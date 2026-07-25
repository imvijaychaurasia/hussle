(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.side-nav a');

  if (path === 'about.html') {
    navLinks.forEach((a) => {
      if (a.getAttribute('href') === 'about.html') a.classList.add('active');
    });
    return;
  }

  const sectionLinks = document.querySelectorAll('.side-nav a[data-section]');
  const sections = document.querySelectorAll('section[id]');

  if (!('IntersectionObserver' in window) || !sections.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        sectionLinks.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('data-section') === id);
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((sec) => obs.observe(sec));
})();
