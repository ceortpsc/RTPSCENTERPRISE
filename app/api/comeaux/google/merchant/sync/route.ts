import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/comeaux/catalog";
import { getGoogleServiceAccountToken, merchantProductInput } from "@/lib/comeaux/google";

const scope = "https://www.googleapis.com/auth/content";
function assertAdmin(req: NextRequest) { const provided=req.headers.get("x-comeaux-admin-key"); const expected=process.env.COMEAUX_ADMIN_SYNC_KEY; return Boolean(expected && provided && provided===expected); }

export async function POST(req: NextRequest) {
  if (!assertAdmin(req)) return NextResponse.json({error:"unauthorized"},{status:401});
  const accountId=process.env.GOOGLE_MERCHANT_ACCOUNT_ID;
  const dataSource=process.env.GOOGLE_MERCHANT_DATASOURCE_ID;
  if (!accountId || !dataSource) return NextResponse.json({error:"Merchant Center account/data source is not configured."},{status:503});
  const eligibleProducts=PRODUCTS.filter(product => product.googleSyncEnabled && product.catalogStatus === "active");
  const token=await getGoogleServiceAccountToken([scope]);
  const results:Array<{sku:string;ok:boolean;status:number;body?:unknown}>=[];
  for (const product of eligibleProducts) {
    const body=merchantProductInput(product);
    const url=new URL(`https://merchantapi.googleapis.com/products/v1/accounts/${encodeURIComponent(accountId)}/productInputs:insert`);
    url.searchParams.set("dataSource",`accounts/${accountId}/dataSources/${dataSource}`);
    const response=await fetch(url,{method:"POST",headers:{authorization:`Bearer ${token}`,"content-type":"application/json"},body:JSON.stringify(body),cache:"no-store"});
    let parsed:unknown; try { parsed=await response.json(); } catch { parsed=undefined; }
    results.push({sku:product.sku,ok:response.ok,status:response.status,body:parsed});
  }
  return NextResponse.json({syncedAt:new Date().toISOString(),catalogTotal:PRODUCTS.length,eligibleTotal:eligibleProducts.length,heldFromSync:PRODUCTS.length-eligibleProducts.length,succeeded:results.filter(x=>x.ok).length,failed:results.filter(x=>!x.ok).length,results},{status:results.every(x=>x.ok)?200:207});
}
