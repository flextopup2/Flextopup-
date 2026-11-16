<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FlexTopUp</title>
<style>
*{box-sizing:border-box}body{font-family:Arial;margin:0;background:#E8F4FF}
.app{max-width:420px;margin:0 auto;background:#fff;min-height:100vh;padding:14px 14px 90px}
.logo{display:flex;align-items:center;gap:8px}.logoIcon{width:48px;height:48px;background:linear-gradient(135deg,#0B6CB8,#FFC107);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:30px}.logoText{font-size:32px;font-weight:900;color:#0B3D91}
h2{margin:16px 0 2px;font-size:24px}.sub{color:#666;font-size:13px;margin:0}
label{font-weight:bold;font-size:14px;display:block;margin-top:16px}
input{width:100%;padding:14px;border:1px solid #ccc;border-radius:12px;font-size:16px;margin-top:8px}
.btn{width:100%;padding:14px;border:0;border-radius:12px;font-size:18px;font-weight:bold;margin-top:12px}.blue{background:#0B6CB8;color:#fff}.white{background:#fff;color:#16a34a;border:2px solid #16a34a}.green{background:#16a34a;color:#fff}.dark{background:#111;color:#fff}.red{background:#ef4444;color:#fff}
.copyBtn{background:#0B3D91;color:#fff;border:0;padding:8px 14px;border-radius:10px;font-weight:bold;font-size:13px;white-space:nowrap}
.copyRow{display:flex;align-items:center;gap:8px;background:#F1F5F9;border:1px solid #ddd;border-radius:12px;padding:10px;margin-top:8px}.copyRow b{flex:1;font-size:16px}
.footer{background:#FEF9C3;border-radius:14px;padding:12px;margin-top:14px}
.refer{background:#FFD93D;border-radius:12px;padding:12px;display:flex;justify-content:space-between;align-items:center;margin-top:12px}.refer button{background:#16a34a;color:#fff;border:0;padding:8px 10px;border-radius:8px;font-weight:bold}
.buyCard{background:#0B9CFF;border-radius:16px;padding:14px;color:#fff;margin-top:12px}
.grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px}.plan{background:#fff;color:#0B3D91;border-radius:10px;padding:10px;text-align:center;font-weight:bold;font-size:13px}.plan small{font-weight:normal;font-size:11px;color:#333}.plan.sel{outline:3px solid #FFC107}
.netRow{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}.net{border:1px solid #ddd;border-radius:20px;padding:8px 10px;font-weight:bold;font-size:13px;background:#F2F2F2}.net.sel{background:#0B3D91;color:#fff}
.card{background:#fff;border:1px solid #eee;border-radius:14px;padding:14px;margin-top:12px;box-shadow:0 2px 8px #eee}
.receive{background:#D9F99D;border-radius:10px;padding:12px;margin-top:10px}.receive b{font-size:22px;color:#14532D}
.mtnCard{background:#FFD93D;border-radius:14px;padding:14px;margin-top:10px}.gloCard{background:#BBF7D0;border-radius:14px;padding:14px;margin-top:10px}
.noteBox{background:#FEF9C3;border:2px solid #FFC107;border-radius:14px;padding:14px;margin-top:12px}
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:420px;background:#fff;border-top:1px solid #ddd;display:flex;justify-content:space-around;padding:10px 0;font-size:12px;text-align:center}.nav div{cursor:pointer}
.screen{display:none}.screen.active{display:block}
.badge{padding:4px 8px;border-radius:20px;font-size:11px;font-weight:bold}.pend{background:#FDE68A}.succ{background:#BBF7D0}.rej{background:#FECACA}
.splash{height:100vh;background:#0B3D91;color:#fff;text-align:center;padding-top:140px}
.faq{padding:10px 0;border-bottom:1px solid #eee}
.statRow{display:flex;gap:8px;margin-top:10px}.stat{flex:1;background:#0B3D91;color:#fff;border-radius:12px;padding:12px;text-align:center}.stat b{font-size:20px;display:block}
.adminBtn{font-size:12px;color:#888;text-align:center;margin-top:16px;text-decoration:underline;cursor:pointer}
.smallBtn{padding:8px 10px;border:0;border-radius:8px;font-weight:bold;font-size:12px;margin-right:6px}
</style>
</head>
<body>
<div class="app">
<div id="splash" class="screen active"><div class="splash"><div style="font-size:90px">⚡</div><h1>FlexTopUp</h1><p>Fast Data • Airtime to Cash • 1-5 Mins Delivery</p><p>Loading...</p></div></div>

<!-- REGISTER -->
<div id="login" class="screen">
<div class="logo"><div class="logoIcon">⚡</div><div class="logoText">FlexTopUp</div></div>
<h2 style="text-align:center">Welcome Back</h2><p class="sub" style="text-align:center">Create your account - No OTP needed</p>
<label>Full Name</label><input id="regName" placeholder="e.g David Okonkwo">
<label>Username</label><input id="regUser" placeholder="e.g david123">
<label>Phone Number</label><input id="regPhone" placeholder="e.g 07078269788" type="tel">
<p style="color:#16a34a;font-weight:bold;font-size:13px;margin-top:12px">✅ One Number One Person<br><small>One phone number = One account</small></p>
<button class="btn blue" onclick="register()">Create Account</button>
<button class="btn white" onclick="show('loginOld')">I Already Have Account - Login</button>
<div class="footer"><b>💬 WhatsApp 07078269788<br>✉️ Email flextopup2@gmail.com<br>🟢 OPay 6490743519</b><button class="copyBtn" onclick="copyText('6490743519',this)">📋 Copy OPay</button></div>
<div class="adminBtn" onclick="show('adminLogin')">🔐 Admin Login</div>
</div>

<div id="loginOld" class="screen">
<div class="logo"><div class="logoIcon">⚡</div><div class="logoText">FlexTopUp</div></div>
<h2 style="text-align:center">Login</h2>
<label>Phone Number</label><input id="loginPhone" placeholder="e.g 07078269788" type="tel">
<button class="btn blue" onclick="loginOldDo()">Login</button>
<button class="btn white" onclick="show('login')">Create New Account</button>
</div>

<!-- ADMIN LOGIN -->
<div id="adminLogin" class="screen">
<h2>🔐 Admin Login</h2><p class="sub">Only for FlexTopUp Owner</p>
<label>Admin PIN</label><input id="adminPin" placeholder="Enter PIN - 1234" type="password">
<button class="btn dark" onclick="adminEnter()">Enter Admin Panel</button>
<button class="btn white" onclick="show('login')">Back to App</button>
<p style="font-size:12px;color:#888;text-align:center">Default PIN: 1234 - You fit change am later</p>
</div>

<!-- ADMIN PANEL -->
<div id="admin" class="screen">
<h2>📊 Admin Panel - FlexTopUp</h2><p class="sub">Welcome Boss! Manage all orders here</p>
<div class="statRow"><div class="stat"><b id="statTotal">0</b><small>Total Orders</small></div><div class="stat" style="background:#F59E0B"><b id="statPend">0</b><small>Pending</small></div><div class="stat" style="background:#16a34a"><b id="statSucc">0</b><small>Successful</small></div></div>
<div class="card" style="background:#D9F99D"><b>💰 Total Revenue (Successful): <span id="statRev">₦0</span></b><br><small>From approved orders only</small></div>
<h3>📦 All Orders - Approve / Reject</h3>
<div id="adminOrders"></div>
<h3>👥 Registered Users</h3>
<div id="adminUsers"></div>
<div class="card"><b>💬 WhatsApp: 07078269788</b><div class="copyRow"><b>07078269788</b><button class="copyBtn" onclick="copyText('07078269788',this)">📋 Copy</button></div><b>🟢 OPay: 6490743519</b><div class="copyRow"><b>6490743519</b><button class="copyBtn" onclick="copyText('6490743519',this)">📋 Copy</button></div></div>
<button class="btn dark" onclick="show('home')">Back to Customer App</button>
<button class="btn red" onclick="show('login')">Logout Admin</button>
</div>

<!-- HOME -->
<div id="home" class="screen">
<div class="logo"><div class="logoIcon">⚡</div><div class="logoText">FlexTopUp</div><span style="margin-left:auto">🔔 👤</span></div>
<p style="margin:12px 0 0">Welcome, <b id="userName">David</b>! 👋</p><p style="color:#666;font-size:13px;margin:2px 0">@<span id="userHandle">david123</span> • <span id="userPhone">07078269788</span></p>
<h2 style="margin:4px 0">Ready to stay connected?</h2>
<div class="refer"><div><b>🎁 Refer & Earn<br>500MB FREE</b></div><div style="font-size:12px">Invite friends and<br>earn instantly</div><button onclick="copyText('flextopup.com/r/'+document.getElementById('userHandle').innerText,this)">Share Now</button></div>
<div class="buyCard"><h3>Buy Data<br>Sharp Sharp ⚡</h3><div style="text-align:right"><span style="background:#16a34a;padding:6px 10px;border-radius:20px;font-size:12px">⚡ Fast Delivery 1-5 Mins</span></div><p style="font-weight:bold;color:#0B3D91;margin:10px 0 0">Choose Data Plan</p><div class="grid" id="planGrid"></div><div style="background:#fff;color:#333;border-radius:10px;padding:8px;margin-top:10px;font-size:12px"><span style="background:#16a34a;color:#fff;padding:3px 8px;border-radius:10px">Best Value</span> <span id="selPlanText">1GB - ₦400 Selected</span></div></div>
<h3>Select Network</h3><div class="netRow"><div class="net sel" onclick="selNet(this)">🟡 MTN</div><div class="net" onclick="selNet(this)">🔴 Airtel</div><div class="net" onclick="selNet(this)">🟢 Glo</div><div class="net" onclick="selNet(this)">🟢 9Mobile</div></div>
<div class="card"><b>Pay to OPay:</b><div class="copyRow"><b>6490743519</b><button class="copyBtn" onclick="copyText('6490743519',this)">📋 Copy</button></div></div>
<button class="btn blue" onclick="buyNow()">Buy Now</button>
</div>

<!-- AIRTIME -->
<div id="airtime" class="screen">
<h2>← FlexTopUp - Airtime to Cash 🔔</h2>
<div class="card" style="background:linear-gradient(#60A5FA,#fff)"><b style="font-size:18px">Convert Your Airtime To Cash Instantly</b><br><small>Get cash in minutes. Fast. Secure. Trusted.</small><br><small style="color:green">✅ Typical payout in 2-5 minutes</small></div>
<div class="noteBox">
<b style="font-size:17px">📝 NOTE: How To Share Your Airtime</b><br><br>
<b>If you want to share your airtime, dial:</b>
<div class="copyRow" style="background:#fff;border:2px dashed #EAB308"><b style="font-size:22px;color:#0B3D91">*321#</b><button class="copyBtn" onclick="copyText('*321#',this)">📋 Copy Code</button></div>
<small style="display:block;margin-top:10px;line-height:1.6"><b>Step 1:</b> Dial <b>*321#</b> on your phone<br><b>Step 2:</b> Select <b>Share Airtime / Transfer</b><br><b>Step 3:</b> Enter the number below<br><b>Step 4:</b> Enter amount & confirm with your PIN<br><b>Step 5:</b> Press <b>"I Have Sent Airtime"</b> below</small>
</div>
<h3>1. Select Network</h3><div class="netRow"><div class="net sel" onclick="selNet(this);setNum('07078269788')">MTN</div><div class="net" onclick="selNet(this);setNum('08111275146')">Glo</div><div class="net" onclick="selNet(this)">Airtel</div><div class="net" onclick="selNet(this)">9Mobile</div></div>
<h3>2. Enter Airtime Amount</h3><input id="amt" value="10000" oninput="calc()" type="number"><div style="background:#DBEAFE;padding:10px;border-radius:10px;margin-top:8px;color:#0B3D91;font-weight:bold">ℹ️ Rate: ₦85 per ₦100 airtime</div>
<h3>3. You will receive</h3><div class="receive"><b id="receive">₦8,500 Cash</b><br><small>Processing fee: NO • You receive =85%</small></div>
<h3>4. Send the Airtime to this number</h3>
<div class="copyRow"><span>📞 <b id="sendNum" style="font-size:18px">07078269788</b></span><button class="copyBtn" onclick="copyText(document.getElementById('sendNum').innerText,this)">📋 Copy</button></div>
<small>Send the exact ₦<span id="amt2">10,000</span> airtime to the number above.</small>
<div style="display:flex;gap:8px"><button class="btn blue" style="flex:1" onclick="orderAirtime()">I Have Sent Airtime</button><button class="btn white" style="flex:1" onclick="show('orders')">Check Status</button></div>
<h3>Send To Correct Number Per Network</h3>
<div class="mtnCard"><b>MTN</b><div class="copyRow" style="background:#fff"><b>07078269788</b><button class="copyBtn" onclick="copyText('07078269788',this)">📋 Copy</button></div></div>
<div class="gloCard"><b>Glo</b><div class="copyRow" style="background:#fff"><b>08111275146</b><button class="copyBtn" onclick="copyText('08111275146',this)">📋 Copy</button></div></div>
</div>

<div id="orders" class="screen"><h2>🧾 My Orders</h2><div id="orderList"></div><div class="card"><b>Pay to OPay:</b><div class="copyRow"><b>6490743519</b><button class="copyBtn" onclick="copyText('6490743519',this)">📋 Copy</button></div></div></div>

<div id="support" class="screen">
<h2>← Support • FlexTopUp 🎧</h2>
<div class="card" style="background:#BFDBFE"><b style="font-size:20px">💬 Need Help?<br>Chat with us.</b><br><small>Our support team is here to help you 24/7</small></div>
<div class="card"><b>💬 WhatsApp: 07078269788</b><div class="copyRow"><b>07078269788</b><button class="copyBtn" onclick="copyText('07078269788',this)">📋 Copy</button></div><button class="btn green" onclick="window.open('https://wa.me/2347078269788')">Chat Now 💬</button></div>
<div class="card"><b>✉️ Email: flextopup2@gmail.com</b><div class="copyRow"><b>flextopup2@gmail.com</b><button class="copyBtn" onclick="copyText('flextopup2@gmail.com',this)">📋 Copy</button></div></div>
<div class="card"><b>🟢 OPay Payment:</b><div class="copyRow"><b>6490743519</b><button class="copyBtn" onclick="copyText('6490743519',this)">📋 Copy</button></div></div>
<div class="card"><b>❓ FAQ</b><div class="faq">› How do I purchase airtime/data?</div><div class="faq">› Why is my transaction pending?</div><div class="faq">› How to cash out to bank?</div><button class="btn white" onclick="window.open('https://wa.me/2347078269788')">⚠️ Report Issue</button></div>
</div>
</div>
<div class="nav"><div onclick="show('home')">🏠<br>Home</div><div onclick="show('home')">📶<br>Buy Data</div><div onclick="show('airtime')">💱<br>Airtime to Cash</div><div onclick="show('orders')">🧾<br>Orders</div><div onclick="show('support')">🎧<br>Support</div></div>
<script>
let plans=[{n:"500MB",p:200,v:"Valid for 1 day"},{n:"1GB",p:400,v:"Valid for 2 days"},{n:"2GB",p:600,v:"Valid for 4 days"},{n:"5GB",p:1500,v:"Valid for 7 days"},{n:"5GB",p:1500,v:"Valid for 7 days"},{n:"10GB",p:3000,v:"Valid for 30 days"}];
let sel=plans[1];
let orders=JSON.parse(localStorage.getItem('flexOrders')||'[{"name":"1GB MTN - ₦400","price":400,"status":"PENDING","user":"David"}]');
let users=JSON.parse(localStorage.getItem('flexAllUsers')||'[]');
let savedUser=JSON.parse(localStorage.getItem('flexUser')||'null');
function saveOrders(){ localStorage.setItem('flexOrders',JSON.stringify(orders)); }
function show(id){ document.querySelectorAll('.screen').forEach(d=>d.classList.remove('active')); document.getElementById(id).classList.add('active'); render(); renderAdmin(); window.scrollTo(0,0); }
function copyText(text,btn){ if(navigator.clipboard){ navigator.clipboard.writeText(text).then(()=>{ let old=btn.innerText; btn.innerText="✅ Copied!"; setTimeout(()=>btn.innerText=old,1500); }); } else { alert("Copied: "+text); } }
function register(){ let n=document.getElementById('regName').value.trim(); let u=document.getElementById('regUser').value.trim(); let p=document.getElementById('regPhone').value.trim(); if(!n||!u||!p){ alert("Abeg fill Name, Username and Phone Number"); return; } let user={name:n,username:u,phone:p}; localStorage.setItem('flexUser',JSON.stringify(user)); users.push(user); localStorage.setItem('flexAllUsers',JSON.stringify(users)); savedUser=user; applyUser(user); alert("Welcome "+n+"!"); show('home'); }
function loginOldDo(){ let p=document.getElementById('loginPhone').value.trim(); if(!p){ alert("Enter phone number"); return; } let u=savedUser; if(u && u.phone==p){ applyUser(u); } else { applyUser({name:"User",username:"user",phone:p}); } show('home'); }
function adminEnter(){ let pin=document.getElementById('adminPin').value; if(pin=="1234"){ show('admin'); } else { alert("Wrong PIN! PIN na 1234"); } }
function applyUser(u){ document.getElementById('userName').innerText=u.name.split(' ')[0]; document.getElementById('userHandle').innerText=u.username; document.getElementById('userPhone').innerText=u.phone; }
function selNet(el){ el.parentElement.querySelectorAll('.net').forEach(n=>n.classList.remove('sel')); el.classList.add('sel'); }
function setNum(num){ document.getElementById('sendNum').innerText=num; }
function renderPlans(){ let h=""; plans.forEach((pl,i)=>{ h+=`<div class="plan ${i==1?'sel':''}" onclick="selectPlan(${i},this)"><div>${pl.n} - N${pl.p}</div><small>${pl.v}</small></div>`; }); document.getElementById('planGrid').innerHTML=h; }
function selectPlan(i,el){ sel=plans[i]; document.querySelectorAll('.plan').forEach(p=>p.classList.remove('sel')); el.classList.add('sel'); document.getElementById('selPlanText').innerText=sel.n+" - ₦"+sel.p+" Selected"; }
function buyNow(){ let uname=savedUser?savedUser.name:"David"; orders.unshift({name:sel.n+" - ₦"+sel.p+" ("+uname+")",price:sel.p,status:"PENDING",user:uname}); saveOrders(); alert(sel.n+" order don enter! Pay to OPay 6490743519 - Tap Copy"); show('orders'); }
function calc(){ let a=Number(document.getElementById('amt').value||0); let r=Math.floor(a*0.85); document.getElementById('receive').innerText="₦"+r.toLocaleString()+" Cash"; document.getElementById('amt2').innerText=a.toLocaleString(); }
function orderAirtime(){ let a=Number(document.getElementById('amt').value||0); let uname=savedUser?savedUser.name:"David"; orders.unshift({name:"Airtime to Cash ₦"+a+" → ₦"+Math.floor(a*0.85)+" ("+uname+")",price:Math.floor(a*0.85),status:"PENDING",user:uname}); saveOrders(); alert("Airtime order don enter!"); show('orders'); }
function render(){ let ol=""; orders.forEach(o=>{ let c=o.status=="PENDING"?"pend":o.status=="SUCCESSFUL"?"succ":"rej"; ol+=`<div class="card"><b>${o.name}</b><br><span class="badge ${c}">${o.status}</span></div>`; }); document.getElementById('orderList').innerHTML=ol; }
function renderAdmin(){
 let total=orders.length; let pend=orders.filter(o=>o.status=="PENDING").length; let succ=orders.filter(o=>o.status=="SUCCESSFUL").length; let rev=orders.filter(o=>o.status=="SUCCESSFUL").reduce((s,o)=>s+(o.price||0),0);
 document.getElementById('statTotal').innerText=total; document.getElementById('statPend').innerText=pend; document.getElementById('statSucc').innerText=succ; document.getElementById('statRev').innerText="₦"+rev.toLocaleString();
 let h=""; orders.forEach((o,i)=>{ h+=`<div class="card"><b>${o.name}</b><br><small>User: ${o.user||"David"}</small><br><span class="badge ${o.status=="PENDING"?"pend":o.status=="SUCCESSFUL"?"succ":"rej"}">${o.status}</span><br><br><button class="smallBtn" style="background:#16a34a;color:#fff" onclick="adminApprove(${i})">✅ Approve</button><button class="smallBtn" style="background:#ef4444;color:#fff" onclick="adminReject(${i})">❌ Reject</button></div>`; }); document.getElementById('adminOrders').innerHTML=h||"<p>No orders yet</p>";
 let uh=""; if(users.length==0 && savedUser){ users=[savedUser]; } users.forEach(u=>{ uh+=`<div class="card"><b>${u.name}</b> (@${u.username})<br>📞 ${u.phone}</div>`; }); document.getElementById('adminUsers').innerHTML=uh||"<p>No users yet</p>";
}
function adminApprove(i){ orders[i].status="SUCCESSFUL"; saveOrders(); renderAdmin(); render(); alert("Order Approved ✅ Customer go see SUCCESSFUL"); }
function adminReject(i){ orders[i].status="REJECTED"; saveOrders(); renderAdmin(); render(); alert("Order Rejected ❌"); }
renderPlans(); render(); renderAdmin(); calc();
setTimeout(function(){ if(savedUser){ applyUser(savedUser); show('home'); } else { show('login'); } },2000);
</script>
</body>
</html># Flextopup-
Data app 
