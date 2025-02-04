document.addEventListener('DOMContentLoaded', () => {
  // Enhanced Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.setAttribute('data-scroll', 'in');
        
        // Add staggered animations
        if(entry.target.classList.contains('investment-card')) {
          entry.target.style.transitionDelay = `${entry.target.dataset.index * 0.1}s`;
        }
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Add index to cards for staggered animation
  document.querySelectorAll('.investment-card').forEach((el, index) => {
    el.dataset.index = index;
    observer.observe(el);
  });

  // Enhanced Parallax with Smoothing
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const scrollDelta = currentScroll - lastScroll;
    
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax);
      const currentY = parseFloat(el.style.transform.split('(')[1] || 0);
      const targetY = currentScroll * speed;
      const smoothY = currentY + (targetY - currentY) * 0.1;
      
      el.style.transform = `translateY(${smoothY}px)`;
    });
    
    lastScroll = currentScroll;
  });

  // Dynamic Header Scaling
  const header = document.querySelector('header');
  const logo = document.querySelector('.logo');
  
  window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / 300;
    const scale = Math.max(0.8, 1 - scrollPercent * 0.1);
    const opacity = Math.max(0.7, 1 - scrollPercent);
    
    logo.style.transform = `scale(${scale})`;
    header.style.background = `rgba(10, 14, 23, ${Math.min(0.8, scrollPercent)})`;
  });

  // 3D Hover Effect for Cards
  document.querySelectorAll('.investment-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.transform = `
        perspective(1000px)
        rotateX(${(y - rect.height/2) / 15}deg)
        rotateY(${-(x - rect.width/2) / 15}deg)
      `;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
});