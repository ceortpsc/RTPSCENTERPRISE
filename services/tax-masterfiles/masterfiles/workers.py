import argparse, json, os, socket, time, uuid
from datetime import datetime, timedelta, timezone
from .db import connect

def now(): return datetime.now(timezone.utc)
def iso(dt=None): return (dt or now()).isoformat()
def cycle_parts(code):
    digits=''.join(c for c in (code or '') if c.isdigit())
    if len(digits)!=8: return (None,None,None)
    year,week,day=int(digits[:4]),int(digits[4:6]),int(digits[6:])
    if not (2000<=year<=2200 and 1<=week<=53 and 0<=day<=7): return (None,None,None)
    return year,week,day
def emit(db,tenant,channel,event_type,stype,sid,payload):
    db.execute("INSERT INTO realtime_event(event_uuid,tenant_id,channel,event_type,subject_type,subject_id,payload_json) VALUES(?,?,?,?,?,?,?)",(uuid.uuid4().hex,tenant,channel,event_type,stype,sid,json.dumps(payload,separators=(',',':'),sort_keys=True)))
def register(db,tenant,worker_id):
    caps=json.dumps(['TDS','SOR','MEF','TINM','IRIS','ACA','TAX_PRO_ACCOUNT'])
    db.execute("INSERT OR REPLACE INTO worker_node(id,tenant_id,worker_type,version,capabilities_json,status,started_at,heartbeat_at) VALUES(?,?,?,?,?,'ONLINE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)",(worker_id,tenant,'integration','1.1.0',caps)); db.commit()
def claim(db,tenant,worker_id,lease_seconds=90):
    db.execute('BEGIN IMMEDIATE')
    row=db.execute("SELECT * FROM integration_job WHERE tenant_id=? AND status IN ('QUEUED','RETRY') AND available_at<=CURRENT_TIMESTAMP AND (lease_expires_at IS NULL OR lease_expires_at<CURRENT_TIMESTAMP) ORDER BY priority,created_at LIMIT 1",(tenant,)).fetchone()
    if not row: db.commit(); return None
    until=iso(now()+timedelta(seconds=lease_seconds)); db.execute("UPDATE integration_job SET status='LEASED',leased_by=?,lease_expires_at=?,attempt_count=attempt_count+1 WHERE id=?",(worker_id,until,row['id'])); db.commit(); return dict(row)
def process_disabled(db,job,worker_id):
    con=db.execute("SELECT status FROM integration_connection WHERE tenant_id=? AND service=? AND environment='PRODUCTION'",(job['tenant_id'],job['service'])).fetchone()
    status='DISABLED' if not con or con['status']!='ENABLED' else 'FAILED'
    code='CONNECTION_NOT_ENABLED' if status=='DISABLED' else 'ADAPTER_NOT_INSTALLED'
    db.execute("UPDATE integration_job SET status=?,last_error_code=?,leased_by=NULL,lease_expires_at=NULL WHERE id=?",(status,code,job['id']))
    emit(db,job['tenant_id'],'integrations','job.blocked','integration_job',job['id'],{'service':job['service'],'status':status,'code':code})
    db.execute("UPDATE worker_node SET heartbeat_at=CURRENT_TIMESTAMP,last_job_at=CURRENT_TIMESTAMP WHERE id=?",(worker_id,)); db.commit()
def run(db_path,tenant,once=False,poll=5):
    worker_id=os.environ.get('TMF_WORKER_ID') or f"{socket.gethostname()}-{os.getpid()}"
    with connect(db_path) as db:
      register(db,tenant,worker_id)
      while True:
        db.execute("UPDATE worker_node SET heartbeat_at=CURRENT_TIMESTAMP WHERE id=?",(worker_id,)); db.commit()
        job=claim(db,tenant,worker_id)
        if job: process_disabled(db,job,worker_id)
        if once: break
        time.sleep(max(1,poll))
def main():
    p=argparse.ArgumentParser(); p.add_argument('--db',required=True); p.add_argument('--tenant',required=True); p.add_argument('--once',action='store_true'); p.add_argument('--poll',type=int,default=5); a=p.parse_args(); run(a.db,a.tenant,a.once,a.poll)
if __name__=='__main__': main()
