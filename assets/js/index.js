// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  // Mobile Menu Toggle (optional, for responsiveness)
  const nav = document.querySelector('nav');
  const header = document.querySelector('header');
  const menuToggle = document.createElement('button');
  menuToggle.textContent = 'Menu';
  menuToggle.style.display = 'none'; // Hidden by default
  
  // Show toggle button only on smaller screens
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      menuToggle.style.display = 'block';
      nav.style.display = 'none'; // Initially hide the nav
    } else {
      menuToggle.style.display = 'none';
      nav.style.display = 'block'; // Show nav on larger screens
    }
  });
  
  // Toggle navigation on button click
  menuToggle.addEventListener('click', () => {
    if (nav.style.display === 'block') {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'block';
    }
  });
  
  // Append menu toggle button to the header
  header.appendChild(menuToggle);
  
  // Contact Form Validation (if you add a form)
  const contactForm = document.querySelector('#contact form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const messageInput = this.querySelector('textarea');
  
      if (!emailInput.value || !emailInput.value.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
  
      if (!messageInput.value.trim()) {
        alert('Please enter a message.');
        return;
      }
  
      alert('Thank you for your message! We will get back to you shortly.');
      this.reset(); // Clear form fields
    });
  }
  
  // Scroll to Top Button (optional enhancement)
  const scrollToTopButton = document.createElement('button');
  scrollToTopButton.textContent = '↑';
  scrollToTopButton.style.position = 'fixed';
  scrollToTopButton.style.bottom = '20px';
  scrollToTopButton.style.right = '20px';
  scrollToTopButton.style.padding = '10px';
  scrollToTopButton.style.display = 'none'; // Hidden by default
  scrollToTopButton.style.backgroundColor = '#007bff';
  scrollToTopButton.style.color = '#fff';
  scrollToTopButton.style.border = 'none';
  scrollToTopButton.style.borderRadius = '5px';
  scrollToTopButton.style.cursor = 'pointer';
  
  // Show/Hide Scroll to Top Button on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopButton.style.display = 'block';
    } else {
      scrollToTopButton.style.display = 'none';
    }
  });
  
  // Scroll to Top on Button Click
  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  // Append the Scroll to Top Button to the Body
  document.body.appendChild(scrollToTopButton);
  