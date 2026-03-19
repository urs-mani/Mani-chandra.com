
/* ── CANVAS – multi-color particle network ── */
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
const touch = window.matchMedia('(pointer:coarse)').matches;
const N = touch ? 30 : 75;
let W, H;
function rsz() { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; }
rsz(); window.addEventListener('resize', rsz, { passive: true });
const mx = { x: -999, y: -999 };
if (!touch) window.addEventListener('mousemove', e => { mx.x = e.clientX; mx.y = e.clientY; }, { passive: true });
const COLORS = ['rgba(0,200,255,', 'rgba(168,85,247,', 'rgba(255,77,141,', 'rgba(34,211,165,', 'rgba(255,209,102,'];
class Dot {
    constructor() { this.rst(); }
    rst() { this.x = Math.random() * W; this.y = Math.random() * H; this.vx = (Math.random() - .5) * .3; this.vy = (Math.random() - .5) * .3; this.r = Math.random() * 1.4 + .4; this.a = Math.random() * .45 + .1; this.c = COLORS[Math.floor(Math.random() * COLORS.length)]; }
    step() { this.x += this.vx; this.y += this.vy; if (this.x < -8 || this.x > W + 8 || this.y < -8 || this.y > H + 8) this.rst(); }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = this.c + this.a + ')'; ctx.fill(); }
}
const dots = Array.from({ length: N }, () => new Dot());
const D = 130, MD = 150;
function frame() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => { d.step(); d.draw(); });
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y, dist = Math.hypot(dx, dy);
            if (dist < D) { ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.strokeStyle = dots[i].c + (1 - dist / D) * .09 + ')'; ctx.lineWidth = .5; ctx.stroke(); }
        }
        if (!touch) { const dx = dots[i].x - mx.x, dy = dots[i].y - mx.y, dist = Math.hypot(dx, dy); if (dist < MD) { ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(mx.x, mx.y); ctx.strokeStyle = 'rgba(168,85,247,' + (1 - dist / MD) * .25 + ')'; ctx.lineWidth = .8; ctx.stroke(); } }
    }
    requestAnimationFrame(frame);
}
frame();

/* ── CURSOR ── */
if (!touch) {
    const cDot = document.getElementById('cursor'), cTr = document.getElementById('cursor-trail');
    let tx = 0, ty = 0;
    window.addEventListener('mousemove', e => { cDot.style.transform = `translate(${e.clientX - 5}px,${e.clientY - 5}px)`; tx += (e.clientX - 17 - tx) * .14; ty += (e.clientY - 17 - ty) * .14; }, { passive: true });
    (function loop() { requestAnimationFrame(loop); cTr.style.transform = `translate(${tx}px,${ty}px)`; })();
}

/* ── TYPEWRITER ── */
const TXT = 'Mani Chandra', el = document.getElementById('typedName');
let ti = 0;
setTimeout(() => { const t = setInterval(() => { el.textContent += TXT[ti++]; if (ti >= TXT.length) clearInterval(t); }, 72); }, 720);

/* ── NAV SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), { passive: true });

/* ── HAMBURGER ── */
const ham = document.getElementById('ham'), mob = document.getElementById('mobNav');
ham.addEventListener('click', () => {
    const o = mob.classList.toggle('open');
    ham.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
});
document.querySelectorAll('.mnl').forEach(a => a.addEventListener('click', () => { mob.classList.remove('open'); ham.classList.remove('open'); document.body.style.overflow = ''; }));

/* ── SCROLL REVEAL ── */
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const siblings = [...e.target.parentNode.children].filter(c => c.classList.contains(e.target.className.split(' ')[0]));
        const idx = siblings.indexOf(e.target);
        setTimeout(() => {
            e.target.classList.add('on');
            e.target.querySelectorAll('.sk-fill[data-w]').forEach((b, i) => setTimeout(() => b.style.width = b.dataset.w + '%', i * 55 + 150));
        }, Math.min(idx * 75, 350));
        io.unobserve(e.target);
    });
}, { threshold: 0.1 });
document.querySelectorAll('.rev,.rl,.rr,.edu-item').forEach(el => io.observe(el));

/* skill bar triggers for each grid */
['sg1', 'sg2', 'sg3'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll('.sk-fill[data-w]').forEach((b, i) => setTimeout(() => b.style.width = b.dataset.w + '%', i * 52));
        });
    }, { threshold: 0.04 }).observe(el);
});

/* ── COUNTER ── */
document.querySelectorAll('[data-c]').forEach(el => {
    const t = parseInt(el.dataset.c); let c = 0;
    setTimeout(() => { const it = setInterval(() => { c = Math.min(c + 1, t); el.textContent = c; if (c >= t) clearInterval(it); }, 55); }, 1200);
});

/* ── ACTIVE NAV LINK ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop - 100) cur = s.getAttribute('id'); });
    navLinks.forEach(a => { a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--cyan)' : ''; });
}, { passive: true });
