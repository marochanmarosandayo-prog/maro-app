
const message=document.getElementById("message")
const maro=document.getElementById("maro")
const effects=document.getElementById("effects")
const meterFill=document.getElementById("meterFill")
const scoreEl=document.getElementById("score")
const sleepOverlay=document.getElementById("sleepOverlay")
const soundBtn=document.getElementById("soundBtn")
const testBtn=document.getElementById("testBtn")
const resetBtn=document.getElementById("resetBtn")

const okIds=["ok1","ok2","ok3"]
const ngIds=["ng1","ng2","ng3"]

let score=0
let soundOn=false
let cleared=false
let sleeping=false
let scratchTimer=null

function audio(id){return document.getElementById(id)}
function play(id){
  if(!soundOn)return
  const a=audio(id)
  a.pause()
  a.currentTime=0
  a.play().catch(()=>{})
}
function playRandom(ids){
  const id=ids[Math.floor(Math.random()*ids.length)]
  play(id)
}
function update(){
  if(score<0)score=0
  if(score>100)score=100
  meterFill.style.width=score+"%"
  scoreEl.textContent=score
}
function animate(cls){
  maro.classList.remove("happy","angry","relax","clear")
  void maro.offsetWidth
  maro.classList.add(cls)
  setTimeout(()=>{if(!scratchTimer&&!sleeping)maro.classList.remove(cls)},800)
}
function effect(x,y,t,big=false){
  const r=effects.getBoundingClientRect()
  const el=document.createElement("div")
  el.className=big?"effect bigEffect":"effect"
  el.textContent=t
  el.style.left=(x-r.left-16)+"px"
  el.style.top=(y-r.top-16)+"px"
  effects.appendChild(el)
  setTimeout(()=>el.remove(),1600)
}
function clearCheck(e){
  if(score>=100&&!cleared){
    score=100
    cleared=true
    update()
    message.textContent="100点！もう一回なでると寝るよ♡"
    maro.classList.remove("scratch")
    animate("clear")
    play("clear")
    ;["🎉","💕","✨","⭐"].forEach((m,i)=>setTimeout(()=>effect(e.clientX+(Math.random()*100-50),e.clientY+(Math.random()*50-25),m,true),i*120))
  }
}
function sleepNow(e){
  if(sleeping)return
  sleeping=true
  stopScratch(false)
  message.textContent="すやすや…マロちゃん寝ちゃった"
  maro.classList.remove("happy","angry","relax","clear","scratch")
  maro.classList.add("sleeping")
  sleepOverlay.classList.add("show")
  play("sleep")
  effect(e.clientX,e.clientY,"💤",true)
}
function good(e){
  if(!soundOn){message.textContent="先に音オンを押してね";return}
  if(cleared&&!sleeping){sleepNow(e);return}
  if(sleeping)return
  score+=10
  update()
  message.textContent="ピュイッ♪ そこ大好き！"
  animate("happy")
  playRandom(okIds)
  effect(e.clientX,e.clientY,"💗")
  clearCheck(e)
}
function ok(e){
  if(!soundOn){message.textContent="先に音オンを押してね";return}
  if(cleared&&!sleeping){sleepNow(e);return}
  if(sleeping)return
  score+=6
  update()
  message.textContent="ふわぁ…おでこ気持ちいい"
  animate("relax")
  playRandom(okIds)
  effect(e.clientX,e.clientY,"🌼")
  clearCheck(e)
}
function bad(e){
  if(!soundOn){message.textContent="先に音オンを押してね";return}
  if(cleared||sleeping)return
  stopScratch()
  score-=12
  update()
  const msgs=["プイッ！そこはイヤみたい","キュイッ！ちょっと怒った","ピュッ！そっぽ向いちゃう"]
  message.textContent=msgs[Math.floor(Math.random()*msgs.length)]
  animate("angry")
  playRandom(ngIds)
  effect(e.clientX,e.clientY,"💢")
}
function startScratch(e){
  if(!soundOn||cleared||sleeping)return
  stopScratch(false)
  maro.classList.add("scratch")
  scratchTimer=setInterval(()=>{
    score+=3
    update()
    playRandom(okIds)
    effect(e.clientX+(Math.random()*30-15),e.clientY+(Math.random()*30-15),score>=70?"💕":"✨")
    clearCheck(e)
  },700)
}
function stopScratch(reset=true){
  if(scratchTimer){clearInterval(scratchTimer);scratchTimer=null}
  maro.classList.remove("scratch")
}
function addGood(sel){
  const z=document.querySelector(sel)
  z.addEventListener("pointerdown",e=>{e.preventDefault();good(e);startScratch(e)},{passive:false})
  z.addEventListener("pointerup",e=>{e.preventDefault();stopScratch()},{passive:false})
  z.addEventListener("pointerleave",()=>stopScratch(),{passive:false})
  z.addEventListener("pointercancel",()=>stopScratch(),{passive:false})
}
addGood(".cheekL")
addGood(".cheekR")
document.querySelector(".forehead").addEventListener("pointerdown",e=>{e.preventDefault();ok(e)},{passive:false})
document.querySelectorAll(".bad").forEach(z=>z.addEventListener("pointerdown",e=>{e.preventDefault();bad(e)},{passive:false}))

soundBtn.onclick=()=>{
  soundOn=true
  play("test")
  message.textContent="音OK！マロちゃんをなでてね"
}
testBtn.onclick=()=>{soundOn=true;play("test")}
resetBtn.onclick=()=>{
  score=0;cleared=false;sleeping=false
  stopScratch()
  update()
  sleepOverlay.classList.remove("show")
  maro.classList.remove("happy","angry","relax","clear","scratch","sleeping")
  message.textContent=soundOn?"マロちゃんをなでてね":"音オンを押してね"
}
update()
