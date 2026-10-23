'use strict';
(() => {
const canvas = document.querySelector('#game'), ctx = canvas.getContext('2d');
const health = document.querySelector('#health'), quest = document.querySelector('#quest');
const status = document.querySelector('#status'), overlay = document.querySelector('#overlay');
const keys = new Set();
let player, enemy, mode = 'ready', last = 0, swing = 0, cooldown = 0, invincible = 0, time = 0;
const obstacles = [{x:96,y:96,w:48,h:38},{x:477,y:98,w:48,h:38},{x:96,y:260,w:48,h:38},{x:477,y:260,w:48,h:38},{x:285,y:60,w:70,h:47}];
const rect = (x,y,w,h,c) => {ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h);};
function reset(start = true) {
 player={x:235,y:229,hp:5,dx:1,dy:0}; enemy={x:417,y:220,hp:3,flash:0};
 swing=cooldown=invincible=0;keys.clear();mode=start?'playing':'ready';
 health.textContent='♥ ♥ ♥ ♥ ♥';quest.innerHTML='Győzd le az őrzőt <b>0/1</b>';
 overlay.classList.toggle('hidden', start);status.textContent=start?'Fedezd fel a kertet. Az őrző közeledik!':'Készen állsz a kalandra?';
 if(start)canvas.focus();
}
function end(won){mode=won?'won':'lost';keys.clear();overlay.classList.remove('hidden');overlay.querySelector('.eyebrow').textContent=won?'KÜLDETÉS TELJESÍTVE':'A KALAND MÉG NEM ÉRT VÉGET';overlay.querySelector('h2').textContent=won?'A kert újra szabad!':'A lovag elesett';overlay.querySelector('p').textContent=won?'Az őrzőt legyőzted. A torony felé vezető út megnyílt.':'Pihenj meg, és próbáld újra!';document.querySelector('#start').innerHTML='Új kaland <span>→</span>';status.textContent=won?'Győzelem! Az őrző legyőzve.':'Elfogyott az életerőd. Próbáld újra!';}
function blocked(x,y){return x<39||x>601||y<55||y>342||obstacles.some(o=>x+10>o.x&&x-10<o.x+o.w&&y+10>o.y&&y-8<o.y+o.h);}
function move(actor,dx,dy){if(!blocked(actor.x+dx,actor.y))actor.x+=dx;if(!blocked(actor.x,actor.y+dy))actor.y+=dy;}
function attack(){if(mode!=='playing'||cooldown>0)return;swing=.22;cooldown=.38;const dx=enemy.x-player.x,dy=enemy.y-player.y,d=Math.hypot(dx,dy);if(d<57&&(d<17||(dx*player.dx+dy*player.dy)/d>.25)){enemy.hp--;enemy.flash=.2;move(enemy,player.dx*16,player.dy*16);status.textContent='Találat! Az őrző életereje: '+enemy.hp+'/3';if(enemy.hp<=0){quest.innerHTML='Őrző legyőzve <b>1/1</b>';end(true);}}}
function update(dt){time+=dt;if(mode!=='playing')return;swing=Math.max(0,swing-dt);cooldown=Math.max(0,cooldown-dt);invincible=Math.max(0,invincible-dt);enemy.flash=Math.max(0,enemy.flash-dt);
 let dx=Number(keys.has('d')||keys.has('ArrowRight'))-Number(keys.has('a')||keys.has('ArrowLeft')),dy=Number(keys.has('s')||keys.has('ArrowDown'))-Number(keys.has('w')||keys.has('ArrowUp'));
 const length=Math.hypot(dx,dy);if(length){dx/=length;dy/=length;player.dx=dx;player.dy=dy;move(player,dx*112*dt,dy*112*dt);}if(keys.has(' '))attack();
 const ex=player.x-enemy.x,ey=player.y-enemy.y,d=Math.hypot(ex,ey);if(d>18)move(enemy,ex/d*41*dt,ey/d*41*dt);
 if(d<22&&invincible===0){player.hp--;invincible=1.1;health.textContent=Array.from({length:5},(_,i)=>i<player.hp?'♥':'♡').join(' ');status.textContent='Az őrző eltalált! Tarts távolságot, majd támadj!';move(player,ex/(d||1)*18,ey/(d||1)*18);if(player.hp<=0)end(false);}}
function tree(x,y){rect(x-5,y+8,10,20,'#685037');rect(x-22,y-4,44,16,'#182e23');rect(x-18,y-20,36,24,'#254d32');rect(x-12,y-29,24,22,'#35643b');rect(x-7,y-28,11,5,'#4d7d46');rect(x-23,y+6,46,5,'#162c22');}
function knight(x,y){x=Math.round(x);y=Math.round(y);rect(x-10,y+11,22,5,'#182b25');rect(x-7,y-1,14,17,'#6f8c9a');rect(x-8,y+9,6,8,'#a3b6b0');rect(x+3,y+9,6,8,'#a3b6b0');rect(x-9,y-15,18,17,'#c1d4ca');rect(x-6,y-18,12,4,'#e1e6cc');rect(x-7,y-8,14,5,'#354953');rect(x-5,y-7,3,2,'#a3d9c4');rect(x+3,y-7,3,2,'#a3d9c4');rect(x-13,y,7,12,'#708dba');rect(x-12,y+2,4,7,'#9aafc5');rect(x+9,y-7,3,18,'#d5decd');rect(x+6,y+5,9,3,'#d4b674');rect(x-2,y-20,4,5,'#dc7865');}
function monster(x,y){x=Math.round(x);y=Math.round(y);rect(x-14,y+12,28,5,'#182b25');const c=enemy.flash>0?'#eee7bd':'#9b74ad';rect(x-12,y-9,24,22,c);rect(x-8,y-16,17,8,c);rect(x-17,y-7,6,15,'#77588e');rect(x+12,y-7,6,15,'#77588e');rect(x-10,y+10,7,8,'#594665');rect(x+4,y+10,7,8,'#594665');rect(x-8,y-8,5,4,'#f3c471');rect(x+4,y-8,5,4,'#f3c471');rect(x-3,y+2,7,4,'#49344f');rect(x-13,y-19,5,10,'#c7bba0');rect(x+8,y-19,5,10,'#c7bba0');rect(x-16,y-29,32,3,'#283024');rect(x-16,y-29,32*enemy.hp/3,3,'#d28b82');}
function draw(){rect(0,0,640,384,'#365d36');for(let y=0;y<384;y+=16)for(let x=0;x<640;x+=16){const n=(x*17+y*31)%113;rect(x,y,16,16,n<45?'#3a6138':'#365b34');if(n<35){rect(x+4,y+7,2,3,'#517441');rect(x+8,y+6,2,4,'#456d3b');}}
 // Worn sandstone path and a circular clearing.
 rect(267,45,106,300,'#8a8960');rect(40,176,560,70,'#8a8960');ctx.fillStyle='#8a8960';ctx.beginPath();ctx.ellipse(320,210,106,75,0,0,Math.PI*2);ctx.fill();
 for(let i=0;i<105;i++){let x=48+(i*97)%546,y=61+(i*53)%276;if((x>272&&x<365)||(y>180&&y<240)||Math.hypot((x-320)/1.4,y-210)<66)rect(x,y,9,3,i%2?'#a19b70':'#777e53');}
 for(let x=16;x<624;x+=24){rect(x,27,23,20,'#626e60');rect(x+2,29,19,5,'#8b947b');rect(x,47,23,5,'#293f30');rect(x,349,23,20,'#626e60');rect(x+2,351,19,4,'#87917a');}for(let y=48;y<350;y+=24){rect(16,y,18,23,'#65725f');rect(18,y,4,20,'#89937a');rect(606,y,18,23,'#65725f');}
 // Sealed tower entrance, stone pillars and lanterns.
 rect(280,30,80,52,'#64756a');rect(290,32,60,47,'#81917b');rect(299,40,42,39,'#243e32');rect(305,45,30,34,'#385141');for(let x=309;x<337;x+=8)rect(x,45,3,34,'#748276');rect(294,76,52,7,'#a1a187');rect(286,83,68,8,'#777e68');
 obstacles.slice(0,4).forEach(o=>{rect(o.x+1,o.y+8,o.w,o.h,'#243f2b');rect(o.x,o.y,o.w,o.h-6,'#677e5c');rect(o.x+4,o.y+3,o.w-8,5,'#91a078');rect(o.x+8,o.y+12,o.w-16,o.h-22,'#3c5e3a');rect(o.x+12,o.y+15,6,8,'#73925c');});
 [[55,65],[170,65],[451,63],[577,67],[62,312],[176,321],[452,320],[577,315],[58,151],[580,152]].forEach(p=>tree(...p));
 for(let i=0;i<24;i++){let x=55+(i*71)%530,y=65+(i*97)%270;if(x>240&&x<390||y>165&&y<253)continue;rect(x,y,2,5,'#83a356');rect(x-2,y-2,5,3,i%3?'#dbbf83':'#b19fc5');}
 [[242,114],[387,114]].forEach(([x,y])=>{rect(x-3,y,7,19,'#554f36');rect(x-6,y-5,13,9,'#927747');rect(x-3,y-7,7,9,'#f4c677');rect(x-1,y-6,3,5,'#ffedb1');});
 if(enemy.hp>0)monster(enemy.x,enemy.y);if(invincible<=0||Math.floor(time*13)%2===0)knight(player.x,player.y);
 if(swing>0){ctx.strokeStyle='#f2e6b2';ctx.lineWidth=5;const a=Math.atan2(player.dy,player.dx);ctx.beginPath();ctx.arc(player.x,player.y,35,a-.95,a+.95);ctx.stroke();ctx.strokeStyle='#fff6d5';ctx.lineWidth=2;ctx.beginPath();ctx.arc(player.x,player.y,41,a-.65,a+.65);ctx.stroke();}
 const shade=ctx.createRadialGradient(320,205,140,320,205,380);shade.addColorStop(0,'#061c0b00');shade.addColorStop(1,'#061c0b70');ctx.fillStyle=shade;ctx.fillRect(0,0,640,384);
}
window.addEventListener('keydown',e=>{const k=e.key.length===1?e.key.toLowerCase():e.key;if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k))e.preventDefault();if(k==='r'){reset();return;}keys.add(k);if(k===' ')attack();});window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>keys.clear());
 document.querySelector('#start').addEventListener('click',()=>reset());document.querySelector('#restart').addEventListener('click',()=>reset());
 document.querySelectorAll('[data-key]').forEach(button=>{button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(button.dataset.key);if(button.dataset.key===' ')attack();});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys.delete(button.dataset.key));});
 reset(false);function frame(now){const dt=Math.min((now-last)/1000,.035);last=now;update(dt);draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
})();
