import argparse, json, os, re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse
from .db import connect

DB="masterfiles.db"
def auth(header):
    if not header.startswith("Bearer "): return None
    return json.loads(os.environ.get("TMF_API_TOKENS","{}" )).get(header[7:])
class Handler(BaseHTTPRequestHandler):
    def reply(self,code,data):
        body=json.dumps(data,default=str).encode(); self.send_response(code); self.send_header("Content-Type","application/json"); self.send_header("Content-Length",str(len(body))); self.send_header("Cache-Control","no-store"); self.send_header("X-Content-Type-Options","nosniff"); self.end_headers(); self.wfile.write(body)
    def do_GET(self):
        principal=auth(self.headers.get("Authorization",""))
        if not principal: return self.reply(401,{"error":"unauthorized"})
        if "practitioner" not in principal.get("roles",[]) and "admin" not in principal.get("roles",[]): return self.reply(403,{"error":"forbidden"})
        tenant=principal["tenant"]; path=urlparse(self.path).path
        with connect(DB) as db:
          if path=="/v1/live/events":
            try: cursor=max(0,int(dict(x.split('=',1) for x in urlparse(self.path).query.split('&') if '=' in x).get('cursor','0')))
            except ValueError: return self.reply(400,{"error":"invalid_cursor"})
            rows=db.execute("SELECT id,event_uuid,channel,event_type,subject_type,subject_id,payload_json,created_at FROM realtime_event WHERE tenant_id=? AND id>? ORDER BY id LIMIT 250",(tenant,cursor)).fetchall()
            items=[]
            for r in rows:
              x=dict(r); x['payload']=json.loads(x.pop('payload_json')); items.append(x)
            return self.reply(200,{"items":items,"next_cursor":items[-1]['id'] if items else cursor,"retry_after_seconds":5})
          if path=="/v1/workers/health":
            rows=db.execute("SELECT id,worker_type,version,status,started_at,heartbeat_at,last_job_at FROM worker_node WHERE tenant_id=? ORDER BY heartbeat_at DESC",(tenant,)).fetchall(); return self.reply(200,{"items":[dict(r) for r in rows]})
          if path=="/v1/clients":
            rows=db.execute("SELECT id,first_name,last_name,dob,ssn_last4,created_at,updated_at FROM client WHERE tenant_id=? ORDER BY last_name,first_name LIMIT 200",(tenant,)).fetchall(); return self.reply(200,{"items":[dict(r) for r in rows]})
          m=re.fullmatch(r"/v1/clients/([^/]+)/folders",path)
          if m:
            rows=db.execute("SELECT f.id,f.tax_year,f.status,r.id return_id,r.source_return_id,r.federal_status,r.federal_refund_cents,r.state_status,r.state_refund_cents FROM tax_folder f LEFT JOIN tax_return r ON r.folder_id=f.id WHERE f.tenant_id=? AND f.client_id=? ORDER BY f.tax_year DESC",(tenant,m.group(1))).fetchall(); return self.reply(200,{"items":[dict(r) for r in rows]})
          m=re.fullmatch(r"/v1/returns/([^/]+)/financial-sections",path)
          if m:
            rid=m.group(1); exists=db.execute("SELECT 1 FROM tax_return WHERE id=? AND tenant_id=?",(rid,tenant)).fetchone()
            if not exists: return self.reply(404,{"error":"not_found"})
            credits=db.execute("SELECT id,item_type,tax_code,description,claimed_cents,allowed_cents,adjusted_cents,variance_cents,source,status,effective_at,evidence_ref FROM credit_adjustment WHERE tenant_id=? AND return_id=? ORDER BY effective_at",(tenant,rid)).fetchall()
            tc846=db.execute("SELECT id,transcript_year,transaction_date,amount_cents,cycle_code,transcript_received_at,matched_funding,match_confidence FROM irs_tc846 WHERE tenant_id=? AND return_id=? ORDER BY transaction_date",(tenant,rid)).fetchall()
            sbtpg=db.execute("SELECT id,external_reference,expected_refund_cents,received_cents,fees_withheld_cents,taxpayer_disbursement_cents,funding_status,received_at,disbursed_at,disbursement_method,trace_last4 FROM sbtpg_funding WHERE tenant_id=? AND return_id=? ORDER BY received_at",(tenant,rid)).fetchall()
            rec=db.execute("SELECT * FROM v_refund_funding_reconciliation WHERE tenant_id=? AND return_id=?",(tenant,rid)).fetchone()
            return self.reply(200,{"credits_adjustments":[dict(x) for x in credits],"tc846":[dict(x) for x in tc846],"sbtpg":[dict(x) for x in sbtpg],"reconciliation":dict(rec) if rec else None})
        return self.reply(404,{"error":"not_found"})
    def log_message(self,fmt,*args): pass
def main():
    global DB; p=argparse.ArgumentParser(); p.add_argument("--db",required=True); p.add_argument("--host",default="127.0.0.1"); p.add_argument("--port",type=int,default=8787); a=p.parse_args(); DB=a.db; ThreadingHTTPServer((a.host,a.port),Handler).serve_forever()
if __name__=="__main__": main()
