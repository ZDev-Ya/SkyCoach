import React from 'react'
import ExercisePicker from './components/ExercisePicker.jsx'
import SetLogger from './components/SetLogger.jsx'
import Sparkline from './components/Sparkline.jsx'

export default function App(){
  const [tab,setTab]=React.useState('seance')
  const [library,setLibrary]=React.useState([])
  const [schedule,setSchedule]=React.useState([])
  const [history,setHistory]=React.useState(()=>{ try{const v=localStorage.getItem('sc_history');return v?JSON.parse(v):[]}catch{return []} })
  React.useEffect(()=>localStorage.setItem('sc_history',JSON.stringify(history)),[history])
  React.useEffect(()=>{ fetch('/exercises_fr.json').then(r=>r.json()).then(setLibrary).catch(()=>{}); fetch('/default_schedule.json').then(r=>r.json()).then(setSchedule).catch(()=>{}) },[])

  const [dayIndex,setDayIndex]=React.useState(0)
  const day = schedule[dayIndex] || {}
  const [currentExercise,setCurrentExercise]=React.useState(null)
  const [log,setLog]=React.useState([])
  function startExercise(exId){ const meta=library.find(x=>x.id===exId)||{}; const start=(day.exercises||[]).find(x=>x.exercise_id===exId)?.start_weight_kg; setCurrentExercise({...meta,start_weight_kg:start}) }
  function finishSet(entry){ setLog(l=>[...l,{...entry, day:day.day, title:day.title}]) }
  function finishExercise(){ setCurrentExercise(null) }
  function endSession(){ const totalVolume=log.reduce((s,e)=> s + (Number(e.weight||0)*Number(e.reps||0)), 0); const sess={id:String(Date.now()),date:new Date().toISOString(),day:day.day,title:day.title,entries:log,totalVolume}; setHistory(h=>[...h,sess]); setLog([]); setCurrentExercise(null); alert('Séance enregistrée') }
  const volumeTrend = history.slice(-10).map(h=>h.totalVolume||0)

  return (
    <div className="container">
      <header>
        <div className="brand">Sky<span>coach</span></div>
        <div className="row">
          <button className={'tab '+(tab==='seance'?'active':'')} onClick={()=>setTab('seance')}>Séance</button>
          <button className={'tab '+(tab==='bibli'?'active':'')} onClick={()=>setTab('bibli')}>Bibliothèque</button>
          <button className={'tab '+(tab==='programme'?'active':'')} onClick={()=>setTab('programme')}>Programme</button>
          <button className={'tab '+(tab==='stats'?'active':'')} onClick={()=>setTab('stats')}>Stats</button>
        </div>
      </header>

      {tab==='seance' && (
        <div className="grid-2">
          <div className="card">
            <div className="label">Choisir le jour</div>
            <select className="input" value={dayIndex} onChange={e=>setDayIndex(Number(e.target.value))}>
              {schedule.map((d,i)=>(<option key={i} value={i}>{d.day} — {d.title}</option>))}
            </select>

            <div style={{marginTop:12}}>
              <div className="label">Exercices du jour</div>
              {(day.exercises||[]).length===0 && <p className="label">Aucun exercice défini pour ce jour.</p>}
              {(day.exercises||[]).map((e,i)=>{
                const meta = library.find(x=>x.id===e.exercise_id) || {name:e.exercise_id}
                return (
                  <button key={i} className="btn tap" style={{display:'block',width:'100%',marginBottom:8}} onClick={()=>startExercise(e.exercise_id)}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div><strong>{meta.name}</strong><br/><small className="label" style={{margin:0}}>{meta.default_sets}×{meta.default_reps} · Repos {meta.rest_sec_set}s · Départ {e.start_weight_kg||0}kg</small></div>
                      <span>›</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {currentExercise && (
              <div style={{marginTop:12}}>
                <SetLogger ex={currentExercise} onFinishSet={finishSet} onFinishExercise={finishExercise} />
              </div>
            )}

            <div style={{marginTop:12}} className="row">
              <button className="btn primary tap" onClick={endSession} disabled={log.length===0}>Terminer & enregistrer</button>
            </div>
          </div>

          <div className="card">
            <div style={{fontWeight:700,marginBottom:8}}>Séries enregistrées</div>
            {log.length===0 && <p className="label">Valide tes séries pour les voir ici.</p>}
            {log.map((e,i)=>(
              <div key={i} className="series">
                <div><strong>{e.name}</strong><br/><small>{e.reps} reps · {e.weight} kg · RPE {e.rpe}</small></div>
                <small className="label" style={{margin:0}}>{new Date(e.ts).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='bibli' && (
        <div className="card">
          <ExercisePicker library={library} onSelect={(ex)=>alert(ex.tutorial_fr)} />
        </div>
      )}

      {tab==='programme' && (
        <div className="card">
          <div style={{fontWeight:700,marginBottom:8}}>Programme hebdomadaire</div>
          {schedule.map((d,i)=>(
            <div key={i} style={{borderTop:'1px solid var(--border)',paddingTop:10,marginTop:10}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                <div><strong>{d.day} · {d.title}</strong></div>
                <div>{(d.tags||[]).map(t=>(<span className="pill" key={t}>{t}</span>))}</div>
              </div>
              {(d.exercises||[]).map((e,idx)=>{
                const meta = library.find(x=>x.id===e.exercise_id) || {name:e.exercise_id}
                return (
                  <div key={idx} className="series">
                    <div><strong>{meta.name}</strong><br/><small>{meta.default_sets}×{meta.default_reps} · Repos {meta.rest_sec_set}s</small></div>
                    <div className="right">
                      <div>
                        <div className="label">Charge départ</div>
                        <input className="input" type="number" defaultValue={Number(String(e.start_weight_kg||0).toString().split('–')[0])}
                          onBlur={(ev)=>{
                            const v = Number(ev.target.value||0)
                            setSchedule(s=>{ const copy=[...s]; copy[i].exercises[idx].start_weight_kg=v; return copy })
                          }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {tab==='stats' && (
        <div className="grid">
          <div className="card">
            <div style={{fontWeight:700,marginBottom:8}}>Historique</div>
            {history.length===0 && <p className="label">Aucune séance pour l’instant.</p>}
            {history.slice().reverse().map(h=>(
              <div key={h.id} className="series">
                <div><strong>{h.day} — {h.title}</strong><br/><small>{new Date(h.date).toLocaleString()} · Volume {Math.round(h.totalVolume)}</small></div>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{fontWeight:700,marginBottom:8}}>Tendance (volume — 10 dernières)</div>
            <Sparkline values={history.slice(-10).map(h=>h.totalVolume||0)} />
            <small className="label">La courbe monte = progression; garde RPE 7–8 la plupart du temps.</small>
          </div>
        </div>
      )}

      <footer>Données stockées localement (navigateur). PWA légère — “Ajouter à l’écran d’accueil”.</footer>
    </div>
  )
}
