import React from 'react'
export default function RestTimer({ seconds, onDone }){
  const [left,setLeft]=React.useState(seconds||0)
  React.useEffect(()=>{ setLeft(seconds||0) },[seconds])
  React.useEffect(()=>{
    if(left<=0) return
    const id=setInterval(()=>setLeft(v=>{
      if(v<=1){
        try{ if('vibrate' in navigator) navigator.vibrate(60) }catch{}
        const a = new Audio(); a.src='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='; a.play().catch(()=>{}) 
        onDone && onDone()
      }
      return v-1
    }),1000)
    return ()=>clearInterval(id)
  },[left])
  const m=Math.floor(left/60), s=left%60
  return <div className="timer">{m}:{String(s).padStart(2,'0')}</div>
}
