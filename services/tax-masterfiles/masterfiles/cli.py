import argparse, json
from .db import connect, init
from .importer import import_csv, reconcile

def main():
    p=argparse.ArgumentParser(); sub=p.add_subparsers(dest="cmd",required=True)
    a=sub.add_parser("init"); a.add_argument("--db",required=True)
    a=sub.add_parser("import"); a.add_argument("--db",required=True); a.add_argument("--tenant",required=True); a.add_argument("--tax-year",type=int,required=True); a.add_argument("files",nargs="+")
    a=sub.add_parser("reconcile"); a.add_argument("--db",required=True); a.add_argument("--tenant",required=True)
    x=p.parse_args()
    if x.cmd=="init": init(x.db); print(json.dumps({"status":"initialized"}))
    elif x.cmd=="import":
      with connect(x.db) as db: print(json.dumps([{"file":f,"result":import_csv(db,f,x.tenant,x.tax_year)} for f in x.files],indent=2))
    else:
      with connect(x.db) as db: print(json.dumps({"reconciled":reconcile(db,x.tenant)}))
if __name__=="__main__": main()
