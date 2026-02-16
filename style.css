/* =====================================================
   Woods Garage — Dark Mode (Black Accent Theme)
   ===================================================== */

:root{
  /* Dark surfaces */
  --bg: #0b0b0c;
  --panel: #151516;
  --panel-2: #1b1b1d;
  --border: rgba(255,255,255,0.08);

  /* Text */
  --text: rgba(255,255,255,0.92);
  --muted: rgba(255,255,255,0.70);
  --subtle: rgba(255,255,255,0.55);

  /* Black accent */
  --accent: #1f1f21;
  --accent-2: #2a2a2d;
  --focus: rgba(255,255,255,0.15);

  /* Status */
  --danger: #ff4d4d;

  --radius: 14px;
  --shadow: 0 10px 30px rgba(0,0,0,0.5);
}

/* ---- Base ---- */
*{ box-sizing:border-box; }
html,body{ height:100%; }

body{
  margin:0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: radial-gradient(1200px 700px at 20% -10%, rgba(255,255,255,0.04), transparent 55%),
              radial-gradient(900px 600px at 90% 0%, rgba(255,255,255,0.03), transparent 60%),
              var(--bg);
  color: var(--text);
  line-height: 1.45;
}

/* ---- Header ---- */
header{
  text-align:center;
  padding: 1.6rem 1rem 1.2rem;
  background: linear-gradient(135deg, #111111, #181818);
  border-bottom: 1px solid var(--border);
}

header h1{
  margin: 0.25rem 0 0;
  font-size: 1.7rem;
}

header p{
  margin: 0.5rem 0 0;
  color: var(--muted);
}

/* ---- Layout ---- */
main{ padding: 1rem; }

.container{
  max-width: 980px;
  margin: 1.5rem auto 0;
  padding: 0 1rem;
}

/* ---- Cards ---- */
.card{
  background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
  background-color: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  box-shadow: var(--shadow);
}

.card + .card{ margin-top: 1rem; }

.card.actions{
  display:flex;
  flex-wrap:wrap;
  gap: 0.75rem;
  justify-content:center;
}

/* ---- Vehicle Cards ---- */
.vehicle-list{
  display:flex;
  flex-wrap:wrap;
  gap: 1rem;
  justify-content:center;
}

.vehicle-card{
  width: min(460px, 100%);
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.12s ease;
}

.vehicle-card:hover{
  transform: translateY(-3px);
  border-color: rgba(255,255,255,0.15);
  background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
}

.vehicle-card h2{ margin: 0 0 0.75rem; }

/* ---- Forms ---- */
label{
  display:block;
  font-weight: 650;
  margin-bottom: 0.35rem;
  color: var(--text);
}

input, textarea, select{
  width:100%;
  background: var(--panel-2);
  color: var(--text);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 0.65rem 0.75rem;
  font-size: 1rem;
  outline: none;
}

input::placeholder,
textarea::placeholder{
  color: var(--subtle);
}

input:focus, textarea:focus, select:focus{
  border-color: rgba(255,255,255,0.3);
  box-shadow: 0 0 0 3px var(--focus);
}

/* ---- Buttons ---- */
button{
  appearance:none;
  border: 1px solid rgba(255,255,255,0.15);
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: white;
  font-weight: 700;
  padding: 0.70rem 1.05rem;
  border-radius: 12px;
  cursor:pointer;
  transition: transform 0.08s ease, filter 0.12s ease;
  box-shadow: 0 8px 20px rgba(0,0,0,0.5);
}

button:hover{
  filter: brightness(1.1);
}

button:active{
  transform: translateY(1px);
}

button:disabled{
  opacity: 0.6;
  cursor:not-allowed;
}

/* ---- Lists ---- */
.mlist{
  margin: 0.25rem 0 0 0;
  padding-left: 1.1rem;
}

.mlist li{
  margin: 0.12rem 0;
}

/* ---- Hints & errors ---- */
.hint{ color: var(--muted); }
.error{ color: var(--danger); }

/* ---- Footer ---- */
footer{
  text-align:center;
  padding: 1.25rem 1rem;
  margin-top: 2rem;
  color: var(--muted);
  border-top: 1px solid var(--border);
  background: rgba(255,255,255,0.02);
}

/* ---- Responsive ---- */
@media (max-width: 600px){
  .container{ padding: 0 0.75rem; }
  .vehicle-list{ gap: 0.75rem; }
  button{ width: 100%; }
}
