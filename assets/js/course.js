// assets/js/course-effects.js

document.addEventListener('DOMContentLoaded', function() {
    const faders = document.querySelectorAll('.fade-in');
  
    const appearOptions = {
      threshold: 0.5,
      rootMargin: "0px 0px -50px 0px"
    };
  
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    }, appearOptions);
  
    faders.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  });