import React from 'react'
export default function Sparkline({ values=[] }){
  if(values.length<2) return <div className="spark" />
  const w=120,h=40; const min=Math.min(...values), max=Math.max(...values); const span=max-min||1
  const pts = values.map((v,i)=>[i*(w/(values.length-1)), h-( (v-min)/span*h )])
  const d = pts.map((p,i)=> (i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')
  return (<svg className="spark" viewBox={`0 0 ${w} ${h}`}><path d={d} fill="none" stroke="currentColor" stroke-width="2" /></svg>)
}
