'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { animate, createScope, stagger, svg } from 'animejs';

// Twelve small, animated views that each answer one question a principal or
// administrator asks, and state the decision the answer supports. PREVIEW ONLY.
// Figures are illustrative.

const BRAND = '#026dde';
const AMBER = '#f59e0b';
const RED = '#ef4444';
const GREEN = '#10b981';
const INK = '#0f2a4a';
const MUTED = '#8a96a8';

type Setup = (root: HTMLElement) => void;

// Replays a set of animations every `period` ms, rebuilding the scope each time.
function useLoop(setup: Setup, period = 9000) {
  const ref = useRef<HTMLDivElement>(null);
  const setupRef = useRef(setup);

  useEffect(() => {
    setupRef.current = setup;
  }, [setup]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const play = () => createScope({ root }).add(() => setupRef.current(root));
    let scope = play();
    const id = window.setInterval(() => {
      scope.revert();
      scope = play();
    }, period);
    return () => {
      window.clearInterval(id);
      scope.revert();
    };
  }, [period]);

  return ref;
}

function countUp(el: Element | null, to: number, format: (v: number) => string, delay = 0, duration = 1200) {
  if (!el) return;
  const c = { v: 0 };
  animate(c, {
    v: to,
    duration,
    delay,
    ease: 'outExpo',
    onUpdate: () => {
      el.textContent = format(c.v);
    },
  });
}

function Card({ n, question, decision, tone, children, svgRef }: { n: number; question: string; decision: string; tone: string; children: ReactNode; svgRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <article className="flex flex-col rounded-2xl border border-[#dbe4f0] bg-white p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#026dde]">{String(n).padStart(2, '0')}</p>
      <h3 className="mt-1 text-base font-bold text-[#0f2a4a]">{question}</h3>
      <div ref={svgRef} className="mt-3 flex-1">
        {children}
      </div>
      <p className="mt-3 border-t border-[#eef2f8] pt-3 text-sm font-semibold" style={{ color: tone }}>
        Decision: {decision}
      </p>
    </article>
  );
}

const VB = '0 0 360 200';

// 01 — Are fees on target?
function FeesVsTarget({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate('.band', { opacity: [0, 0.25], duration: 700, delay: 300 });
    animate(svg.createDrawable(root.querySelectorAll('.actual')), { draw: ['0 0', '0 1'], duration: 1400, ease: 'inOutSine' });
    countUp(root.querySelector('.val'), 18.4, (v) => `₹${v.toFixed(1)}L`, 200);
  });
  const yOf = (v: number) => 170 - (v - 15) * 36;
  const pts = [15.2, 15.9, 16.6, 16.4, 17.0, 17.5, 18.0, 18.4].map((v, i) => `${30 + i * 44},${yOf(v)}`).join(' ');
  return (
    <Card n={n} question="Are fees on target?" decision="On track — ₹1.0L ahead of target" tone={GREEN} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        <text x="30" y="24" fill={MUTED} fontSize="11">Collected this month</text>
        <text className="val" x="30" y="48" fill={INK} fontSize="26" fontWeight="800">₹0.0L</text>
        <rect className="band" x="26" y={yOf(17.4) - 6} width="312" height="12" fill={AMBER} opacity="0" />
        <line x1="26" x2="338" y1={yOf(17.4)} y2={yOf(17.4)} stroke={AMBER} strokeDasharray="4 4" />
        <polyline className="actual" points={pts} fill="none" stroke={BRAND} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <text x="338" y={yOf(17.4) - 6} textAnchor="end" fill={AMBER} fontSize="10" fontWeight="700">Target ₹17.4L</text>
      </svg>
    </Card>
  );
}

// 02 — Who needs escalation?
function DefaultersByAge({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate(root.querySelectorAll('.grow'), { scaleY: [0, 1], duration: 900, delay: stagger(160, { start: 200 }), ease: 'outExpo' });
    countUp(root.querySelector('.total'), 100, (v) => `${Math.round(v)} families`, 200);
  });
  const bars = [
    { x: 40, h: 92, c: AMBER, label: '0–30 days', v: '62' },
    { x: 150, h: 44, c: '#f97316', label: '31–60 days', v: '21' },
    { x: 260, h: 36, c: RED, label: '60+ days', v: '17' },
  ];
  return (
    <Card n={n} question="Who needs escalation?" decision="Escalate the 17 families over 60 days" tone={RED} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        <text x="30" y="24" fill={MUTED} fontSize="11">Overdue fee accounts</text>
        <text className="total" x="30" y="46" fill={INK} fontSize="22" fontWeight="800">100 families</text>
        {bars.map((b) => (
          <g key={b.label}>
            <rect className="grow" x={b.x} y={170 - b.h} width="80" height={b.h} rx="6" fill={b.c} style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }} />
            <text x={b.x + 40} y={170 - b.h - 6} textAnchor="middle" fill={INK} fontSize="13" fontWeight="800">{b.v}</text>
            <text x={b.x + 40} y="188" textAnchor="middle" fill={MUTED} fontSize="10.5">{b.label}</text>
          </g>
        ))}
      </svg>
    </Card>
  );
}

// 03 — Which classes are slipping on attendance?
function AttendanceHeatmap({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate(root.querySelectorAll('.cell'), { opacity: [0, 1], scale: [0.6, 1], duration: 500, delay: stagger(45, { from: 'first' }), ease: 'outBack' });
    animate(root.querySelectorAll('.low'), { opacity: [1, 0.35, 1], duration: 1200, delay: 1400, loop: true, ease: 'inOutSine' });
  });
  const classes = ['6A', '6B', '7A', '7B', '8A', '8B'];
  const rows = ['Mon', 'Tue', 'Wed', 'Thu'];
  const data = rows.map((_, r) => classes.map((_, c) => 88 + ((r * 7 + c * 5) % 12)));
  const colour = (v: number) => (v >= 95 ? GREEN : v >= 90 ? AMBER : RED);
  return (
    <Card n={n} question="Which classes are slipping?" decision="Check Class 6B — 84% on Wednesday" tone={RED} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        {rows.map((day, r) => (
          <text key={day} x="8" y={64 + r * 34} fill={MUTED} fontSize="10">{day}</text>
        ))}
        {classes.map((cl, c) => (
          <text key={cl} x={58 + c * 50} y="36" textAnchor="middle" fill={INK} fontSize="11" fontWeight="700">{cl}</text>
        ))}
        {data.map((row, r) =>
          row.map((v, c) => (
            <g key={`${r}-${c}`}>
              <rect className={`cell ${v < 90 ? 'low' : ''}`} x={36 + c * 50} y={46 + r * 34} width="44" height="28" rx="6" fill={colour(v)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
              <text x={58 + c * 50} y={64 + r * 34} textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="700">{v}%</text>
            </g>
          )),
        )}
      </svg>
    </Card>
  );
}

// 04 — Where do we lose admissions?
function AdmissionsFunnel({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate(root.querySelectorAll('.stage'), { scaleX: [0, 1], duration: 800, delay: stagger(180, { start: 150 }), ease: 'outExpo' });
  });
  const stages = [
    { w: 300, c: BRAND, label: 'Enquiries', v: '620', drop: '' },
    { w: 230, c: '#2d7fe0', label: 'Applied', v: '410', drop: '−34%' },
    { w: 170, c: AMBER, label: 'Verified', v: '290', drop: '−29%' },
    { w: 110, c: GREEN, label: 'Enrolled', v: '205', drop: '−29%' },
  ];
  return (
    <Card n={n} question="Where do we lose admissions?" decision="Follow up 120 applications awaiting verification" tone={AMBER} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        {stages.map((s, i) => {
          const y = 14 + i * 44;
          const x = 180 - s.w / 2;
          return (
            <g key={s.label}>
              <rect className="stage" x={x} y={y} width={s.w} height="34" rx="8" fill={s.c} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
              <text x="180" y={y + 22} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">{s.label} · {s.v}</text>
              {s.drop && <text x="352" y={y + 22} textAnchor="end" fill={RED} fontSize="10.5" fontWeight="700">{s.drop}</text>}
            </g>
          );
        })}
      </svg>
    </Card>
  );
}

// 05 — Which enquiry source earns its budget?
function EnquirySources({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate(root.querySelectorAll('.src-bar'), { scaleX: [0, 1], duration: 900, delay: stagger(120, { start: 200 }), ease: 'outExpo' });
    animate(root.querySelectorAll('.src'), { translateY: [0, 0], duration: 1, delay: 0 });
  });
  const sources = [
    { label: 'Referrals', pct: 34, c: GREEN },
    { label: 'Website', pct: 26, c: BRAND },
    { label: 'Walk-ins', pct: 22, c: AMBER },
    { label: 'Ads', pct: 18, c: RED },
  ];
  return (
    <Card n={n} question="Which source converts best?" decision="Shift ad budget to referrals (34% of enrolments)" tone={GREEN} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        {sources.map((s, i) => {
          const y = 24 + i * 40;
          return (
            <g key={s.label} className="src">
              <text x="30" y={y + 14} fill={INK} fontSize="12" fontWeight="600">{s.label}</text>
              <rect x="120" y={y} width="200" height="18" rx="9" fill="#eef2f8" />
              <rect className="src-bar" x="120" y={y} width={(200 * s.pct) / 40} height="18" rx="9" fill={s.c} style={{ transformBox: 'fill-box', transformOrigin: 'left center' }} />
              <text x="330" y={y + 14} textAnchor="end" fill={INK} fontSize="12" fontWeight="800">{s.pct}%</text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}

// 06 — Who is overloaded?
function TeacherWorkload({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate(root.querySelectorAll('.load'), { scaleY: [0, 1], duration: 900, delay: stagger(110, { start: 200 }), ease: 'outExpo' });
    animate(root.querySelectorAll('.over'), { fill: [AMBER, RED, AMBER], duration: 1400, delay: 1200, loop: true, ease: 'inOutSine' });
  });
  const teachers = [
    { name: 'Asha', hrs: 22, over: false },
    { name: 'Ravi', hrs: 27, over: true },
    { name: 'Meena', hrs: 20, over: false },
    { name: 'Vikram', hrs: 25, over: false },
    { name: 'Priya', hrs: 28, over: true },
  ];
  const capY = 170 - (24 / 30) * 130;
  return (
    <Card n={n} question="Who is overloaded?" decision="Rebalance Science — two teachers over capacity" tone={RED} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        <text x="30" y="24" fill={MUTED} fontSize="11">Teaching hours per week (capacity 24)</text>
        <line x1="24" x2="340" y1={capY} y2={capY} stroke={INK} strokeDasharray="4 4" />
        {teachers.map((t, i) => {
          const h = (t.hrs / 30) * 130;
          const x = 40 + i * 62;
          return (
            <g key={t.name}>
              <rect className={`load ${t.over ? 'over' : ''}`} x={x} y={170 - h} width="40" height={h} rx="6" fill={t.over ? RED : BRAND} style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }} />
              <text x={x + 20} y={170 - h - 6} textAnchor="middle" fill={INK} fontSize="11" fontWeight="800">{t.hrs}</text>
              <text x={x + 20} y="186" textAnchor="middle" fill={MUTED} fontSize="10">{t.name}</text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
}

// 07 — Are buses on time?
function BusPunctuality({ n }: { n: number }) {
  const ref = useLoop((root) => {
    const buses = root.querySelectorAll('.bus');
    animate(buses, { translateX: [0, 290], duration: 3200, delay: stagger(180), ease: 'linear', loop: true });
    animate(root.querySelectorAll('.late'), { opacity: [1, 0.2, 1], duration: 700, loop: true, ease: 'inOutSine' });
  });
  const routes = [
    { y: 62, late: false, label: 'Route 1' },
    { y: 102, late: false, label: 'Route 2' },
    { y: 142, late: true, label: 'Route 3 · +25 min' },
  ];
  return (
    <Card n={n} question="Are buses on time?" decision="Reassign Bus 7 on Route 3" tone={RED} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        {routes.map((r) => (
          <g key={r.label}>
            <line x1="30" x2="330" y1={r.y} y2={r.y} stroke="#dbe4f0" strokeWidth="6" strokeLinecap="round" />
            <circle cx="330" cy={r.y} r="6" fill={INK} />
            <text x="30" y={r.y - 10} fill={r.late ? RED : MUTED} fontSize="10.5" fontWeight="700">{r.label}</text>
            <rect className={`bus ${r.late ? 'late' : ''}`} x="30" y={r.y - 6} width="26" height="12" rx="3" fill={r.late ? RED : BRAND} />
          </g>
        ))}
        <text x="30" y="186" fill={MUTED} fontSize="10.5">Ontime 14 of 16 buses</text>
      </svg>
    </Card>
  );
}

// 08 — Are results healthy?
function ExamDistribution({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate(root.querySelectorAll('.bin'), { scaleY: [0, 1], duration: 900, delay: stagger(90, { start: 200 }), ease: 'outExpo' });
    countUp(root.querySelector('.pass'), 86, (v) => `${Math.round(v)}% pass`, 300);
  });
  const bins = [4, 9, 18, 26, 22, 12, 6];
  const passLine = 30 + 3 * 42;
  return (
    <Card n={n} question="Are results healthy?" decision="Re-teach Maths — 14% of pupils below pass" tone={AMBER} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        <text className="pass" x="30" y="30" fill={INK} fontSize="22" fontWeight="800">0% pass</text>
        <text x="30" y="46" fill={MUTED} fontSize="11">Marks distribution, Maths</text>
        {bins.map((b, i) => (
          <rect key={i} className="bin" x={30 + i * 42} y={170 - b * 4} width="34" height={b * 4} rx="5" fill={i < 3 ? AMBER : BRAND} style={{ transformBox: 'fill-box', transformOrigin: 'bottom center' }} />
        ))}
        <line x1={passLine} x2={passLine} y1="60" y2="170" stroke={RED} strokeDasharray="4 4" />
        <text x={passLine + 4} y="74" fill={RED} fontSize="10.5" fontWeight="700">Pass 40</text>
      </svg>
    </Card>
  );
}

// 09 — Are we within budget?
function BudgetDonut({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate(root.querySelectorAll('.seg'), { strokeDashoffset: [314, 0], duration: 1100, delay: stagger(160, { start: 150 }), ease: 'outExpo' });
    countUp(root.querySelector('.over-pct'), 6, (v) => `+${v.toFixed(0)}%`, 500);
  });
  const C = 2 * Math.PI * 50;
  const parts = [
    { len: C * 0.38, c: BRAND, rot: -90 },
    { len: C * 0.27, c: GREEN, rot: -90 + 137 },
    { len: C * 0.2, c: AMBER, rot: -90 + 234 },
    { len: C * 0.15, c: RED, rot: -90 + 306 },
  ];
  return (
    <Card n={n} question="Are we within budget?" decision="Transport is 6% over budget — review routes" tone={RED} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        <g transform="translate(90 100)">
          <circle r="50" fill="none" stroke="#eef2f8" strokeWidth="14" />
          {parts.map((p, i) => (
            <circle
              key={i}
              className="seg"
              r="50"
              fill="none"
              stroke={p.c}
              strokeWidth="14"
              strokeDasharray={`${p.len} ${C}`}
              strokeDashoffset="0"
              transform={`rotate(${p.rot})`}
            />
          ))}
        </g>
        <text className="over-pct" x="90" y="108" textAnchor="middle" fill={RED} fontSize="16" fontWeight="800">+0%</text>
        {['Transport', 'Salaries', 'Labs', 'Other'].map((l, i) => (
          <g key={l}>
            <rect x="170" y={62 + i * 26} width="10" height="10" rx="2" fill={parts[i].c} />
            <text x="188" y={71 + i * 26} fill={INK} fontSize="12">{l}</text>
          </g>
        ))}
      </svg>
    </Card>
  );
}

// 10 — Did parents receive the notice?
function MessageReach({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate(svg.createDrawable(root.querySelectorAll('.ring')), { draw: ['0 0', '0 1'], duration: 1300, ease: 'outExpo' });
    countUp(root.querySelector('.delivered'), 94, (v) => `${Math.round(v)}%`, 200);
    countUp(root.querySelector('.read'), 71, (v) => `${Math.round(v)}% read`, 400);
  });
  const C = 2 * Math.PI * 46;
  return (
    <Card n={n} question="Did parents receive the notice?" decision="Re-send to 212 families who have not read it" tone={AMBER} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        <g transform="translate(92 100) rotate(-90)">
          <circle r="46" fill="none" stroke="#eef2f8" strokeWidth="12" />
          <circle className="ring" r="46" fill="none" stroke={GREEN} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${C} ${C}`} />
        </g>
        <text className="delivered" x="92" y="108" textAnchor="middle" fill={INK} fontSize="20" fontWeight="800">0%</text>
        <text x="92" y="124" textAnchor="middle" fill={MUTED} fontSize="10">delivered</text>
        <text x="200" y="88" fill={INK} fontSize="13" fontWeight="700">1,840 families</text>
        <text className="read" x="200" y="112" fill={BRAND} fontSize="22" fontWeight="800">0% read</text>
        <text x="200" y="132" fill={MUTED} fontSize="11">WhatsApp, Mar notice</text>
      </svg>
    </Card>
  );
}

// 11 — Will we fall short next term?
function CashForecast({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate(svg.createDrawable(root.querySelectorAll('.fc')), { draw: ['0 0', '0 1'], duration: 1500, ease: 'inOutSine' });
    animate(root.querySelectorAll('.band-f'), { opacity: [0, 0.2], duration: 800, delay: 1200 });
  });
  const actual = [40, 48, 44, 60, 58];
  const fc = [58, 62, 54, 48];
  const toY = (v: number) => 170 - (v - 30) * 2.2;
  const actualPts = actual.map((v, i) => `${30 + i * 60},${toY(v)}`).join(' ');
  const fcPts = [`${30 + 4 * 60},${toY(actual[4])}`, ...fc.map((v, i) => `${30 + (5 + i) * 60},${toY(v)}`)].join(' ');
  return (
    <Card n={n} question="Will we fall short next term?" decision="Plan for a ₹2.1L shortfall in March" tone={RED} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        <text x="30" y="24" fill={MUTED} fontSize="11">Cash position (₹ lakh) — actual and forecast</text>
        <line x1="30" x2="330" y1={toY(40)} y2={toY(40)} stroke={RED} strokeDasharray="4 4" />
        <text x="330" y={toY(40) - 5} textAnchor="end" fill={RED} fontSize="10">Minimum ₹40L</text>
        <polyline points={actualPts} fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <polygon className="band-f" points={`${fcPts} 330,${toY(42)} 270,${toY(actual[4])}`} fill={RED} opacity="0" />
        <polyline className="fc" points={fcPts} fill="none" stroke={RED} strokeWidth="3" strokeDasharray="6 5" strokeLinejoin="round" />
      </svg>
    </Card>
  );
}

// 12 — What needs my approval?
function ApprovalQueue({ n }: { n: number }) {
  const ref = useLoop((root) => {
    animate(root.querySelectorAll('.task'), { translateX: [28, 0], opacity: [0, 1], duration: 600, delay: stagger(220, { start: 150 }), ease: 'outExpo' });
    animate(root.querySelectorAll('.tick'), { scale: [0, 1], duration: 400, delay: stagger(300, { start: 1400 }), ease: 'outBack' });
    countUp(root.querySelector('.queue'), 3, (v) => `${Math.round(v)} waiting`, 150, 800);
  });
  const tasks = ['Fee waiver — 2 students', 'Transport route change', 'Teacher leave — 14 Nov'];
  return (
    <Card n={n} question="What needs my approval?" decision="Approve the three items waiting now" tone={BRAND} svgRef={ref}>
      <svg viewBox={VB} className="h-auto w-full">
        <text className="queue" x="30" y="30" fill={INK} fontSize="22" fontWeight="800">0 waiting</text>
        {tasks.map((t, i) => (
          <g key={t} className="task" style={{ opacity: 0 }}>
            <rect x="30" y={52 + i * 42} width="300" height="34" rx="10" fill="#f4f8fd" stroke="#dbe4f0" />
            <text x="46" y={74 + i * 42} fill={INK} fontSize="12.5" fontWeight="600">{t}</text>
            <circle className="tick" cx="312" cy={69 + i * 42} r="10" fill={GREEN} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
            <text className="tick" x="312" y={73 + i * 42} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800">✓</text>
          </g>
        ))}
      </svg>
    </Card>
  );
}

export function DecisionCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <FeesVsTarget n={1} />
      <DefaultersByAge n={2} />
      <AttendanceHeatmap n={3} />
      <AdmissionsFunnel n={4} />
      <EnquirySources n={5} />
      <TeacherWorkload n={6} />
      <BusPunctuality n={7} />
      <ExamDistribution n={8} />
      <BudgetDonut n={9} />
      <MessageReach n={10} />
      <CashForecast n={11} />
      <ApprovalQueue n={12} />
    </div>
  );
}
