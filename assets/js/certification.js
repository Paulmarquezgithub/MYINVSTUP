document.addEventListener('DOMContentLoaded', () => {
  // Particle System Initialization
  const createParticles = () => {
      const container = document.getElementById('particles-container');
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.cssText = `
              left: ${Math.random() * 100}%;
              width: ${Math.random() * 4 + 2}px;
              height: ${Math.random() * 4 + 2}px;
              animation-delay: ${Math.random() * 20}s;
              opacity: ${Math.random() * 0.3 + 0.1};
          `;
          container.appendChild(particle);
      }
  };

  // Scroll Animation Handler
  const handleScrollAnimations = () => {
      document.querySelectorAll('.scroll-hide').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) {
              el.classList.add('scroll-show');
          }
      });
  };

  // Header Scroll Effect
  let lastScroll = 0;
  const header = document.querySelector('.glass-header');
  const scrollThreshold = 100;

  const handleHeaderScroll = () => {
      const currentScroll = window.pageYOffset;
      
      if (Math.abs(currentScroll - lastScroll) < scrollThreshold) return;
      
      if (currentScroll > lastScroll) {
          header.classList.add('scroll-down');
          header.classList.remove('scroll-up');
      } else {
          header.classList.remove('scroll-down');
          header.classList.add('scroll-up');
      }
      
      lastScroll = currentScroll;
  };

  // Certification Start Handler
  const startBtn = document.getElementById('start-certification');
  if(startBtn) {
      startBtn.addEventListener('click', () => {
          const confirmation = confirm('You will be redirected to the certification exam. Ready to begin?');
          if(confirmation) {
              window.location.href = 'certificationexam.html';
          }
      });
  }

  // Course Card Interactions
  document.querySelectorAll('.course-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });

      card.addEventListener('mouseleave', () => {
          card.style.removeProperty('--mouse-x');
          card.style.removeProperty('--mouse-y');
      });
  });

  // Intersection Observer for Elements
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if(entry.isIntersecting) {
              entry.target.classList.add('visible');
          }
      });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-title, .course-card, .timeline-step').forEach(el => {
      observer.observe(el);
  });

  // Initialize All Components
  createParticles();
  window.addEventListener('scroll', handleScrollAnimations);
  window.addEventListener('scroll', handleHeaderScroll);
  handleScrollAnimations();
});