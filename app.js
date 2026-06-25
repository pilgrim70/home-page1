document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sticky Header scroll transition
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Drawer Navigation Toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMenu = () => {
    menuBtn.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.classList.toggle('no-scroll'); // Prevent background scrolling when open
  };

  menuBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close mobile drawer when link is clicked
      if (mobileNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Prevent background scrolling CSS rule injection
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `body.no-scroll { overflow: hidden; }`;
  document.head.appendChild(styleEl);

  // 3. Dynamic Sermon Video Playlist Switcher
  const playlistItems = document.querySelectorAll('.playlist-item');
  const mainVideo = document.getElementById('mainSermonVideo');

  playlistItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all items
      playlistItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Get video ID and update YouTube embed src
      const videoId = item.getAttribute('data-video-id');
      if (videoId && mainVideo) {
        mainVideo.src = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
      }
    });
  });

  // 4. Scroll Spy Navigation (Highlight current menu item)
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-menu.desktop .nav-item');

  const options = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // Detect element when it spans the center half of the viewport
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Remove active class from all header links
        navItems.forEach(item => {
          item.classList.remove('active');
          const link = item.querySelector('a');
          if (link && link.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  };

  const spyObserver = new IntersectionObserver(observerCallback, options);
  sections.forEach(section => spyObserver.observe(section));

  // 5. Scroll Reveal Animation using Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px', // Trigger slightly before element enters view
    threshold: 0.15
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
  revealElements.forEach(el => revealObserver.observe(el));
});
