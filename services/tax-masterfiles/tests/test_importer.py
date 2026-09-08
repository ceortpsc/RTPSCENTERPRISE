import csv, os, tempfile, unittest
from masterfiles.db import connect, init
from masterfiles.importer import import_csv, reconcile

class ImportTest(unittest.TestCase):
  def setUp(self):
    os.environ["TMF_MASTER_KEY_HEX"]="11"*32; self.tmp=tempfile.TemporaryDirectory(); self.db=self.tmp.name+"/x.db"; init(self.db)
  def tearDown(self): self.tmp.cleanup()
  def test_idempotent_multiyear(self):
    p=self.tmp.name+"/a.csv"
    with open(p,"w",newline="") as f:
      w=csv.DictWriter(f,fieldnames=["ReturnID","First Name","Last Name","SSN","Federal Refund","Prep Fee","Preparer Name"]); w.writeheader(); w.writerow({"ReturnID":"R1","First Name":"A","Last Name":"B","SSN":"111-22-3333","Federal Refund":"100.25","Prep Fee":"25","Preparer Name":"P"})
    with connect(self.db) as db:
      self.assertEqual(import_csv(db,p,"t",2025)["inserted"],1); self.assertEqual(import_csv(db,p,"t",2025)["inserted"],0); self.assertEqual(db.execute("SELECT count(*) FROM client").fetchone()[0],1); self.assertEqual(db.execute("SELECT federal_refund_cents FROM tax_return").fetchone()[0],10025); self.assertEqual(reconcile(db,"t"),1)
      tables={r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
      self.assertTrue({"case_note","remedy_action","credit_adjustment","irs_tc846","sbtpg_funding"}.issubset(tables))
      views={r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='view'")}
      self.assertIn("v_refund_funding_reconciliation",views)
      self.assertTrue({"taxpayer_authorization","integration_job","worker_node","transcript_snapshot","realtime_event"}.issubset(tables))
if __name__=="__main__": unittest.main()
