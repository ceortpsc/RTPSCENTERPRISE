import os,tempfile,unittest
from masterfiles.db import init,connect
from masterfiles.workers import cycle_parts,register,claim,process_disabled
from masterfiles.security import encrypt

class WorkerTest(unittest.TestCase):
  def setUp(self): os.environ['TMF_MASTER_KEY_HEX']='55'*32
  def test_cycle_and_fail_closed_job(self):
    self.assertEqual(cycle_parts('20263605'),(2026,36,5)); self.assertEqual(cycle_parts('nonsense'),(None,None,None))
    with tempfile.TemporaryDirectory() as d:
      p=d+'/x.db'; init(p)
      with connect(p) as db:
        db.execute("INSERT INTO tenant(id,name) VALUES('t','T')")
        db.execute("INSERT INTO integration_job(id,tenant_id,service,operation,subject_type,subject_id,request_enc,request_hash,idempotency_key) VALUES('j','t','TDS','GET_ACCOUNT_TRANSCRIPT','client','c',?,'h','k')",(encrypt('{}'),)); db.commit()
        register(db,'t','w'); job=claim(db,'t','w'); self.assertEqual(job['id'],'j'); process_disabled(db,job,'w')
        self.assertEqual(db.execute("SELECT status FROM integration_job WHERE id='j'").fetchone()[0],'DISABLED')
        self.assertEqual(db.execute("SELECT count(*) FROM realtime_event").fetchone()[0],1)
if __name__=='__main__': unittest.main()
