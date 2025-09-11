document.addEventListener('DOMContentLoaded', () => {
  // Debounce utility function for scroll performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Utility function to ensure hero content is visible
  function ensureHeroVisibility() {
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image-wrapper');
    const techIcons = document.querySelectorAll('.tech-icons .icon');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (heroContent) {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
      heroContent.style.visibility = 'visible';
    }
    if (heroImage) {
      heroImage.style.opacity = '1';
      heroImage.style.transform = 'scale(1)';
      heroImage.style.visibility = 'visible';
    }
    if (scrollIndicator) {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.transform = 'translateY(0)';
      scrollIndicator.style.visibility = 'visible';
    }
    techIcons.forEach(icon => {
      icon.style.opacity = '1';
      icon.style.visibility = 'visible';
      icon.style.transform = 'scale(1)';
    });
    console.log('Hero visibility ensured');
  }

  // Preloader with improved hero content safety
  const preloader = document.querySelector('.preloader');
  const percentageText = document.querySelector('.preloader-percentage');
  const progressBar = document.querySelector('.preloader-progress');
  
  // If no preloader exists, ensure hero is visible immediately
  if (!preloader) {
    setTimeout(ensureHeroVisibility, 100);
  } else {
    const minDisplayTime = 3000; // 3 seconds minimum display
    const fadeOutDuration = 800; // 0.8 second fade out
    let pageLoaded = false;
    let minTimeElapsed = false;
    let progress = 0;
    const targetProgress = 100;
    const increment = 1.5; // Smoother increment for progress
    const intervalTime = 50; // Faster updates for smoother animation
    const startTime = performance.now();

    if (percentageText && progressBar) {
      // Simulate smooth progress
      const progressInterval = setInterval(() => {
        if (progress < targetProgress) {
          progress = Math.min(progress + increment, targetProgress);
          percentageText.textContent = `${Math.round(progress)}%`;
          progressBar.style.width = `${progress}%`;
        } else {
          clearInterval(progressInterval);
        }
      }, intervalTime);

      // Start minimum display timer
      setTimeout(() => {
        minTimeElapsed = true;
        if (pageLoaded) hidePreloader();
      }, minDisplayTime);

      // Hide when page is loaded
      window.addEventListener('load', () => {
        pageLoaded = true;
        clearInterval(progressInterval);
        progress = targetProgress;
        percentageText.textContent = `${targetProgress}%`;
        progressBar.style.width = '100%';

        if (minTimeElapsed) {
          hidePreloader();
        } else {
          setTimeout(hidePreloader, minDisplayTime - (performance.now() - startTime));
        }
      });

      // Emergency fallback - always hide preloader after maximum time
      setTimeout(() => {
        if (preloader && preloader.style.visibility !== 'hidden') {
          console.log('Emergency fallback: Hiding preloader and ensuring hero visibility');
          clearInterval(progressInterval);
          hidePreloader();
        }
      }, minDisplayTime + 3000); // 6 seconds total maximum
    }

    function hidePreloader() {
      if (typeof gsap !== 'undefined') {
        gsap.to(preloader, {
          opacity: 0,
          duration: fadeOutDuration / 1000,
          ease: 'power2.out',
          onComplete: () => {
            preloader.style.visibility = 'hidden';
            preloader.style.display = 'none';
            document.dispatchEvent(new Event('preloaderHidden'));
          }
        });
      } else {
        // Fallback if GSAP is not available
        preloader.classList.add('loaded');
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
          setTimeout(() => {
            preloader.style.display = 'none';
            document.dispatchEvent(new Event('preloaderHidden'));
          }, fadeOutDuration);
        }, 300);
      }
    }

    // Additional safety net: Ensure hero content is visible after a delay
    setTimeout(() => {
      if (preloader && preloader.style.visibility !== 'hidden') {
        ensureHeroVisibility();
      }
    }, 2000);

    // Listen for preloader hidden event and ensure hero visibility
    document.addEventListener('preloaderHidden', () => {
      setTimeout(ensureHeroVisibility, 50);
    });
  }

  // Particles.js initialization
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: ['#327ffc', '#0b42da', '#60a5fa'] },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#60a5fa', opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  // Typed.js for hero subtitle
  if (document.querySelector('.typing-text')) {
    new Typed('.typing-text', {
      strings: ['Full Stack Developer', 'AI Enthusiast', 'Web Architect', 'Problem Solver'],
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 1500,
      loop: true
    });
  }

  // Splide.js for sliders
  if (document.querySelector('.splide')) {
    new Splide('.splide', {
      type: 'loop',
      perPage: 1,
      autoplay: true,
      interval: 5000,
      pauseOnHover: true,
      arrows: true,
      pagination: true,
      gap: '1rem',
      breakpoints: {
        767: {
          perPage: 1,
          gap: '0.5rem'
        }
      }
    }).mount();
  }

  // GSAP Animations - Fixed version
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial states for hero elements to prevent flash of content
    gsap.set('.hero-content', { opacity: 0, y: 50 });
    gsap.set('.hero-image-wrapper', { opacity: 0, scale: 0.8 });
    gsap.set('.tech-icons .icon', { opacity: 0, scale: 0, visibility: 'hidden' });
    gsap.set('.scroll-indicator', { opacity: 0, y: 20 });

    // Function to animate hero content
    function animateHeroContent() {
      console.log('Starting hero animations');
      
      // Animate hero content
      gsap.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      });

      // Animate hero image
      gsap.to('.hero-image-wrapper', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      });

      // Animate tech icons
      gsap.to('.tech-icons .icon', {
        opacity: 1,
        scale: 1,
        visibility: 'visible',
        duration: 0.5,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        delay: 0.4
      });

      // Animate scroll indicator
      gsap.to('.scroll-indicator', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
      });
    }

    // Listen for preloader hidden event
    document.addEventListener('preloaderHidden', () => {
      // Small delay to ensure DOM is ready
      setTimeout(animateHeroContent, 100);
    });

    // Fallback: If preloader doesn't exist or event doesn't fire
    if (!document.querySelector('.preloader')) {
      // If no preloader, animate immediately when DOM is ready
      setTimeout(animateHeroContent, 500);
    }

    // Fallback timeout in case preloader event doesn't fire
    setTimeout(() => {
      const heroContent = document.querySelector('.hero-content');
      if (heroContent && parseFloat(getComputedStyle(heroContent).opacity) === 0) {
        console.log('Fallback: Animating hero content');
        animateHeroContent();
      }
    }, 5000);

    // Other section animations
    gsap.utils.toArray(['.about-section', '.skills-section', '.projects-section', '.experience-section', '.contact-section']).forEach(section => {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.project-card').forEach(card => {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.timeline-item').forEach(item => {
      gsap.from(item, {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
  } else {
    // Fallback if GSAP is not available - ensure content is visible
    console.log('GSAP not available, ensuring content visibility');
    setTimeout(ensureHeroVisibility, 100);
  }

  // Additional safety net - ensure hero is visible after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const heroContent = document.querySelector('.hero-content');
      if (heroContent && parseFloat(getComputedStyle(heroContent).opacity) < 1) {
        console.log('Load event: Ensuring hero visibility');
        ensureHeroVisibility();
      }
    }, 1000);
  });

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleNavbarScroll = debounce(() => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, 10);
    
    window.addEventListener('scroll', handleNavbarScroll);
  }

  // Nav link active state handling
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });

    if (window.scrollY < sections[0].offsetTop - 100) {
      navLinks.forEach(link => link.classList.remove('active'));
      const homeLink = document.querySelector('.nav-link[href="#hero"]');
      if (homeLink) homeLink.classList.add('active');
    }
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

  // Initialize Bootstrap ScrollSpy
  if (typeof bootstrap !== 'undefined') {
    try {
      new bootstrap.ScrollSpy(document.body, {
        target: '#navbar',
        offset: 100,
        method: 'auto'
      });
    } catch (error) {
      console.log('Bootstrap ScrollSpy initialization failed:', error);
    }
  }

  // Navbar toggler animation
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarLines = document.querySelectorAll('.navbar-toggler .line');
  if (navbarToggler && navbarLines.length) {
    navbarToggler.addEventListener('click', () => {
      const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
      navbarLines.forEach((line, index) => {
        if (index === 0) {
          line.style.transform = isExpanded ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        } else if (index === 1) {
          line.style.opacity = isExpanded ? '0' : '1';
        } else if (index === 2) {
          line.style.transform = isExpanded ? 'rotate(-45deg) translate(7px, -7px)' : 'none';
        }
      });
    });
  }

  // Back to Top Button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const handleBackToTopVisibility = debounce(() => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, 100);
    
    window.addEventListener('scroll', handleBackToTopVisibility);
  }

  // Smooth scrolling for other anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (!anchor.classList.contains('nav-link')) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    }
  });

  // Project filter with improved animation
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const filter = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
              );
            } else {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }
          } else {
            if (typeof gsap !== 'undefined') {
              gsap.to(card, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                  card.style.display = 'none';
                }
              });
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  }

  // About Section Tab Switching
  const tabLinks = document.querySelectorAll('.about-tabs .nav-link');
  const tabPanes = document.querySelectorAll('.tab-content .tab-pane');

  if (tabLinks.length && tabPanes.length) {
    // Initialize Bootstrap tabs if available
    if (typeof bootstrap !== 'undefined') {
      try {
        tabLinks.forEach(link => {
          link.setAttribute('data-bs-toggle', 'tab');
          link.setAttribute('role', 'tab');
        });
        tabPanes.forEach(pane => {
          pane.setAttribute('role', 'tabpanel');
        });
        new bootstrap.Tab(document.querySelector('.about-tabs .nav-link.active') || tabLinks[0]);
      } catch (error) {
        console.log('Bootstrap tabs initialization failed:', error);
      }
    }

    // Custom tab switching
    tabLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Deactivate all tabs and panes
        tabLinks.forEach(tab => {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        });
        tabPanes.forEach(pane => {
          pane.classList.remove('show', 'active');
          pane.style.display = 'none';
        });

        // Activate clicked tab
        link.classList.add('active');
        link.setAttribute('aria-selected', 'true');

        // Show corresponding pane
        const targetPaneId = link.getAttribute('href')?.substring(1) || link.getAttribute('data-bs-target')?.substring(1);
        const targetPane = document.getElementById(targetPaneId);
        if (targetPane) {
          targetPane.classList.add('show', 'active');
          targetPane.style.display = 'block';
          
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(targetPane, 
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
          } else {
            targetPane.style.opacity = '1';
            targetPane.style.transform = 'translateY(0)';
          }
        }
      });
    });

    // Initialize first tab
    let activeTab = document.querySelector('.about-tabs .nav-link.active');
    if (!activeTab && tabLinks.length > 0) {
      activeTab = tabLinks[0];
      activeTab.classList.add('active');
      activeTab.setAttribute('aria-selected', 'true');
    }
    if (activeTab) {
      const firstPaneId = activeTab.getAttribute('href')?.substring(1) || activeTab.getAttribute('data-bs-target')?.substring(1);
      const firstPane = document.getElementById(firstPaneId);
      if (firstPane) {
        firstPane.classList.add('show', 'active');
        firstPane.style.display = 'block';
      }
    }
  }

  // Chatbot Logic
  let step = 'name';
  let formData = { name: '', email: '', subject: '', message: '' };

  window.sendMessage = function () {
    const input = document.getElementById('chatbotInputField');
    const messagesContainer = document.getElementById('chatbotMessages');
    const inputValue = input.value.trim();

    if (!inputValue) return;

    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.innerHTML = `<span>${inputValue}</span>`;
    messagesContainer.appendChild(userMessage);

    // Store input in formData
    formData[step] = inputValue;

    // Process response based on step
    let botMessage = document.createElement('div');
    botMessage.className = 'message bot';
    let nextMessage = '';
    let nextStep = step;

    switch (step) {
      case 'name':
        nextMessage = `Nice to meet you, ${inputValue}! What's your email address?`;
        nextStep = 'email';
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(inputValue)) {
          nextMessage = 'Please enter a valid email address.';
          nextStep = 'email';
        } else {
          nextMessage = "Great! What's the subject of your message?";
          nextStep = 'subject';
        }
        break;
      case 'subject':
        nextMessage = "Awesome! Now, what's your message for Ashley?";
        nextStep = 'message';
        break;
      case 'message':
        nextMessage = 'Thank you! Your message has been recorded. Would you like to send another message? (Type "yes" or "reset")';
        nextStep = 'complete';
        break;
      case 'complete':
        if (inputValue.toLowerCase() === 'yes') {
          nextMessage = "Alright, let's start over. What's your name?";
          nextStep = 'name';
          formData = { name: '', email: '', subject: '', message: '' };
        } else {
          nextMessage = 'Your message has been sent! Ashley will get back to you soon.';
          nextStep = 'finished';
          console.log('Form Data:', formData);
          const chatbotInputContainer = document.getElementById('chatbotInput');
          if (chatbotInputContainer) chatbotInputContainer.style.display = 'none';
        }
        break;
      default:
        nextMessage = 'Something went wrong. Please start over by typing "reset".';
        nextStep = 'complete';
    }

    botMessage.innerHTML = `<span>${nextMessage}</span>`;
    messagesContainer.appendChild(botMessage);
    step = nextStep;
    input.value = '';

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const chatbotInput = document.getElementById('chatbotInputField');
  if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        window.sendMessage();
      }
    });
  }

  // Update footer year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile Particles Adjustment
  function adjustParticlesForMobile() {
    if (window.innerWidth < 768 && typeof particlesJS !== 'undefined' && typeof pJSDom !== 'undefined' && pJSDom.length) {
      pJSDom[0].pJS.particles.number.value = 30;
      pJSDom[0].pJS.particles.line_linked.distance = 100;
      pJSDom[0].pJS.fn.vendors.refresh();
    }
  }

  window.addEventListener('resize', debounce(adjustParticlesForMobile, 250));
  window.addEventListener('load', adjustParticlesForMobile);

  // Final safety check for hero visibility
  setTimeout(() => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      const computedStyle = getComputedStyle(heroContent);
      if (parseFloat(computedStyle.opacity) < 1 || computedStyle.visibility === 'hidden') {
        console.log('Final safety check: Ensuring hero visibility');
        ensureHeroVisibility();
      }
    }
  }, 8000);

  console.log('Main JavaScript file loaded successfully with hero section fixes');
});