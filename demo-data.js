/* Data fiktif untuk presentasi. Tidak terhubung ke database aplikasi utama. */
const DEMO_KEY = 'freshplus-preview-v1';
function seedDemo() {
  const day = offset => { const d = new Date(); d.setDate(d.getDate() + offset); return d.toLocaleDateString('en-CA'); };
  const products = [
    ['Tomat merah','Fresh produce','kg',18000],['Kentang granola','Fresh produce','kg',22000],
    ['Wortel lokal','Fresh produce','kg',16000],['Bawang merah','Seasoning','kg',38000],
    ['Dada ayam fillet','Protein','kg',58000],['Udang kupas','Protein','kg',95000],
    ['Beras premium 25 kg','Grocery','karung',365000],['Minyak goreng 2 L','Grocery','pack',36000],
    ['Brokoli segar','Fresh produce','kg',32000],['Bawang putih','Seasoning','kg',42000],
    ['Telur ayam negeri','Protein','kg',29000],['Gula pasir 1 kg','Grocery','pack',18000]
  ].map((p,i)=>({id:'p'+i,sku:'FP-'+String(i+1).padStart(3,'0'),name:p[0],category:p[1],unit:p[2],price:p[3],note:''}));
  const customers = [
    ['Dapur Senja','Restoran','Rani','0812-0000-0101','Jl. Melati No. 12, Jakarta'],
    ['Katering Nusa','Katering','Budi','0812-0000-0102','Jl. Kenanga No. 8, Jakarta'],
    ['Kopi Halaman','Kafe','Dina','0812-0000-0103','Jl. Anggrek No. 21, Jakarta'],
    ['Hotel Taman Sari','Hotel','Andi','0812-0000-0104','Jl. Taman Sari No. 16, Jakarta'],
    ['Bistro Pagi','Restoran','Sinta','0812-0000-0105','Jl. Cempaka No. 3, Jakarta']
  ].map((c,i)=>({id:'c'+i,name:c[0],segment:c[1],contact:c[2],phone:c[3],address:c[4]}));
  const documents=[],cash=[];
  function doc(type,ci,offset,lines,paid=0) {
    const items=lines.map(([pi,qty])=>{const p=products[pi];return {productId:p.id,name:p.name,unit:p.unit,qty,price:p.price,total:Math.round(qty*p.price)};});
    const prefix={invoice:'INV',quotation:'QUO',delivery:'SJ'}[type];
    const count=documents.filter(d=>d.type===type).length+1;
    const d={id:'doc-'+documents.length,type,number:prefix+'-'+new Date().getFullYear()+'-'+String(count).padStart(4,'0'),customerId:customers[ci].id,customer:{...customers[ci]},date:day(offset),due:day(offset+14),items,total:items.reduce((s,i)=>s+i.total,0),paid, note:type==='delivery'?'Mohon periksa jumlah dan kondisi barang saat diterima.':'Harga sudah termasuk pengemasan. Terima kasih telah memilih Fresh+.',status:type==='invoice'?(paid===items.reduce((s,i)=>s+i.total,0)?'Lunas':paid?'Sebagian':'Belum dibayar'):type==='delivery'?'Siap dikirim':'Draft'};
    documents.unshift(d);
    if(paid)cash.unshift({id:'pay-'+d.id,date:day(offset+1),description:'Pembayaran '+d.number+' · '+d.customer.name,direction:'in',amount:paid,documentId:d.id});
    return d;
  }
  doc('invoice',0,-8,[[0,15],[4,12],[3,5]],500000);
  doc('invoice',1,-6,[[6,3],[7,10],[10,20]],2035000);
  doc('invoice',2,-3,[[7,6],[11,10]],0);
  doc('invoice',3,-2,[[5,8],[4,15],[8,5]],1000000);
  doc('invoice',4,0,[[0,8],[1,10],[4,5]],0);
  doc('quotation',3,-1,[[4,25],[5,15],[6,5]],0);
  doc('quotation',1,0,[[0,30],[2,20],[7,15]],0);
  doc('delivery',0,-1,[[0,15],[4,12],[3,5]],0);
  doc('delivery',4,0,[[0,8],[1,10],[4,5]],0);
  cash.unshift({id:'expense-1',date:day(-2),description:'Pembelian bahan dari supplier',direction:'out',amount:1850000}, {id:'expense-2',date:day(-1),description:'Operasional pengiriman',direction:'out',amount:175000});
  const vendors = seedVendors();
  const movements = seedMovements(products, vendors, customers, day);
  return {products,customers,documents,cash,vendors,movements};
}
function seedVendors() {
  return [
    ['Kebun Mitra Sejahtera','Fresh produce','Pak Dedi','0812-0000-0201','Bogor'],
    ['Protein Nusantara','Protein','Ibu Maya','0812-0000-0202','Jakarta'],
    ['Sembako Berkah','Grocery','Pak Hendra','0812-0000-0203','Bekasi'],
    ['Rempah Jaya','Seasoning','Ibu Lina','0812-0000-0204','Jakarta']
  ].map((v,i)=>({id:'v'+i,name:v[0],category:v[1],contact:v[2],phone:v[3],address:v[4],note:''}));
}
function seedMovements(products,vendors,customers,day) {
  const rows=[];
  products.forEach((p,i)=>{
    const vendor=vendors.find(v=>v.category===p.category);
    rows.push({id:'mi'+i,direction:'in',date:day(-10),time:'08:30',productId:p.id,productName:p.name,unit:p.unit,qty:p.unit==='karung'?12:100,partnerId:vendor.id,partnerName:vendor.name,reason:'Pembelian',reference:'BM-001',note:'Penerimaan pasokan awal (contoh)'});
  });
  [[0,15,0,-7],[4,12,0,-7],[3,5,0,-7],[6,3,1,-5],[7,10,1,-5],[10,20,1,-5],[7,6,2,-2],[11,10,2,-2],[5,8,3,-1],[4,15,3,-1],[8,5,3,-1]].forEach(([pi,qty,ci,offset],i)=>{
    const p=products[pi],c=customers[ci];rows.push({id:'mo'+i,direction:'out',date:day(offset),time:'10:00',productId:p.id,productName:p.name,unit:p.unit,qty,partnerId:c.id,partnerName:c.name,reason:'Penjualan',reference:'Pengiriman contoh',note:''});
  });
  return rows.reverse();
}
let demoStore;
try { demoStore=JSON.parse(localStorage.getItem(DEMO_KEY)); } catch { demoStore=null; }
if(!demoStore || !['products','customers','documents','cash'].every(k=>Array.isArray(demoStore[k]))) demoStore=seedDemo();
// Tambahkan modul baru tanpa menghapus percobaan pada demo versi sebelumnya.
if(!Array.isArray(demoStore.vendors))demoStore.vendors=seedVendors();
if(!Array.isArray(demoStore.movements))demoStore.movements=[];
function persistDemo() {
  try {localStorage.setItem(DEMO_KEY,JSON.stringify(demoStore));return true;} catch {return false;}
}
function resetDemo() { demoStore=seedDemo();persistDemo(); }
function demoId() { return 'demo-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8); }
function cloneDemo(v) { return JSON.parse(JSON.stringify(v)); }
async function demoApi(path, method='GET', body) {
  const [kind,id,action]=path.split('/');
  if(kind==='backup')return {version:1,demo:true,exportedAt:new Date().toISOString(),...cloneDemo(demoStore)};
  if(!Array.isArray(demoStore[kind]))throw Error('Data tidak ditemukan.');
  if(method==='GET')return cloneDemo(demoStore[kind]);
  const v=cloneDemo(body||{});
  if(kind==='documents' && action==='pay') {
    const d=demoStore.documents.find(d=>d.id===id),amount=Math.round(Number(v.amount));
    if(!d||d.type!=='invoice'||!Number.isFinite(amount)||amount<=0||amount>d.total-d.paid)throw Error('Nominal tidak boleh melebihi sisa tagihan.');
    if(!v.date)throw Error('Tanggal pembayaran wajib diisi.');
    d.paid+=amount;d.status=d.paid===d.total?'Lunas':'Sebagian';
    demoStore.cash.unshift({id:demoId(),date:v.date,description:'Pembayaran '+d.number+' · '+d.customer.name,direction:'in',amount,documentId:id});
    persistDemo();return cloneDemo(d);
  }
  if(kind==='products') {
    if(!v.name?.trim()||!v.unit?.trim()||!Number.isFinite(Number(v.price))||Number(v.price)<0)throw Error('Lengkapi nama, satuan, dan harga produk.');
    v.price=Math.round(Number(v.price));
  }
  if(['customers','vendors'].includes(kind)&&!v.name?.trim())throw Error('Nama klien atau vendor wajib diisi.');
  if(kind==='movements') {
    const p=demoStore.products.find(p=>p.id===v.productId),qty=Number(v.qty);
    if(!p||!['in','out'].includes(v.direction)||!Number.isFinite(qty)||qty<=0)throw Error('Pilih produk dan isi jumlah yang valid.');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(v.date||'') || Number.isNaN(Date.parse(v.date)) || new Date(v.date).toISOString().slice(0,10)!==v.date || !/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time||''))throw Error('Tanggal dan waktu wajib valid.');
    const partners=v.direction==='in'?demoStore.vendors:demoStore.customers;
    const partner=partners.find(x=>x.id===v.partnerId);
    if(v.direction==='in'&&!partner || v.direction==='out'&&v.reason==='Penjualan'&&!partner)throw Error('Pilih vendor atau klien untuk transaksi ini.');
    if(!(v.direction==='in'?['Pembelian']:['Penjualan','Rusak / susut','Pemakaian internal']).includes(v.reason))throw Error('Keperluan transaksi tidak valid.');
    const available=demoStore.movements.filter(m=>m.productId===p.id&&m.date+'T'+m.time<=v.date+'T'+v.time).reduce((s,m)=>s+(m.direction==='in'?m.qty:-m.qty),0);
    if(v.direction==='out'&&qty>available+0.000001)throw Error('Stok pada waktu tersebut hanya '+Math.max(0,available)+' '+p.unit+'. Catat barang masuk terlebih dahulu.');
    const candidate={...v,qty};
    // Tolak tanggal mundur yang menyebabkan stok negatif pada transaksi berikutnya.
    let balance=0;
    const timeline=[...demoStore.movements.filter(m=>m.productId===p.id),candidate].sort((a,b)=>(a.date+'T'+a.time).localeCompare(b.date+'T'+b.time)||(a.direction==='in'?0:1)-(b.direction==='in'?0:1));
    for(const m of timeline){balance+=m.direction==='in'?m.qty:-m.qty;if(balance< -0.000001)throw Error('Transaksi ini membuat stok negatif. Periksa tanggal dan jumlah.');}
    v.qty=qty;v.productName=p.name;v.unit=p.unit;v.partnerName=partner?.name||'Internal';
  }
  if(kind==='cash') {
    if(!v.description?.trim()||!['in','out'].includes(v.direction)||!Number.isFinite(Number(v.amount))||Number(v.amount)<=0)throw Error('Isi nominal dan keterangan transaksi.');
    v.amount=Math.round(Number(v.amount));
  }
  if(kind==='documents') {
    const c=demoStore.customers.find(c=>c.id===v.customerId);
    if(!c||!v.items?.length)throw Error('Pilih pelanggan dan minimal satu produk.');
    if(v.type==='invoice'&&v.due<v.date)throw Error('Jatuh tempo tidak boleh sebelum tanggal invoice.');
    v.customer=cloneDemo(c);
    v.items=v.items.map(i=>{const p=demoStore.products.find(p=>p.id===i.productId);const qty=Number(i.qty),price=Math.round(Number(i.price));if(!p||!Number.isFinite(qty)||qty<=0||!Number.isFinite(price)||price<0)throw Error('Periksa produk, jumlah, dan harga.');return {productId:p.id,name:p.name,unit:p.unit,qty,price,total:Math.round(qty*price)};});
    v.total=v.items.reduce((s,i)=>s+i.total,0);v.paid=0;
    v.status=v.type==='invoice'?'Belum dibayar':v.type==='delivery'?'Siap dikirim':'Draft';
    const prefix={invoice:'INV',quotation:'QUO',delivery:'SJ'}[v.type];
    if(!prefix)throw Error('Jenis dokumen tidak valid.');
    v.number=prefix+'-'+new Date().getFullYear()+'-'+String(demoStore.documents.filter(d=>d.type===v.type).length+1).padStart(4,'0');
  }
  if(method==='PUT') {
    const n=demoStore[kind].findIndex(x=>x.id===id);if(n<0)throw Error('Data tidak ditemukan.');v.id=id;demoStore[kind][n]=v;
  } else {v.id=demoId();demoStore[kind].unshift(v);}
  persistDemo();return cloneDemo(v);
}
