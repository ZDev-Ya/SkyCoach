import React from 'react'
export default function ExercisePicker({ library, onSelect }){
  const [q,setQ] = React.useState('')
  const items = React.useMemo(()=>{
    const s=(q||'').toLowerCase()
    return library.filter(e=> e.name.toLowerCase().includes(s) || (e.equipment||'').includes(s))
  },[q,library])
  return (
    <div>
      <div className="label">Rechercher un exercice</div>
      <input className="input" placeholder="Ex: poulie, développé, curl…" value={q} onChange={e=>setQ(e.target.value)} />
      <div style={{marginTop:8}}>
        {items.map(ex=>(
          <button key={ex.id} className="btn tap" style={{display:'block',width:'100%',marginBottom:8}} onClick={()=>onSelect(ex)}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <strong>{ex.name}</strong><br/>
                <small className="label" style={{margin:0}}>Par défaut: {ex.default_sets}×{ex.default_reps} · Repos {ex.rest_sec_set}s</small>
              </div>
              <span>›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
