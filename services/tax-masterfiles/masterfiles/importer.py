import csv, hashlib, json, re, uuid
from decimal import Decimal, InvalidOperation
from .security import blind_index, encrypt, last4

FORMS = ["EDUCATIONTAXCREDIT","SCHEDULE A","SCHEDULE C","SCHEDULE CEZ","FORM 8862","SCHEDULE D","SCHEDULE F","Form W2G","FORM 2441","Form W2","Form 4562","Form 8379","QBID","Unemployment","Form 7202","Form 8915E","Form 8915F"]

def uid(prefix): return prefix+"_"+uuid.uuid4().hex
def money(v):
    try: return int((Decimal((v or "0").replace("$","").replace(",","")) * 100).quantize(Decimal("1")))
    except (InvalidOperation, AttributeError): return 0
def truth(v): return str(v or "").strip().lower() in {"1","true","yes","y","x"}
def norm(row): return {re.sub(r"[^a-z0-9]","",k.lower()): (v or "").strip() for k,v in row.items() if k}
def pick(n,*keys): return next((n.get(re.sub(r"[^a-z0-9]","",k.lower()),"") for k in keys if n.get(re.sub(r"[^a-z0-9]","",k.lower()),"")),"")

def import_csv(db, path, tenant, tax_year):
    stats={"read":0,"inserted":0,"updated":0,"skipped_blank":0,"errors":[]}
    db.execute("INSERT OR IGNORE INTO tenant(id,name) VALUES(?,?)",(tenant,tenant))
    with open(path,newline="",encoding="utf-8-sig") as fh:
      for line,row in enumerate(csv.DictReader(fh),2):
        stats["read"]+=1; n=norm(row); rid=pick(n,"ReturnID")
        if not rid: stats["skipped_blank"]+=1; continue
        try:
          first,last=pick(n,"First Name"),pick(n,"Last Name")
          ssn=pick(n,"SSN"); l4=last4(ssn) or pick(n,"Last Four","Last 4")[-4:]
          dob=pick(n,"TP DOB")
          identity=blind_index(tenant, re.sub(r"\D","",ssn) if ssn else f"{first.lower()}|{last.lower()}|{dob}|{l4}")
          c=db.execute("SELECT id FROM client WHERE tenant_id=? AND identity_key=?",(tenant,identity)).fetchone()
          if c: cid=c["id"]; db.execute("UPDATE client SET first_name=?,last_name=?,dob=COALESCE(NULLIF(?,''),dob),updated_at=CURRENT_TIMESTAMP WHERE id=?",(first,last,dob,cid))
          else:
            cid=uid("cli"); db.execute("INSERT INTO client(id,tenant_id,identity_key,first_name,last_name,dob,ssn_enc,ssn_last4,phone_enc,email_enc,address_enc) VALUES(?,?,?,?,?,?,?,?,?,?,?)",(cid,tenant,identity,first,last,dob,encrypt(ssn),l4,encrypt(pick(n,"TP Cell Phone","Phone")),encrypt(pick(n,"Email Address")),encrypt("|".join(filter(None,[pick(n,"TPAddress"),pick(n,"TPCity"),pick(n,"TPState"),pick(n,"TPZip")]))) ))
          pname=pick(n,"Preparer Name","Preparer") or "Unassigned"; pkey=blind_index(tenant,pname.lower())[:24]
          db.execute("INSERT OR IGNORE INTO practitioner(id,tenant_id,display_name,ptin_last4,efin) VALUES(?,?,?,?,?)",("pr_"+pkey,tenant,pname,last4(pick(n,"PTIN")),pick(n,"EFIN")))
          folder=db.execute("SELECT id FROM tax_folder WHERE tenant_id=? AND client_id=? AND tax_year=?",(tenant,cid,tax_year)).fetchone()
          fid=folder["id"] if folder else uid("fld")
          if not folder: db.execute("INSERT INTO tax_folder(id,tenant_id,client_id,tax_year,assigned_practitioner_id) VALUES(?,?,?,?,?)",(fid,tenant,cid,tax_year,"pr_"+pkey))
          canonical=json.dumps(n,sort_keys=True,separators=(",",":")); source_hash=hashlib.sha256(canonical.encode()).hexdigest()
          old=db.execute("SELECT id,source_hash FROM tax_return WHERE tenant_id=? AND source_return_id=?",(tenant,rid)).fetchone(); retid=old["id"] if old else uid("ret")
          values=(fid,pick(n,"Federal Return Type","1040Type","Return Type"),pick(n,"Filing Status"),pick(n,"Federal Status"),money(pick(n,"Federal Refund","Refund")),pick(n,"Federal Accepted Date","Ack Date"),pick(n,"State"),pick(n,"State Status"),money(pick(n,"State Refund")),pick(n,"State Accepted Date"),money(pick(n,"AGI")),truth(pick(n,"MarkedComplete")),truth(pick(n,"MarkedPaid")),source_hash,retid)
          if old:
            if old["source_hash"]==source_hash: continue
            db.execute("UPDATE tax_return SET folder_id=?,return_type=?,filing_status=?,federal_status=?,federal_refund_cents=?,federal_accepted_at=?,state_code=?,state_status=?,state_refund_cents=?,state_accepted_at=?,agi_cents=?,marked_complete=?,marked_paid=?,source_hash=?,imported_at=CURRENT_TIMESTAMP WHERE id=?",values); stats["updated"]+=1
          else:
            db.execute("INSERT INTO tax_return(folder_id,return_type,filing_status,federal_status,federal_refund_cents,federal_accepted_at,state_code,state_status,state_refund_cents,state_accepted_at,agi_cents,marked_complete,marked_paid,source_hash,id,tenant_id,source_return_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",values+(tenant,rid)); stats["inserted"]+=1
          db.execute("INSERT OR REPLACE INTO bank_product(id,return_id,bank_name,product,routing_enc,account_enc,routing_last4,account_last4,funded_at,advance_requested_cents,advance_paid_cents) VALUES(COALESCE((SELECT id FROM bank_product WHERE return_id=?),?),?,?,?,?,?,?,?,?,?,?)",(retid,uid("bnk"),retid,pick(n,"Bank"),pick(n,"Product"),encrypt(pick(n,"Routing Number")),encrypt(pick(n,"Account Number")),last4(pick(n,"Routing Number")),last4(pick(n,"Account Number")),pick(n,"Funded Date"),money(pick(n,"Advance Amount Requested")),money(pick(n,"Advance Amount Paid"))))
          for typ,col,paidcol in [("PREP","Prep Fee","Preparer Fee Paid"),("CALCULATED_PREP","Calculated Prep Fee",""),("EFILE","Efile Fee","Efile Fee Paid"),("DOCUMENT","Document Prep Fee","Doc Prep Fee Paid"),("AUDIT","Audit Fee","Audit Fee Paid Amount"),("ID_THEFT","ID Theft Fee","ID Theft Fee Paid Amount")]:
            assessed=money(pick(n,col)); paid=money(pick(n,paidcol)) if paidcol else 0
            if assessed or paid: db.execute("INSERT OR REPLACE INTO fee_ledger(id,return_id,fee_type,assessed_cents,paid_cents) VALUES(COALESCE((SELECT id FROM fee_ledger WHERE return_id=? AND fee_type=?),?),?,?,?,?)",(retid,typ,uid("fee"),retid,typ,assessed,paid))
          for form in FORMS:
            if pick(n,form): db.execute("INSERT OR REPLACE INTO return_form(id,return_id,form_code,present) VALUES(COALESCE((SELECT id FROM return_form WHERE return_id=? AND form_code=?),?),?,?,?)",(retid,form,uid("frm"),retid,form,truth(pick(n,form))))
          payload=json.dumps({"return_id":retid,"tax_year":tax_year,"source_hash":source_hash},sort_keys=True)
          seq=db.execute("SELECT COALESCE(MAX(sequence_no),0)+1 n FROM replication_outbox WHERE tenant_id=? AND aggregate_type='tax_return' AND aggregate_id=?",(tenant,retid)).fetchone()["n"]
          db.execute("INSERT INTO replication_outbox(id,tenant_id,aggregate_type,aggregate_id,sequence_no,event_type,payload_enc,payload_hash) VALUES(?,?,?,?,?,?,?,?)",(uid("evt"),tenant,"tax_return",retid,seq,"return.upserted",encrypt(payload),hashlib.sha256(payload.encode()).hexdigest()))
          db.execute("INSERT INTO audit_event(id,tenant_id,actor_id,action,object_type,object_id,metadata_json) VALUES(?,?,?,?,?,?,?)",(uid("aud"),tenant,"csv-import","UPSERT","tax_return",retid,json.dumps({"source_hash":source_hash,"line":line})))
        except Exception as exc: stats["errors"].append({"line":line,"type":type(exc).__name__}); continue
    db.commit(); return stats

def reconcile(db,tenant):
    rows=db.execute("SELECT * FROM v_return_reconciliation WHERE tenant_id=?",(tenant,)).fetchall(); count=0
    for r in rows:
      variance=r["fee_balance_cents"]; sev="INFO" if variance==0 else "REVIEW"
      db.execute("INSERT OR REPLACE INTO reconciliation(id,tenant_id,return_id,check_name,expected_cents,actual_cents,variance_cents,severity) VALUES(COALESCE((SELECT id FROM reconciliation WHERE return_id=? AND check_name='FEES_PAID'),?),?,?,?,?,?,?,?)",(r["return_id"],uid("rec"),tenant,r["return_id"],"FEES_PAID",r["total_fees_cents"],r["total_paid_cents"],variance,sev)); count+=1
    db.commit(); return count
