function nowStr(offset=0){const d=new Date(Date.now()+offset*1000);return d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});}
const DEFAULT_CONTACTS=[
 {id:1,number:"+254 107 661334",unread:true,preview:"joined using a group link",messages:[{text:"Welcome!",sent:false,time:nowStr(-60)}]},
 {id:2,number:"+254 705 588176",unread:true,preview:"Yes",messages:[{text:"Hey?",sent:false,time:nowStr(-3600)}]},
 {id:3,number:"+254 700 000000",unread:false,preview:"Screenshot?",messages:[{text:"Send screenshot",sent:false,time:nowStr(-7200)},{text:"Okay",sent:true,time:nowStr(-7100)}]},
 {id:4,number:"+254 712 345678",unread:true,preview:"Nimekuadd kwa vcf",messages:[{text:"Send vcf?",sent:false,time:nowStr(-4000)}]},
];
const chatList=document.getElementById("chatList"),messages=document.getElementById("messages"),chatHeader=document.getElementById("chatHeader"),msgInput=document.getElementById("messageInput"),sendBtn=document.getElementById("sendBtn"),search=document.getElementById("searchInput");
let contacts=load(),current=null;
function load(){try{let s=localStorage.getItem("wa_data");if(s)return JSON.parse(s);}catch{}return JSON.parse(JSON.stringify(DEFAULT_CONTACTS));}
function save(){localStorage.setItem("wa_data",JSON.stringify(contacts));}
function initials(num){return num.replace(/\D/g,"").slice(-2);}
function find(id){return contacts.find(c=>c.id===id);}
function renderList(f=""){chatList.innerHTML="";const q=f.trim().toLowerCase();contacts.filter(c=>!q||c.number.toLowerCase().includes(q)||c.preview.toLowerCase().includes(q)).forEach(c=>{const item=document.createElement("div");item.className="chat-item"+(c.unread?" unread":"");item.dataset.id=c.id;const av=document.createElement("div");av.className="avatar";av.textContent=initials(c.number);const meta=document.createElement("div");meta.className="chat-meta";const top=document.createElement("div");top.className="chat-top";const lbl=document.createElement("div");lbl.className="chat-label";lbl.textContent=c.number;const right=document.createElement("div");right.className="chat-right";const t=document.createElement("div");t.className="time";const last=c.messages[c.messages.length-1];t.textContent=last?last.time:"";const badge=document.createElement("div");badge.className="unread-badge";badge.textContent="1";if(!c.unread)badge.style.display="none";right.appendChild(t);right.appendChild(badge);top.appendChild(lbl);top.appendChild(right);const sub=document.createElement("div");sub.className="chat-sub";sub.textContent=c.preview||last.text;meta.appendChild(top);meta.appendChild(sub);item.appendChild(av);item.appendChild(meta);item.onclick=()=>open(c.id);let timer;item.onmousedown=e=>{timer=setTimeout(()=>toggle(c.id),700);};["mouseup","mouseleave"].forEach(ev=>item.addEventListener(ev,()=>clearTimeout(timer)));chatList.appendChild(item);});}
function open(id){const c=find(id);if(!c)return;current=c.id;c.unread=false;save();renderList(search.value);chatHeader.querySelector(".chat-title").textContent=c.number;renderMsgs(c);}
function renderMsgs(c){messages.innerHTML="";if(!c.messages.length){messages.innerHTML='<div class="empty-state">No messages yet</div>';return;}c.messages.forEach(m=>{const d=document.createElement("div");d.className="message "+(m.sent?"sent":"received");d.innerHTML=`<div>${m.text}</div><div class='msg-time'>${m.time}</div>`;messages.appendChild(d);});messages.scrollTop=messages.scrollHeight;}
function send(){if(!current)return;const txt=msgInput.value.trim();if(!txt)return;const c=find(current);c.messages.push({text:txt,sent:true,time:nowStr(0)});c.preview=txt;save();msgInput.value="";renderMsgs(c);renderList(search.value);}
sendBtn.onclick=send;msgInput.onkeydown=e=>{if(e.key==="Enter")send();};
function toggle(id){const c=find(id);c.unread=!c.unread;save();renderList(search.value);}
search.oninput=()=>renderList(search.value);
document.addEventListener("DOMContentLoaded",()=>{renderList();});
