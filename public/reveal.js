function initReveal(selector) {
  const items = document.querySelectorAll(selector || '.reveal:not(.in-view)');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in-view'));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => initReveal());
