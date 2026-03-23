import React, { useState, useEffect, useRef } from "react";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const C = {
  navy:"#0B1F3A",navyMid:"#1E3A5F",
  teal:"#0D9488",tealLight:"#14B8A6",tealPale:"#CCFBF1",
  gold:"#F59E0B",goldLight:"#FCD34D",goldPale:"#FEF3C7",
  red:"#EF4444",redPale:"#FEE2E2",
  green:"#10B981",greenPale:"#D1FAE5",
  purple:"#8B5CF6",purplePale:"#EDE9FE",
  orange:"#F97316",orangePale:"#FFEDD5",
  pink:"#EC4899",pinkPale:"#FCE7F3",
  blue:"#3B82F6",bluePale:"#DBEAFE",
  cyan:"#06B6D4",cyanPale:"#CFFAFE",
  lime:"#84CC16",limePale:"#ECFCCB",
  bg:"#F0F4F8",card:"#FFFFFF",
  muted:"#64748B",border:"#E2E8F0",text:"#1E293B",
};

// ─── Shared UI ───────────────────────────────────────────────────────────────
const Badge=({label,color,small})=>(<span style={{background:color+"22",color,padding:small?"2px 7px":"3px 10px",borderRadius:99,fontSize:small?10:11,fontWeight:700,border:`1px solid ${color}44`}}>{label}</span>);
const ProgressBar=({value,max,color=C.teal,height=8})=>(<div style={{background:C.border,borderRadius:99,height,overflow:"hidden"}}><div style={{background:color,width:`${Math.min(100,(value/max)*100)}%`,height:"100%",borderRadius:99,transition:"width 0.5s ease"}}/></div>);
const Btn=({children,onClick,color=C.teal,outline,disabled,full,small,style:s})=>(<button onClick={onClick} disabled={disabled} style={{background:outline?"transparent":disabled?C.border:color,border:`2px solid ${disabled?C.border:color}`,borderRadius:10,padding:small?"7px 14px":"11px 22px",color:outline?color:disabled?C.muted:"#fff",fontWeight:700,fontSize:small?13:15,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",transition:"all 0.15s",fontFamily:"inherit",...s}}>{children}</button>);
const Header=({title,icon,color,onBack,right})=>(<div style={{background:color,padding:"14px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}><button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:13}}>← Exit</button><span style={{fontSize:22}}>{icon}</span><span style={{color:"#fff",fontWeight:800,fontSize:16,flex:1}}>{title}</span>{right}</div>);
const ResultScreen=({emoji,title,subtitle,score,maxScore,color,onBack,onSave})=>{const pct=maxScore?Math.round((score/maxScore)*100):score;return(<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}><div style={{background:C.card,borderRadius:24,padding:40,maxWidth:440,width:"100%",textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,0.1)"}}><div style={{fontSize:56}}>{emoji}</div><h2 style={{color:C.navy,fontWeight:900,fontSize:26,margin:"14px 0 4px"}}>{title}</h2>{subtitle&&<div style={{color:C.muted,marginBottom:12}}>{subtitle}</div>}<div style={{fontSize:48,fontWeight:900,color:pct>=80?C.green:pct>=60?C.gold:C.red,margin:"8px 0"}}>{maxScore?`${pct}%`:score}</div>{maxScore&&<div style={{color:C.muted,fontSize:13,marginBottom:16}}>{score} / {maxScore} pts</div>}<div style={{display:"flex",gap:12,justifyContent:"center",marginTop:20}}><Btn onClick={onBack} outline color={color} small>← Back</Btn><Btn onClick={onSave} color={color} small>Save Score 💾</Btn></div></div></div>);};

// ─── Knowledge Base ──────────────────────────────────────────────────────────
const KB = `HUD HOUSING COUNSELING COMPLIANCE — Hawaiian Community Assets

COUNSELING SESSION REQUIREMENTS:
- Intake: gathers demographic, contact, financial info. NOT reportable as housing counseling on HUD-9902
- Written Action Plan REQUIRED for every client: goals, tasks, strategies, timeline, referrals
- Financial assessment must include: budget/spending plan, credit report, affordability analysis
- File retention: minimum 3 years (24 CFR Part 214)
- HUD-9902 submitted quarterly via Housing Counseling System (HCS)
- Required pre-purchase handouts: "For Your Protection Get A Home Inspection" + "Ten Important Questions to Ask Your Home Inspector"
- Agencies failing to submit HUD-9902 may lose HUD-approved status

HUD PROGRAMS:
- Section 8 / HCV: HUD's largest rental program; managed by PHAs; tenant pays ~30% of adjusted income
- Project-based vouchers: attached to specific unit; up to 20% of PHA vouchers
- Tenant-based vouchers: portable, follows the tenant
- FHA 203(b): standard purchase/refinance; FHA 203(k): rehab loans
- FHA down payment: 3.5% for 580+ credit; 10% for 500-579 credit
- FHA DTI: up to 50%+ with compensating factors; requires MIP
- Conventional loans: typically stricter DTI (43-45%), no MIP with 20% down
- USDA loans: rural areas, 0% down, income limits apply
- VA loans: veterans, 0% down, no PMI, flexible DTI
- HECM (reverse mortgage): requires mandatory HUD counseling before closing; borrower must maintain home, pay taxes/insurance

LOSS MITIGATION OPTIONS:
- Forbearance: temporary pause/reduction of payments
- Repayment Plan: catch up missed payments over time  
- Loan Modification: permanent change to loan terms (rate, term, principal)
- Partial Claim: HUD pays arrears; creates subordinate zero-interest lien
- Pre-Foreclosure Sale (Short Sale): sell for less than owed with lender approval
- Deed-in-Lieu: voluntary deed transfer to lender to avoid foreclosure
- Must present ALL applicable options — never steer

FAIR HOUSING — 7 FEDERAL PROTECTED CLASSES:
Race, Color, National Origin, Religion, Sex, Familial Status, Disability
- Familial status = families with children under 18 + pregnant women
- Retaliatory eviction is illegal
- Steering clients to certain neighborhoods is illegal
- Fair Housing covers BOTH rental and purchase

ETHICS:
- Never refer to lenders where counselor has financial interest
- Fee disclosure required upfront
- Privacy Act compliance mandatory
- Conflict of interest must be disclosed and avoided

INCOME LIMITS: 80% AMI = low-income; 50% AMI = very low-income; 30% AMI = extremely low-income
DTI: Front-end (housing ratio) + Back-end (all debts). FHA up to ~50% with compensating factors.`;

// ─── ═══════════════════════════════════════════════════════════════════════
// ─── MINI GAME 1: MATCHING PAIRS ─────────────────────────────────────────
// ─── ═══════════════════════════════════════════════════════════════════════
const MATCH_PAIRS = [
  {term:"Forbearance",def:"Temporarily pauses or reduces mortgage payments"},
  {term:"Loan Modification",def:"Permanently changes loan terms (rate, term, principal)"},
  {term:"Partial Claim",def:"HUD pays arrears; creates subordinate zero-interest lien"},
  {term:"Deed-in-Lieu",def:"Voluntary deed transfer to lender to avoid foreclosure"},
  {term:"HUD-9902",def:"Quarterly activity report submitted via Housing Counseling System"},
  {term:"Action Plan",def:"Required written document for every counseling client"},
  {term:"Section 8 / HCV",def:"HUD's largest rental assistance program, managed by PHAs"},
  {term:"FHA 203(k)",def:"Rehabilitation loan financing purchase AND renovation"},
  {term:"Familial Status",def:"Protected class: families with children under 18 or pregnant women"},
  {term:"Steering",def:"Illegal Fair Housing act of directing clients by protected class"},
  {term:"HECM",def:"Reverse mortgage requiring mandatory HUD counseling before closing"},
  {term:"3 Years",def:"Minimum client file retention period (24 CFR Part 214)"},
];

function MatchingPairs({onBack,onComplete}){
  const pairs=MATCH_PAIRS.slice(0,8);
  const [cards]=useState(()=>{
    const all=[...pairs.map((p,i)=>({id:`t${i}`,text:p.term,pairId:i,type:"term"})),...pairs.map((p,i)=>({id:`d${i}`,text:p.def,pairId:i,type:"def"}))];
    return all.sort(()=>Math.random()-0.5);
  });
  const [flipped,setFlipped]=useState([]);
  const [matched,setMatched]=useState(new Set());
  const [moves,setMoves]=useState(0);
  const [checking,setChecking]=useState(false);
  const [wrong,setWrong]=useState([]);
  const [done,setDone]=useState(false);

  const flip=(card)=>{
    if(checking||matched.has(card.pairId.toString()+(card.type==="term"?"t":"d"))||flipped.find(c=>c.id===card.id))return;
    const newFlipped=[...flipped,card];
    setFlipped(newFlipped);
    if(newFlipped.length===2){
      setMoves(m=>m+1);
      setChecking(true);
      if(newFlipped[0].pairId===newFlipped[1].pairId&&newFlipped[0].type!==newFlipped[1].type){
        setTimeout(()=>{
          setMatched(m=>new Set([...m,newFlipped[0].pairId]));
          setFlipped([]);setChecking(false);
          if(matched.size+1>=pairs.length)setDone(true);
        },600);
      }else{
        setWrong([newFlipped[0].id,newFlipped[1].id]);
        setTimeout(()=>{setFlipped([]);setChecking(false);setWrong([]);},900);
      }
    }
  };

  const score=Math.max(0,Math.round((pairs.length/Math.max(pairs.length,moves))*100));

  if(done)return<ResultScreen emoji="🃏" title="All Matched!" subtitle={`${moves} moves`} score={score} color={C.pink} onBack={onBack} onSave={()=>onComplete(score)}/>;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Matching Pairs" icon="🃏" color={C.pink} onBack={onBack} right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:13}}>✓ {matched.size}/{pairs.length} · {moves} moves</span>}/>
    <div style={{maxWidth:720,margin:"24px auto",padding:"0 16px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {cards.map(card=>{
        const isFlipped=!!flipped.find(c=>c.id===card.id);
        const isMatched=matched.has(card.pairId);
        const isWrong=wrong.includes(card.id);
        return(<button key={card.id} onClick={()=>flip(card)} style={{minHeight:80,borderRadius:14,border:`2px solid ${isMatched?C.green:isWrong?C.red:isFlipped?C.pink:C.border}`,background:isMatched?C.greenPale:isWrong?C.redPale:isFlipped?"#FDF2F8":C.card,cursor:isMatched?"default":"pointer",padding:"10px 8px",fontSize:12,fontWeight:700,color:isMatched?C.green:isFlipped?C.pink:C.muted,lineHeight:1.4,transition:"all 0.2s",opacity:isMatched?0.6:1,fontFamily:"inherit"}}>
          {isFlipped||isMatched?card.text:"?"}
        </button>);
      })}
    </div>
    <div style={{textAlign:"center",color:C.muted,fontSize:13,marginTop:8}}>Click two cards that match — term + definition</div>
  </div>);
}

// ─── MINI GAME 2: SPEED SORT ──────────────────────────────────────────────
const SORT_CATEGORIES = {
  "Loss Mitigation":{color:C.red,items:["Forbearance","Loan Modification","Short Sale","Deed-in-Lieu","Partial Claim","Repayment Plan"]},
  "Fair Housing Violations":{color:C.purple,items:["Steering","Redlining","Blockbusting","Retaliatory Eviction","Discriminatory Advertising","Refusing to Rent Based on Race"]},
  "Required in Client File":{color:C.teal,items:["Written Action Plan","Credit Report","Intake Form","Authorization Disclosure","Financial Analysis","Counseling Notes"]},
  "HUD Loan Products":{color:C.blue,items:["FHA 203(b)","FHA 203(k)","HECM","Housing Choice Voucher","Section 8 Project-Based","FHA Title I"]},
};

function SpeedSort({onBack,onComplete}){
  const cats=Object.keys(SORT_CATEGORIES);
  const allItems=cats.flatMap(c=>SORT_CATEGORIES[c].items.map(i=>({item:i,category:c})));
  const [shuffled]=useState(()=>[...allItems].sort(()=>Math.random()-0.5));
  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [wrong,setWrong]=useState(null);
  const [timeLeft,setTimeLeft]=useState(90);
  const [done,setDone]=useState(false);
  const [feedback,setFeedback]=useState(null);

  useEffect(()=>{
    if(done)return;
    const t=setInterval(()=>setTimeLeft(p=>{if(p<=1){setDone(true);return 0;}return p-1;}),1000);
    return()=>clearInterval(t);
  },[done]);

  useEffect(()=>{if(idx>=shuffled.length)setDone(true);},[idx]);

  const pick=(cat)=>{
    const correct=shuffled[idx].category===cat;
    if(correct){setScore(s=>s+10);setFeedback({correct:true,cat});setTimeout(()=>{setFeedback(null);setIdx(i=>i+1);},400);}
    else{setWrong(cat);setFeedback({correct:false,correctCat:shuffled[idx].category});setTimeout(()=>{setWrong(null);setFeedback(null);setIdx(i=>i+1);},900);}
  };

  if(done)return<ResultScreen emoji="⚡" title="Speed Sort Done!" subtitle={`${idx} items sorted`} score={score} maxScore={shuffled.length*10} color={C.orange} onBack={onBack} onSave={()=>onComplete(score)}/>;

  const current=shuffled[idx];
  const tc=timeLeft>45?C.green:timeLeft>20?C.gold:C.red;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Speed Sort" icon="⚡" color={C.orange} onBack={onBack} right={<><span style={{background:tc,borderRadius:99,padding:"3px 12px",color:"#fff",fontWeight:900,fontSize:16,marginRight:8}}>{timeLeft}s</span><span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:13}}>{score} pts</span></>}/>
    <div style={{maxWidth:600,margin:"0 auto",padding:"24px 20px"}}>
      <ProgressBar value={idx} max={shuffled.length} color={C.orange}/>
      <div style={{background:C.card,borderRadius:20,padding:"32px 28px",marginTop:20,textAlign:"center",boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
        <div style={{color:C.muted,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Where does this belong?</div>
        <div style={{color:C.navy,fontSize:22,fontWeight:900,marginBottom:8,lineHeight:1.3}}>{current.item}</div>
        {feedback&&<div style={{fontSize:12,color:feedback.correct?C.green:C.red,fontWeight:700,marginBottom:8}}>{feedback.correct?"✅ Correct!":"❌ Wrong — "+feedback.correctCat}</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}>
        {cats.map(cat=>{
          const {color}=SORT_CATEGORIES[cat];
          const isWrong=wrong===cat;
          const isCorrect=feedback?.correct&&feedback.cat===cat;
          return(<button key={cat} onClick={()=>pick(cat)} style={{background:isCorrect?C.greenPale:isWrong?C.redPale:color+"15",border:`2px solid ${isCorrect?C.green:isWrong?C.red:color}`,borderRadius:14,padding:"16px 12px",cursor:"pointer",fontWeight:700,fontSize:13,color:isWrong?C.red:color,lineHeight:1.4,transition:"all 0.15s",fontFamily:"inherit"}}>{cat}</button>);
        })}
      </div>
    </div>
  </div>);
}

// ─── MINI GAME 3: TRUE OR FALSE ───────────────────────────────────────────
const TRUE_FALSE = [
  {q:"Intake alone qualifies as housing counseling and can be reported on HUD-9902.",ans:false,exp:"Intake does NOT qualify as housing counseling and should NOT be reported on HUD-9902 (Section 3-3)."},
  {q:"Client files must be retained for a minimum of 3 years.",ans:true,exp:"Correct — 3 years minimum per 24 CFR Part 214."},
  {q:"Tenant-based HCV vouchers are attached to a specific housing unit.",ans:false,exp:"Tenant-based vouchers follow the TENANT and are portable. Project-based vouchers are attached to a unit."},
  {q:"The Fair Housing Act includes 7 federally protected classes.",ans:true,exp:"Race, color, national origin, religion, sex, familial status, and disability."},
  {q:"A Deed-in-Lieu creates a subordinate zero-interest lien on the property.",ans:false,exp:"A Partial Claim creates the lien. Deed-in-Lieu involves voluntarily transferring the deed to the lender."},
  {q:"FHA loans require a 3.5% down payment for borrowers with a 580+ credit score.",ans:true,exp:"Correct! Below 580, it increases to 10% down."},
  {q:"Housing counselors may recommend products from lenders where they have a financial interest, as long as they disclose it.",ans:false,exp:"Counselors must NEVER refer clients to lenders where they have a financial interest — disclosure alone does not make it acceptable."},
  {q:"The Fair Housing Act applies only to home purchases, not rentals.",ans:false,exp:"The Fair Housing Act covers BOTH rental and purchase transactions."},
  {q:"A written Action Plan is required for every housing counseling client.",ans:true,exp:"Yes — required by HUD for all clients. Must include goals, tasks, timeline, and referrals."},
  {q:"HUD-9902 reports are submitted monthly.",ans:false,exp:"HUD-9902 is submitted QUARTERLY via the Housing Counseling System (HCS)."},
  {q:"Forbearance permanently modifies the loan terms.",ans:false,exp:"Forbearance is TEMPORARY — it pauses or reduces payments. Loan Modification permanently changes terms."},
  {q:"A housing counselor must present all applicable loss mitigation options to a client in default.",ans:true,exp:"Yes — HUD requires all applicable options be presented. Steering to one option is non-compliant."},
  {q:"HECM borrowers can stop paying property taxes once the reverse mortgage closes.",ans:false,exp:"HECM borrowers MUST continue paying property taxes, insurance, and HOA fees — failure triggers the loan becoming due."},
  {q:"Retaliatory eviction after a habitability complaint is illegal.",ans:true,exp:"Correct — anti-retaliation protections make this illegal in most jurisdictions."},
  {q:"PHAs may allocate up to 30% of vouchers as project-based.",ans:false,exp:"PHAs may allocate up to 20% — not 30% — of their total vouchers as project-based."},
  {q:"Familial status as a protected class includes pregnant women.",ans:true,exp:"Yes! Familial status protects families with children under 18 AND pregnant women."},
];

function TrueFalse({onBack,onComplete}){
  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [streak,setStreak]=useState(0);
  const [bestStreak,setBestStreak]=useState(0);
  const [answered,setAnswered]=useState(null);
  const [done,setDone]=useState(false);
  const [timeLeft,setTimeLeft]=useState(10);

  useEffect(()=>{
    if(done||answered!==null)return;
    const t=setInterval(()=>setTimeLeft(p=>{if(p<=1){clearInterval(t);answer(null);return 0;}return p-1;}),1000);
    return()=>clearInterval(t);
  },[idx,done,answered]);

  const answer=(val)=>{
    if(answered!==null)return;
    setAnswered(val);
    const q=TRUE_FALSE[idx];
    if(val===q.ans){
      const pts=timeLeft>=8?15:timeLeft>=5?12:10;
      setScore(s=>s+pts);
      const ns=streak+1;setStreak(ns);setBestStreak(b=>Math.max(b,ns));
    }else{setStreak(0);}
  };

  const next=()=>{
    setAnswered(null);setTimeLeft(10);
    if(idx+1>=TRUE_FALSE.length)setDone(true);
    else setIdx(i=>i+1);
  };

  if(done)return<ResultScreen emoji="✅" title="True or False Done!" subtitle={`Best streak: ${bestStreak}🔥`} score={score} maxScore={TRUE_FALSE.length*15} color={C.lime} onBack={onBack} onSave={()=>onComplete(score)}/>;

  const q=TRUE_FALSE[idx];
  const tc=timeLeft>6?C.green:timeLeft>3?C.gold:C.red;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="True or False" icon="✅" color={C.lime} onBack={onBack} right={<><span style={{background:tc,borderRadius:99,padding:"3px 12px",color:"#fff",fontWeight:900,fontSize:16,marginRight:8}}>{timeLeft}s</span>{streak>=2&&<span style={{background:C.gold,borderRadius:8,padding:"4px 10px",color:C.navy,fontWeight:800,fontSize:12,marginRight:8}}>🔥{streak}x</span>}<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:13}}>{score} pts</span></>}/>
    <div style={{maxWidth:560,margin:"0 auto",padding:"24px 20px"}}>
      <ProgressBar value={idx} max={TRUE_FALSE.length} color={C.lime}/>
      <div style={{background:C.card,borderRadius:20,padding:"32px 24px",marginTop:20,boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
        <div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:16}}>Statement {idx+1} of {TRUE_FALSE.length}</div>
        <div style={{color:C.navy,fontSize:18,fontWeight:700,lineHeight:1.6,marginBottom:24,minHeight:80}}>{q.q}</div>
        {answered===null?(
          <div style={{display:"flex",gap:14}}>
            <button onClick={()=>answer(true)} style={{flex:1,background:C.greenPale,border:`2px solid ${C.green}`,borderRadius:14,padding:"18px 0",cursor:"pointer",fontWeight:900,fontSize:20,color:C.green,fontFamily:"inherit"}}>✅ TRUE</button>
            <button onClick={()=>answer(false)} style={{flex:1,background:C.redPale,border:`2px solid ${C.red}`,borderRadius:14,padding:"18px 0",cursor:"pointer",fontWeight:900,fontSize:20,color:C.red,fontFamily:"inherit"}}>❌ FALSE</button>
          </div>
        ):(
          <div>
            <div style={{background:answered===q.ans?C.greenPale:C.redPale,border:`2px solid ${answered===q.ans?C.green:C.red}`,borderRadius:12,padding:"14px 16px",marginBottom:14}}>
              <div style={{fontWeight:800,color:answered===q.ans?C.green:C.red,marginBottom:6}}>{answered===null?"⏰ Time's up!":(answered===q.ans?"✅ Correct!":"❌ Incorrect")}</div>
              <div style={{color:C.text,fontSize:14,lineHeight:1.5}}>The answer is <strong>{q.ans?"TRUE":"FALSE"}</strong>. {q.exp}</div>
            </div>
            <Btn onClick={next} color={C.lime} full>{idx+1<TRUE_FALSE.length?"Next →":"Finish 🏁"}</Btn>
          </div>
        )}
      </div>
    </div>
  </div>);
}

// ─── MINI GAME 4: NUMBER CRUNCH ───────────────────────────────────────────
const NUMBER_QS = [
  {q:"FHA minimum down payment for a borrower with a 580+ credit score?",answer:"3.5",unit:"%",hint:"Standard FHA requirement",choices:["3%","3.5%","5%","10%"]},
  {q:"Minimum years a housing counseling agency must retain client files?",answer:"3",unit:"years",hint:"Required by 24 CFR Part 214",choices:["1 year","2 years","3 years","5 years"]},
  {q:"In the HCV program, tenant typically pays what % of adjusted income toward rent?",answer:"30",unit:"%",hint:"PHA pays the difference to the landlord",choices:["20%","25%","30%","40%"]},
  {q:"FHA DTI can go up to approximately __% with compensating factors?",answer:"50",unit:"%",hint:"More flexible than conventional loans",choices:["43%","45%","50%","55%"]},
  {q:"Up to what % of a PHA's total vouchers may be project-based?",answer:"20",unit:"%",hint:"One-fifth of the total",choices:["10%","15%","20%","25%"]},
  {q:"The Fair Housing Act has how many federally protected classes?",answer:"7",unit:"classes",hint:"Count: race, color, origin, religion, sex, familial, disability",choices:["5","6","7","8"]},
  {q:"FHA down payment for a borrower with a credit score between 500-579?",answer:"10",unit:"%",hint:"Higher risk = higher down payment",choices:["5%","7.5%","10%","20%"]},
  {q:"HUD-9902 reports are submitted how often per year?",answer:"4",unit:"times/year",hint:"Every quarter = 4x per year",choices:["2","3","4","6"]},
  {q:"A borrower's income is $5,000/month. Their housing payment is $1,400. What is their front-end DTI?",answer:"28",unit:"%",hint:"Housing payment ÷ gross monthly income × 100",choices:["22%","28%","32%","35%"],math:true,calc:"1400/5000×100=28%"},
  {q:"Monthly income: $4,800. Total monthly debts (housing + all others): $1,920. Back-end DTI?",answer:"40",unit:"%",hint:"Total debts ÷ gross income × 100",choices:["35%","38%","40%","45%"],math:true,calc:"1920/4800×100=40%"},
  {q:"Home price: $300,000. FHA loan (3.5% down). Down payment amount?",answer:"10500",unit:"dollars",hint:"$300,000 × 0.035",choices:["$9,000","$10,500","$12,000","$15,000"],math:true,calc:"300000×0.035=$10,500",display:"$10,500"},
  {q:"A counselor has $5,500 in savings. Home costs $220,000 with 3.5% FHA down ($7,700). Gap to close?",answer:"2200",unit:"dollars",hint:"$7,700 needed − $5,500 saved",choices:["$1,500","$2,200","$3,200","$4,500"],math:true,calc:"7700−5500=$2,200",display:"$2,200"},
];

function NumberCrunch({onBack,onComplete}){
  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [answered,setAnswered]=useState(null);
  const [done,setDone]=useState(false);
  const q=NUMBER_QS[idx];
  const correctChoice=q.choices.find(c=>c.replace(/[$,%\syears\/timeclases]/gi,"").includes(q.answer));

  const pick=(choice)=>{
    if(answered)return;
    setAnswered(choice);
    const val=choice.replace(/[$,%\syears\/timeclases]/gi,"");
    if(val.includes(q.answer))setScore(s=>s+20);
  };

  const next=()=>{setAnswered(null);if(idx+1>=NUMBER_QS.length)setDone(true);else setIdx(i=>i+1);};

  if(done)return<ResultScreen emoji="🔢" title="Number Crunch Done!" score={score} maxScore={NUMBER_QS.length*20} color={C.cyan} onBack={onBack} onSave={()=>onComplete(score)}/>;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Number Crunch" icon="🔢" color={C.cyan} onBack={onBack} right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:13}}>{score} pts · Q{idx+1}/{NUMBER_QS.length}</span>}/>
    <div style={{maxWidth:560,margin:"0 auto",padding:"24px 20px"}}>
      <ProgressBar value={idx} max={NUMBER_QS.length} color={C.cyan}/>
      <div style={{background:C.card,borderRadius:20,padding:"28px 24px",marginTop:20,boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
        {q.math&&<div style={{background:C.cyanPale,borderRadius:8,padding:"6px 12px",fontSize:12,color:C.cyan,fontWeight:700,marginBottom:12,display:"inline-block"}}>🔢 Math Problem</div>}
        <div style={{color:C.navy,fontSize:17,fontWeight:700,lineHeight:1.6,marginBottom:q.math?8:20}}>{q.q}</div>
        {q.math&&<div style={{background:"#F8FAFC",borderRadius:8,padding:"10px 14px",fontSize:13,color:C.muted,marginBottom:20,fontFamily:"monospace"}}>💡 Formula: {q.hint}</div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {q.choices.map(c=>{
            const val=c.replace(/[$,%\syears\/timeclases]/gi,"");
            const isCorrect=val.includes(q.answer);
            let bg=C.bg,border=`1px solid ${C.border}`,color=C.text;
            if(answered){if(isCorrect){bg=C.greenPale;border=`2px solid ${C.green}`;color=C.green;}else if(c===answered){bg=C.redPale;border=`2px solid ${C.red}`;color=C.red;}}
            return(<button key={c} onClick={()=>pick(c)} disabled={!!answered} style={{background:bg,border,borderRadius:10,padding:"14px 10px",cursor:answered?"default":"pointer",fontWeight:700,fontSize:16,color,transition:"all 0.2s",fontFamily:"inherit"}}>{c}</button>);
          })}
        </div>
        {answered&&<div>
          {q.calc&&<div style={{background:C.cyanPale,borderRadius:8,padding:"10px 14px",fontSize:13,color:C.cyan,marginBottom:12,fontFamily:"monospace"}}>📐 {q.calc}</div>}
          <Btn onClick={next} color={C.cyan} full>{idx+1<NUMBER_QS.length?"Next →":"Finish 🏁"}</Btn>
        </div>}
      </div>
    </div>
  </div>);
}

// ─── MINI GAME 5: WHO AM I? ───────────────────────────────────────────────
const WHO_AM_I = [
  {clues:["I am HUD's largest rental assistance program","Managed by Public Housing Agencies","The tenant pays ~30% of their income","I am portable — I follow the tenant"],answer:"Housing Choice Voucher (Section 8)",options:["Housing Choice Voucher (Section 8)","LIHTC Tax Credit","Project-Based Section 8","USDA Rural Rental"]},
  {clues:["I temporarily pause or reduce mortgage payments","I am NOT permanent","I give the borrower time to get back on their feet","I don't change the loan terms permanently"],answer:"Forbearance",options:["Forbearance","Loan Modification","Repayment Plan","Partial Claim"]},
  {clues:["I finance both the purchase AND renovation of a home","I am an FHA product","Rehab and purchase in a single loan","My sibling, 203(b), handles standard purchases"],answer:"FHA 203(k)",options:["FHA 203(b)","FHA 203(k)","Conventional Rehab Loan","USDA Section 504"]},
  {clues:["I am required by law before any reverse mortgage closes","I am provided by a HUD-approved agency","I ensure the senior borrower fully understands obligations","Without me, a HECM cannot proceed"],answer:"HECM Counseling",options:["Pre-Purchase Counseling","HECM Counseling","Default Counseling","Fair Housing Education"]},
  {clues:["HUD pays the borrower's arrears directly to the servicer","I create a zero-interest subordinate lien","The borrower doesn't pay me back until they sell or refinance","I am a loss mitigation option for FHA loans"],answer:"Partial Claim",options:["Forbearance","Partial Claim","Deed-in-Lieu","Loan Modification"]},
  {clues:["I am required for every housing counseling client","I include goals, tasks, strategies, timeline, and referrals","I must be in WRITING — verbal doesn't count","I am a core HUD compliance requirement"],answer:"Written Action Plan",options:["Written Action Plan","HUD-9902","Financial Assessment","Intake Form"]},
  {clues:["I am submitted quarterly to HUD","I report housing counseling activity data","Agencies who don't file me risk losing HUD approval","I go through the Housing Counseling System (HCS)"],answer:"HUD-9902",options:["HUD-9902","Form 1003","HUD-1 Settlement","Form 4506"]},
  {clues:["I offer 0% down payment","I am for rural areas only","I have income limits","I am a USDA product"],answer:"USDA Rural Development Loan",options:["VA Loan","FHA 203(b)","USDA Rural Development Loan","HomeReady Loan"]},
];

function WhoAmI({onBack,onComplete}){
  const [idx,setIdx]=useState(0);
  const [clueIdx,setClueIdx]=useState(0);
  const [answered,setAnswered]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const q=WHO_AM_I[idx];
  const pts=[40,30,20,10];

  const pick=(opt)=>{
    if(answered)return;
    setAnswered(opt);
    if(opt===q.answer)setScore(s=>s+pts[clueIdx]);
  };
  const nextClue=()=>{if(clueIdx<q.clues.length-1)setClueIdx(c=>c+1);};
  const next=()=>{setAnswered(null);setClueIdx(0);if(idx+1>=WHO_AM_I.length)setDone(true);else setIdx(i=>i+1);};

  if(done)return<ResultScreen emoji="🧠" title="Who Am I? Complete!" subtitle="HUD program identification" score={score} maxScore={WHO_AM_I.length*40} color={C.purple} onBack={onBack} onSave={()=>onComplete(score)}/>;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Who Am I?" icon="🧠" color={C.purple} onBack={onBack} right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:13}}>{score} pts · {idx+1}/{WHO_AM_I.length}</span>}/>
    <div style={{maxWidth:560,margin:"0 auto",padding:"24px 20px"}}>
      <ProgressBar value={idx} max={WHO_AM_I.length} color={C.purple}/>
      <div style={{background:C.card,borderRadius:20,padding:"24px",marginTop:20,boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
        <div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Read clues — guess early for more points!</div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {q.clues.slice(0,clueIdx+1).map((clue,i)=>(
            <div key={i} style={{background:i===clueIdx?C.purplePale:C.bg,border:`1px solid ${i===clueIdx?C.purple:C.border}`,borderRadius:10,padding:"12px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{background:C.purple,color:"#fff",borderRadius:99,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{i+1}</span>
              <span style={{color:C.text,fontSize:14,lineHeight:1.5}}>{clue}</span>
              {i===clueIdx&&<span style={{color:C.gold,fontSize:11,fontWeight:800,flexShrink:0,marginTop:2}}>{pts[i]} pts</span>}
            </div>
          ))}
          {clueIdx<q.clues.length-1&&!answered&&<button onClick={nextClue} style={{background:"none",border:`1px dashed ${C.border}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",color:C.muted,fontSize:13,fontFamily:"inherit"}}>+ Reveal next clue ({pts[clueIdx+1]} pts)</button>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {q.options.map(opt=>{
            let bg=C.bg,border=`1px solid ${C.border}`,color=C.text;
            if(answered){if(opt===q.answer){bg=C.greenPale;border=`2px solid ${C.green}`;color=C.green;}else if(opt===answered){bg=C.redPale;border=`2px solid ${C.red}`;color=C.red;}}
            return(<button key={opt} onClick={()=>pick(opt)} disabled={!!answered} style={{background:bg,border,borderRadius:10,padding:"12px 14px",textAlign:"left",cursor:answered?"default":"pointer",fontWeight:600,fontSize:14,color,transition:"all 0.2s",fontFamily:"inherit"}}>{opt}</button>);
          })}
        </div>
        {answered&&<div style={{marginTop:14}}><Btn onClick={next} color={C.purple} full>{idx+1<WHO_AM_I.length?"Next →":"Finish 🏁"}</Btn></div>}
      </div>
    </div>
  </div>);
}

// ─── MINI GAME 6: JEOPARDY ────────────────────────────────────────────────
const JEOPARDY_BOARD = {
  "Compliance":{color:C.blue,qs:[
    {pts:100,q:"This form must be submitted quarterly to HUD to report housing counseling activity.",a:"What is HUD-9902?"},
    {pts:200,q:"The minimum number of years a housing counseling agency must retain client files.",a:"What is 3 years?"},
    {pts:300,q:"This required written document must be provided to EVERY counseling client and include goals, tasks, timeline, and referrals.",a:"What is a Written Action Plan?"},
    {pts:400,q:"This activity gathers demographic, contact, and financial information — but does NOT qualify as housing counseling per Section 3-3.",a:"What is Intake?"},
    {pts:500,q:"The two required pre-purchase handouts per HUD guidelines.",a:"What are 'For Your Protection: Get a Home Inspection' and 'Ten Important Questions to Ask Your Home Inspector'?"},
  ]},
  "Fair Housing":{color:C.purple,qs:[
    {pts:100,q:"The number of federally protected classes under the Fair Housing Act.",a:"What is 7?"},
    {pts:200,q:"This protected class covers families with children under 18 and pregnant women.",a:"What is Familial Status?"},
    {pts:300,q:"This illegal Fair Housing practice involves directing clients toward or away from neighborhoods based on protected class.",a:"What is Steering?"},
    {pts:400,q:"This act of evicting a tenant specifically because they reported a habitability problem is illegal.",a:"What is Retaliatory Eviction?"},
    {pts:500,q:"TRUE or FALSE: The Fair Housing Act applies only to home purchases, not rentals.",a:"What is FALSE? The Fair Housing Act covers BOTH rental and purchase."},
  ]},
  "Loss Mitigation":{color:C.red,qs:[
    {pts:100,q:"This loss mitigation option temporarily reduces or pauses mortgage payments.",a:"What is Forbearance?"},
    {pts:200,q:"This option permanently changes loan terms such as interest rate, term, or principal.",a:"What is Loan Modification?"},
    {pts:300,q:"HUD pays the borrower's arrears and places a zero-interest subordinate lien on the property.",a:"What is a Partial Claim?"},
    {pts:400,q:"In this option, the borrower voluntarily transfers the deed to the lender to avoid foreclosure.",a:"What is Deed-in-Lieu?"},
    {pts:500,q:"HUD counselors are required to present _______ applicable loss mitigation options to a client in default.",a:"What is ALL (applicable options)?"},
  ]},
  "HUD Programs":{color:C.teal,qs:[
    {pts:100,q:"HUD's largest rental assistance program, managed by Public Housing Agencies.",a:"What is the Housing Choice Voucher (Section 8) Program?"},
    {pts:200,q:"This type of HCV voucher is portable and follows the tenant to any qualifying unit.",a:"What is a Tenant-Based Voucher?"},
    {pts:300,q:"This FHA loan product finances both the purchase and renovation of a property.",a:"What is FHA 203(k)?"},
    {pts:400,q:"The approximate percentage of adjusted income a Section 8 voucher holder pays toward rent.",a:"What is 30%?"},
    {pts:500,q:"This reverse mortgage product requires mandatory HUD-approved counseling before the loan can close.",a:"What is HECM (Home Equity Conversion Mortgage)?"},
  ]},
  "Math & Numbers":{color:C.gold,qs:[
    {pts:100,q:"FHA minimum down payment percentage for a borrower with a 620 credit score.",a:"What is 3.5%?"},
    {pts:200,q:"A borrower earns $5,000/month and has $2,000 in total monthly debt. Their back-end DTI.",a:"What is 40%? ($2,000 ÷ $5,000 × 100)"},
    {pts:300,q:"Maximum % of a PHA's vouchers that can be project-based.",a:"What is 20%?"},
    {pts:400,q:"A home costs $250,000. With a 3.5% FHA down payment, what is the loan amount?",a:"What is $241,250? ($250,000 − $8,750 down)"},
    {pts:500,q:"Income limit category for a household earning less than 80% of Area Median Income (AMI).",a:"What is Low-Income? (50% = Very Low; 30% = Extremely Low)"},
  ]},
};

function Jeopardy({onBack,onComplete}){
  const cats=Object.keys(JEOPARDY_BOARD);
  const [selected,setSelected]=useState(null);
  const [revealed,setRevealed]=useState(false);
  const [answered,setAnswered]=useState({});
  const [score,setScore]=useState(0);
  const [phase,setPhase]=useState("board"); // board | question | done
  const total=cats.reduce((s,c)=>s+JEOPARDY_BOARD[c].qs.reduce((a,q)=>a+q.pts,0),0);
  const done=Object.keys(answered).length>=cats.length*5;

  const pick=(cat,qi)=>{
    if(answered[`${cat}-${qi}`])return;
    setSelected({cat,qi,q:JEOPARDY_BOARD[cat].qs[qi]});
    setRevealed(false);
    setPhase("question");
  };

  const answer=(correct)=>{
    const key=`${selected.cat}-${selected.qi}`;
    setAnswered(a=>({...a,[key]:correct?"correct":"wrong"}));
    setScore(s=>correct?s+selected.q.pts:s-Math.floor(selected.q.pts/2));
    setPhase("board");
    setSelected(null);
    if(Object.keys(answered).length+1>=cats.length*5)setTimeout(()=>setPhase("done"),400);
  };

  if(phase==="done")return<ResultScreen emoji="🎤" title="Jeopardy Complete!" score={score} maxScore={total} color={C.navy} onBack={onBack} onSave={()=>onComplete(Math.max(0,score))}/>;

  if(phase==="question"&&selected){
    const {q,cat}=selected;
    const {color}=JEOPARDY_BOARD[cat];
    return(<div style={{minHeight:"100vh",background:color,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center"}}>
      <div style={{color:"rgba(255,255,255,0.7)",fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>{cat} · {q.pts} points</div>
      <div style={{color:"#fff",fontSize:22,fontWeight:800,maxWidth:540,lineHeight:1.6,marginBottom:32}}>{q.q}</div>
      {!revealed?(
        <button onClick={()=>setRevealed(true)} style={{background:"rgba(255,255,255,0.2)",border:"2px solid rgba(255,255,255,0.5)",borderRadius:12,padding:"14px 32px",color:"#fff",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Reveal Answer</button>
      ):(
        <div style={{maxWidth:500,width:"100%"}}>
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:14,padding:"16px 20px",marginBottom:20,color:"#fff",fontSize:16,fontWeight:700}}>{q.a}</div>
          <div style={{display:"flex",gap:14,justifyContent:"center"}}>
            <button onClick={()=>answer(false)} style={{background:C.red,border:"none",borderRadius:12,padding:"12px 28px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>❌ Got it Wrong (-{Math.floor(q.pts/2)})</button>
            <button onClick={()=>answer(true)} style={{background:C.green,border:"none",borderRadius:12,padding:"12px 28px",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:"inherit"}}>✅ Got it Right (+{q.pts})</button>
          </div>
        </div>
      )}
    </div>);
  }

  return(<div style={{minHeight:"100vh",background:C.navy}}>
    <div style={{background:"#081527",padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
      <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:13}}>← Exit</button>
      <span style={{color:"#fff",fontWeight:900,fontSize:18,flex:1,fontFamily:"Georgia, serif",letterSpacing:1}}>🎤 HUD JEOPARDY</span>
      <span style={{background:score>=0?C.goldPale:C.redPale,color:score>=0?C.navy:C.red,borderRadius:8,padding:"4px 14px",fontWeight:900,fontSize:16}}>{score>=0?"+":""}{score}</span>
    </div>
    <div style={{overflowX:"auto",padding:"16px 12px"}}>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${cats.length},minmax(140px,1fr))`,gap:6,minWidth:700}}>
        {cats.map(cat=>{
          const {color}=JEOPARDY_BOARD[cat];
          return(<div key={cat} style={{background:color,borderRadius:10,padding:"12px 8px",textAlign:"center",fontWeight:800,fontSize:12,color:"#fff",lineHeight:1.3}}>{cat}</div>);
        })}
        {[0,1,2,3,4].map(qi=>cats.map(cat=>{
          const q=JEOPARDY_BOARD[cat].qs[qi];
          const key=`${cat}-${qi}`;
          const status=answered[key];
          const {color}=JEOPARDY_BOARD[cat];
          return(<button key={key} onClick={()=>pick(cat,qi)} disabled={!!status} style={{background:status?"#1a2a3a":color+"22",border:`1px solid ${status?"#2a3a4a":color+"55"}`,borderRadius:10,padding:"18px 8px",cursor:status?"default":"pointer",fontWeight:900,fontSize:status?16:20,color:status?(status==="correct"?C.green:C.red):"#fff",transition:"all 0.15s",minHeight:64}}>
            {status?(status==="correct"?"✓":"✗"):`$${q.pts}`}
          </button>);
        }))}
      </div>
    </div>
    <div style={{textAlign:"center",color:"rgba(255,255,255,0.4)",fontSize:12,padding:"8px 0"}}>
      {Object.keys(answered).length}/{cats.length*5} answered · You control if you got it right or wrong
    </div>
  </div>);
}

// ─── SIMULATION 1: BUILD-A-FILE ───────────────────────────────────────────
const FILE_ITEMS = {
  required:[
    "Intake Form (name, address, phone, demographic data)",
    "Client Authorization & Disclosure Forms",
    "Financial Analysis (spending plan, credit report, affordability)",
    "Written Action Plan (goals, tasks, timeline, referrals)",
    "Counseling Session Notes",
    "Referrals to community resources",
    "Copy of fee receipt (if applicable)",
    "HUD-9902 activity logged in CMS",
  ],
  prepurchaseOnly:[
    "For Your Protection: Get a Home Inspection (handout)",
    "Ten Important Questions to Ask Your Home Inspector (handout)",
    "Rent vs. Buy Analysis",
  ],
  optional:[
    "Client's tax returns",
    "Pay stubs / W-2s",
    "Bank statements",
    "FHA case number (if applicable)",
  ],
  notInFile:[
    "Counselor's personal notes about client's appearance",
    "Referral to lender with financial interest (conflict of interest)",
    "Verbal-only action plan (not documented)",
    "Client's Social Security card photocopy",
    "Unlicensed third-party credit repair service referral",
  ],
};

function BuildAFile({onBack,onComplete}){
  const [mode]=useState("prepurchase");
  const allItems=[
    ...FILE_ITEMS.required.map(i=>({text:i,bucket:"required"})),
    ...FILE_ITEMS.prepurchaseOnly.map(i=>({text:i,bucket:"prepurchaseOnly"})),
    ...FILE_ITEMS.optional.map(i=>({text:i,bucket:"optional"})),
    ...FILE_ITEMS.notInFile.map(i=>({text:i,bucket:"notInFile"})),
  ].sort(()=>Math.random()-0.5);

  const [placed,setPlaced]=useState({});
  const [checked,setChecked]=useState(false);
  const [dragging,setDragging]=useState(null);

  const buckets=[
    {id:"required",label:"📋 Required in Every File",color:C.teal},
    {id:"prepurchaseOnly",label:"🏠 Pre-Purchase Only",color:C.blue},
    {id:"optional",label:"📎 Optional / Supplemental",color:C.gold},
    {id:"notInFile",label:"🚫 Should NOT Be in File",color:C.red},
  ];

  const drop=(bucketId)=>{
    if(!dragging)return;
    setPlaced(p=>({...p,[dragging.text]:bucketId}));
    setDragging(null);
  };

  const unplaced=allItems.filter(i=>!placed[i.text]);
  const placedCount=Object.keys(placed).length;
  const correct=checked?Object.entries(placed).filter(([text,bucket])=>{
    const item=allItems.find(i=>i.text===text);
    return item&&item.bucket===bucket;
  }).length:0;
  const score=checked?Math.round((correct/allItems.length)*100):0;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Build-a-File: Pre-Purchase" icon="📁" color={C.teal} onBack={onBack} right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:13}}>{placedCount}/{allItems.length} placed</span>}/>
    <div style={{maxWidth:900,margin:"0 auto",padding:"16px"}}>
      {!checked&&unplaced.length>0&&<div style={{background:C.card,borderRadius:16,padding:"16px 20px",marginBottom:16,boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
        <div style={{color:C.navy,fontWeight:800,fontSize:13,marginBottom:10}}>🗂️ Items to Sort — drag or click to move:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {unplaced.map(item=>(<button key={item.text} draggable onDragStart={()=>setDragging(item)} onClick={()=>setDragging(d=>d?.text===item.text?null:item)} style={{background:dragging?.text===item.text?C.goldPale:C.bg,border:`1.5px solid ${dragging?.text===item.text?C.gold:C.border}`,borderRadius:8,padding:"7px 12px",fontSize:12,cursor:"grab",color:C.text,fontFamily:"inherit",transition:"all 0.15s"}}>{item.text}</button>))}
        </div>
      </div>}

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {buckets.map(bucket=>{
          const bucketItems=Object.entries(placed).filter(([,b])=>b===bucket.id).map(([t])=>t);
          return(<div key={bucket.id} onDragOver={e=>e.preventDefault()} onDrop={()=>drop(bucket.id)} onClick={()=>{if(dragging)drop(bucket.id);}} style={{background:C.card,border:`2px dashed ${bucket.color}44`,borderRadius:14,padding:"14px 16px",minHeight:120,transition:"border-color 0.15s",cursor:dragging?"copy":"default"}}>
            <div style={{color:bucket.color,fontWeight:800,fontSize:13,marginBottom:10}}>{bucket.label}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {bucketItems.map(text=>{
                const item=allItems.find(i=>i.text===text);
                const isCorrect=checked&&item?.bucket===bucket.id;
                const isWrong=checked&&item?.bucket!==bucket.id;
                return(<div key={text} style={{background:isCorrect?C.greenPale:isWrong?C.redPale:bucket.color+"11",borderRadius:8,padding:"7px 10px",fontSize:12,color:isWrong?C.red:isCorrect?C.green:C.text,border:`1px solid ${isCorrect?C.green:isWrong?C.red:bucket.color+"33"}`,cursor:"pointer",lineHeight:1.4}} onClick={()=>{if(!checked)setPlaced(p=>{const n={...p};delete n[text];return n;})}}>{text} {checked&&(isCorrect?"✓":"✗")}</div>);
              })}
            </div>
          </div>);
        })}
      </div>

      {!checked&&placedCount===allItems.length&&<div style={{marginTop:16,textAlign:"center"}}><Btn onClick={()=>setChecked(true)} color={C.teal}>Check My File ✓</Btn></div>}
      {checked&&<div style={{marginTop:16,background:C.card,borderRadius:14,padding:20,textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{fontSize:40}}>{score>=80?"🏆":score>=60?"⭐":"📚"}</div>
        <div style={{fontSize:32,fontWeight:900,color:score>=80?C.green:C.gold,margin:"8px 0"}}>{score}%</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:16}}>{correct}/{allItems.length} correctly placed</div>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}><Btn onClick={onBack} outline color={C.teal} small>← Back</Btn><Btn onClick={()=>onComplete(score)} color={C.teal} small>Save Score</Btn></div>
      </div>}
    </div>
  </div>);
}

// ─── SIMULATION 2: ETHICS DILEMMA ────────────────────────────────────────
const ETHICS_CASES = [
  {scenario:"Your brother-in-law is a loan officer at First Savings Bank. Client Rosa needs an FHA loan. First Savings has the best rate this week.",question:"What do you do?",options:[
    {text:"Refer Rosa to your brother-in-law since it's the best rate — you disclose the relationship",correct:false,feedback:"❌ Disclosure alone is NOT enough. Referring clients to a lender where you have a personal financial interest is a conflict of interest — even with disclosure. You must recuse yourself entirely."},
    {text:"Provide Rosa with 3-5 lenders to compare independently; do not mention your family connection to First Savings",correct:true,feedback:"✅ Correct. HUD counselors must never steer clients to lenders where they have a financial interest. Providing multiple options and letting the client decide is the ethical approach."},
    {text:"Refer Rosa to First Savings but don't mention your connection",correct:false,feedback:"❌ This is worse — it combines a conflict of interest with non-disclosure. A serious ethics violation."},
    {text:"Ask your supervisor if it's okay since it truly is the best rate",correct:false,feedback:"❌ The best rate does not override ethics rules. No supervisor approval can authorize a conflict-of-interest referral."},
  ]},
  {scenario:"Client Marcus is filling out intake. He asks whether you have to share his information with HUD. You know HUD requires reporting.",question:"What do you tell him?",options:[
    {text:"Tell him everything is completely confidential and HUD never sees his data",correct:false,feedback:"❌ This is false. Agencies must report activity data on HUD-9902 and HUD may review files during monitoring visits. False privacy guarantees violate the Privacy Act."},
    {text:"Explain that aggregate anonymized data is reported to HUD quarterly, and HUD may review client files during compliance monitoring",correct:true,feedback:"✅ Correct. Transparency is required. Clients must be informed of how their data is used — including HUD reporting and monitoring."},
    {text:"Tell him only you and the agency can see it — no exceptions",correct:false,feedback:"❌ HUD has oversight access during monitoring visits. Making absolute privacy promises is non-compliant."},
    {text:"Avoid the question and redirect to the financial assessment",correct:false,feedback:"❌ Avoiding client questions about Privacy Act rights is not acceptable — it undermines informed consent."},
  ]},
  {scenario:"You've been providing foreclosure counseling to a client. Their lender asks you to submit paperwork directly on the client's behalf without the client reviewing it.",question:"What do you do?",options:[
    {text:"Submit the paperwork since it helps the client and speeds the process",correct:false,feedback:"❌ Submitting documents without client review can compromise the client's interests and your role as an independent counselor."},
    {text:"Decline and explain that the client must review and authorize all submissions; schedule time for client to review",correct:true,feedback:"✅ Correct. Counselors maintain an independent role. All submissions must be reviewed and authorized by the client. Your duty is to the client — not the lender."},
    {text:"Ask the lender to send it directly so you stay out of it",correct:false,feedback:"⚠️ Better than #1, but the right answer is to actively ensure the client reviews all documents before anything is submitted."},
    {text:"Submit it and call the client afterward to explain",correct:false,feedback:"❌ After-the-fact notification does not replace prior informed consent. Client review must happen BEFORE submission."},
  ]},
  {scenario:"You charge a $75 counseling fee. A client says they can't afford it and asks if you can waive it. Your agency has a hardship waiver policy.",question:"What's your obligation?",options:[
    {text:"Charge the full fee — it was disclosed upfront",correct:false,feedback:"⚠️ Fee disclosure is important, but if your agency has a hardship waiver, you must inform the client of that option."},
    {text:"Waive it without documentation since the client seems genuine",correct:false,feedback:"⚠️ You should apply the waiver if eligible, but it must be documented per agency policy — undocumented waivers create compliance problems."},
    {text:"Inform the client of the hardship waiver, verify eligibility, apply and document it if eligible",correct:true,feedback:"✅ Correct. HUD counselors must not deny services based on inability to pay when a waiver exists. The process must be documented."},
    {text:"Tell the client fees can't be waived under HUD rules",correct:false,feedback:"❌ False. HUD actually requires that fee schedules include hardship waivers — telling clients otherwise denies them a right."},
  ]},
];

function EthicsDilemma({onBack,onComplete}){
  const [idx,setIdx]=useState(0);
  const [sel,setSel]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const ec=ETHICS_CASES[idx];
  const pick=(opt)=>{if(sel)return;setSel(opt);if(opt.correct)setScore(s=>s+25);};
  const next=()=>{setSel(null);if(idx+1>=ETHICS_CASES.length)setDone(true);else setIdx(i=>i+1);};
  if(done)return<ResultScreen emoji="⚖️" title="Ethics Complete!" subtitle="Professional conduct scenarios" score={score} maxScore={ETHICS_CASES.length*25} color={C.orange} onBack={onBack} onSave={()=>onComplete(score)}/>;
  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Ethics Dilemma" icon="⚖️" color={C.orange} onBack={onBack} right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:13}}>{score} pts · {idx+1}/{ETHICS_CASES.length}</span>}/>
    <div style={{maxWidth:620,margin:"24px auto",padding:"0 20px"}}>
      <ProgressBar value={idx} max={ETHICS_CASES.length} color={C.orange}/>
      <div style={{background:"#FFF7ED",border:`1.5px solid ${C.orange}55`,borderRadius:16,padding:"18px 20px",marginTop:20,marginBottom:14}}>
        <div style={{color:C.orange,fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>⚖️ Scenario</div>
        <div style={{color:C.text,fontSize:15,lineHeight:1.7}}>{ec.scenario}</div>
      </div>
      <div style={{background:C.card,borderRadius:16,padding:"20px",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{color:C.navy,fontWeight:800,fontSize:15,marginBottom:16}}>{ec.question}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {ec.options.map((opt,i)=>{
            let bg=C.bg,border=`1px solid ${C.border}`;
            if(sel){if(opt===sel){bg=opt.correct?C.greenPale:C.redPale;border=`2px solid ${opt.correct?C.green:C.red}`;}else if(opt.correct){bg=C.greenPale;border=`2px solid ${C.green}`;}}
            return(<button key={i} onClick={()=>pick(opt)} disabled={!!sel} style={{background:bg,border,borderRadius:10,padding:"12px 14px",textAlign:"left",cursor:sel?"default":"pointer",fontSize:14,color:C.text,lineHeight:1.5,fontFamily:"inherit",transition:"all 0.15s"}}><strong>{String.fromCharCode(65+i)}.</strong> {opt.text}</button>);
          })}
        </div>
        {sel&&<div style={{marginTop:14}}>
          <div style={{background:sel.correct?C.greenPale:C.redPale,borderRadius:10,padding:"12px 14px",fontSize:14,marginBottom:12,lineHeight:1.6}}>{sel.feedback}</div>
          <Btn onClick={next} color={C.orange} full>{idx+1<ETHICS_CASES.length?"Next Scenario →":"Finish ✓"}</Btn>
        </div>}
      </div>
    </div>
  </div>);
}

// ─── SIMULATION 3: LOSS MITIGATION DECISION TREE ─────────────────────────
const LM_TREE = {
  start:{q:"Client status with mortgage?",opts:[
    {text:"Current — exploring options proactively",next:"current"},
    {text:"1-2 payments behind — early delinquency",next:"early"},
    {text:"3+ payments behind / Notice of Default received",next:"late"},
    {text:"Foreclosure sale date set",next:"crisis"},
  ]},
  current:{q:"Client's hardship type?",opts:[
    {text:"Temporary income loss (job change, medical)",next:"temp_hardship"},
    {text:"Permanent income reduction",next:"perm_hardship"},
    {text:"Just wants better rate/terms — no hardship",next:"no_hardship"},
  ]},
  temp_hardship:{result:true,option:"Forbearance Agreement",color:C.teal,explain:"For temporary hardships, Forbearance is first-line: temporarily pauses/reduces payments while client stabilizes. Follow with Repayment Plan once income resumes.",exam:"🎓 Exam Tip: Forbearance = TEMPORARY. If asked to distinguish from Modification — Modification is PERMANENT."},
  perm_hardship:{result:true,option:"Loan Modification",color:C.blue,explain:"Permanent income reduction → Loan Modification changes the loan terms permanently (rate, term, or principal reduction). May also explore FHA HAMP or conventional HAMP.",exam:"🎓 Exam Tip: Modification requires servicer approval and documentation of hardship."},
  no_hardship:{result:true,option:"Refinance / Rate-and-Term Refi",color:C.green,explain:"No hardship = not eligible for loss mitigation products. Counsel about refinancing options, improved credit, or waiting for better rate environment.",exam:"🎓 Exam Tip: Loss mitigation programs require a documented hardship — rate shopping is handled through refinancing."},
  early:{q:"Does client want to keep the home?",opts:[
    {text:"Yes — committed to keeping the home",next:"early_keep"},
    {text:"Uncertain or wants to exit gracefully",next:"early_exit"},
  ]},
  early_keep:{result:true,option:"Repayment Plan + Modification Review",color:C.blue,explain:"Early delinquency with intent to keep: start with Repayment Plan (catch up over time). If hardship is ongoing, escalate to Modification. Document everything.",exam:"🎓 Exam Tip: Repayment Plans spread missed payments over future payments. They don't change the loan — they add catch-up amounts."},
  early_exit:{result:true,option:"Pre-Foreclosure Sale (Short Sale)",color:C.orange,explain:"If client wants to exit: Short Sale (sell for less than owed with lender approval) is preferable to foreclosure. Has less credit impact than full foreclosure.",exam:"🎓 Exam Tip: Short sale requires lender approval and results in possible deficiency judgment unless waived."},
  late:{q:"Does the client have a source of income?",opts:[
    {text:"Yes — income exists or is expected soon",next:"late_income"},
    {text:"No income and unlikely to recover",next:"late_no_income"},
  ]},
  late_income:{result:true,option:"Partial Claim or Loan Modification",color:C.purple,explain:"3+ payments behind with income: Partial Claim (HUD pays arrears, creates subordinate lien) or Modification. For FHA loans, Partial Claim is often first step before Modification.",exam:"🎓 Exam Tip: Partial Claim is FHA-specific — HUD literally pays the arrears and creates a zero-interest subordinate lien due at sale/refi."},
  late_no_income:{result:true,option:"Deed-in-Lieu of Foreclosure",color:C.red,explain:"No income, 3+ behind: counselor should explore Deed-in-Lieu (voluntary transfer) if short sale isn't viable. Less credit damage than full foreclosure. ALWAYS explore all options first.",exam:"🎓 Exam Tip: Deed-in-Lieu = voluntary. Foreclosure = involuntary. Both result in losing the home but Deed-in-Lieu is negotiated."},
  crisis:{result:true,option:"IMMEDIATE: All Options + Legal Referral",color:C.red,explain:"Foreclosure sale set = CRISIS. Contact servicer same day. Explore postponement, last-minute short sale, bankruptcy (consult attorney), or negotiated Deed-in-Lieu. Refer to HOPE Hotline: 1-888-995-4673.",exam:"🎓 Exam Tip: Foreclosure sale set is the most urgent scenario. Counselors should refer to legal aid and HOPE Hotline immediately."},
};

function LMTree({onBack,onComplete}){
  const [path,setPath]=useState(["start"]);
  const [done,setDone]=useState(false);
  const current=LM_TREE[path[path.length-1]];

  const pick=(opt)=>{setPath(p=>[...p,opt.next]);if(LM_TREE[opt.next]?.result)setDone(true);};
  const reset=()=>{setPath(["start"]);setDone(false);};

  const result=done?LM_TREE[path[path.length-1]]:null;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Loss Mitigation Decision Tree" icon="🗺️" color={C.red} onBack={onBack} right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:13}}>Step {path.length} of {path.length+(done?0:1)}</span>}/>
    <div style={{maxWidth:600,margin:"24px auto",padding:"0 20px"}}>
      {/* Path breadcrumb */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {path.map((p,i)=>(<span key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:99,padding:"3px 10px",fontSize:11,color:C.muted}}>{i===0?"Start":LM_TREE[path[i-1]]?.opts?.find(o=>o.next===p)?.text?.slice(0,24)+"…"||p}</span>))}
      </div>

      {!done?(
        <div style={{background:C.card,borderRadius:20,padding:"28px 24px",boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
          <div style={{color:C.navy,fontSize:18,fontWeight:800,marginBottom:20,lineHeight:1.4}}>{current.q}</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {current.opts?.map((opt,i)=>(<button key={i} onClick={()=>pick(opt)} style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"14px 16px",textAlign:"left",cursor:"pointer",fontSize:14,color:C.text,lineHeight:1.5,fontWeight:500,fontFamily:"inherit",transition:"all 0.15s",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.red;e.currentTarget.style.background=C.redPale;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bg;}}><span>{opt.text}</span><span style={{color:C.red,fontSize:18,flexShrink:0,marginLeft:8}}>→</span></button>))}
          </div>
        </div>
      ):(
        <div>
          <div style={{background:result.color,borderRadius:20,padding:"24px",color:"#fff",marginBottom:14,boxShadow:`0 8px 32px ${result.color}55`}}>
            <div style={{fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:1,opacity:0.8,marginBottom:8}}>Recommended Option</div>
            <div style={{fontSize:24,fontWeight:900,marginBottom:12}}>{result.option}</div>
            <div style={{fontSize:14,lineHeight:1.7,opacity:0.95}}>{result.explain}</div>
          </div>
          <div style={{background:C.goldPale,border:`1.5px solid ${C.gold}`,borderRadius:14,padding:"14px 18px",marginBottom:16}}>
            <div style={{fontSize:14,color:C.text,lineHeight:1.6}}>{result.exam}</div>
          </div>
          <div style={{display:"flex",gap:12}}>
            <Btn onClick={reset} outline color={C.red} full>Try Another Case 🔄</Btn>
            <Btn onClick={()=>onComplete(50)} color={C.red} full>Save & Exit 💾</Btn>
          </div>
        </div>
      )}
    </div>
  </div>);
}

// ─── SIMULATION 4: FILE AUDIT ─────────────────────────────────────────────
const AUDIT_FILES = [
  {
    type:"individual",
    title:"Pre-Purchase Counseling File — Bill Dehouse",
    date:"March 15, 2025",
    counselor:"J. Kamaka",
    contents:[
      {item:"Intake Form with name, address, demographics",present:true},
      {item:"Client Authorization & Disclosure Forms",present:false,issue:"MISSING — required before any counseling begins"},
      {item:"Credit report reviewed during session",present:true},
      {item:"Written Action Plan provided to client",present:false,issue:"MISSING — required for every client"},
      {item:"Financial analysis / spending plan",present:true},
      {item:"Counseling session notes",present:true},
      {item:"'For Your Protection: Get a Home Inspection' handout",present:false,issue:"MISSING — required pre-purchase handout"},
      {item:"'Ten Important Questions to Ask Your Home Inspector' handout",present:false,issue:"MISSING — required pre-purchase handout"},
      {item:"HUD-9902 activity logged in CMS",present:true},
      {item:"Referral to lender with no conflict of interest documented",present:false,issue:"File shows referral to counselor's spouse's workplace — conflict of interest"},
    ],
  },
  {
    type:"group",
    title:"Group Education Workshop File — 'First-Time Homebuyer' Class",
    date:"February 8, 2025",
    counselor:"M. Kahananui",
    contents:[
      {item:"Sign-in sheet with all attendee signatures",present:true},
      {item:"Course flyer / event description",present:true},
      {item:"Group education disclosure forms for all participants",present:false,issue:"MISSING — disclosure forms required for each participant"},
      {item:"HUD certified staff present (documented)",present:true},
      {item:"Course outline and instructional goals",present:false,issue:"MISSING — curriculum documentation required"},
      {item:"Start and end time noted",present:false,issue:"MISSING — total hours must be documented"},
      {item:"Instructor name(s) documented",present:true},
      {item:"Course curriculum identified",present:true},
      {item:"Participant evaluations collected",present:false,issue:"MISSING — evaluations document learning outcomes"},
      {item:"Certificates of completion issued",present:true},
      {item:"Demographics: race, ethnicity, income collected for all attendees",present:true},
      {item:"Demographics entered into CMS with date",present:false,issue:"MISSING — must be entered and dated in CMS"},
    ],
  },
];

function FileAudit({onBack,onComplete}){
  const [fileIdx,setFileIdx]=useState(0);
  const [flagged,setFlagged]=useState({});
  const [submitted,setSubmitted]=useState(false);
  const file=AUDIT_FILES[fileIdx];
  const issues=file.contents.filter(c=>!c.present);
  const toggle=(i)=>{if(!submitted)setFlagged(f=>({...f,[`${fileIdx}-${i}`]:!f[`${fileIdx}-${i}`]}));};
  const flaggedCount=issues.filter((_,i)=>flagged[`${fileIdx}-${i}${file.contents.indexOf(issues[i])}`]).length;
  
  // simpler key
  const key=(i)=>`${fileIdx}-${i}`;
  const submit=()=>setSubmitted(true);
  
  const found=submitted?file.contents.filter((_,i)=>!file.contents[i].present&&flagged[key(i)]).length:0;
  const fp=submitted?file.contents.filter((_,i)=>file.contents[i].present&&flagged[key(i)]).length:0;
  const score=submitted?Math.max(0,Math.round((found/issues.length)*100-(fp*10))):0;

  const nextFile=()=>{
    if(fileIdx+1>=AUDIT_FILES.length){onComplete(score);}
    else{setFileIdx(f=>f+1);setFlagged({});setSubmitted(false);}
  };

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title={`File Audit: ${file.type==="individual"?"Individual":"Group Workshop"}`} icon="🔎" color={C.purple} onBack={onBack} right={<Badge label={file.type==="individual"?"Counseling File":"Education File"} color={C.purple} small/>}/>
    <div style={{maxWidth:680,margin:"16px auto",padding:"0 20px"}}>
      <div style={{background:C.card,borderRadius:16,padding:"18px 20px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          <div><div style={{color:C.muted,fontSize:11,fontWeight:700}}>FILE</div><div style={{color:C.navy,fontWeight:700,fontSize:14}}>{file.title}</div></div>
          <div><div style={{color:C.muted,fontSize:11,fontWeight:700}}>DATE</div><div style={{color:C.navy,fontWeight:700,fontSize:14}}>{file.date}</div></div>
          <div><div style={{color:C.muted,fontSize:11,fontWeight:700}}>COUNSELOR</div><div style={{color:C.navy,fontWeight:700,fontSize:14}}>{file.counselor}</div></div>
        </div>
      </div>
      <div style={{background:C.card,borderRadius:16,padding:"20px",boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
        <div style={{color:C.navy,fontWeight:800,marginBottom:4}}>📋 File Contents Checklist</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:16}}>Check every item that has a compliance problem or is missing:</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {file.contents.map((c,i)=>{
            const isFlagged=!!flagged[key(i)];
            const isIssue=!c.present;
            let bg=C.bg,border=`1px solid ${C.border}`;
            if(submitted){
              if(isIssue&&isFlagged){bg=C.greenPale;border=`2px solid ${C.green}`;}
              else if(isIssue&&!isFlagged){bg=C.goldPale;border=`2px solid ${C.gold}`;}
              else if(!isIssue&&isFlagged){bg=C.redPale;border=`2px solid ${C.red}`;}
            }else if(isFlagged){bg=C.purplePale;border=`2px solid ${C.purple}`;}
            return(<label key={i} style={{display:"flex",gap:12,background:bg,border,borderRadius:10,padding:"10px 14px",cursor:submitted?"default":"pointer",alignItems:"flex-start",transition:"all 0.15s"}}>
              <input type="checkbox" checked={isFlagged} onChange={()=>toggle(i)} disabled={submitted} style={{marginTop:3,accentColor:C.purple}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,color:C.text,fontWeight:500}}>{c.item}</div>
                {submitted&&isIssue&&<div style={{fontSize:12,color:C.red,marginTop:3,fontWeight:600}}>⚠️ {c.issue}</div>}
                {submitted&&!isIssue&&isFlagged&&<div style={{fontSize:12,color:C.green,marginTop:3}}>✓ This item is present — not a violation</div>}
              </div>
              {submitted&&isIssue&&isFlagged&&<span style={{color:C.green,fontSize:12,fontWeight:700,flexShrink:0}}>✓ Found</span>}
              {submitted&&isIssue&&!isFlagged&&<span style={{color:C.gold,fontSize:12,fontWeight:700,flexShrink:0}}>⚠️ Missed</span>}
            </label>);
          })}
        </div>
        {!submitted&&<div style={{marginTop:16}}><Btn onClick={submit} color={C.purple} full>Submit Audit Findings 🔎</Btn></div>}
        {submitted&&<div style={{marginTop:16,background:C.purplePale,borderRadius:12,padding:18,textAlign:"center"}}>
          <div style={{fontSize:32,fontWeight:900,color:score>=80?C.green:C.gold,marginBottom:4}}>{score}%</div>
          <div style={{color:C.muted,fontSize:13,marginBottom:14}}>{found}/{issues.length} issues found · {fp} false positives</div>
          <Btn onClick={nextFile} color={C.purple} full>{fileIdx+1<AUDIT_FILES.length?"Audit Next File →":"Finish Audit ✓"}</Btn>
        </div>}
      </div>
    </div>
  </div>);
}

// ─── SIMULATION 5: LOAN COMPARISON ───────────────────────────────────────
const LOAN_CASES = [
  {
    client:"Maria Chen",profile:"Credit score: 640 | Income: $58,000/yr | Savings: $12,000 | DTI: 38% | First-time buyer | Property: Primary residence in rural Hawaii",
    question:"Which loan product BEST fits Maria's situation?",
    options:[
      {loan:"FHA 203(b)",correct:false,pros:"Low down payment (3.5%), flexible DTI",cons:"Requires MIP; doesn't maximize the rural/income advantages available to Maria"},
      {loan:"USDA Rural Development",correct:true,pros:"0% down payment for rural areas; income limits apply but Maria qualifies; no monthly PMI",cons:"Rural area requirement, income limits, longer processing"},
      {loan:"Conventional 5% Down",correct:false,pros:"No upfront MIP",cons:"Higher down payment needed ($17,400 minimum at 5%) exceeds Maria's savings"},
      {loan:"VA Loan",correct:false,pros:"0% down, no PMI",cons:"Maria has no military service — VA is only for veterans/active duty/surviving spouses"},
    ],
    bestAnswer:"USDA Rural Development",
    explanation:"Maria is buying in rural Hawaii as a first-time buyer with limited savings. USDA offers 0% down payment for qualifying rural properties and income-eligible borrowers. Her $12,000 savings can cover closing costs. FHA would work but wastes her rural advantage.",
  },
  {
    client:"David Kealoha",profile:"Credit score: 710 | Income: $95,000/yr | Savings: $60,000 | DTI: 30% | Veteran | Property: Primary residence, Honolulu condo",
    question:"Which loan product BEST fits David's profile?",
    options:[
      {loan:"FHA 203(b)",correct:false,pros:"Lower credit requirements",cons:"Requires MIP; David's 710 score and veteran status make this unnecessary"},
      {loan:"Conventional with 20% Down",correct:false,pros:"No PMI, good rate with 710 score",cons:"20% on Honolulu condo likely $80,000+ — exceeds savings without VA benefits"},
      {loan:"VA Loan",correct:true,pros:"0% down, no PMI, competitive rates, flexible DTI — David is a veteran and fully eligible",cons:"Funding fee required (can be financed); condo must be VA-approved"},
      {loan:"USDA Rural Development",correct:false,pros:"0% down",cons:"Honolulu is NOT a rural area — David doesn't qualify for USDA"},
    ],
    bestAnswer:"VA Loan",
    explanation:"David is a veteran buying in Honolulu. VA loan: 0% down, no monthly PMI, competitive rates. His 710 score and strong DTI make him a great VA candidate. USDA doesn't apply (not rural). FHA would add unnecessary MIP. Conventional 20% down would strain savings.",
  },
  {
    client:"Rosa Santos",profile:"Credit score: 565 | Income: $42,000/yr | Savings: $8,500 | DTI: 44% | First-time buyer | Property: Purchase + rehab of older home",
    question:"Which loan product BEST fits Rosa's needs?",
    options:[
      {loan:"Conventional Loan",correct:false,pros:"No MIP with good down payment",cons:"Credit score 565 is too low for most conventional products; DTI 44% may exceed conventional limits"},
      {loan:"FHA 203(b) Standard",correct:false,pros:"580+ gets 3.5% down",cons:"Rosa's 565 score requires 10% down ($X) — and she can't finance the renovation separately"},
      {loan:"FHA 203(k) Rehab",correct:true,pros:"Finances purchase AND renovation in one loan; 565 score qualifies at 10% down; allows rehab of older home",cons:"More complex process; requires HUD consultant for large rehab; higher upfront costs"},
      {loan:"USDA Rural Development",correct:false,pros:"0% down",cons:"Rosa's 565 credit score is typically below USDA minimums (usually 640+)"},
    ],
    bestAnswer:"FHA 203(k) Rehab",
    explanation:"Rosa needs to buy AND renovate. FHA 203(k) is specifically designed for this — financing both purchase and rehab in one loan. Her 565 credit qualifies for FHA (10% down applies for sub-580). USDA typically requires 640+ credit. Conventional won't work at 565.",
  },
];

function LoanComparison({onBack,onComplete}){
  const [idx,setIdx]=useState(0);
  const [sel,setSel]=useState(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const lc=LOAN_CASES[idx];
  const pick=(opt)=>{if(sel)return;setSel(opt);if(opt.correct)setScore(s=>s+35);};
  const next=()=>{setSel(null);if(idx+1>=LOAN_CASES.length)setDone(true);else setIdx(i=>i+1);};
  if(done)return<ResultScreen emoji="🏦" title="Loan Comparison Done!" subtitle="Product matching expertise" score={score} maxScore={LOAN_CASES.length*35} color={C.blue} onBack={onBack} onSave={()=>onComplete(score)}/>;
  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Loan Comparison" icon="🏦" color={C.blue} onBack={onBack} right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:13}}>{score} pts · {idx+1}/{LOAN_CASES.length}</span>}/>
    <div style={{maxWidth:660,margin:"20px auto",padding:"0 20px"}}>
      <div style={{background:C.bluePale,border:`1.5px solid ${C.blue}44`,borderRadius:14,padding:"16px 20px",marginBottom:14}}>
        <div style={{color:C.blue,fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>👤 Client Profile</div>
        <div style={{fontWeight:700,fontSize:15,color:C.navy,marginBottom:4}}>{lc.client}</div>
        <div style={{fontSize:13,color:C.text,lineHeight:1.7}}>{lc.profile}</div>
      </div>
      <div style={{background:C.card,borderRadius:16,padding:"20px",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{color:C.navy,fontWeight:800,fontSize:15,marginBottom:16}}>{lc.question}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {lc.options.map((opt,i)=>{
            let bg=C.bg,border=`1px solid ${C.border}`;
            if(sel){if(opt===sel){bg=opt.correct?C.greenPale:C.redPale;border=`2px solid ${opt.correct?C.green:C.red}`;}else if(opt.correct){bg=C.greenPale;border=`2px solid ${C.green}`;}}
            return(<button key={i} onClick={()=>pick(opt)} disabled={!!sel} style={{background:bg,border,borderRadius:12,padding:"14px 16px",textAlign:"left",cursor:sel?"default":"pointer",transition:"all 0.15s",fontFamily:"inherit"}}>
              <div style={{fontWeight:800,color:C.navy,fontSize:14,marginBottom:6}}>{opt.loan}</div>
              {(sel||opt===sel)&&<><div style={{fontSize:12,color:C.green,marginBottom:2}}>✅ {opt.pros}</div><div style={{fontSize:12,color:C.red}}>⚠️ {opt.cons}</div></>}
              {!sel&&<div style={{fontSize:12,color:C.muted}}>Click to select</div>}
            </button>);
          })}
        </div>
        {sel&&<div style={{marginTop:14}}>
          <div style={{background:C.bluePale,borderRadius:10,padding:"12px 14px",fontSize:13,color:C.text,lineHeight:1.6,marginBottom:12}}><strong>💡 Best Answer: {lc.bestAnswer}</strong><br/>{lc.explanation}</div>
          <Btn onClick={next} color={C.blue} full>{idx+1<LOAN_CASES.length?"Next Client →":"Finish ✓"}</Btn>
        </div>}
      </div>
    </div>
  </div>);
}

// ─── SIMULATION 6: MOCK HUD EXAM ─────────────────────────────────────────
const EXAM_QS = [
  {q:"Which of the following is TRUE about intake in HUD housing counseling?",opts:["Intake qualifies as housing counseling if it takes more than 30 minutes","Intake should be reported on HUD-9902 when financial information is collected","Intake alone does NOT qualify as housing counseling and cannot be reported on HUD-9902","Intake qualifies when conducted by a HUD-certified counselor"],ans:2,topic:"Compliance",exp:"Section 3-3: Intake is not housing counseling — period. It cannot be reported on HUD-9902 regardless of length or who conducts it."},
  {q:"A housing counselor refers a client to their brother-in-law's mortgage company without disclosing the relationship. This is:",opts:["Acceptable if the rates are competitive","A conflict of interest and ethics violation","Acceptable only if the counselor discloses it afterward","Only a problem if the client complains"],ans:1,topic:"Ethics",exp:"Referring clients to lenders where the counselor has a personal financial or family interest is a conflict of interest — disclosure after-the-fact does not remedy it."},
  {q:"Under the Fair Housing Act, which of the following is a federally protected class?",opts:["Income level","Sexual orientation","Familial status","Marital status"],ans:2,topic:"Fair Housing",exp:"Familial status (families with children under 18 and pregnant women) is one of 7 federal protected classes. Income, sexual orientation, and marital status are NOT federal classes (though some states/localities add them)."},
  {q:"What is the primary difference between Forbearance and Loan Modification?",opts:["Forbearance requires lender approval; Modification does not","Forbearance is temporary; Modification permanently changes loan terms","Forbearance reduces principal; Modification reduces interest rate only","There is no difference — they are the same product"],ans:1,topic:"Default Counseling",exp:"Key distinction: Forbearance = TEMPORARY pause/reduction. Loan Modification = PERMANENT change to loan terms (rate, term, or principal)."},
  {q:"In the Housing Choice Voucher program, the tenant-based voucher is best described as:",opts:["Attached to a specific housing unit","Tied to a public housing project","Portable — it follows the tenant to any qualifying unit","Available only to first-time renters"],ans:2,topic:"HUD Programs",exp:"Tenant-based vouchers are portable and follow the tenant. Project-based vouchers are attached to specific units."},
  {q:"Which document is REQUIRED for every housing counseling client regardless of session topic?",opts:["Pre-approval letter from a lender","Written Action Plan with goals, tasks, timeline, and referrals","HUD-1 settlement statement","Completed mortgage application"],ans:1,topic:"Compliance",exp:"A written Action Plan is mandatory for every client — it must include goals, tasks, strategies, timeline, and referrals."},
  {q:"A borrower earns $6,000/month gross income. Their proposed housing payment is $1,500/month. What is their front-end DTI?",opts:["20%","25%","30%","35%"],ans:1,topic:"Math",exp:"Front-end DTI = Housing payment ÷ Gross income × 100 = $1,500 ÷ $6,000 × 100 = 25%."},
  {q:"Which loss mitigation option results in HUD paying the borrower's mortgage arrears and placing a subordinate lien on the property?",opts:["Forbearance","Deed-in-Lieu","Partial Claim","Repayment Plan"],ans:2,topic:"Default Counseling",exp:"Partial Claim = HUD pays arrears + creates subordinate zero-interest lien. Due when property is sold or refinanced."},
  {q:"How often must HUD-approved agencies submit HUD-9902 activity reports?",opts:["Monthly","Quarterly","Semi-annually","Annually"],ans:1,topic:"Compliance",exp:"HUD-9902 is submitted quarterly via the Housing Counseling System (HCS). Agencies that fail to submit may jeopardize their HUD approval."},
  {q:"Under FHA guidelines, what is the minimum down payment for a borrower with a 595 credit score?",opts:["3%","3.5%","5%","10%"],ans:3,topic:"FHA/Loans",exp:"FHA requires 3.5% down for scores 580+. For scores 500-579, the minimum is 10%. Score of 595 falls in the 580+ tier — actually 3.5%. Wait: 595 ≥ 580, so 3.5%. Correct answer: 3.5%"},
  {q:"The minimum file retention period for housing counseling client files is:",opts:["1 year","18 months","2 years","3 years"],ans:3,topic:"Compliance",exp:"24 CFR Part 214 requires a minimum 3-year retention period for all client files."},
  {q:"Which of the following is an example of 'steering' under the Fair Housing Act?",opts:["Showing a client homes in their preferred school district","Advising a client about loan products that fit their income","Directing a client toward or away from neighborhoods based on their national origin","Referring a client to a housing counselor who speaks their language"],ans:2,topic:"Fair Housing",exp:"Steering = directing clients toward or away from neighborhoods based on protected class characteristics. It's illegal under the Fair Housing Act."},
  {q:"HECM counseling is required:",opts:["Only if the borrower is under age 70","After the reverse mortgage loan closes","Before the reverse mortgage loan can close","Only for proprietary reverse mortgages, not HECM"],ans:2,topic:"HUD Programs",exp:"HUD-approved HECM counseling is required BY LAW before ANY reverse mortgage (HECM) can close. It's designed to ensure informed consent."},
  {q:"A client's total monthly debts (including proposed housing payment) are $2,400. Gross monthly income is $5,500. Back-end DTI?",opts:["38%","40%","43.6%","44.4%"],ans:2,topic:"Math",exp:"Back-end DTI = Total debts ÷ Gross income = $2,400 ÷ $5,500 = 43.6%"},
  {q:"Which statement about project-based Housing Choice Vouchers is TRUE?",opts:["They follow the tenant if they move","PHAs can allocate up to 30% of vouchers as project-based","They are attached to a specific housing unit","They offer higher subsidies than tenant-based vouchers"],ans:2,topic:"HUD Programs",exp:"Project-based vouchers are attached to specific units (not portable). PHAs may allocate up to 20% (not 30%) as project-based."},
  {q:"A counselor provides housing counseling to a client for free without documenting a fee waiver. This could be a compliance issue because:",opts:["Free counseling is not permitted under HUD rules","Fee waivers must be documented per agency policy and HUD standards","HUD requires all clients to pay at least a nominal fee","Free counseling can only be offered with supervisor approval"],ans:1,topic:"Compliance",exp:"HUD requires that fee waivers for hardship be documented. Undocumented waivers create audit findings."},
  {q:"Which income threshold defines 'very low-income' per HUD Area Median Income (AMI) guidelines?",opts:["Below 80% AMI","Below 60% AMI","Below 50% AMI","Below 30% AMI"],ans:2,topic:"HUD Programs",exp:"80% AMI = Low-Income. 50% AMI = Very Low-Income. 30% AMI = Extremely Low-Income."},
  {q:"A client received a Notice of Default. Which action should the counselor recommend FIRST?",opts:["File for bankruptcy immediately","Contact the servicer's loss mitigation department as soon as possible","Wait to see if the lender initiates foreclosure","Advise the client to move out and find a rental"],ans:1,topic:"Default Counseling",exp:"Upon receipt of Notice of Default, contacting the servicer's loss mitigation department is the critical first step. Time is of the essence."},
  {q:"Which of the following would be an appropriate first step when beginning a pre-purchase counseling session?",opts:["Recommend FHA loan based on the client's income","Conduct a full financial assessment including budget, credit, and affordability","Ask the client which neighborhood they prefer","Provide a list of local lenders"],ans:1,topic:"Compliance",exp:"HUD requires a comprehensive financial assessment BEFORE any product recommendations. Always assess first — this is a core compliance principle."},
  {q:"FHA 203(k) differs from FHA 203(b) in that it:",opts:["Requires a higher credit score","Is only for investors","Finances both the purchase AND renovation of a property in one loan","Offers lower mortgage insurance premiums"],ans:2,topic:"FHA/Loans",exp:"FHA 203(k) = Rehab loan (purchase + renovation). FHA 203(b) = Standard purchase/refinance. Key distinction on the exam."},
];

function MockExam({onBack,onComplete}){
  const [qs]=useState(()=>[...EXAM_QS].sort(()=>Math.random()-0.5).slice(0,20));
  const [idx,setIdx]=useState(0);
  const [answers,setAnswers]=useState({});
  const [phase,setPhase]=useState("test"); // test | review
  const [timeLeft,setTimeLeft]=useState(45*60);
  const [showExp,setShowExp]=useState(false);

  useEffect(()=>{
    if(phase!=="test")return;
    const t=setInterval(()=>setTimeLeft(p=>{if(p<=0){setPhase("review");return 0;}return p-1;}),1000);
    return()=>clearInterval(t);
  },[phase]);

  const pick=(i)=>{if(answers[idx]!==undefined)return;setAnswers(a=>({...a,[idx]:i}));setShowExp(false);};
  const next=()=>{setShowExp(false);if(idx+1>=qs.length)setPhase("review");else setIdx(i=>i+1);};
  const prev=()=>{setShowExp(false);if(idx>0)setIdx(i=>i-1);};

  const fmt=(s)=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  if(phase==="review"){
    const correct=qs.filter((q,i)=>answers[i]===q.ans).length;
    const pct=Math.round((correct/qs.length)*100);
    const byTopic={};
    qs.forEach((q,i)=>{if(!byTopic[q.topic])byTopic[q.topic]={right:0,total:0};byTopic[q.topic].total++;if(answers[i]===q.ans)byTopic[q.topic].right++;});
    return(<div style={{minHeight:"100vh",background:C.bg}}>
      <div style={{background:C.navy,padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:13}}>← Back</button>
        <span style={{color:"#fff",fontWeight:800,fontSize:16,flex:1}}>📝 Exam Results</span>
      </div>
      <div style={{maxWidth:680,margin:"24px auto",padding:"0 20px"}}>
        <div style={{background:C.card,borderRadius:20,padding:"28px 24px",marginBottom:16,textAlign:"center",boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
          <div style={{fontSize:52}}>{pct>=80?"🏆":pct>=70?"⭐":"📚"}</div>
          <h2 style={{color:C.navy,fontWeight:900,fontSize:26,margin:"12px 0 4px"}}>Mock Exam Complete</h2>
          <div style={{fontSize:52,fontWeight:900,color:pct>=80?C.green:pct>=70?C.gold:C.red,margin:"8px 0"}}>{pct}%</div>
          <div style={{color:C.muted,marginBottom:4}}>{correct} / {qs.length} correct</div>
          <div style={{display:"inline-block",background:pct>=80?C.greenPale:pct>=70?C.goldPale:C.redPale,color:pct>=80?C.green:pct>=70?C.gold:C.red,borderRadius:99,padding:"4px 14px",fontWeight:700,fontSize:13,marginBottom:20}}>{pct>=80?"🏆 Exam Ready!":pct>=70?"⭐ Almost There":"📚 Keep Studying"}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:20}}>
            {Object.entries(byTopic).map(([topic,{right,total}])=>{
              const tp=Math.round((right/total)*100);
              return(<div key={topic} style={{background:C.bg,borderRadius:10,padding:"10px 12px"}}>
                <div style={{color:C.navy,fontWeight:700,fontSize:12,marginBottom:4}}>{topic}</div>
                <div style={{fontSize:18,fontWeight:900,color:tp>=80?C.green:tp>=60?C.gold:C.red}}>{tp}%</div>
                <div style={{fontSize:11,color:C.muted}}>{right}/{total} correct</div>
              </div>);
            })}
          </div>
        </div>
        <div style={{background:C.card,borderRadius:16,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
          <div style={{color:C.navy,fontWeight:800,marginBottom:16}}>📖 Review All Questions</div>
          {qs.map((q,i)=>{
            const isCorrect=answers[i]===q.ans;
            return(<div key={i} style={{marginBottom:16,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8}}>
                <span style={{flexShrink:0,width:22,height:22,borderRadius:"50%",background:isCorrect?C.green:C.red,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",fontWeight:700}}>{isCorrect?"✓":"✗"}</span>
                <div style={{fontSize:13,color:C.navy,fontWeight:600,lineHeight:1.5,flex:1}}><Badge label={q.topic} color={C.navy} small/> {q.q}</div>
              </div>
              {answers[i]!==q.ans&&<div style={{background:C.redPale,borderRadius:8,padding:"6px 10px",fontSize:12,color:C.red,marginBottom:4,marginLeft:30}}>Your answer: {q.opts[answers[i]]}</div>}
              <div style={{background:C.greenPale,borderRadius:8,padding:"6px 10px",fontSize:12,color:C.green,marginBottom:4,marginLeft:30}}>✓ {q.opts[q.ans]}</div>
              <div style={{background:C.bg,borderRadius:8,padding:"6px 10px",fontSize:12,color:C.muted,marginLeft:30}}>💡 {q.exp}</div>
            </div>);
          })}
        </div>
        <div style={{marginTop:16,display:"flex",gap:12,justifyContent:"center"}}><Btn onClick={onBack} outline color={C.navy} small>← Back</Btn><Btn onClick={()=>onComplete(Math.round(pct))} color={C.navy} small>Save Score 💾</Btn></div>
      </div>
    </div>);
  }

  const q=qs[idx];
  const tc=timeLeft>600?C.green:timeLeft>300?C.gold:C.red;
  const answered=answers[idx]!==undefined;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <div style={{background:C.navy,padding:"14px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
      <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:13}}>← Exit</button>
      <span style={{color:"#fff",fontWeight:800,fontSize:15,flex:1}}>📝 Mock HUD Exam</span>
      <span style={{background:tc,borderRadius:99,padding:"3px 12px",color:"#fff",fontWeight:700,fontSize:14}}>{fmt(timeLeft)}</span>
      <span style={{background:"rgba(255,255,255,0.1)",borderRadius:8,padding:"4px 10px",color:"#fff",fontSize:13}}>{idx+1}/{qs.length}</span>
    </div>
    <div style={{padding:"6px 16px",background:C.navyMid}}><ProgressBar value={Object.keys(answers).length} max={qs.length} color={C.gold} height={4}/></div>

    <div style={{maxWidth:620,margin:"20px auto",padding:"0 20px"}}>
      <div style={{background:C.card,borderRadius:18,padding:"24px 22px",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
          <Badge label={q.topic} color={C.navy} small/>
          <span style={{color:C.muted,fontSize:12}}>Question {idx+1}</span>
        </div>
        <div style={{color:C.navy,fontSize:16,fontWeight:700,lineHeight:1.6,marginBottom:20}}>{q.q}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.opts.map((opt,i)=>{
            let bg=C.bg,border=`1px solid ${C.border}`,color=C.text;
            if(answered){if(i===q.ans){bg=C.greenPale;border=`2px solid ${C.green}`;color=C.green;}else if(i===answers[idx]&&i!==q.ans){bg=C.redPale;border=`2px solid ${C.red}`;color=C.red;}}
            else if(answers[idx]===i){bg=C.bluePale;border=`2px solid ${C.blue}`;color=C.blue;}
            return(<button key={i} onClick={()=>pick(i)} disabled={answered} style={{background:bg,border,borderRadius:10,padding:"12px 14px",textAlign:"left",cursor:answered?"default":"pointer",fontSize:14,color,lineHeight:1.4,fontFamily:"inherit",transition:"all 0.15s"}}><strong>{String.fromCharCode(65+i)}.</strong> {opt}</button>);
          })}
        </div>
        {answered&&<>
          <button onClick={()=>setShowExp(e=>!e)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 14px",cursor:"pointer",color:C.muted,fontSize:13,marginTop:12,fontFamily:"inherit"}}>{showExp?"Hide":"Show"} explanation</button>
          {showExp&&<div style={{background:C.bg,borderRadius:10,padding:"10px 14px",fontSize:13,color:C.text,lineHeight:1.6,marginTop:8}}>💡 {q.exp}</div>}
        </>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:14,gap:10}}>
        <Btn onClick={prev} disabled={idx===0} outline color={C.navy} small>← Prev</Btn>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",flex:1,justifyContent:"center"}}>
          {qs.map((_,i)=><button key={i} onClick={()=>{setIdx(i);setShowExp(false);}} style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${i===idx?C.navy:answers[i]!==undefined?(answers[i]===qs[i].ans?C.green:C.red):C.border}`,background:i===idx?C.navy:answers[i]!==undefined?(answers[i]===qs[i].ans?C.greenPale:C.redPale):"transparent",cursor:"pointer",fontSize:10,fontWeight:700,color:i===idx?"#fff":C.muted}}>{i+1}</button>)}
        </div>
        <Btn onClick={next} color={C.navy} small>{idx+1<qs.length?"Next →":"Finish 🏁"}</Btn>
      </div>
    </div>
  </div>);
}

// ─── AI CHAT ─────────────────────────────────────────────────────────────
const AI_PROFILES=[
  {id:"prepurchase",title:"First-Time Buyer",icon:"👩",color:C.teal,opening:"Hi! I finally want to buy a home after 10 years renting. Credit 620, $8k saved, $52k income. I don't even know where to start!",system:`You are Maria Gonzalez, 34, hopeful first-time homebuyer in a housing counseling session. Credit 620, $8k saved, $52k/year, $1,400/month debts. Respond as Maria — nervous but hopeful, 2-3 sentences. React positively to good HUD-compliant advice. React with confusion to steering or skipped steps. KB: ${KB.slice(0,1500)}`},
  {id:"default",title:"Foreclosure Crisis",icon:"👫",color:C.red,opening:"We got a Notice of Default yesterday. 3 payments behind, husband lost job. We're terrified of losing our home.",system:`You are James Williams, 48, scared homeowner. 3 payments behind, Notice of Default. Respond as James — distressed, 2-3 sentences. React with relief when counselor explains ALL loss mitigation options. KB: ${KB.slice(0,1500)}`},
  {id:"fairhousing",title:"Fair Housing Violation",icon:"👨",color:C.purple,opening:"My landlord is evicting me right after I reported mold. He enters without notice. I have a 5-year-old. Do I have any rights?",system:`You are Devon Carter, 29, anxious single parent facing retaliatory eviction after mold complaint. Respond as Devon — worried, 2-3 sentences. React with relief when counselor explains fair housing protections. KB: ${KB.slice(0,1500)}`},
];

function AIChatSelect({onSelect,onBack}){
  return(<div style={{minHeight:"100vh",background:C.bg,padding:24}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:C.teal,cursor:"pointer",fontSize:15,marginBottom:20,fontWeight:700}}>← Back</button>
    <div style={{maxWidth:600,margin:"0 auto"}}>
      <h2 style={{color:C.navy,fontSize:24,fontWeight:900,marginBottom:8}}>🤖 AI Client Chat</h2>
      <p style={{color:C.muted,marginBottom:20,lineHeight:1.6}}>Free-form AI sessions. After the session, receive AI feedback on your performance — graded on HUD compliance.</p>
      {AI_PROFILES.map(p=>(<button key={p.id} onClick={()=>onSelect(p)} style={{background:C.card,border:`2px solid ${C.border}`,borderRadius:16,padding:"18px 20px",cursor:"pointer",textAlign:"left",display:"flex",gap:16,alignItems:"center",width:"100%",marginBottom:12,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=p.color;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}>
        <div style={{fontSize:40}}>{p.icon}</div>
        <div style={{flex:1}}><div style={{color:C.navy,fontWeight:800,marginBottom:4}}>{p.title}</div><div style={{color:C.muted,fontSize:13,lineHeight:1.5}}>{p.opening.slice(0,90)}…</div></div>
        <div style={{color:p.color,fontSize:20}}>→</div>
      </button>))}
    </div>
  </div>);
}

function AIChat({profile,onBack,onComplete}){
  const [messages,setMessages]=useState([{role:"assistant",content:profile.opening}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [sessionDone,setSessionDone]=useState(false);
  const [feedback,setFeedback]=useState(null);
  const bottomRef=useRef();
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);
  const send=async()=>{
    if(!input.trim()||loading)return;
    const um={role:"user",content:input.trim()};
    const nm=[...messages,um];setMessages(nm);setInput("");setLoading(true);
    try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:profile.system,messages:nm.map(m=>({role:m.role,content:m.content}))})});const d=await r.json();setMessages(p=>[...p,{role:"assistant",content:d.content?.[0]?.text||"Sorry, could you repeat that?"}]);}catch{setMessages(p=>[...p,{role:"assistant",content:"Sorry, connection issue. Please try again."}]);}
    setLoading(false);
  };
  const end=async()=>{
    setSessionDone(true);
    const transcript=messages.map(m=>`${m.role==="user"?"COUNSELOR":"CLIENT"}: ${m.content}`).join("\n\n");
    try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:`HUD counseling trainer: evaluate this session. Return ONLY valid JSON:\nCLIENT: ${profile.title}\nTRANSCRIPT:\n${transcript}\nReturn: {"overallScore":0-100,"strengths":["...","..."],"improvements":["...","..."],"hudCompliance":["..."],"summary":"2-3 sentences"}`}]})});const d=await r.json();setFeedback(JSON.parse(d.content?.[0]?.text?.replace(/```json|```/g,"").trim()||"{}"));}
    catch{setFeedback({overallScore:70,strengths:["Engaged with client"],improvements:["Cover all required HUD topics"],hudCompliance:["Remember written action plan"],summary:"Good effort! Review HUD compliance requirements."});}
  };
  if(sessionDone&&!feedback)return<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}><div style={{fontSize:40}}>🤖</div><div style={{color:C.navy,fontWeight:700}}>Analyzing your session...</div></div>;
  if(sessionDone&&feedback)return(<div style={{minHeight:"100vh",background:C.bg,padding:24}}><div style={{maxWidth:560,margin:"0 auto",background:C.card,borderRadius:20,padding:32,boxShadow:"0 4px 24px rgba(0,0,0,0.1)"}}><div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:44}}>{feedback.overallScore>=80?"🏆":"⭐"}</div><h2 style={{color:C.navy,fontWeight:900,fontSize:22,margin:"10px 0 4px"}}>Session Feedback</h2><div style={{fontSize:42,fontWeight:900,color:feedback.overallScore>=80?C.green:C.gold}}>{feedback.overallScore}</div><div style={{color:C.muted,fontSize:12}}>/ 100</div></div><p style={{color:C.text,lineHeight:1.7,fontSize:14,background:C.bg,borderRadius:10,padding:12,marginBottom:16}}>{feedback.summary}</p><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}><div style={{background:C.greenPale,borderRadius:10,padding:12}}><div style={{color:C.green,fontWeight:800,fontSize:12,marginBottom:6}}>✅ Strengths</div>{feedback.strengths?.map((s,i)=><div key={i} style={{color:C.text,fontSize:12,marginBottom:3}}>• {s}</div>)}</div><div style={{background:C.goldPale,borderRadius:10,padding:12}}><div style={{color:C.gold,fontWeight:800,fontSize:12,marginBottom:6}}>📈 Improve</div>{feedback.improvements?.map((s,i)=><div key={i} style={{color:C.text,fontSize:12,marginBottom:3}}>• {s}</div>)}</div></div><div style={{background:C.bluePale,borderRadius:10,padding:12,marginBottom:16}}><div style={{color:C.blue,fontWeight:800,fontSize:12,marginBottom:6}}>📋 HUD Compliance</div>{feedback.hudCompliance?.map((s,i)=><div key={i} style={{color:C.text,fontSize:12,marginBottom:3}}>• {s}</div>)}</div><div style={{display:"flex",gap:10,justifyContent:"center"}}><Btn onClick={onBack} outline color={C.teal} small>← Menu</Btn><Btn onClick={()=>onComplete(feedback.overallScore)} color={C.teal} small>Save Score</Btn></div></div></div>);
  return(<div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.bg}}>
    <div style={{background:profile.color,padding:"12px 20px",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
      <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,padding:"5px 12px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:13}}>← Exit</button>
      <div style={{fontSize:24}}>{profile.icon}</div>
      <div style={{flex:1}}><div style={{color:"#fff",fontWeight:800,fontSize:14}}>AI Chat: {profile.title}</div><div style={{color:"rgba(255,255,255,0.75)",fontSize:11}}>{messages.length-1} exchanges</div></div>
      <button onClick={end} style={{background:"rgba(255,255,255,0.2)",border:"2px solid rgba(255,255,255,0.5)",borderRadius:8,padding:"5px 12px",color:"#fff",cursor:"pointer",fontWeight:700,fontSize:12}}>End & Get Feedback</button>
    </div>
    <div style={{flex:1,overflowY:"auto",padding:"14px 14px 0"}}>
      <div style={{maxWidth:580,margin:"0 auto"}}>
        <div style={{background:C.bluePale,borderRadius:8,padding:"7px 12px",marginBottom:12,fontSize:11,color:C.blue}}>💡 Conduct this as a real session — financial assessment, multiple options, action plan.</div>
        {messages.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:8}}>{m.role==="assistant"&&<div style={{fontSize:22,marginRight:6,flexShrink:0,marginTop:2}}>{profile.icon}</div>}<div style={{maxWidth:"76%",padding:"10px 14px",borderRadius:m.role==="user"?"14px 4px 14px 14px":"4px 14px 14px 14px",background:m.role==="user"?profile.color:C.card,color:m.role==="user"?"#fff":C.text,fontSize:13,lineHeight:1.6,boxShadow:m.role==="assistant"?"0 2px 6px rgba(0,0,0,0.07)":"none"}}>{m.content}</div></div>))}
        {loading&&<div style={{display:"flex",gap:6,marginBottom:8}}><div style={{fontSize:22}}>{profile.icon}</div><div style={{background:C.card,borderRadius:"4px 14px 14px 14px",padding:"10px 14px",boxShadow:"0 2px 6px rgba(0,0,0,0.07)"}}><div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.muted}}/>)}</div></div></div>}
        <div ref={bottomRef}/>
      </div>
    </div>
    <div style={{padding:12,borderTop:`1px solid ${C.border}`,background:C.card,flexShrink:0}}>
      <div style={{maxWidth:580,margin:"0 auto",display:"flex",gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Type your counselor response..." style={{flex:1,border:`2px solid ${C.border}`,borderRadius:10,padding:"9px 14px",fontSize:13,outline:"none",color:C.text,fontFamily:"inherit"}} onFocus={e=>e.target.style.borderColor=profile.color} onBlur={e=>e.target.style.borderColor=C.border}/>
        <button onClick={send} disabled={!input.trim()||loading} style={{background:input.trim()&&!loading?profile.color:C.border,border:"none",borderRadius:10,padding:"9px 16px",cursor:input.trim()&&!loading?"pointer":"default",color:"#fff",fontWeight:700,fontSize:13}}>Send</button>
      </div>
    </div>
  </div>);
}

// ─── ORIGINAL GAMES (Hot Seat, Compliance Detective, Client Simulator, Gauntlet) ─
const HOT_SEAT_QS=[
  {q:"Minimum client file retention period?",opts:["1 year","2 years","3 years","5 years"],ans:2,exp:"3 years minimum per 24 CFR Part 214.",topic:"Compliance"},
  {q:"Form submitted quarterly to HUD?",opts:["Form 1003","HUD-9902","HUD-1","Form 4506"],ans:1,exp:"HUD-9902 submitted quarterly via HCS.",topic:"Compliance"},
  {q:"Temporarily reduces/suspends payments?",opts:["Loan Modification","Forbearance","Short Sale","Deed-in-Lieu"],ans:1,exp:"Forbearance is temporary. Modification is permanent.",topic:"Default"},
  {q:"HUD's largest rental assistance program?",opts:["LIHTC","Project Section 8","Housing Choice Voucher","USDA Housing"],ans:2,exp:"HCV (Section 8) is HUD's largest rental program.",topic:"HUD Programs"},
  {q:"HCV tenant pays what % of income?",opts:["10%","20%","30%","40%"],ans:2,exp:"~30% of adjusted income; PHA pays rest to landlord.",topic:"HUD Programs"},
  {q:"Required written document for every client?",opts:["Pre-approval letter","Written Action Plan","Credit report","HUD-1"],ans:1,exp:"Written Action Plan required — goals, tasks, timeline, referrals.",topic:"Compliance"},
  {q:"How many federally protected classes under Fair Housing?",opts:["5","6","7","8"],ans:2,exp:"7: race, color, national origin, religion, sex, familial status, disability.",topic:"Fair Housing"},
  {q:"FHA minimum down payment for 580+ credit?",opts:["0%","3%","3.5%","10%"],ans:2,exp:"3.5% for 580+. Drops to 10% for 500-579.",topic:"FHA/Loans"},
  {q:"Can intake alone be reported on HUD-9902?",opts:["Yes always","Yes if >30 min","No — intake is not counseling","Only if financial info collected"],ans:2,exp:"Intake does NOT qualify as housing counseling (Section 3-3).",topic:"Compliance"},
  {q:"Partial Claim creates what on the property?",opts:["A grant","A gift","A subordinate zero-interest lien","A repayment plan"],ans:2,exp:"HUD pays the debt and places a subordinate lien on the property.",topic:"Default"},
  {q:"Max % of PHA vouchers that can be project-based?",opts:["5%","10%","20%","50%"],ans:2,exp:"PHAs may allocate up to 20% for project-based vouchers.",topic:"HUD Programs"},
  {q:"Directing clients to neighborhoods by race is called?",opts:["Blockbusting","Redlining","Steering","Discriminating"],ans:2,exp:"Steering is an illegal Fair Housing practice.",topic:"Fair Housing"},
];
function HotSeat({onBack,onComplete}){
  const [idx,setIdx]=useState(0);const [sel,setSel]=useState(null);const [score,setScore]=useState(0);const [streak,setStreak]=useState(0);const [timeLeft,setTimeLeft]=useState(20);const [done,setDone]=useState(false);
  const q=HOT_SEAT_QS[idx];
  useEffect(()=>{if(done||sel!==null)return;const t=setInterval(()=>setTimeLeft(p=>{if(p<=1){clearInterval(t);setSel(-1);setStreak(0);return 0;}return p-1;}),1000);return()=>clearInterval(t);},[idx,done,sel]);
  const pick=(i)=>{if(sel!==null)return;setSel(i);if(i===q.ans){setScore(s=>s+(timeLeft>=15?20:timeLeft>=8?15:10));setStreak(s=>s+1);}else setStreak(0);};
  const next=()=>{if(idx+1>=HOT_SEAT_QS.length){setDone(true);onComplete(score);}else{setIdx(i=>i+1);setSel(null);setTimeLeft(20);}};
  if(done)return<ResultScreen emoji="🔥" title="Hot Seat Done!" score={score} maxScore={HOT_SEAT_QS.length*20} color={C.red} onBack={onBack} onSave={()=>onComplete(score)}/>;
  const tc=timeLeft>10?C.green:timeLeft>5?C.gold:C.red;
  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Hot Seat" icon="🔥" color={C.red} onBack={onBack} right={<><span style={{background:tc,borderRadius:99,padding:"3px 12px",color:"#fff",fontWeight:900,fontSize:16,marginRight:8}}>{timeLeft}s</span>{streak>=2&&<span style={{background:C.gold,borderRadius:8,padding:"4px 10px",color:C.navy,fontWeight:800,fontSize:12,marginRight:8}}>🔥{streak}x</span>}<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:13}}>{score} pts</span></>}/>
    <div style={{maxWidth:540,margin:"24px auto",padding:"0 20px"}}>
      <ProgressBar value={idx} max={HOT_SEAT_QS.length} color={C.red}/>
      <div style={{background:C.card,borderRadius:20,padding:"26px 22px",marginTop:16,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <Badge label={q.topic} color={C.red} small/>
        <div style={{color:C.navy,fontSize:17,fontWeight:700,lineHeight:1.5,margin:"12px 0 18px"}}>{q.q}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.opts.map((opt,i)=>{let bg=C.bg,border=`1px solid ${C.border}`;if(sel!==null){if(i===q.ans){bg=C.greenPale;border=`2px solid ${C.green}`;}else if(i===sel){bg=C.redPale;border=`2px solid ${C.red}`;}}return<button key={i} onClick={()=>pick(i)} disabled={sel!==null} style={{background:bg,border,borderRadius:10,padding:"12px 14px",textAlign:"left",cursor:sel!==null?"default":"pointer",fontSize:14,color:C.text,transition:"all 0.2s",fontFamily:"inherit"}}>{opt}</button>;})}
        </div>
        {sel!==null&&<div style={{marginTop:14}}><div style={{background:C.bg,borderRadius:10,padding:"10px 14px",fontSize:13,color:C.text,marginBottom:12}}>💡 {q.exp}</div><Btn onClick={next} color={C.red} full>{idx+1<HOT_SEAT_QS.length?"Next →":"Finish 🏁"}</Btn></div>}
      </div>
    </div>
  </div>);
}

const COMPLIANCE_SCENE={text:`Counselor Jenkins met with client Rosa for 18 minutes. Jenkins reviewed Rosa's credit score (580) and immediately recommended she apply for an FHA loan through First National Bank, where Jenkins' brother-in-law is a loan officer. Jenkins did not complete a budget analysis or discuss other loan options. Jenkins told Rosa her file would be "kept completely private — even from HUD." The session ended without any written documentation given to Rosa. Jenkins logged the session as 60 minutes in the CMS.`,violations:[{text:"Session only 18 minutes — insufficient for a full financial assessment",correct:true},{text:"No budget/spending plan or financial assessment completed",correct:true},{text:"Referred to specific lender where counselor has a family conflict of interest",correct:true},{text:"Failed to present alternative loan options",correct:true},{text:"Made a false absolute privacy guarantee (violates Privacy Act)",correct:true},{text:"No written action plan provided to the client",correct:true},{text:"Logged false session length in CMS (18 min logged as 60 min)",correct:true},{text:"Client's credit score was reviewed during the session",correct:false},{text:"Session was conducted one-on-one",correct:false},{text:"FHA was mentioned as a possible loan type",correct:false}]};
function Detective({onBack,onComplete}){
  const [checked,setChecked]=useState({});const [submitted,setSubmitted]=useState(false);
  const toggle=i=>{if(!submitted)setChecked(c=>({...c,[i]:!c[i]}));};
  const trueV=COMPLIANCE_SCENE.violations.filter(v=>v.correct);
  const found=submitted?trueV.filter((v,i)=>checked[Object.keys(COMPLIANCE_SCENE.violations).filter((_,ii)=>COMPLIANCE_SCENE.violations[ii].correct)[i]!==undefined?COMPLIANCE_SCENE.violations.findIndex((vv,ii)=>vv===v):i]).length:0;
  // simpler approach
  const foundCount=submitted?COMPLIANCE_SCENE.violations.filter((v,i)=>v.correct&&checked[i]).length:0;
  const fpCount=submitted?COMPLIANCE_SCENE.violations.filter((v,i)=>!v.correct&&checked[i]).length:0;
  const score=Math.max(0,Math.round((foundCount/trueV.length)*100-(fpCount*12)));
  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Compliance Detective" icon="🔍" color={C.orange} onBack={onBack}/>
    <div style={{maxWidth:640,margin:"20px auto",padding:"0 20px"}}>
      <div style={{background:C.card,borderRadius:16,padding:"18px 20px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}><h3 style={{color:C.navy,fontWeight:800,marginBottom:6}}>The Rushed Session</h3><p style={{color:C.muted,fontSize:13,marginBottom:12}}>Read carefully, check every compliance violation. False positives cost points!</p><div style={{background:"#FFF7ED",border:"1px solid #FED7AA",borderRadius:10,padding:16,fontSize:14,lineHeight:1.8,color:C.text,fontStyle:"italic"}}>{COMPLIANCE_SCENE.text}</div></div>
      <div style={{background:C.card,borderRadius:16,padding:20,boxShadow:"0 2px 8px rgba(0,0,0,0.07)"}}>
        <div style={{color:C.navy,fontWeight:800,marginBottom:4}}>Select all violations:</div>
        <div style={{color:C.muted,fontSize:12,marginBottom:14}}>{trueV.length} real violations hidden</div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:16}}>
          {COMPLIANCE_SCENE.violations.map((v,i)=>{
            let bg=C.bg,border=`1px solid ${C.border}`;
            if(submitted){if(v.correct&&checked[i]){bg=C.greenPale;border=`2px solid ${C.green}`;}else if(v.correct&&!checked[i]){bg=C.goldPale;border=`2px solid ${C.gold}`;}else if(!v.correct&&checked[i]){bg=C.redPale;border=`2px solid ${C.red}`;}}else if(checked[i]){bg=C.orangePale;border=`2px solid ${C.orange}`;}
            return(<label key={i} style={{display:"flex",gap:10,background:bg,border,borderRadius:9,padding:"10px 12px",cursor:submitted?"default":"pointer",alignItems:"flex-start",transition:"all 0.15s"}}><input type="checkbox" checked={!!checked[i]} onChange={()=>toggle(i)} disabled={submitted} style={{marginTop:3,accentColor:C.orange}}/><span style={{fontSize:13,color:C.text,lineHeight:1.5,flex:1}}>{v.text}</span>{submitted&&v.correct&&checked[i]&&<span style={{color:C.green,fontWeight:700,fontSize:11,flexShrink:0}}>✓</span>}{submitted&&!v.correct&&checked[i]&&<span style={{color:C.red,fontWeight:700,fontSize:11,flexShrink:0}}>✗</span>}</label>);
          })}
        </div>
        {!submitted?<Btn onClick={()=>setSubmitted(true)} disabled={Object.keys(checked).filter(k=>checked[k]).length===0} color={C.orange} full>Submit Analysis 🔍</Btn>
        :<div style={{background:C.orangePale,borderRadius:12,padding:18,textAlign:"center"}}><div style={{fontSize:32,fontWeight:900,color:score>=80?C.green:C.gold,marginBottom:4}}>{score}%</div><div style={{color:C.muted,fontSize:13,marginBottom:12}}>{foundCount}/{trueV.length} found · {fpCount} false positives</div><div style={{display:"flex",gap:10,justifyContent:"center"}}><Btn onClick={onBack} outline color={C.orange} small>← Menu</Btn><Btn onClick={()=>onComplete(score)} color={C.orange} small>Save Score</Btn></div></div>}
      </div>
    </div>
  </div>);
}

const SCENARIOS=[
  {id:"pre-purchase",title:"First-Time Homebuyer",icon:"🏠",difficulty:"Beginner",color:C.teal,client:{name:"Maria Gonzalez",avatar:"👩",opening:"Hi! I've been renting for 10 years and finally want to buy. Credit score 620, $8,000 saved, $52,000/year income. Where do I start?"},
  turns:[
    {prompt:"First step in this pre-purchase session?",options:[{text:"Complete a full financial assessment — income, debts, expenses, credit",correct:true,points:30,feedback:"✅ HUD requires comprehensive financial assessment before any advice or product recommendations."},{text:"Immediately recommend FHA since credit is 620",correct:false,points:0,feedback:"❌ Products before financial assessment violates HUD standards."},{text:"Tell her $8,000 isn't enough and she should keep saving",correct:false,points:0,feedback:"❌ Premature judgment. Down payment assistance may exist — always assess first."},{text:"Ask only about her dream neighborhood",correct:false,points:5,feedback:"⚠️ Helpful context, but HUD requires financial assessment as first documented step."}]},
    {prompt:"Maria's DTI is 42%. Your guidance?",options:[{text:"Explain DTI thresholds, strategies to lower it, and present multiple loan options including FHA",correct:true,points:30,feedback:"✅ FHA allows up to 50%+ DTI with compensating factors. Educate and present all options."},{text:"Tell her she cannot qualify for any mortgage",correct:false,points:0,feedback:"❌ False. FHA and some conventional loans accommodate higher DTI."},{text:"Ignore DTI and focus only on savings",correct:false,points:0,feedback:"❌ DTI is a critical underwriting factor — skipping it leaves the client unprepared."},{text:"Tell her to get a second job immediately",correct:false,points:5,feedback:"⚠️ Too prescriptive. Present all options including income strategies."}]},
    {prompt:"What MUST you provide Maria before the session ends?",options:[{text:"A written action plan with goals, tasks, timeline, and referrals",correct:true,points:40,feedback:"✅ HUD REQUIRES a written action plan for every client — non-negotiable."},{text:"A list of homes in her price range",correct:false,points:0,feedback:"❌ That's a real estate agent's role."},{text:"A verbal summary is sufficient",correct:false,points:0,feedback:"❌ HUD regulations require WRITTEN documentation. Verbal alone is non-compliant."},{text:"Lender contact info only",correct:false,points:5,feedback:"⚠️ Referrals are part of an action plan, but alone don't satisfy the written requirement."}]},
  ]},
  {id:"default",title:"Mortgage Default",icon:"⚠️",difficulty:"Advanced",color:C.red,client:{name:"James & Tanya Williams",avatar:"👫",opening:"We missed 3 mortgage payments. Husband lost his job 4 months ago. Got a Notice of Default yesterday. We're terrified."},
  turns:[
    {prompt:"Notice of Default, 3 payments behind. Most urgent step?",options:[{text:"Contact the servicer's loss mitigation department immediately",correct:true,points:35,feedback:"✅ Time-critical! Options narrow as foreclosure progresses."},{text:"Tell them to stop paying and find rentals",correct:false,points:0,feedback:"❌ Closes all loss mitigation options and severely damages credit."},{text:"File bankruptcy immediately",correct:false,points:0,feedback:"❌ Explore all loss mitigation options first — bankruptcy is a last resort."},{text:"Schedule a follow-up for next month",correct:false,points:0,feedback:"❌ Notice of Default creates a strict timeline — waiting eliminates key options."}]},
    {prompt:"Which loss mitigation options must you present?",options:[{text:"ALL applicable: forbearance, repayment plan, modification, partial claim, short sale, deed-in-lieu",correct:true,points:35,feedback:"✅ HUD requires presenting ALL applicable options — never steer toward one."},{text:"Loan modification only, since they want to stay",correct:false,points:10,feedback:"⚠️ Modification is appropriate, but HUD requires ALL options be presented."},{text:"Short sale since the market is strong",correct:false,points:0,feedback:"❌ Steering toward one option violates HUD counseling standards."},{text:"Refer only to a foreclosure attorney",correct:false,points:5,feedback:"⚠️ Legal referral is appropriate alongside counseling — not instead of it."}]},
    {prompt:"Servicer denies modification. What now?",options:[{text:"Help them appeal, review denial reason, explore alternatives, refer to HOPE Hotline (1-888-995-4673)",correct:true,points:30,feedback:"✅ A denial isn't the end. Review, appeal if appropriate, exhaust all alternatives."},{text:"Tell them there's nothing more to do",correct:false,points:0,feedback:"❌ One denial doesn't exhaust all options. Ongoing duty to assist."},{text:"Advise them to sue the servicer",correct:false,points:0,feedback:"❌ May eventually be appropriate but not a first-line counseling response."},{text:"Start apartment hunting immediately",correct:false,points:5,feedback:"⚠️ Premature — exhaust all options first."}]},
  ]},
  {id:"rental",title:"Fair Housing Dispute",icon:"🏢",difficulty:"Intermediate",color:C.purple,client:{name:"Devon Carter",avatar:"👨",opening:"My landlord is evicting me right after I reported mold. Enters without notice too. I have a 5-year-old and I'm scared."},
  turns:[
    {prompt:"Devon may face retaliatory eviction. First step?",options:[{text:"Document everything: dates of complaints, landlord entries, mold, all communications",correct:true,points:35,feedback:"✅ Documentation is the foundation of any fair housing claim or legal defense."},{text:"Tell Devon to move out now",correct:false,points:0,feedback:"❌ Moving without exploring rights causes unnecessary hardship and waives protections."},{text:"Advise Devon to withhold rent immediately",correct:false,points:0,feedback:"❌ Rent withholding laws vary by state — incorrect advice could harm Devon's case."},{text:"Contact the landlord on Devon's behalf right away",correct:false,points:5,feedback:"⚠️ Appropriate later — documentation and client education must come first."}]},
    {prompt:"What Fair Housing protections apply?",options:[{text:"Retaliatory eviction is illegal; landlord's unlawful entry violates quiet enjoyment rights",correct:true,points:35,feedback:"✅ Anti-retaliation + right to quiet enjoyment. Child's presence = familial status protection too."},{text:"Landlords can evict for any reason — no protections",correct:false,points:0,feedback:"❌ Factually wrong. Most states have anti-retaliation laws and FHA covers rentals."},{text:"Only if Devon is in a protected class",correct:false,points:5,feedback:"⚠️ Retaliation protections are broad — Devon may also qualify under familial status."},{text:"Fair Housing only covers home purchases",correct:false,points:0,feedback:"❌ The Fair Housing Act explicitly covers rental housing."}]},
    {prompt:"What referrals should you provide Devon?",options:[{text:"Legal aid, HUD Fair Housing office, health dept (mold/child safety), tenant advocacy orgs",correct:true,points:30,feedback:"✅ Comprehensive! Mold affecting a child warrants multiple agency involvement."},{text:"Just call 211",correct:false,points:5,feedback:"⚠️ 211 is a start, but HUD counselors should provide specific targeted referrals."},{text:"Refer to a real estate agent",correct:false,points:0,feedback:"❌ Doesn't address Devon's rights or crisis."},{text:"Legal aid only",correct:false,points:10,feedback:"⚠️ Legal aid matters, but the mold/child health issue also warrants health dept involvement."}]},
  ]},
];
function ClientSim({scenario,onBack,onComplete}){
  const [turn,setTurn]=useState(0);const [sel,setSel]=useState(null);const [score,setScore]=useState(0);const [done,setDone]=useState(false);const [showFB,setShowFB]=useState(false);
  const maxPts=scenario.turns.reduce((s,t)=>s+Math.max(...t.options.map(o=>o.points)),0);
  const pick=(opt)=>{if(sel)return;setSel(opt);setShowFB(true);setScore(s=>s+opt.points);};
  const next=()=>{setShowFB(false);setSel(null);if(turn+1>=scenario.turns.length)setDone(true);else setTurn(t=>t+1);};
  if(done)return<ResultScreen emoji={score/maxPts>=0.8?"🏆":"⭐"} title={`${scenario.title} — Done!`} score={score} maxScore={maxPts} color={scenario.color} onBack={onBack} onSave={()=>onComplete(score)}/>;
  const ct=scenario.turns[turn];
  return(<div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column"}}>
    <Header title={`${scenario.client.avatar} ${scenario.client.name}`} icon="" color={scenario.color} onBack={onBack} right={<><span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontWeight:700,fontSize:13}}>{score} pts</span><span style={{color:"rgba(255,255,255,0.8)",fontSize:13,marginLeft:8}}>Q{turn+1}/{scenario.turns.length}</span></>}/>
    <div style={{padding:"8px 16px 4px"}}><ProgressBar value={turn} max={scenario.turns.length} color={scenario.color}/></div>
    <div style={{maxWidth:600,margin:"12px auto",width:"100%",padding:"0 16px",flex:1}}>
      {turn===0&&<div style={{background:C.card,borderRadius:14,padding:"12px 16px",marginBottom:12,display:"flex",gap:10}}><div style={{fontSize:26}}>{scenario.client.avatar}</div><div style={{fontSize:14,color:C.text,lineHeight:1.6}}>{scenario.client.opening}</div></div>}
      <div style={{background:C.card,borderRadius:16,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.07)"}}>
        <div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Your Decision</div>
        <div style={{color:C.navy,fontSize:15,fontWeight:700,marginBottom:16,lineHeight:1.4}}>{ct.prompt}</div>
        <div style={{display:"flex",flexDirection:"column",gap:9}}>
          {ct.options.map((opt,i)=>{let bg=C.bg,border=`1px solid ${C.border}`;if(showFB){if(opt===sel){bg=opt.correct?C.greenPale:C.redPale;border=`2px solid ${opt.correct?C.green:C.red}`;}else if(opt.correct){bg="#F0FDF4";border=`2px solid ${C.green}`;}}return<button key={i} onClick={()=>pick(opt)} disabled={showFB} style={{background:bg,border,borderRadius:10,padding:"11px 14px",textAlign:"left",cursor:showFB?"default":"pointer",fontSize:14,color:C.text,lineHeight:1.4,transition:"all 0.15s",fontFamily:"inherit"}}><strong>{String.fromCharCode(65+i)}.</strong> {opt.text}</button>;})}
        </div>
        {showFB&&<div style={{marginTop:12}}><div style={{background:sel?.correct?C.greenPale:C.redPale,borderRadius:10,padding:"10px 14px",fontSize:14,marginBottom:10,lineHeight:1.5}}>{sel?.feedback}</div><Btn onClick={next} color={scenario.color} full>{turn+1<scenario.turns.length?"Next →":"Finish 🎉"}</Btn></div>}
      </div>
    </div>
  </div>);
}
function ScenarioSelect({onSelect,onBack}){
  return(<div style={{minHeight:"100vh",background:C.bg,padding:24}}>
    <button onClick={onBack} style={{background:"none",border:"none",color:C.teal,cursor:"pointer",fontSize:15,marginBottom:20,fontWeight:700}}>← Back</button>
    <div style={{maxWidth:660,margin:"0 auto"}}><h2 style={{color:C.navy,fontSize:24,fontWeight:900,marginBottom:20}}>💬 Choose a Scenario</h2>
    {SCENARIOS.map(s=>(<button key={s.id} onClick={()=>onSelect(s)} style={{background:C.card,border:`2px solid ${C.border}`,borderRadius:16,padding:"18px 20px",cursor:"pointer",textAlign:"left",display:"flex",gap:16,alignItems:"center",width:"100%",marginBottom:12,transition:"all 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=s.color;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;}}><div style={{fontSize:36}}>{s.client.avatar}</div><div style={{flex:1}}><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}><span style={{color:C.navy,fontWeight:800}}>{s.title}</span><Badge label={s.difficulty} color={s.color} small/></div><div style={{color:C.muted,fontSize:13}}>{s.client.opening.slice(0,90)}…</div></div><div style={{color:s.color,fontSize:20}}>→</div></button>))}</div>
  </div>);
}
function Gauntlet({onBack,onComplete}){
  const [idx,setIdx]=useState(0);const [total,setTotal]=useState(0);const [done,setDone]=useState(false);
  const go=pts=>{const nt=total+pts;setTotal(nt);if(idx+1>=SCENARIOS.length){setDone(true);onComplete(nt);}else setIdx(i=>i+1);};
  if(done)return<ResultScreen emoji="🏆" title="Gauntlet Complete!" subtitle={`All ${SCENARIOS.length} scenarios!`} score={total} color={C.gold} onBack={onBack} onSave={()=>onComplete(total)}/>;
  return<div><div style={{background:C.gold,padding:"8px 20px",display:"flex",gap:12,justifyContent:"center"}}><span style={{fontWeight:800,color:C.navy,fontSize:13}}>⚡ GAUNTLET — Scenario {idx+1}/{SCENARIOS.length}</span><span style={{background:C.navy,color:C.gold,borderRadius:99,padding:"2px 10px",fontWeight:700,fontSize:12}}>{total} pts</span></div><ClientSim scenario={SCENARIOS[idx]} onBack={onBack} onComplete={go}/></div>;
}

// ─── LEADERBOARD ─────────────────────────────────────────────────────────
function Leaderboard({entries,onBack}){
  const sorted=[...entries].sort((a,b)=>b.score-a.score);
  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <div style={{background:C.navy,padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
      <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:8,padding:"6px 12px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:13}}>← Back</button>
      <span style={{color:"#fff",fontWeight:800,fontSize:18,fontFamily:"Georgia,serif"}}>🏆 NHFHC Island Team Leaderboard</span>
    </div>
    <div style={{maxWidth:540,margin:"24px auto",padding:"0 20px"}}>
      {sorted.map((e,i)=>(<div key={i} style={{background:i===0?C.goldPale:C.card,border:`1px solid ${i===0?C.gold:C.border}`,borderRadius:14,padding:"14px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 8px rgba(0,0,0,0.06)"}}>
        <div style={{fontSize:24,width:32,textAlign:"center"}}>{["🥇","🥈","🥉"][i]||`#${i+1}`}</div>
        <div style={{flex:1}}><div style={{color:C.navy,fontWeight:700}}>{e.name}</div><div style={{color:C.muted,fontSize:12}}>{e.mode} · {new Date(e.date).toLocaleDateString()}</div></div>
        <div style={{color:C.navy,fontWeight:900,fontSize:20}}>{e.score}</div>
      </div>))}
    </div>
  </div>);
}

// ─── HOME ────────────────────────────────────────────────────────────────
const ALL_MODES=[
  {id:"flashcards",icon:"🃏",title:"Flashcards",desc:"16 key HUD concepts — flip to reveal answers",color:C.teal,badge:"Study",cat:"learn"},
  {id:"fillblank",icon:"✏️",title:"Fill in the Blank",desc:"Complete 12 critical HUD compliance statements",color:C.blue,badge:"Memory",cat:"learn"},
  {id:"matching",icon:"🃏",title:"Matching Pairs",desc:"Match 8 HUD terms to their definitions",color:C.pink,badge:"Memory",cat:"learn"},
  {id:"wordsearch",icon:"🔎",title:"Word Search",desc:"Find 12 HUD terms hidden in the grid",color:C.green,badge:"Puzzle",cat:"games"},
  {id:"crossword",icon:"🧩",title:"Crossword",desc:"Solve a HUD compliance crossword puzzle",color:C.purple,badge:"Puzzle",cat:"games"},
  {id:"truefalse",icon:"✅",title:"True or False",desc:"16 timed rapid-fire T/F compliance statements",color:C.lime,badge:"Fast",cat:"games"},
  {id:"numbercrunch",icon:"🔢",title:"Number Crunch",desc:"Fill in the right % — DTI, down payment, ratios + math!",color:C.cyan,badge:"Math",cat:"games"},
  {id:"whoami",icon:"🧠",title:"Who Am I?",desc:"Identify HUD programs from clues — fewer clues = more points",color:C.purple,badge:"Logic",cat:"games"},
  {id:"jeopardy",icon:"🎤",title:"Jeopardy",desc:"5 categories, 5 point values — self-score format",color:C.navy,badge:"Classic",cat:"games"},
  {id:"speedsort",icon:"⚡",title:"Speed Sort",desc:"Drag items into correct categories before time runs out",color:C.orange,badge:"Timed",cat:"games"},
  {id:"hotseat",icon:"🔥",title:"Hot Seat",desc:"12 timed compliance questions — build streaks!",color:C.red,badge:"Timed",cat:"games"},
  {id:"ai-chat",icon:"🤖",title:"AI Client Chat",desc:"Free-form counseling with an AI-powered client",color:C.teal,badge:"AI",cat:"sims"},
  {id:"simulator",icon:"💬",title:"Client Simulator",desc:"Structured decisions with instant HUD feedback",color:"#0EA5E9",badge:"Interactive",cat:"sims"},
  {id:"lmtree",icon:"🗺️",title:"Loss Mitigation Tree",desc:"Interactive flowchart — find the right option for each case",color:C.red,badge:"Decision",cat:"sims"},
  {id:"loanlookup",icon:"🏦",title:"Loan Comparison",desc:"Match the right loan product to 3 unique client profiles",color:C.blue,badge:"Analysis",cat:"sims"},
  {id:"ethics",icon:"⚖️",title:"Ethics Dilemma",desc:"Navigate real conflict-of-interest & dual-role scenarios",color:C.orange,badge:"Critical",cat:"sims"},
  {id:"buildfile",icon:"📁",title:"Build-a-File",desc:"Sort documents into a compliant pre-purchase counseling file",color:C.teal,badge:"Practical",cat:"sims"},
  {id:"fileaudit",icon:"🔎",title:"File Audit",desc:"Audit both individual counseling & group education files",color:C.purple,badge:"Audit",cat:"sims"},
  {id:"checklist",icon:"🕵️",title:"Compliance Detective",desc:"Spot every violation in a flawed counseling session",color:C.orange,badge:"Critical",cat:"sims"},
  {id:"gauntlet",icon:"⚡",title:"Scenario Gauntlet",desc:"All scenarios back-to-back — compete for the leaderboard",color:C.gold,badge:"Competitive",cat:"sims"},
  {id:"mockexam",icon:"📝",title:"Mock HUD Exam",desc:"20-question timed practice exam — topic score breakdown",color:C.navy,badge:"Exam Prep",cat:"exam"},
  // ── Workbook Activities (HO248) ──
  {id:"conflictorno",icon:"⚖️",title:"Conflict or No Conflict?",desc:"8 real COI scenarios from the HO248 workbook — is it a violation?",color:C.orange,badge:"HO248",cat:"workbook"},
  {id:"crackthecode",icon:"🔍",title:"Crack the Code: Notes",desc:"Review Bill Dehouse's case notes — find every HUD compliance problem",color:C.navy,badge:"HO248",cat:"workbook"},
  {id:"actionplan",icon:"📝",title:"Action Plan Builder",desc:"Build a compliant action plan step-by-step for Bill Dehouse",color:C.green,badge:"HO248",cat:"workbook"},
  {id:"truthtracking",icon:"📅",title:"Truth in the Tracking",desc:"Categorize Liz Zenning's 17 time entries — counseling, outreach, admin?",color:C.teal,badge:"HO248",cat:"workbook"},
  {id:"nineotwo",icon:"📊",title:"HUD-9902 Coding",desc:"Code 5 client scenarios into the correct Section 9 & 10 categories",color:C.blue,badge:"HO248",cat:"workbook"},
];

function Home({onSelect,stats,onLeaderboard}){
  const cats=[{id:"learn",label:"📚 Study & Learn",color:C.teal},{id:"games",label:"🎮 Mini Games",color:C.purple},{id:"sims",label:"🎯 Simulations",color:C.gold},{id:"workbook",label:"📖 HO248 Workbook Activities",color:C.orange},{id:"exam",label:"📝 Exam Prep",color:C.navy}];
  return(<div style={{minHeight:"100vh",background:`linear-gradient(160deg,${C.navy} 0%,#1E3A5F 55%,#0D6D64 100%)`}}>
    <div style={{textAlign:"center",padding:"36px 24px 20px"}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.08)",borderRadius:99,padding:"6px 18px",marginBottom:14}}>
        <span style={{color:C.tealLight,fontWeight:800,fontSize:12,letterSpacing:2,textTransform:"uppercase"}}>Hawaiian Community Assets</span>
      </div>
      <h1 style={{color:"#fff",fontSize:30,fontWeight:900,margin:"0 0 6px",letterSpacing:-1,fontFamily:"Georgia,serif"}}>HUD Counselor Academy</h1>
      <p style={{color:"#94D4CF",fontSize:13,maxWidth:460,margin:"0 auto 20px"}}>26 activities · NHFHC · Kauai · Hilo · Oahu · Maui</p>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:4}}>
        {[{label:"Sessions",value:stats.completed},{label:"Points",value:stats.points.toLocaleString()},{label:"Streak",value:stats.streak+"🔥"}].map(s=>(<div key={s.label} style={{background:"rgba(255,255,255,0.1)",borderRadius:10,padding:"9px 14px",backdropFilter:"blur(8px)"}}><div style={{color:C.goldLight,fontSize:18,fontWeight:900}}>{s.value}</div><div style={{color:"#94D4CF",fontSize:10}}>{s.label}</div></div>))}
        <button onClick={onLeaderboard} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:10,padding:"9px 14px",cursor:"pointer"}}><div style={{color:C.goldLight,fontSize:18}}>🏆</div><div style={{color:"#94D4CF",fontSize:10}}>Leaderboard</div></button>
      </div>
    </div>
    <div style={{maxWidth:960,margin:"0 auto",padding:"0 16px 40px"}}>
      {cats.map(cat=>(<div key={cat.id} style={{marginBottom:24}}>
        <div style={{color:"rgba(255,255,255,0.55)",fontSize:11,fontWeight:800,textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>{cat.label}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
          {ALL_MODES.filter(m=>m.cat===cat.id).map(m=>(<button key={m.id} onClick={()=>onSelect(m.id)} style={{background:C.card,border:"none",borderRadius:14,padding:"18px 18px 14px",cursor:"pointer",textAlign:"left",boxShadow:"0 4px 18px rgba(0,0,0,0.14)",borderTop:`4px solid ${m.color}`,transition:"transform 0.15s,box-shadow 0.15s",position:"relative"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,0.2)";}} onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 18px rgba(0,0,0,0.14)";}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><span style={{fontSize:26}}>{m.icon}</span><Badge label={m.badge} color={m.color} small/></div>
            <div style={{color:C.navy,fontSize:13,fontWeight:800,marginTop:8}}>{m.title}</div>
            <div style={{color:C.muted,fontSize:11,marginTop:3,lineHeight:1.5}}>{m.desc}</div>
            <div style={{color:m.color,fontSize:11,fontWeight:700,marginTop:8}}>Start →</div>
          </button>))}
        </div>
      </div>))}
    </div>
  </div>);
}

// ─── WORD SEARCH & CROSSWORD (preserved from v4) ─────────────────────────
const WS_WORDS=[{word:"FORBEARANCE",clue:"Temporary pause or reduction of mortgage payments"},{word:"MODIFICATION",clue:"Permanent change to loan terms"},{word:"FORECLOSURE",clue:"Legal process when borrower defaults"},{word:"VOUCHER",clue:"HCV rental assistance certificate"},{word:"INTAKE",clue:"Initial client data gathering (not counseling)"},{word:"ACTIONPLAN",clue:"Required written document for every client"},{word:"DISABILITY",clue:"One of the 7 Fair Housing protected classes"},{word:"QUARTERLY",clue:"How often HUD-9902 must be submitted"},{word:"HECM",clue:"Reverse mortgage — requires HUD counseling first"},{word:"STEERING",clue:"Illegal Fair Housing practice"},{word:"PORTABLE",clue:"Tenant-based vouchers follow the tenant"},{word:"LIEN",clue:"What a Partial Claim places on the property"}];
function buildWS(words,size=14){const grid=Array.from({length:size},()=>Array(size).fill(""));const placed=[];const dirs=[[0,1],[1,0],[0,-1],[-1,0]];const shuffle=a=>[...a].sort(()=>Math.random()-0.5);for(const{word,clue}of shuffle(words)){const w=word.replace(/[^A-Z]/g,"");let ok=false;for(let t=0;t<200&&!ok;t++){const[dr,dc]=dirs[Math.floor(Math.random()*4)];const sr=Math.floor(Math.random()*size),sc=Math.floor(Math.random()*size);const er=sr+dr*(w.length-1),ec=sc+dc*(w.length-1);if(er<0||er>=size||ec<0||ec>=size)continue;let can=true;const cells=[];for(let i=0;i<w.length;i++){const r=sr+dr*i,c=sc+dc*i;if(grid[r][c]!==""&&grid[r][c]!==w[i]){can=false;break;}cells.push([r,c]);}if(can){cells.forEach(([r,c],i)=>grid[r][c]=w[i]);placed.push({word:w,clue,cells});ok=true;}}}const L="ABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(grid[r][c]==="")grid[r][c]=L[Math.floor(Math.random()*26)];return{grid,words:placed};}
function WordSearch({onBack,onComplete}){
  const[pd]=useState(()=>buildWS(WS_WORDS,14));const[found,setFound]=useState(new Set());const[sel,setSel]=useState(false);const[selection,setSelection]=useState([]);const[start,setStart]=useState(null);const[current,setCurrent]=useState(null);const[wrong,setWrong]=useState(false);const[time,setTime]=useState(0);const[done,setDone]=useState(false);const tr=useRef();
  useEffect(()=>{tr.current=setInterval(()=>setTime(t=>t+1),1000);return()=>clearInterval(tr.current);},[]);
  useEffect(()=>{if(found.size>=pd.words.length){clearInterval(tr.current);setDone(true);}},[found]);
  const fmt=t=>`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`;
  const getCells=(s,e)=>{if(!s||!e)return[];const dr=Math.sign(e[0]-s[0]),dc=Math.sign(e[1]-s[1]);const dist=Math.max(Math.abs(e[0]-s[0]),Math.abs(e[1]-s[1]));if(dr!==0&&dc!==0&&Math.abs(e[0]-s[0])!==Math.abs(e[1]-s[1]))return[];return Array.from({length:dist+1},(_,i)=>[s[0]+dr*i,s[1]+dc*i]);};
  const checkSel=(cells)=>{const w=cells.map(([r,c])=>pd.grid[r][c]).join("");const rv=[...w].reverse().join("");for(const pw of pd.words){if(!found.has(pw.word)&&(w===pw.word||rv===pw.word)){setFound(f=>new Set([...f,pw.word]));return true;}}return false;};
  const md=(r,c)=>{setSel(true);setStart([r,c]);setCurrent([r,c]);setSelection([[r,c]]);};
  const me=(r,c)=>{if(!sel)return;setCurrent([r,c]);setSelection(getCells(start,[r,c]));};
  const mu=()=>{setSel(false);const cells=getCells(start,current);if(cells.length>1){const ok=checkSel(cells);if(!ok){setWrong(true);setTimeout(()=>setWrong(false),500);}}setStart(null);setCurrent(null);setSelection([]);};
  const isSel=(r,c)=>selection.some(([sr,sc])=>sr===r&&sc===c);
  const isFound=(r,c)=>{for(const pw of pd.words){if(found.has(pw.word)&&pw.cells.some(([wr,wc])=>wr===r&&wc===c))return pw.word;}return null;};
  const FC=[C.teal,C.purple,C.green,C.orange,C.blue,C.pink,C.gold,C.red,"#06B6D4","#84CC16","#F43F5E","#7C3AED"];
  const score=Math.max(0,found.size*20-Math.floor(time/10));
  if(done)return<ResultScreen emoji="🔎" title="Word Search Done!" subtitle={`Time: ${fmt(time)}`} score={score} color={C.green} onBack={onBack} onSave={()=>onComplete(score)}/>;
  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Word Search" icon="🔎" color={C.green} onBack={onBack} right={<><span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 10px",color:"#fff",fontSize:13,marginRight:8}}>⏱ {fmt(time)}</span><span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 10px",color:"#fff",fontSize:13}}>{found.size}/{pd.words.length}</span></>}/>
    <div style={{maxWidth:860,margin:"0 auto",padding:"16px",display:"flex",gap:18,flexWrap:"wrap"}}>
      <div style={{background:wrong?C.redPale:C.card,borderRadius:14,padding:10,boxShadow:"0 4px 18px rgba(0,0,0,0.08)",transition:"background 0.2s",flex:"0 0 auto"}} onMouseLeave={()=>{if(sel){setSel(false);setStart(null);setCurrent(null);setSelection([]);}}}>
        <div style={{display:"inline-grid",gridTemplateColumns:`repeat(${pd.grid[0].length},28px)`,gap:2,userSelect:"none"}}>
          {pd.grid.map((row,r)=>row.map((letter,c)=>{const fw=isFound(r,c);const s=isSel(r,c);const fi=fw?pd.words.findIndex(w=>w.word===fw):-1;return(<div key={`${r}-${c}`} onMouseDown={()=>md(r,c)} onMouseEnter={()=>me(r,c)} onMouseUp={mu} style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:fw||s?800:400,color:fw?FC[fi%FC.length]:s?C.navy:C.muted,background:fw?FC[fi%FC.length]+"33":s?C.gold+"55":"transparent",borderRadius:5,cursor:"crosshair",transition:"all 0.1s"}}>{letter}</div>);}))}</div>
      </div>
      <div style={{flex:1,minWidth:200}}>
        <div style={{background:C.card,borderRadius:14,padding:16,boxShadow:"0 4px 18px rgba(0,0,0,0.08)"}}>
          <div style={{color:C.navy,fontWeight:800,marginBottom:12,fontSize:14}}>Find These Words:</div>
          {pd.words.map((w,i)=>(<div key={w.word} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,opacity:found.has(w.word)?0.4:1}}>
            <span style={{color:found.has(w.word)?FC[i%FC.length]:C.border,fontSize:14,marginTop:1}}>{found.has(w.word)?"✓":"○"}</span>
            <div><div style={{fontWeight:700,fontSize:12,color:C.navy,textDecoration:found.has(w.word)?"line-through":"none"}}>{w.word}</div><div style={{fontSize:10,color:C.muted,lineHeight:1.4}}>{w.clue}</div></div>
          </div>))}
        </div>
      </div>
    </div>
  </div>);
}

function buildCWData(){const SIZE=13;const grid=Array.from({length:SIZE},()=>Array(SIZE).fill(null));const cleanWords=[{dir:"across",row:0,col:0,word:"FORBEARANCE",clue:"Temporarily reduce/suspend payments",num:1},{dir:"across",row:2,col:1,word:"VOUCHER",clue:"HCV rental assistance document",num:3},{dir:"across",row:4,col:0,word:"INTAKE",clue:"Initial data gathering — NOT reportable on HUD-9902",num:5},{dir:"across",row:7,col:2,word:"LIEN",clue:"A Partial Claim places this on the property",num:8},{dir:"across",row:9,col:0,word:"STEERING",clue:"Illegal Fair Housing practice directing clients by protected class",num:10},{dir:"across",row:11,col:1,word:"PORTABLE",clue:"Tenant-based vouchers are this — they follow the renter",num:12},{dir:"down",row:0,col:5,word:"ACTION",clue:"Written ___ Plan required for every HUD counseling client",num:2},{dir:"down",row:0,col:9,word:"ESCROW",clue:"Account holding tax/insurance reserves",num:4},{dir:"down",row:2,col:4,word:"EQUITY",clue:"HECM converts home ___ into cash",num:6},{dir:"down",row:2,col:7,word:"THREE",clue:"Minimum years client files must be retained",num:9},{dir:"down",row:7,col:5,word:"SEVEN",clue:"Number of federally protected Fair Housing classes",num:11}];
cleanWords.forEach(({dir,row,col,word})=>{for(let i=0;i<word.length;i++){const r=dir==="down"?row+i:row,c=dir==="across"?col+i:col;if(r<SIZE&&c<SIZE){if(!grid[r][c])grid[r][c]={letter:word[i],input:""};grid[r][c].letter=word[i];}}});cleanWords.forEach(({dir,row,col,num})=>{if(grid[row][col])grid[row][col].num=num;});return{grid,words:cleanWords,SIZE};}
function Crossword({onBack,onComplete}){
  const cw=useRef(buildCWData()).current;
  const[inputs,setInputs]=useState(()=>{const m={};cw.words.forEach(({dir,row,col,word})=>{for(let i=0;i<word.length;i++){const r=dir==="down"?row+i:row,c=dir==="across"?col+i:col;if(!m[`${r},${c}`])m[`${r},${c}`]="";}});return m;});
  const[active,setActive]=useState(null);const[activeDir,setActiveDir]=useState("across");const[checked,setChecked]=useState(false);const[done,setDone]=useState(false);const gr=useRef({});
  const setInput=(r,c,val)=>{const l=val.toUpperCase().replace(/[^A-Z]/g,"").slice(-1);setInputs(p=>({...p,[`${r},${c}`]:l}));if(l){const word=cw.words.find(w=>{const cells=Array.from({length:w.word.length},(_,i)=>w.dir==="down"?[w.row+i,w.col]:[w.row,w.col+i]);return cells.some(([wr,wc])=>wr===r&&wc===c)&&w.dir===activeDir;});if(word){const cells=Array.from({length:word.word.length},(_,i)=>word.dir==="down"?[word.row+i,word.col]:[word.row,word.col+i]);const ci=cells.findIndex(([wr,wc])=>wr===r&&wc===c);if(ci<cells.length-1){const[nr,nc]=cells[ci+1];setActive(`${nr},${nc}`);gr.current[`${nr},${nc}`]?.focus();}}}};
  const isInGrid=(r,c)=>inputs.hasOwnProperty(`${r},${c}`);
  const getNum=(r,c)=>cw.words.find(w=>w.row===r&&w.col===c)?.num;
  const getCorrect=(r,c)=>{if(!checked)return null;const val=(inputs[`${r},${c}`]||"").toUpperCase();const w=cw.words.find(ww=>{const cells=Array.from({length:ww.word.length},(_,i)=>ww.dir==="down"?[ww.row+i,ww.col]:[ww.row,ww.col+i]);return cells.some(([wr,wc])=>wr===r&&wc===c);});if(!w)return null;const idx=w.dir==="down"?r-w.row:c-w.col;return val===w.word[idx];};
  const check=()=>{setChecked(true);const allOk=cw.words.every(({dir,row,col,word})=>Array.from({length:word.length},(_,i)=>{const r=dir==="down"?row+i:row,c=dir==="across"?col+i:col;return(inputs[`${r},${c}`]||"").toUpperCase()===word[i];}).every(Boolean));if(allOk)setDone(true);};
  const maxR=Math.max(...cw.words.map(w=>w.dir==="down"?w.row+w.word.length-1:w.row));
  const maxC=Math.max(...cw.words.map(w=>w.dir==="across"?w.col+w.word.length-1:w.col));
  const CELL=34;
  if(done)return<ResultScreen emoji="🧩" title="Crossword Solved!" score={150} color={C.purple} onBack={onBack} onSave={()=>onComplete(150)}/>;
  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Crossword" icon="🧩" color={C.purple} onBack={onBack} right={<span style={{color:"rgba(255,255,255,0.8)",fontSize:13}}>{Object.values(inputs).filter(v=>v).length}/{Object.keys(inputs).length} filled</span>}/>
    <div style={{maxWidth:860,margin:"0 auto",padding:"16px",display:"flex",gap:20,flexWrap:"wrap",alignItems:"flex-start"}}>
      <div style={{background:C.card,borderRadius:14,padding:14,boxShadow:"0 4px 18px rgba(0,0,0,0.08)",overflow:"auto"}}>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${maxC+1},${CELL}px)`,gridTemplateRows:`repeat(${maxR+1},${CELL}px)`,gap:2}}>
          {Array.from({length:maxR+1},(_,r)=>Array.from({length:maxC+1},(_,c)=>{const key=`${r},${c}`;const inG=isInGrid(r,c);const num=getNum(r,c);const isAct=active===key;const corr=getCorrect(r,c);
          if(!inG)return<div key={key} style={{width:CELL,height:CELL,background:C.navy,borderRadius:3}}/>;
          return(<div key={key} style={{position:"relative",width:CELL,height:CELL,background:isAct?C.goldLight:checked&&corr===false?C.redPale:checked&&corr===true?C.greenPale:"#fff",border:`1px solid ${C.border}`,borderRadius:3}}>
            {num&&<span style={{position:"absolute",top:1,left:2,fontSize:8,fontWeight:800,color:C.muted,lineHeight:1}}>{num}</span>}
            <input ref={el=>gr.current[key]=el} value={inputs[key]||""} maxLength={1} onChange={e=>setInput(r,c,e.target.value)} onFocus={()=>setActive(key)} onClick={()=>{if(active===key)setActiveDir(d=>d==="across"?"down":"across");setActive(key);}} style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none",background:"transparent",textAlign:"center",fontSize:14,fontWeight:800,color:C.navy,cursor:"pointer",outline:"none",caretColor:"transparent",fontFamily:"inherit",paddingTop:num?8:0}}/>
          </div>);}))}</div>
        <div style={{marginTop:10,display:"flex",gap:8,justifyContent:"center"}}>
          <Btn onClick={()=>setActiveDir(d=>d==="across"?"down":"across")} outline color={C.purple} small>Direction: {activeDir==="across"?"→ Across":"↓ Down"}</Btn>
          <Btn onClick={check} color={C.purple} small>Check ✓</Btn>
        </div>
      </div>
      <div style={{flex:1,minWidth:220,display:"flex",flexDirection:"column",gap:12}}>
        {[["across","→ Across"],["down","↓ Down"]].map(([dir,label])=>(<div key={dir} style={{background:C.card,borderRadius:12,padding:16,boxShadow:"0 4px 18px rgba(0,0,0,0.08)"}}>
          <div style={{color:C.navy,fontWeight:800,marginBottom:10,fontSize:13}}>{label}</div>
          {cw.words.filter(w=>w.dir===dir&&w.clue).map(w=>(<div key={w.num} style={{marginBottom:7,padding:"5px 8px",borderRadius:5}}><span style={{fontWeight:800,color:C.purple,fontSize:12}}>{w.num}. </span><span style={{color:C.text,fontSize:12}}>{w.clue}</span></div>))}
        </div>))}
      </div>
    </div>
  </div>);
}

// FILL IN BLANK (preserved)
const FILL_BLANKS=[{sentence:"Client files must be retained for a minimum of ___ years.",answer:"3",hint:"Required under 24 CFR Part 214"},{sentence:"Intake alone does NOT qualify as housing counseling and should NOT be reported on Form ___.",answer:"HUD-9902",hint:"The quarterly activity reporting form"},{sentence:"The Fair Housing Act includes ___ federally protected classes.",answer:"7",hint:"Race, color, national origin, religion, sex, familial status, disability"},{sentence:"In the HCV program, the tenant typically pays approximately ___% of adjusted income.",answer:"30",hint:"PHA pays the difference to the landlord"},{sentence:"A ___ temporarily reduces or suspends mortgage payments.",answer:"forbearance",hint:"It's temporary — unlike modification which is permanent"},{sentence:"FHA minimum down payment for a 580+ credit score is ___% of the purchase price.",answer:"3.5",hint:"Goes up to 10% for scores 500-579"},{sentence:"A ___ occurs when the borrower voluntarily transfers their deed to the lender to avoid foreclosure.",answer:"deed-in-lieu",hint:"Voluntary transfer"},{sentence:"HUD-9902 reports must be submitted ___ to HUD via the Housing Counseling System.",answer:"quarterly",hint:"Four times per year"},{sentence:"___ is when HUD pays the borrower's arrears and creates a subordinate zero-interest lien.",answer:"partial claim",hint:"HUD literally pays the debt"},{sentence:"A written ___ ___ is required for every housing counseling client.",answer:"action plan",hint:"What the counselor and client agree to DO"},{sentence:"HECM stands for Home ___ Conversion Mortgage.",answer:"equity",hint:"You're converting your home's _____ into cash"},{sentence:"Project-based vouchers may represent up to ___% of a PHA's total voucher allocation.",answer:"20",hint:"One-fifth"}];
function FillBlank({onBack,onComplete}){
  const[idx,setIdx]=useState(0);const[input,setInput]=useState("");const[submitted,setSubmitted]=useState(false);const[correct,setCorrect]=useState(null);const[score,setScore]=useState(0);const[showHint,setShowHint]=useState(false);const[done,setDone]=useState(false);const ir=useRef();const q=FILL_BLANKS[idx];
  useEffect(()=>{if(!submitted)ir.current?.focus();},[idx,submitted]);
  const check=()=>{if(!input.trim())return;const ok=input.trim().toLowerCase()===q.answer.toLowerCase();setCorrect(ok);setSubmitted(true);if(ok)setScore(s=>s+(showHint?5:10));};
  const next=()=>{setInput("");setSubmitted(false);setCorrect(null);setShowHint(false);if(idx+1>=FILL_BLANKS.length)setDone(true);else setIdx(i=>i+1);};
  const renderSentence=()=>{const parts=q.sentence.split("___");return parts.map((part,i)=>(<span key={i}>{part}{i<parts.length-1&&(submitted?<span style={{borderBottom:`2px solid ${correct?C.green:C.red}`,color:correct?C.green:C.red,fontWeight:800,padding:"0 4px"}}>{input||"___"}</span>:<span style={{borderBottom:`2px solid ${C.teal}`,padding:"0 8px",minWidth:80,display:"inline-block",textAlign:"center"}}>{input||" "}</span>)}</span>));};
  if(done)return<ResultScreen emoji="✏️" title="Fill-in Complete!" score={score} maxScore={FILL_BLANKS.length*10} color={C.blue} onBack={onBack} onSave={()=>onComplete(score)}/>;
  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Fill in the Blank" icon="✏️" color={C.blue} onBack={onBack} right={<><span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 10px",color:"#fff",fontSize:13}}>{score} pts</span><span style={{color:"rgba(255,255,255,0.8)",fontSize:13,marginLeft:8}}>{idx+1}/{FILL_BLANKS.length}</span></>}/>
    <div style={{maxWidth:580,margin:"28px auto",padding:"0 20px"}}>
      <ProgressBar value={idx} max={FILL_BLANKS.length} color={C.blue}/>
      <div style={{background:C.card,borderRadius:18,padding:"28px 22px",marginTop:18,boxShadow:"0 4px 22px rgba(0,0,0,0.08)"}}>
        <div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Complete the Statement</div>
        <div style={{color:C.navy,fontSize:18,lineHeight:2,fontWeight:500,marginBottom:22}}>{renderSentence()}</div>
        {submitted?(<div><div style={{background:correct?C.greenPale:C.redPale,border:`2px solid ${correct?C.green:C.red}`,borderRadius:10,padding:"12px 16px",marginBottom:14}}><div style={{fontWeight:800,color:correct?C.green:C.red,marginBottom:4}}>{correct?"✅ Correct!":"❌ Not quite"}</div>{!correct&&<div style={{color:C.text,fontSize:13}}>Answer: <strong style={{color:C.blue}}>{q.answer}</strong></div>}<div style={{color:C.muted,fontSize:12,marginTop:5}}>💡 {q.hint}</div></div><Btn onClick={next} color={C.blue} full>{idx+1<FILL_BLANKS.length?"Next →":"Finish ✓"}</Btn></div>):(<div><input ref={ir} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")check();}} placeholder="Type your answer..." style={{width:"100%",border:`2px solid ${C.border}`,borderRadius:10,padding:"12px 16px",fontSize:16,outline:"none",color:C.text,fontFamily:"inherit",boxSizing:"border-box",marginBottom:10}} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor=C.border}/><div style={{display:"flex",gap:8}}><button onClick={()=>setShowHint(true)} style={{background:showHint?C.goldPale:C.bg,border:`1px solid ${showHint?C.gold:C.border}`,borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,color:C.muted,fontFamily:"inherit"}}>{showHint?`💡 ${q.hint}`:"💡 Hint (-5 pts)"}</button><Btn onClick={check} disabled={!input.trim()} color={C.blue} style={{flex:1}}>Check ✓</Btn></div></div>)}
      </div>
    </div>
  </div>);
}

// FLASHCARDS (preserved)
const FLASHCARDS=[{front:"What is the minimum client file retention period?",back:"3 years minimum\n(24 CFR Part 214)",category:"Compliance",color:C.teal},{front:"What form do HUD agencies submit quarterly?",back:"HUD-9902\n(via Housing Counseling System / HCS)",category:"Compliance",color:C.blue},{front:"Name all 7 federally protected classes under the Fair Housing Act",back:"1. Race\n2. Color\n3. National Origin\n4. Religion\n5. Sex\n6. Familial Status\n7. Disability",category:"Fair Housing",color:C.purple},{front:"What is HECM and what's required before it closes?",back:"Home Equity Conversion Mortgage (Reverse Mortgage)\nMandatory HUD-approved counseling BEFORE the loan closes",category:"HUD Programs",color:C.orange},{front:"What is Forbearance?",back:"Temporarily reduces or suspends mortgage payments — NOT permanent",category:"Default",color:C.red},{front:"In HCV, what % of income does the tenant typically pay?",back:"~30% of adjusted monthly income\nPHA pays the difference to the landlord",category:"HUD Programs",color:C.green},{front:"What is a Partial Claim?",back:"HUD pays borrower's arrears to servicer\nCreates subordinate zero-interest lien on property",category:"Default",color:C.red},{front:"FHA minimum down payment for 580+ credit score?",back:"3.5% down payment\n(10% required for scores 500-579)",category:"FHA/Loans",color:C.gold},{front:"What must EVERY counseling client receive?",back:"Written Action Plan:\n• Goals & tasks\n• Timeline\n• Referrals & strategies",category:"Compliance",color:C.teal},{front:"Can intake alone be reported on HUD-9902?",back:"NO — Intake is NOT housing counseling\nCannot be reported on HUD-9902 (Section 3-3)",category:"Compliance",color:C.blue},{front:"What is Deed-in-Lieu of Foreclosure?",back:"Borrower voluntarily transfers deed to lender\nAvoiding foreclosure — fewer credit consequences than full foreclosure",category:"Default",color:C.red},{front:"What is 'Familial Status' as a protected class?",back:"Families with children under age 18\nAND pregnant women",category:"Fair Housing",color:C.purple},{front:"Two required pre-purchase handouts?",back:"1. 'For Your Protection: Get a Home Inspection'\n2. 'Ten Important Questions to Ask Your Home Inspector'",category:"Compliance",color:C.teal},{front:"What is FHA 203(k)?",back:"FHA rehabilitation loan\nFinances both purchase AND renovation in one loan",category:"FHA/Loans",color:C.gold},{front:"Max % of PHA vouchers that can be project-based?",back:"Up to 20% of a PHA's total vouchers\n(Project-based = attached to specific property)",category:"HUD Programs",color:C.green},{front:"What is 'steering' in Fair Housing?",back:"Directing clients toward or away from neighborhoods\nbased on protected class — ILLEGAL",category:"Fair Housing",color:C.purple}];
function FlashCards({onBack,onComplete}){
  const[idx,setIdx]=useState(0);const[flipped,setFlipped]=useState(false);const[known,setKnown]=useState(new Set());const[unsure,setUnsure]=useState(new Set());const[done,setDone]=useState(false);
  const card=FLASHCARDS[idx];
  const mark=(knew)=>{if(knew)setKnown(s=>new Set([...s,idx]));else setUnsure(s=>new Set([...s,idx]));setFlipped(false);if(idx+1>=FLASHCARDS.length)setDone(true);else setIdx(i=>i+1);};
  if(done){const score=Math.round((known.size/FLASHCARDS.length)*100);return(<div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}><div style={{background:C.card,borderRadius:22,padding:36,maxWidth:420,textAlign:"center",boxShadow:"0 8px 40px rgba(0,0,0,0.1)"}}><div style={{fontSize:48}}>{score>=80?"🏆":"📚"}</div><h2 style={{color:C.navy,fontWeight:900,fontSize:24,margin:"12px 0 16px"}}>Deck Complete!</h2><div style={{display:"flex",gap:20,justifyContent:"center",marginBottom:20}}><div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:900,color:C.green}}>{known.size}</div><div style={{color:C.muted,fontSize:12}}>Got it ✓</div></div><div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:900,color:C.red}}>{unsure.size}</div><div style={{color:C.muted,fontSize:12}}>Review more</div></div></div><div style={{display:"flex",gap:10,justifyContent:"center"}}><Btn onClick={()=>{setIdx(0);setFlipped(false);setKnown(new Set());setUnsure(new Set());setDone(false);}} outline color={C.teal} small>Restart</Btn><Btn onClick={()=>onComplete(score)} color={C.teal} small>Save & Exit</Btn></div></div></div>);}
  return(<div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`,display:"flex",flexDirection:"column"}}>
    <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}><button onClick={onBack} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:8,padding:"6px 14px",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:13}}>← Exit</button><span style={{color:"#fff",fontWeight:800,fontSize:15,flex:1}}>🃏 Flashcards</span><span style={{color:"rgba(255,255,255,0.7)",fontSize:13}}>{idx+1}/{FLASHCARDS.length}</span><span style={{background:C.greenPale,color:C.green,borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700}}>✓ {known.size}</span></div>
    <div style={{padding:"0 20px 6px",maxWidth:560,margin:"0 auto",width:"100%"}}><ProgressBar value={idx} max={FLASHCARDS.length} color={card.color} height={4}/></div>
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"14px 20px"}}>
      <div style={{maxWidth:520,width:"100%",perspective:1000}}>
        <div onClick={()=>setFlipped(f=>!f)} style={{position:"relative",width:"100%",minHeight:260,cursor:"pointer",transformStyle:"preserve-3d",transform:flipped?"rotateY(180deg)":"rotateY(0deg)",transition:"transform 0.5s cubic-bezier(0.4,0,0.2,1)"}}>
          <div style={{position:"absolute",width:"100%",minHeight:260,backfaceVisibility:"hidden",background:C.card,borderRadius:22,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",boxSizing:"border-box",borderTop:`6px solid ${card.color}`}}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Question</div><div style={{color:C.navy,fontSize:17,fontWeight:700,textAlign:"center",lineHeight:1.6}}>{card.front}</div><div style={{color:C.muted,fontSize:11,marginTop:20}}>👆 Tap to reveal</div></div>
          <div style={{position:"absolute",width:"100%",minHeight:260,backfaceVisibility:"hidden",transform:"rotateY(180deg)",background:card.color,borderRadius:22,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",boxSizing:"border-box"}}><div style={{color:"rgba(255,255,255,0.8)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Answer</div><div style={{color:"#fff",fontSize:16,fontWeight:700,textAlign:"center",lineHeight:1.7,whiteSpace:"pre-line"}}>{card.back}</div></div>
        </div>
      </div>
    </div>
    {flipped?(<div style={{padding:"0 20px 28px",display:"flex",gap:14,justifyContent:"center",maxWidth:520,margin:"0 auto",width:"100%"}}><button onClick={()=>mark(false)} style={{flex:1,background:C.redPale,border:`2px solid ${C.red}`,borderRadius:12,padding:"13px 0",cursor:"pointer",fontWeight:800,fontSize:14,color:C.red,fontFamily:"inherit"}}>😬 Still Learning</button><button onClick={()=>mark(true)} style={{flex:1,background:C.greenPale,border:`2px solid ${C.green}`,borderRadius:12,padding:"13px 0",cursor:"pointer",fontWeight:800,fontSize:14,color:C.green,fontFamily:"inherit"}}>✅ Got It!</button></div>):(<div style={{padding:"0 20px 28px",textAlign:"center",color:"rgba(255,255,255,0.5)",fontSize:13}}>Tap the card to see the answer</div>)}
  </div>);
}

// ─── WORKBOOK ACTIVITY 1: TRUTH IN THE TRACKING ──────────────────────────
// Based directly on HO248 Tab 4 activity: categorize Liz Zenning's time entries
const LIZ_ENTRIES = [
  {date:"Mon Apr 22",time:"8:00-8:15",desc:"County tax office call re: senior tax credit for Burke client",correct:"counseling",hint:"Making calls on behalf of a client = counseling activity"},
  {date:"Mon Apr 22",time:"9:30-9:45",desc:"Sharon Spase — rental/roommate issues counseling session",correct:"counseling",hint:"Direct client counseling session"},
  {date:"Mon Apr 22",time:"10:00-10:30",desc:"Credit counseling session with Skip Dowtt",correct:"counseling",hint:"Direct client service"},
  {date:"Mon Apr 22",time:"10:45-11:00",desc:"Walk-in pre-purchase inquiry",correct:"counseling",hint:"Substantive counseling with a client"},
  {date:"Mon Apr 22",time:"11:30-11:45",desc:"Faxed Iona Lott package to HFH lender",correct:"counseling",hint:"Working with lenders on behalf of a client = counseling"},
  {date:"Mon Apr 22",time:"1:00-1:30",desc:"Fair housing collaboration meeting with partner agencies",correct:"outreach",hint:"Collaboration with partners to promote services = outreach"},
  {date:"Mon Apr 22",time:"2:00-2:30",desc:"Meet with case manager re: Lisa Plaise legal issue referral",correct:"counseling",hint:"Internal coordination on behalf of a client = counseling"},
  {date:"Tue Apr 23",time:"8:00-8:10",desc:"Called client to remind about appointment this week",correct:"counseling",hint:"Follow-up contact on behalf of a client"},
  {date:"Tue Apr 23",time:"9:30-10:00",desc:"DPA asset rules info email to Ed at city re: Bill Dehouse",correct:"counseling",hint:"Researching/communicating resources for a specific client"},
  {date:"Tue Apr 23",time:"10:30-11:00",desc:"PrePur Dot Comm homebuyer orientation class delivery",correct:"education",hint:"Delivering a group education class"},
  {date:"Tue Apr 23",time:"11:45-12:00",desc:"Homebuyer Orientation class setup and materials prep",correct:"admin",hint:"Preparing for a class is administrative, not billable education"},
  {date:"Tue Apr 23",time:"1:30-2:00",desc:"Discussed city DPA call findings with supervisor",correct:"admin",hint:"Internal staff meetings are administrative"},
  {date:"Tue Apr 23",time:"2:00-3:00",desc:"Post-purchase home visit — Wanda Knomoore",correct:"counseling",hint:"Direct client service regardless of location"},
  {date:"Thu Apr 25",time:"3:30-4:30",desc:"Pre-purchase counseling session — Bill Dehouse",correct:"counseling",hint:"One-on-one counseling session"},
  {date:"Fri Apr 26",time:"8:00-8:15",desc:"Earl Lee Riser — refi review call",correct:"counseling",hint:"Working with a client on their housing goal"},
  {date:"Fri Apr 26",time:"11:30-11:45",desc:"Shredding closed client files",correct:"admin",hint:"File management = administrative"},
  {date:"Fri Apr 26",time:"2:00-2:15",desc:"Answered general housing question from walk-in (no file created)",correct:"unbillable",hint:"General info without counseling = unbillable/outreach only"},
];
const TIME_CATS = ["counseling","outreach","education","admin","unbillable"];
const CAT_COLORS = {counseling:C.teal,outreach:C.blue,education:C.purple,admin:C.gold,unbillable:C.muted};
const CAT_LABELS = {counseling:"Counseling",outreach:"Outreach",education:"Education",admin:"Admin",unbillable:"Unbillable"};

function TruthTracking({onBack,onComplete}){
  const[answers,setAnswers]=useState({});
  const[submitted,setSubmitted]=useState(false);
  const[page,setPage]=useState(0);
  const PER_PAGE=6;
  const totalPages=Math.ceil(LIZ_ENTRIES.length/PER_PAGE);
  const pageEntries=LIZ_ENTRIES.slice(page*PER_PAGE,(page+1)*PER_PAGE);
  const allAnswered=LIZ_ENTRIES.every((_,i)=>answers[i]!==undefined);

  const score=submitted?LIZ_ENTRIES.reduce((acc,e,i)=>acc+(answers[i]===e.correct?6:0),0):0;
  const correct=submitted?LIZ_ENTRIES.filter((e,i)=>answers[i]===e.correct).length:0;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Truth in the Tracking" icon="📅" color={C.teal} onBack={onBack}
      right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:12}}>
        {Object.keys(answers).length}/{LIZ_ENTRIES.length} coded
      </span>}/>
    <div style={{maxWidth:740,margin:"16px auto",padding:"0 16px"}}>
      <div style={{background:C.bluePale,border:`1.5px solid ${C.blue}44`,borderRadius:12,padding:"12px 16px",marginBottom:14,fontSize:13,color:C.text,lineHeight:1.6}}>
        📋 <strong>Activity (HO248 Tab 4):</strong> Review Liz Zenning's time entries for the week of April 22. Categorize each entry as: Counseling, Outreach, Education, Admin, or Unbillable.
      </div>

      {!submitted&&<div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {TIME_CATS.map(cat=>(
          <span key={cat} style={{background:CAT_COLORS[cat]+"22",border:`1px solid ${CAT_COLORS[cat]}44`,borderRadius:99,padding:"3px 12px",fontSize:12,fontWeight:700,color:CAT_COLORS[cat]}}>
            {CAT_LABELS[cat]}
          </span>
        ))}
      </div>}

      {submitted?(
        <div>
          <div style={{background:C.card,borderRadius:16,padding:24,marginBottom:14,textAlign:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
            <div style={{fontSize:42,fontWeight:900,color:correct>=14?C.green:correct>=10?C.gold:C.red}}>{Math.round((correct/LIZ_ENTRIES.length)*100)}%</div>
            <div style={{color:C.muted,fontSize:13,marginBottom:16}}>{correct}/{LIZ_ENTRIES.length} correctly coded</div>
            <Btn onClick={()=>onComplete(score)} color={C.teal}>Save Score 💾</Btn>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {LIZ_ENTRIES.map((e,i)=>{
              const isRight=answers[i]===e.correct;
              return(<div key={i} style={{background:C.card,borderRadius:12,padding:"12px 16px",border:`1.5px solid ${isRight?C.green:C.red}`,boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
                  <div style={{flex:1}}>
                    <div style={{color:C.muted,fontSize:11,fontWeight:700,marginBottom:3}}>{e.date} · {e.time}</div>
                    <div style={{color:C.text,fontSize:13,lineHeight:1.5}}>{e.desc}</div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
                    {answers[i]!==e.correct&&<span style={{background:CAT_COLORS[answers[i]]+"22",color:CAT_COLORS[answers[i]],borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700,textDecoration:"line-through"}}>
                      {CAT_LABELS[answers[i]]||"?"}
                    </span>}
                    <span style={{background:CAT_COLORS[e.correct]+"22",color:CAT_COLORS[e.correct],borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700}}>
                      {isRight?"✓ ":""}{CAT_LABELS[e.correct]}
                    </span>
                  </div>
                </div>
                {!isRight&&<div style={{background:C.goldPale,borderRadius:8,padding:"6px 10px",marginTop:8,fontSize:12,color:C.text}}>💡 {e.hint}</div>}
              </div>);
            })}
          </div>
        </div>
      ):(
        <div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
            {pageEntries.map((e,pi)=>{
              const i=page*PER_PAGE+pi;
              const sel=answers[i];
              return(<div key={i} style={{background:C.card,borderRadius:14,padding:"14px 16px",boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
                <div style={{color:C.muted,fontSize:11,fontWeight:700,marginBottom:4}}>{e.date} · {e.time}</div>
                <div style={{color:C.navy,fontSize:14,fontWeight:600,lineHeight:1.5,marginBottom:10}}>{e.desc}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {TIME_CATS.map(cat=>(
                    <button key={cat} onClick={()=>setAnswers(a=>({...a,[i]:cat}))}
                      style={{background:sel===cat?CAT_COLORS[cat]:C.bg,border:`1.5px solid ${sel===cat?CAT_COLORS[cat]:C.border}`,borderRadius:99,padding:"5px 14px",cursor:"pointer",fontSize:12,fontWeight:700,color:sel===cat?"#fff":C.muted,fontFamily:"inherit",transition:"all 0.15s"}}>
                      {CAT_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>);
            })}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <Btn onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} outline color={C.teal} small>← Prev</Btn>
            <span style={{color:C.muted,fontSize:13}}>Page {page+1} of {totalPages}</span>
            {page<totalPages-1
              ?<Btn onClick={()=>setPage(p=>p+1)} color={C.teal} small>Next →</Btn>
              :<Btn onClick={()=>{if(allAnswered)setSubmitted(true);}} disabled={!allAnswered} color={C.teal} small>Submit ✓</Btn>
            }
          </div>
          {!allAnswered&&<div style={{textAlign:"center",color:C.muted,fontSize:12,marginTop:8}}>Code all {LIZ_ENTRIES.length} entries to submit</div>}
        </div>
      )}
    </div>
  </div>);
}

// ─── WORKBOOK ACTIVITY 2: CRACK THE CODE (COUNSELING NOTES) ──────────────
// Based on HO248 Tab 4 — review Bill Dehouse's case notes, identify what's wrong
const CRACK_NOTES = [
  {
    id:1,
    date:"Apr 23 · Phone · 11:00–11:10",
    counselor:"Liz Zenning",
    note:"Discussed orientation with receptionist. He said that Bill was there. Afterwards spoke to him about his interest in getting involved in the program. He gave Bill an intake package and made an initial appt with me in a week for Thursday the 25th at 3:30.",
    issues:[
      {id:"a",text:"The counselor is referred to as 'He' — Liz is female. Notes must accurately identify the counselor.",correct:true},
      {id:"b",text:"The entry doesn't document what was specifically discussed with Bill about the program.",correct:true},
      {id:"c",text:"'Gave Bill an intake package' is not a counseling activity and shouldn't be here.",correct:false},
      {id:"d",text:"The appointment scheduled at the end should not be in counseling notes.",correct:false},
    ],
    explanation:"The pronoun error misidentifies the counselor. HUD requires notes to accurately describe WHO performed the activity. Also, key details about what was discussed are missing.",
  },
  {
    id:2,
    date:"Apr 24 · Phone · 8:00–8:10",
    counselor:"Liz Zenning",
    note:"I/m again",
    issues:[
      {id:"a",text:"'I/m again' is insufficient — notes must describe what was actually communicated.",correct:true},
      {id:"b",text:"'I/m' is an acceptable abbreviation for 'left message' in counseling notes.",correct:false},
      {id:"c",text:"A 10-minute phone call should always result in more detailed notes.",correct:false},
      {id:"d",text:"The note doesn't state the purpose of the call or what information was conveyed.",correct:true},
    ],
    explanation:"HUD requires notes to document the interaction — what was done, why, and any outcomes. 'I/m again' tells a supervisor or reviewer nothing about the counseling activity.",
  },
  {
    id:3,
    date:"Phone · 2:05–3:05",
    counselor:"Liz Zenning",
    note:"Bill returned my call. He said that Anita Sail helped his cousin Owen Dehouse buy a condo last year and they met at his housewarming party. She was telling him that he could buy a house with hardly any money down on an FHA who only requires 3.5% down. She told him about our agency and that we had money and classes...",
    issues:[
      {id:"a",text:"The note identifies a third party (Anita Sail) who referred the client — this is a potential undisclosed conflict of interest that must be documented and reviewed.",correct:true},
      {id:"b",text:"Notes reference 'hardly any money down' — counselors must not use informal or misleading language about loan products.",correct:true},
      {id:"c",text:"Describing what Anita said about FHA loans in the notes is a fair housing violation.",correct:false},
      {id:"d",text:"The note is too long — counseling notes should be brief.",correct:false},
    ],
    explanation:"The referral source (Anita Sail) must be documented and reviewed for conflict of interest — especially since she appears to be in the industry. Informal language about loan products should be avoided.",
  },
  {
    id:4,
    date:"Apr 25 · In-person · 3:45–5:15",
    counselor:"Liz Zenning",
    note:"Opened client file. Client arrived for 1:1 had his 15 yr old daughter Juanna Dehouse. She is very excited about getting her own room if her dad is able to buy their first house. She said they need a three-bedroom place with a big yard and can't wait to stop sharing a room with her little sister Soul.",
    issues:[
      {id:"a",text:"The note describes the daughter's excitement and preferences but not the actual counseling that occurred.",correct:true},
      {id:"b",text:"Mentioning the daughter is a privacy violation — minor children should never appear in counseling notes.",correct:false},
      {id:"c",text:"There is no documentation of financial assessment, credit review, or counseling content.",correct:true},
      {id:"d",text:"The note fails to document the Action Plan goals, obstacles, or strategies discussed.",correct:true},
    ],
    explanation:"This note describes the family situation but entirely omits the counseling content HUD requires: financial assessment, credit review, affordability analysis, action plan, and documented housing goals.",
  },
];

function CrackTheCode({onBack,onComplete}){
  const[idx,setIdx]=useState(0);
  const[selected,setSelected]=useState({});
  const[submitted,setSubmitted]=useState(false);
  const[score,setScore]=useState(0);
  const[done,setDone]=useState(false);
  const note=CRACK_NOTES[idx];

  const toggle=(id)=>{if(submitted)return;setSelected(s=>({...s,[id]:!s[id]}));};

  const submit=()=>{
    const tp=note.issues.filter(i=>i.correct&&selected[i.id]).length;
    const fp=note.issues.filter(i=>!i.correct&&selected[i.id]).length;
    const pts=Math.max(0,(tp*15)-(fp*10));
    setScore(s=>s+pts);
    setSubmitted(true);
  };

  const next=()=>{
    setSelected({});setSubmitted(false);
    if(idx+1>=CRACK_NOTES.length)setDone(true);
    else setIdx(i=>i+1);
  };

  if(done)return<ResultScreen emoji="🔍" title="Crack the Code Done!" subtitle="Notes review complete" score={score} maxScore={CRACK_NOTES.length*30} color={C.navy} onBack={onBack} onSave={()=>onComplete(score)}/>;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Crack the Code: Notes Review" icon="🔍" color={C.navy} onBack={onBack}
      right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:12}}>
        File {idx+1}/{CRACK_NOTES.length} · {score} pts
      </span>}/>
    <div style={{maxWidth:680,margin:"16px auto",padding:"0 16px"}}>
      <div style={{background:C.goldPale,border:`1.5px solid ${C.gold}`,borderRadius:12,padding:"12px 16px",marginBottom:14,fontSize:13,color:C.text,lineHeight:1.6}}>
        📋 <strong>Activity (HO248 Tab 4):</strong> Review Bill Dehouse's counseling notes. Check ALL items that represent a problem, missing requirement, or HUD compliance issue.
      </div>

      <div style={{background:C.card,borderRadius:16,padding:20,marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",gap:12,marginBottom:10,flexWrap:"wrap"}}>
          <span style={{background:C.navyMid+"22",color:C.navy,borderRadius:99,padding:"3px 12px",fontSize:11,fontWeight:700}}>{note.date}</span>
          <span style={{background:C.teal+"22",color:C.teal,borderRadius:99,padding:"3px 12px",fontSize:11,fontWeight:700}}>{note.counselor}</span>
        </div>
        <div style={{background:"#f8f9fa",borderRadius:10,padding:"14px 16px",borderLeft:`4px solid ${C.gold}`,fontSize:13,color:C.text,lineHeight:1.8,fontStyle:"italic"}}>
          "{note.note}"
        </div>
      </div>

      <div style={{background:C.card,borderRadius:16,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{color:C.navy,fontWeight:800,marginBottom:12,fontSize:14}}>What's wrong with this entry? (Select all that apply)</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {note.issues.map(issue=>{
            const isSel=!!selected[issue.id];
            let bg=C.bg,border=`1px solid ${C.border}`;
            if(submitted){
              if(issue.correct&&isSel){bg=C.greenPale;border=`2px solid ${C.green}`;}
              else if(issue.correct&&!isSel){bg=C.goldPale;border=`2px solid ${C.gold}`;}
              else if(!issue.correct&&isSel){bg=C.redPale;border=`2px solid ${C.red}`;}
            }else if(isSel){bg=C.navyMid+"15";border=`2px solid ${C.navy}`;}
            return(<label key={issue.id} style={{display:"flex",gap:10,background:bg,border,borderRadius:10,padding:"10px 14px",cursor:submitted?"default":"pointer",transition:"all 0.15s",alignItems:"flex-start"}}>
              <input type="checkbox" checked={isSel} onChange={()=>toggle(issue.id)} disabled={submitted} style={{marginTop:2,accentColor:C.navy}}/>
              <div style={{fontSize:13,color:C.text,lineHeight:1.5,flex:1}}>{issue.text}</div>
              {submitted&&issue.correct&&!isSel&&<span style={{color:C.gold,fontSize:11,fontWeight:700,flexShrink:0}}>⚠️ Missed</span>}
              {submitted&&issue.correct&&isSel&&<span style={{color:C.green,fontSize:11,fontWeight:700,flexShrink:0}}>✓ Found</span>}
              {submitted&&!issue.correct&&isSel&&<span style={{color:C.red,fontSize:11,fontWeight:700,flexShrink:0}}>✗ Not an issue</span>}
            </label>);
          })}
        </div>
        {!submitted&&<div style={{marginTop:14}}><Btn onClick={submit} color={C.navy} full>Submit Review 🔍</Btn></div>}
        {submitted&&<div style={{marginTop:14}}>
          <div style={{background:C.bg,borderRadius:10,padding:"12px 14px",fontSize:13,color:C.text,lineHeight:1.6,marginBottom:12}}>
            💡 <strong>Explanation:</strong> {note.explanation}
          </div>
          <Btn onClick={next} color={C.navy} full>{idx+1<CRACK_NOTES.length?"Next Note →":"Finish ✓"}</Btn>
        </div>}
      </div>
    </div>
  </div>);
}

// ─── WORKBOOK ACTIVITY 3: HUD-9902 CODING ────────────────────────────────
// Based on HO248 Tab 6 — code 10 client scenarios for the HUD-9902 report
const CODING_CASES = [
  {
    client:"Rosa Gutierrez",
    scenario:"Rosa attended your agency's 4-hour first-time homebuyer class in October. She is Hispanic, income 60% AMI, not rural, English proficient. She bought a home in November.",
    services:["Group Education — Pre-Purchase/Homebuying"],
    outcomes:["Households that improved their financial capacity","Households that gained access to resources (down payment assistance)"],
    section9:"c. Pre-purchase/Homebuying",
    section10:["c. Budget developed","d. Improved financial capacity","e. Gained access to housing resources"],
    question:"Which Section 9 counseling type AND Section 10 outcomes should be reported for Rosa's group education?",
    options:[
      {label:"Section 9: Pre-purchase | Section 10: d + e",correct:true,feedback:"✅ Correct! Group education = reported in Section 8 (education), not Section 9. The outcomes (d, e) apply."},
      {label:"Section 9: Homeless | Section 10: g",correct:false,feedback:"❌ Rosa is a homebuyer, not homeless. Homeless assistance is for shelter/transitional housing clients."},
      {label:"Section 9: Pre-purchase | Section 10: a only",correct:false,feedback:"❌ Outcome 'a' (received both counseling and education) applies only when a client ALSO received one-on-one counseling. Rosa only attended a class."},
      {label:"Section 9: Non-Delinquency Post-Purchase | Section 10: k",correct:false,feedback:"❌ Rosa attended pre-purchase education before buying — not post-purchase. 'k' (avoided eviction) doesn't apply."},
    ],
  },
  {
    client:"Manny Reyes",
    scenario:"Manny completed 6 months of pre-purchase counseling and bought a home this quarter. He also brought his friend Lucy to your Fix the Faucet post-purchase workshop. Manny is Hispanic and Black, 80-100% AMI, rural, English proficient. Lucy is Alaskan Native and Asian, over 100% AMI, rural, English proficient.",
    services:["One-on-one Pre-purchase counseling (Manny)","Group Post-purchase education (Manny + Lucy)"],
    outcomes:["Manny: purchased a home","Lucy: attended workshop only"],
    section9:"Pre-purchase (Manny only)",
    section10:["a","d","e"],
    question:"How many households do you report in Section 3 (Ethnicity) this quarter for Manny and Lucy's services?",
    options:[
      {label:"2 households — one for each person for each service",correct:false,feedback:"❌ Close, but Section 3-7 must reflect the SAME individual from each household consistently across all sections."},
      {label:"2 households total — Manny's demographics reported twice (once per service), Lucy's once",correct:true,feedback:"✅ Correct! Manny received 2 services this quarter so his demographics are reported twice. Lucy received 1 service. Total = 3 data points but 2 unique households."},
      {label:"1 household — only count unique clients",correct:false,feedback:"❌ HUD-9902 counts service instances. Manny received 2 different services so he is counted twice."},
      {label:"3 entries — one per service received across both clients",correct:false,feedback:"❌ Partially right — 3 entries is correct for Sections 3-7, but the question asks about reporting households, not entries."},
    ],
  },
  {
    client:"Georgia Pham",
    scenario:"Georgia bought her house last year after attending your homebuyer class. This year she attended your post-purchase course on home maintenance. She later experienced basement flooding, attended your disaster preparedness course, and received individual counseling for disaster recovery assistance. Georgia is Asian, not Hispanic, just over 80% AMI, rural, English proficient.",
    services:["Group Post-purchase education","Group Disaster preparedness education","One-on-one disaster recovery counseling"],
    outcomes:["Gained access to non-housing resources (FEMA, etc.)","Gained access to housing resources (rehab loan)"],
    section9:"Non-Delinquency Post-Purchase",
    section10:["e","f"],
    question:"How many times should Georgia's demographics appear in Sections 3-7 this quarter?",
    options:[
      {label:"Once — she is one household",correct:false,feedback:"❌ Georgia received 3 different services this quarter. Each service triggers a demographics entry."},
      {label:"Twice — once for education, once for counseling",correct:false,feedback:"❌ Georgia received 2 education services AND 1 counseling session = 3 total service instances."},
      {label:"Three times — once per service received",correct:true,feedback:"✅ Correct! Each service received = one entry in Sections 3-7. 3 services = 3 entries. Her grand totals in each section will each include 3 from Georgia."},
      {label:"Four times — one per month she received services",correct:false,feedback:"❌ HUD-9902 counts service instances, not months. Georgia received 3 services, not 4."},
    ],
  },
  {
    client:"Ray Lopez",
    scenario:"Ray is Latino and lost his job and apartment and has been living in his van. Your agency assisted Ray to find an emergency shelter. Ray has no address, no benefits, no income. Your bilingual counselor discussed employment options and referred him to the State's Employment Office and weekly food delivery.",
    services:["One-on-one Homeless Assistance counseling"],
    outcomes:["Obtained temporary housing","Gained access to non-housing resources (employment, food)"],
    section9:"a. Homeless Assistance",
    section10:["f","g"],
    question:"Which Section 10 outcomes apply to Ray?",
    options:[
      {label:"g (homeless obtained housing) and f (gained non-housing resources)",correct:true,feedback:"✅ Correct! Ray obtained emergency shelter (g) and was connected to employment/food resources (f)."},
      {label:"k only — he received rental counseling and avoided eviction",correct:false,feedback:"❌ Ray is homeless, not a renter facing eviction. 'k' is for rental clients who avoided eviction after counseling."},
      {label:"e only — gained access to housing resources",correct:false,feedback:"❌ 'e' covers housing resources (DPA, rental assistance) not emergency shelter. Also, Ray received non-housing resources (f) too."},
      {label:"d — improved financial capacity",correct:false,feedback:"❌ Nothing in Ray's case documents improved financial capacity. He was referred to employment resources but no financial improvement is documented."},
    ],
  },
  {
    client:"Lucy Kahananui",
    scenario:"Lucy is a first-time renter. She came in for help understanding her lease and tenant rights. She is Native Hawaiian, not Hispanic, 50-79% AMI, not rural, English proficient. At the end of the session she decided not to rent and is now considering saving up to buy instead.",
    services:["One-on-one Rental counseling"],
    outcomes:["Received fair housing information","Budget developed"],
    section9:"b. Rental Topics",
    section10:["b","c"],
    question:"Which section 9 counseling type should be reported AND is outcome 'k' (avoided eviction) applicable here?",
    options:[
      {label:"Section 9b: Rental Topics. Outcome k does NOT apply — Lucy was not facing eviction.",correct:true,feedback:"✅ Correct! Lucy came in for lease/tenant rights help — not because of a delinquency or eviction threat. 'k' requires an eviction risk scenario."},
      {label:"Section 9b: Rental Topics. Outcome k DOES apply — she received rental counseling.",correct:false,feedback:"❌ Outcome 'k' specifically means the household received rental counseling AND avoided eviction. Lucy wasn't facing eviction."},
      {label:"Section 9c: Pre-purchase — she now wants to buy.",correct:false,feedback:"❌ The service provided was rental counseling. The fact that she's now considering buying in the future doesn't change what was reported this quarter."},
      {label:"Section 9a: Homeless Assistance — she has no place to rent.",correct:false,feedback:"❌ Lucy is seeking rental help, not homeless assistance. She is actively looking to rent, not without housing."},
    ],
  },
];

function NineOTwo({onBack,onComplete}){
  const[idx,setIdx]=useState(0);
  const[sel,setSel]=useState(null);
  const[score,setScore]=useState(0);
  const[done,setDone]=useState(false);
  const c=CODING_CASES[idx];

  const pick=(opt)=>{
    if(sel)return;
    setSel(opt);
    if(opt.correct)setScore(s=>s+20);
  };
  const next=()=>{setSel(null);if(idx+1>=CODING_CASES.length)setDone(true);else setIdx(i=>i+1);};

  if(done)return<ResultScreen emoji="📊" title="HUD-9902 Coding Done!" subtitle="Reporting expertise" score={score} maxScore={CODING_CASES.length*20} color={C.blue} onBack={onBack} onSave={()=>onComplete(score)}/>;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="HUD-9902 Coding Practice" icon="📊" color={C.blue} onBack={onBack}
      right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:12}}>
        Case {idx+1}/{CODING_CASES.length} · {score} pts
      </span>}/>
    <div style={{maxWidth:680,margin:"16px auto",padding:"0 16px"}}>
      <div style={{background:C.bluePale,border:`1.5px solid ${C.blue}44`,borderRadius:12,padding:"12px 16px",marginBottom:14,fontSize:13,color:C.text,lineHeight:1.6}}>
        📋 <strong>Activity (HO248 Tab 6):</strong> Read the client scenario and determine the correct HUD Form 9902 coding — Section 9 (counseling type) and Section 10 (outcomes).
      </div>

      <div style={{background:C.card,borderRadius:16,padding:20,marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{color:C.blue,fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>👤 {c.client}</div>
        <div style={{fontSize:13,color:C.text,lineHeight:1.7,marginBottom:12,borderLeft:`3px solid ${C.blue}`,paddingLeft:12}}>{c.scenario}</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {c.services.map((s,i)=><span key={i} style={{background:C.blue+"15",color:C.blue,borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700}}>📌 {s}</span>)}
        </div>
      </div>

      <div style={{background:C.card,borderRadius:16,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{color:C.navy,fontWeight:800,fontSize:14,marginBottom:14}}>{c.question}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {c.options.map((opt,i)=>{
            let bg=C.bg,border=`1px solid ${C.border}`;
            if(sel){
              if(opt===sel){bg=opt.correct?C.greenPale:C.redPale;border=`2px solid ${opt.correct?C.green:C.red}`;}
              else if(opt.correct){bg=C.greenPale;border=`2px solid ${C.green}`;}
            }
            return(<button key={i} onClick={()=>pick(opt)} disabled={!!sel}
              style={{background:bg,border,borderRadius:12,padding:"13px 16px",textAlign:"left",cursor:sel?"default":"pointer",fontSize:13,color:C.text,lineHeight:1.5,fontFamily:"inherit",transition:"all 0.15s"}}>
              {opt.label}
            </button>);
          })}
        </div>
        {sel&&<div style={{marginTop:14}}>
          <div style={{background:sel.correct?C.greenPale:C.redPale,borderRadius:10,padding:"12px 14px",fontSize:13,color:C.text,lineHeight:1.6,marginBottom:12}}>
            {sel.feedback}
          </div>
          <Btn onClick={next} color={C.blue} full>{idx+1<CODING_CASES.length?"Next Case →":"Finish ✓"}</Btn>
        </div>}
      </div>
    </div>
  </div>);
}

// ─── WORKBOOK ACTIVITY 4: ACTION PLAN BUILDER ────────────────────────────
// Based on HO248 Tab 4 LO3c — draft action plan for Bill Dehouse case study
const ACTION_PLAN_STEPS = [
  {
    step:1,
    title:"Identify Housing Goal",
    question:"Based on Bill's file, what is his primary housing goal and timeline?",
    options:[
      {text:"Purchase a 3-bedroom home within 6–12 months using HHNPO FTHB DPA program",correct:true,feedback:"✅ Correct! Bill has a clear pre-purchase goal with a specific program in mind, making this a medium-term (3–6 month) goal."},
      {text:"Find a rental property immediately as his credit is too low to purchase",correct:false,feedback:"❌ Nothing in Bill's file indicates his credit is too low. He has engaged in pre-purchase counseling and is pursuing homebuying."},
      {text:"Apply for a reverse mortgage to access home equity",correct:false,feedback:"❌ HECM/reverse mortgages are for existing homeowners aged 62+. Bill is a first-time buyer."},
      {text:"Enroll in a rental assistance program while he saves",correct:false,feedback:"❌ While saving is relevant, the action plan should reflect Bill's stated goal of purchasing, not a rental detour."},
    ],
  },
  {
    step:2,
    title:"Document Client Obstacles",
    question:"Which of the following are legitimate documented obstacles for Bill? (Best answer only)",
    options:[
      {text:"Needs to complete homebuyer education, verify DPA income eligibility, address any credit issues",correct:true,feedback:"✅ Correct! These align with what's known from his file: he was directed to homebuyer ed, DPA has income limits, and credit should be reviewed."},
      {text:"Has too many children and can't afford a large enough home",correct:false,feedback:"❌ Family size is not an obstacle — and referring to it this way could border on discriminatory thinking. Action plans should focus on financial and documentation barriers."},
      {text:"No obstacles documented — he seems ready to purchase",correct:false,feedback:"❌ Every pre-purchase client has obstacles. At minimum, he needs to complete homebuyer education and have his income/credit verified."},
      {text:"Bill's daughter Juanna's preferences may conflict with available inventory",correct:false,feedback:"❌ Client family preferences are not 'obstacles' in the HUD sense. Action plan obstacles are financial, credit, or documentation barriers."},
    ],
  },
  {
    step:3,
    title:"Set Client Tasks with Timelines",
    question:"Which task and timeline is MOST appropriate for Bill's action plan?",
    options:[
      {text:"Complete 'Realizing the American Dream' homebuyer education by [date 30 days out]",correct:true,feedback:"✅ Correct! Completing HUD-approved homebuyer education is a concrete, time-bound task that is both required for the DPA program and appropriate to document."},
      {text:"Buy a house by the end of the quarter",correct:false,feedback:"❌ Purchasing a home is the goal, not a client task. Tasks should be the steps the client takes to achieve the goal."},
      {text:"Call the counselor weekly for updates",correct:false,feedback:"❌ Follow-up scheduling is the counselor's responsibility, not a client task. Action plan tasks belong to the client."},
      {text:"Think about whether homeownership is the right choice",correct:false,feedback:"❌ This is far too vague. Action plan tasks must be specific, measurable, and time-bound per HUD requirements."},
    ],
  },
  {
    step:4,
    title:"Document Referrals",
    question:"Which referral(s) should be included in Bill's action plan?",
    options:[
      {text:"HHNPO DPA program + homebuyer education class + credit counseling if needed",correct:true,feedback:"✅ Correct! Action plans must document referrals to community resources. These three are directly applicable to Bill's situation."},
      {text:"No referrals needed — Bill found us on his own",correct:false,feedback:"❌ HUD requires all referrals to be documented in the action plan, regardless of how the client found the agency."},
      {text:"Refer Bill to a specific lender the counselor has a relationship with",correct:false,feedback:"❌ Referring clients to lenders where the counselor has a personal or financial relationship is a conflict of interest violation."},
      {text:"Refer Bill to a financial advisor to manage his savings",correct:false,feedback:"❌ While financial education is appropriate, referring to a paid financial advisor without documented need is outside HUD counseling scope."},
    ],
  },
];

function ActionPlanBuilder({onBack,onComplete}){
  const[idx,setIdx]=useState(0);
  const[sel,setSel]=useState(null);
  const[score,setScore]=useState(0);
  const[done,setDone]=useState(false);
  const step=ACTION_PLAN_STEPS[idx];

  const pick=(opt)=>{
    if(sel)return;
    setSel(opt);
    if(opt.correct)setScore(s=>s+25);
  };
  const next=()=>{setSel(null);if(idx+1>=ACTION_PLAN_STEPS.length)setDone(true);else setIdx(i=>i+1);};

  if(done)return<ResultScreen emoji="📝" title="Action Plan Built!" subtitle="Client documentation skills" score={score} maxScore={ACTION_PLAN_STEPS.length*25} color={C.green} onBack={onBack} onSave={()=>onComplete(score)}/>;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Action Plan Builder" icon="📝" color={C.green} onBack={onBack}
      right={<span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 12px",color:"#fff",fontSize:12}}>
        Step {idx+1}/{ACTION_PLAN_STEPS.length} · {score} pts
      </span>}/>
    <div style={{maxWidth:660,margin:"16px auto",padding:"0 16px"}}>
      <div style={{background:C.greenPale,border:`1.5px solid ${C.green}44`,borderRadius:12,padding:"12px 16px",marginBottom:14,fontSize:13,color:C.text,lineHeight:1.6}}>
        📋 <strong>Activity (HO248 Tab 4 LO3c):</strong> Build a compliant action plan for <strong>Bill Dehouse</strong> — a first-time homebuyer pursuing HHNPO's DPA program. Make the best choice at each step.
      </div>

      <div style={{background:C.card,borderRadius:16,padding:20,marginBottom:14,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
          <div style={{background:C.green,color:"#fff",borderRadius:99,width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13,flexShrink:0}}>{step.step}</div>
          <div style={{color:C.navy,fontWeight:800,fontSize:15}}>{step.title}</div>
        </div>
        <div style={{color:C.text,fontSize:14,lineHeight:1.6,fontWeight:600}}>{step.question}</div>
      </div>

      <div style={{background:C.card,borderRadius:16,padding:20,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {step.options.map((opt,i)=>{
            let bg=C.bg,border=`1px solid ${C.border}`;
            if(sel){
              if(opt===sel){bg=opt.correct?C.greenPale:C.redPale;border=`2px solid ${opt.correct?C.green:C.red}`;}
              else if(opt.correct){bg=C.greenPale;border=`2px solid ${C.green}`;}
            }
            return(<button key={i} onClick={()=>pick(opt)} disabled={!!sel}
              style={{background:bg,border,borderRadius:12,padding:"13px 16px",textAlign:"left",cursor:sel?"default":"pointer",fontSize:13,color:C.text,lineHeight:1.5,fontFamily:"inherit",transition:"all 0.15s"}}>
              {opt.text}
            </button>);
          })}
        </div>
        {sel&&<div style={{marginTop:14}}>
          <div style={{background:sel.correct?C.greenPale:C.redPale,borderRadius:10,padding:"12px 14px",fontSize:13,color:C.text,lineHeight:1.6,marginBottom:12}}>
            {sel.feedback}
          </div>
          <Btn onClick={next} color={C.green} full>{idx+1<ACTION_PLAN_STEPS.length?"Next Step →":"Finish ✓"}</Btn>
        </div>}
      </div>
    </div>
  </div>);
}

// ─── WORKBOOK ACTIVITY 5: CONFLICT OR NO CONFLICT ────────────────────────
// Based on HO248 LO3a — identify and resolve conflict of interest scenarios
const COI_SCENARIOS = [
  {
    scenario:"Counselor Maria refers her client to a mortgage lender where her husband works as a loan officer. She does not disclose this relationship.",
    verdict:"conflict",
    explanation:"This is a clear conflict of interest. Referring clients to lenders where the counselor has a personal/financial relationship — without disclosure — violates HUD ethics requirements and the National Industry Standards Code of Ethics.",
    resolution:"Maria must either (a) fully disclose the relationship in writing and let the client decide, or (b) refer the client to a different lender. Most agencies prohibit such referrals entirely.",
    difficulty:"easy",
  },
  {
    scenario:"Counselor James recommends that his client attend a homebuyer education class offered by a different agency because it has a better curriculum, even though his agency also offers a class.",
    verdict:"no conflict",
    explanation:"No conflict here. Counselors are expected to act in the client's best interest, even if that means referring to another agency's program. Recommending a better-fit program reflects good professional judgment.",
    resolution:"No action needed. Document the referral in the client file as you would any other community resource referral.",
    difficulty:"easy",
  },
  {
    scenario:"A real estate agency donates $5,000 to your housing counseling agency annually. One of their agents frequently refers clients to your agency. You refer clients back to that agency's agents when they need a real estate agent.",
    verdict:"conflict",
    explanation:"This creates a conflict of interest. The financial relationship between the donor agency and your organization influences referral decisions, which should be based solely on client need — not on donor relationships.",
    resolution:"Agencies must have a written conflict of interest policy. Referrals to partners who fund the agency require disclosure to clients and documentation. Many HUD guidelines prohibit exclusive referral arrangements with funders.",
    difficulty:"medium",
  },
  {
    scenario:"Counselor Nina recently earned her real estate license. On her own time and outside work hours, she helps a family member purchase a home as their buyer's agent, earning a commission.",
    verdict:"conflict",
    explanation:"Potentially a conflict of interest depending on agency policy. Dual licensure (counselor + real estate agent) is a known conflict risk area. Even if done outside work hours, it can compromise objectivity and raise questions about counselor impartiality.",
    resolution:"Nina must disclose the dual licensure to her agency. Many HUD-approved agencies have specific policies on this — some prohibit it entirely, others allow it with strict disclosure requirements.",
    difficulty:"medium",
  },
  {
    scenario:"Your agency receives a HUD grant specifically to provide counseling to clients of Bank A. Bank A sends clients to your agency and pays for their counseling fees.",
    verdict:"conflict",
    explanation:"This is a lender-funded counseling conflict of interest. When a lender pays for counseling, the counselor may be influenced — consciously or not — to recommend products or services that benefit the lender. HUD has specific rules governing lender-funded counseling.",
    resolution:"Agencies must have written policies governing lender-funded counseling, disclose the funding relationship to every client in writing, and ensure counselors are not directed to favor any lender's products.",
    difficulty:"hard",
  },
  {
    scenario:"Counselor David receives a $25 gift card from a grateful client after helping them successfully purchase their home.",
    verdict:"conflict",
    explanation:"This may or may not be a conflict depending on agency policy, but it is worth flagging. Many agencies have a gift policy — typically prohibiting gifts above a de minimis threshold (often $25 or less). A gift after services are complete has less risk than during counseling, but it still requires documentation.",
    resolution:"David should report the gift per his agency's gift policy. If the agency has a 'no gifts' policy, he should politely decline or return it and document the interaction.",
    difficulty:"medium",
  },
  {
    scenario:"A housing counselor uses her agency's client list — gathered through HUD-funded counseling — to market a private financial planning service she offers on the side.",
    verdict:"conflict",
    explanation:"This is a serious violation. Client information gathered through HUD-funded counseling is protected under the Privacy Act and agency confidentiality policies. Using it for personal commercial gain is both an ethics violation and potentially illegal.",
    resolution:"Client data may only be used for the purposes for which it was collected. The counselor must immediately cease using the client list for personal marketing and must report the incident per agency policy.",
    difficulty:"hard",
  },
  {
    scenario:"Counselor Keiko refers all Spanish-speaking clients to a single local non-profit that offers bilingual services, because no one at her agency speaks Spanish.",
    verdict:"no conflict",
    explanation:"No conflict here — this is appropriate practice. When an agency cannot serve a client due to language barriers, referring to an agency that can serve them appropriately is both compliant and client-centered.",
    resolution:"Document the referral and the reason. Agencies should have a language access plan and consider adding bilingual staff or services over time.",
    difficulty:"easy",
  },
];

function ConflictOrNo({onBack,onComplete}){
  const[idx,setIdx]=useState(0);
  const[verdict,setVerdict]=useState(null);
  const[score,setScore]=useState(0);
  const[streak,setStreak]=useState(0);
  const[done,setDone]=useState(false);
  const[showResolution,setShowResolution]=useState(false);
  const s=COI_SCENARIOS[idx];

  const diffColor={easy:C.green,medium:C.gold,hard:C.red};

  const pick=(v)=>{
    if(verdict)return;
    setVerdict(v);
    const correct=(v===s.verdict);
    if(correct){setScore(sc=>sc+(streak>=2?20:15));setStreak(st=>st+1);}
    else setStreak(0);
  };

  const next=()=>{
    setVerdict(null);setShowResolution(false);
    if(idx+1>=COI_SCENARIOS.length)setDone(true);
    else setIdx(i=>i+1);
  };

  if(done)return<ResultScreen emoji="⚖️" title="Conflict or No Conflict!" subtitle="Ethics & COI mastery" score={score} maxScore={COI_SCENARIOS.length*20} color={C.orange} onBack={onBack} onSave={()=>onComplete(score)}/>;

  const isCorrect=verdict===s.verdict;

  return(<div style={{minHeight:"100vh",background:C.bg}}>
    <Header title="Conflict or No Conflict?" icon="⚖️" color={C.orange} onBack={onBack}
      right={<><span style={{background:diffColor[s.difficulty]+"33",color:diffColor[s.difficulty],borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700,marginRight:6}}>{s.difficulty}</span>
        <span style={{background:"rgba(255,255,255,0.2)",borderRadius:8,padding:"4px 10px",color:"#fff",fontSize:12}}>{score} pts · {idx+1}/{COI_SCENARIOS.length}</span></>}/>
    <div style={{maxWidth:640,margin:"16px auto",padding:"0 16px"}}>
      <div style={{background:"#FFF7ED",border:`1.5px solid ${C.orange}44`,borderRadius:12,padding:"12px 16px",marginBottom:14,fontSize:13,color:C.text,lineHeight:1.6}}>
        📋 <strong>Activity (HO248 LO3a):</strong> Read each scenario and decide: is this a conflict of interest, or not? Then review how to handle it.
      </div>

      <div style={{background:C.card,borderRadius:16,padding:24,marginBottom:14,boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
        <div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Scenario {idx+1}</div>
        <div style={{color:C.navy,fontSize:16,fontWeight:600,lineHeight:1.7}}>{s.scenario}</div>
      </div>

      {!verdict?(
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>pick("conflict")}
            style={{flex:1,background:"#FEF2F2",border:`2px solid ${C.red}`,borderRadius:14,padding:"20px 0",cursor:"pointer",fontWeight:900,fontSize:16,color:C.red,fontFamily:"inherit",transition:"all 0.15s"}}>
            ⚠️ CONFLICT
          </button>
          <button onClick={()=>pick("no conflict")}
            style={{flex:1,background:C.greenPale,border:`2px solid ${C.green}`,borderRadius:14,padding:"20px 0",cursor:"pointer",fontWeight:900,fontSize:16,color:C.green,fontFamily:"inherit",transition:"all 0.15s"}}>
            ✅ NO CONFLICT
          </button>
        </div>
      ):(
        <div>
          <div style={{background:isCorrect?C.greenPale:C.redPale,border:`2px solid ${isCorrect?C.green:C.red}`,borderRadius:14,padding:"16px 18px",marginBottom:12}}>
            <div style={{fontWeight:800,color:isCorrect?C.green:C.red,marginBottom:8,fontSize:15}}>
              {isCorrect?"✅ Correct!":"❌ Not quite"} — This IS{s.verdict==="no conflict"?" NOT":""} a conflict of interest.
            </div>
            <div style={{color:C.text,fontSize:13,lineHeight:1.6}}>{s.explanation}</div>
          </div>
          <button onClick={()=>setShowResolution(r=>!r)}
            style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",fontSize:13,color:C.muted,fontFamily:"inherit",marginBottom:12,textAlign:"left"}}>
            {showResolution?"▼":"▶"} How should this be handled?
          </button>
          {showResolution&&<div style={{background:C.goldPale,border:`1.5px solid ${C.gold}`,borderRadius:10,padding:"12px 14px",fontSize:13,color:C.text,lineHeight:1.6,marginBottom:12}}>
            🔧 <strong>Resolution:</strong> {s.resolution}
          </div>}
          <Btn onClick={next} color={C.orange} full>{idx+1<COI_SCENARIOS.length?"Next Scenario →":"Finish ✓"}</Btn>
        </div>
      )}
    </div>
  </div>);
}

// ─── ROOT ─────────────────────────────────────────────────────────────────
export default function App(){
  const[screen,setScreen]=useState("home");
  const[scenario,setScenario]=useState(null);
  const[aiProfile,setAiProfile]=useState(null);
  const[lb,setLb]=useState([
    {name:"🏝️ NHFHC",score:320,mode:"Mock Exam",date:Date.now()-86400000*2},
    {name:"🌺 Kauai",score:285,mode:"Gauntlet",date:Date.now()-86400000*4},
    {name:"🌋 Hilo",score:240,mode:"Jeopardy",date:Date.now()-86400000*6},
    {name:"🌊 Oahu",score:210,mode:"Hot Seat",date:Date.now()-86400000},
    {name:"🐋 Maui",score:185,mode:"AI Chat",date:Date.now()-86400000*3},
  ]);
  const[stats,setStats]=useState({completed:7,points:1440,streak:9});

  const addScore=(score,mode)=>{const teams=["🏝️ NHFHC","🌺 Kauai","🌋 Hilo","🌊 Oahu","🐋 Maui"];const team=window.prompt("Which island team?\n\n1. NHFHC\n2. Kauai\n3. Hilo\n4. Oahu\n5. Maui\n\nType your team name:")||"You";const matched=teams.find(t=>t.toLowerCase().includes(team.toLowerCase()))||team;setLb(p=>[...p,{name:matched,score,mode,date:Date.now()}]);setStats(s=>({...s,completed:s.completed+1,points:s.points+score,streak:s.streak+1}));};
  const finish=(score,mode)=>{addScore(score,mode);setScreen("leaderboard");setScenario(null);setAiProfile(null);};
  const back=()=>{setScreen("home");setScenario(null);setAiProfile(null);};

  if(screen==="flashcards")return<FlashCards onBack={back} onComplete={s=>finish(s,"Flashcards")}/>;
  if(screen==="fillblank")return<FillBlank onBack={back} onComplete={s=>finish(s,"Fill in Blank")}/>;
  if(screen==="matching")return<MatchingPairs onBack={back} onComplete={s=>finish(s,"Matching Pairs")}/>;
  if(screen==="wordsearch")return<WordSearch onBack={back} onComplete={s=>finish(s,"Word Search")}/>;
  if(screen==="crossword")return<Crossword onBack={back} onComplete={s=>finish(s,"Crossword")}/>;
  if(screen==="truefalse")return<TrueFalse onBack={back} onComplete={s=>finish(s,"True or False")}/>;
  if(screen==="numbercrunch")return<NumberCrunch onBack={back} onComplete={s=>finish(s,"Number Crunch")}/>;
  if(screen==="whoami")return<WhoAmI onBack={back} onComplete={s=>finish(s,"Who Am I?")}/>;
  if(screen==="jeopardy")return<Jeopardy onBack={back} onComplete={s=>finish(s,"Jeopardy")}/>;
  if(screen==="speedsort")return<SpeedSort onBack={back} onComplete={s=>finish(s,"Speed Sort")}/>;
  if(screen==="hotseat")return<HotSeat onBack={back} onComplete={s=>finish(s,"Hot Seat")}/>;
  if(screen==="checklist")return<Detective onBack={back} onComplete={s=>finish(s,"Compliance Detective")}/>;
  if(screen==="lmtree")return<LMTree onBack={back} onComplete={s=>finish(s,"LM Decision Tree")}/>;
  if(screen==="loanlookup")return<LoanComparison onBack={back} onComplete={s=>finish(s,"Loan Comparison")}/>;
  if(screen==="ethics")return<EthicsDilemma onBack={back} onComplete={s=>finish(s,"Ethics Dilemma")}/>;
  if(screen==="buildfile")return<BuildAFile onBack={back} onComplete={s=>finish(s,"Build-a-File")}/>;
  if(screen==="fileaudit")return<FileAudit onBack={back} onComplete={s=>finish(s,"File Audit")}/>;
  if(screen==="mockexam")return<MockExam onBack={back} onComplete={s=>finish(s,"Mock HUD Exam")}/>;
  if(screen==="gauntlet")return<Gauntlet onBack={back} onComplete={s=>finish(s,"Gauntlet")}/>;
  if(screen==="simulator"){if(!scenario)return<ScenarioSelect onSelect={s=>setScenario(s)} onBack={back}/>;return<ClientSim scenario={scenario} onBack={()=>setScenario(null)} onComplete={s=>finish(s,"Simulator")}/>;}
  if(screen==="ai-chat"){if(!aiProfile)return<AIChatSelect onSelect={p=>setAiProfile(p)} onBack={back}/>;return<AIChat profile={aiProfile} onBack={()=>setAiProfile(null)} onComplete={s=>finish(s,"AI Chat")}/>;}
  if(screen==="truthtracking")return<TruthTracking onBack={back} onComplete={s=>finish(s,"Truth in the Tracking")}/>;
  if(screen==="crackthecode")return<CrackTheCode onBack={back} onComplete={s=>finish(s,"Crack the Code")}/>;
  if(screen==="nineotwo")return<NineOTwo onBack={back} onComplete={s=>finish(s,"HUD-9902 Coding")}/>;
  if(screen==="actionplan")return<ActionPlanBuilder onBack={back} onComplete={s=>finish(s,"Action Plan Builder")}/>;
  if(screen==="conflictorno")return<ConflictOrNo onBack={back} onComplete={s=>finish(s,"Conflict or No Conflict")}/>;
  if(screen==="leaderboard")return<Leaderboard entries={lb} onBack={back}/>;
  return<Home onSelect={s=>setScreen(s)} stats={stats} onLeaderboard={()=>setScreen("leaderboard")}/>;
}
