/* Accessible navigation and progressive section reveals. */
const nav = document.getElementById('nav');
const menuButton = document.getElementById('ham');
const mobileMenu = document.getElementById('mobNav');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function closeMenu() {
    mobileMenu.classList.remove('open');
    menuButton.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}
menuButton.setAttribute('aria-expanded', 'false');
menuButton.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuButton.classList.toggle('open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
});
document.querySelectorAll('.mnl').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
});

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

const revealItems = document.querySelectorAll('.rev, .rl, .rr, .edu-item');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('on'));
    document.querySelectorAll('.sk-fill[data-w]').forEach(bar => bar.style.width = bar.dataset.w + '%');
} else {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('on');
            entry.target.querySelectorAll('.sk-fill[data-w]').forEach(bar => {
                bar.style.width = bar.dataset.w + '%';
            });
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
}
document.getElementById('year').textContent = new Date().getFullYear();

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 110) current = section.id;
    });
    navLinks.forEach(link => {
        if (link.getAttribute('href') === '#' + current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
}, { passive: true });
