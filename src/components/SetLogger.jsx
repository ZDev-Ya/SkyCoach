import React from 'react'
import RestTimer from './RestTimer.jsx'
export default function SetLogger({ ex, onFinishSet, onFinishExercise }){
  const [setsLeft,setSetsLeft]=React.useState(ex.default_sets||3)
  const [reps,setReps]=React.useState((ex.default_reps||'8').split('–')[0])
  const [weight,setWeight]=React.useState(ex.start_weight_kg?Number(String(ex.start_weight_kg).split('–')[0]):0)
  const [rpe,setRpe]=React.useState(8)
  const [rest,setRest]=React.useState(0)
  function validate(){
    const entry={ name:ex.name, reps:Number(reps||0), weight:Number(weight||0), rpe:Number(rpe||0), ts:new Date().toISOString() }
    onFinishSet && onFinishSet(entry)
    const next = setsLeft-1
    if(next>0){ setSetsLeft(next); setRest(ex.rest_sec_set||60) }
    else{ setRest(ex.rest_sec_exercise||120); setTimeout(()=> onFinishExercise && onFinishExercise(), (ex.rest_sec_exercise||120)*1000) }
  }
  return (
    <div>
      <div className="series" style={{alignItems:'flex-start'}}>
        <div style={{flex:1}}>
          <div style={{fontWeight:700}}>{ex.name}</div>
          <small>{setsLeft} série(s) restante(s) · {ex.default_reps} rép. · repos {ex.rest_sec_set||60}s</small>
          <div className="label" style={{marginTop:8}}>{ex.tutorial_fr}</div>
        </div>
        <div className="right">
          <div><div className="label">Poids (kg)</div><input className="input" type="number" value={weight} onChange={e=>setWeight(e.target.value)} /></div>
          <div><div className="label">Rép.</div><input className="input" type="number" value={reps} onChange={e=>setReps(e.target.value)} /></div>
          <div><div className="label">RPE</div><input className="input" type="number" min="6" max="10" value={rpe} onChange={e=>setRpe(e.target.value)} /></div>
          <button className="btn primary tap" onClick={validate}>Valider la série</button>
        </div>
      </div>
      {rest>0 && (
        <div className="row" style={{alignItems:'center'}}>
          <span className="label" style={{margin:0}}>Repos</span>
          <RestTimer seconds={rest} onDone={()=>setRest(0)}/>
          <button className="btn tap" onClick={()=>setRest(0)}>Ignorer</button>
        </div>
      )}
    </div>
  )
}
