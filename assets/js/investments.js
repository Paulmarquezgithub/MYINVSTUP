document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer pour les animations lors du scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.setAttribute('data-scroll', 'in');
        if (entry.target.classList.contains('investment-card')) {
          entry.target.style.transitionDelay = `${entry.target.dataset.index * 0.1}s`;
        }
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  document.querySelectorAll('.investment-card').forEach((el, index) => {
    el.dataset.index = index;
    observer.observe(el);
  });

  // Parallax simple avec easing
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax);
      const targetY = currentScroll * speed;
      const currentTransform = parseFloat(el.style.transform.replace(/[^\d.-]/g, '')) || 0;
      const smoothY = currentTransform + (targetY - currentTransform) * 0.1;
      el.style.transform = `translateY(${smoothY}px)`;
    });
    
    lastScroll = currentScroll;
  });

  // Gestion du header : s'estompe (disparaît) après le milieu de la fenêtre
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    const scrollThreshold = window.innerHeight / 2;
    if (window.scrollY > scrollThreshold) {
      header.style.opacity = "0";
    } else {
      header.style.opacity = "1";
    }
  });

  // Effet 3D au survol des cartes
  document.querySelectorAll('.investment-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.transform = `
        perspective(1000px)
        rotateX(${(y - rect.height / 2) / 15}deg)
        rotateY(${-(x - rect.width / 2) / 15}deg)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
});