// --- EMAILJS CONFIGURATION ---
// Customize these settings after signing up for a free account at https://www.emailjs.com/
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "etbgIkka-RTVyw_J4",      // Replace with your EmailJS Public Key
  SERVICE_ID: "service_psvwaba",      // Replace with your EmailJS Service ID
  FEEDBACK_TEMPLATE_ID: "template_7tjrs1t", // Replace with your Feedback Template ID
  NEWSLETTER_TEMPLATE_ID: "template_sc75les" // Replace with your Welcome/Newsletter Template ID
};

document.addEventListener('DOMContentLoaded', () => {

  // Initialize EmailJS if configured (foolproof check to allow user keys)
  const isEmailJSConfigured =
    EMAILJS_CONFIG.PUBLIC_KEY &&
    EMAILJS_CONFIG.PUBLIC_KEY.trim() !== "" &&
    !EMAILJS_CONFIG.PUBLIC_KEY.includes("YOUR_") &&
    EMAILJS_CONFIG.SERVICE_ID &&
    EMAILJS_CONFIG.SERVICE_ID.trim() !== "" &&
    !EMAILJS_CONFIG.SERVICE_ID.includes("YOUR_");

  if (isEmailJSConfigured && typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
    });
  }

  // --- 1. WHATSAPP LINK REDIRECTOR ---
  // Constant URL placeholder defined in prompt requirements
  const WHATSAPP_COMMUNITY_INVITE_URL = "https://chat.whatsapp.com/Fp9jYfGvtQaBmyID4rCdyC";

  const whatsappButtons = document.querySelectorAll('.whatsapp-btn, .social-icon[aria-label="WhatsApp Invite Link"]');
  whatsappButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(WHATSAPP_COMMUNITY_INVITE_URL, '_blank');
    });
  });


  // --- 1.5. CONTACT MAILTO REDIRECTOR & CLIPBOARD HELPER ---
  const contactCardEmail = document.querySelector('.contact-card[href^="mailto:"]');
  if (contactCardEmail) {
    contactCardEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const email = "teamabhiyantrix@gmail.com";

      // Copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast("teamabhiyantrix@gmail.com copied to clipboard! 📋");
        }).catch((err) => {
          console.error("Clipboard copy failed:", err);
        });
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast("teamabhiyantrix@gmail.com copied to clipboard! 📋");
      }

      // Explicitly open mailto redirect
      setTimeout(() => {
        window.location.href = `mailto:${email}`;
      }, 100);
    });
  }

  // --- 2. SINGLE PAGE APP (SPA) HASH ROUTER ---
  const views = document.querySelectorAll('.view-container');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleRouting() {
    let hash = window.location.hash || '#home';

    // Normalize hash
    if (!hash.startsWith('#')) {
      hash = '#' + hash;
    }

    const targetId = hash.substring(1);
    const targetView = document.getElementById(targetId);

    if (targetView) {
      // Deactivate all views
      views.forEach(view => {
        view.classList.remove('active');
      });

      // Activate target view
      targetView.classList.add('active');

      // Update nav link active state
      navLinks.forEach(link => {
        const linkHash = link.getAttribute('href');
        if (linkHash === hash) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Scroll to top smoothly on page transition
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      const navMenu = document.getElementById('nav-menu');
      if (navMenu.classList.contains('mobile-active')) {
        navMenu.classList.remove('mobile-active');
      }

      // Re-trigger scroll animations for the new active view
      triggerScrollAnimations();
    }
  }

  // Bind router events
  window.addEventListener('hashchange', handleRouting);
  // Initial routing on page load
  handleRouting();

  // Handle in-page triggers (e.g. "See Community" secondary hero CTA)
  document.querySelectorAll('.nav-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = trigger.getAttribute('data-target');
      window.location.hash = '#' + target;
    });
  });


  // --- 3. PREMIUM HERO STACKED SLIDESHOW CONTROLLER ---
  const stackContainer = document.getElementById('hero-slideshow-stack');

  if (stackContainer) {
    const cards = Array.from(stackContainer.querySelectorAll('.hero-mockup-card'));
    let isTransitioning = false;

    function rotateStack() {
      if (isTransitioning) return;
      isTransitioning = true;

      // Find cards by their current positional classes
      const frontCard = cards.find(card => card.classList.contains('pos-1'));
      const middleCard = cards.find(card => card.classList.contains('pos-2'));
      const backCard = cards.find(card => card.classList.contains('pos-3'));
      const backCard1 = cards.find(card => card.classList.contains('pos-4'));

      if (!frontCard || !middleCard || !backCard || !backCard1) {
        isTransitioning = false;
        return;
      }

      // Phase 1: Slide out the front card (sweep to left, fade out)
      frontCard.classList.add('exiting');

      // Concurrently shift middle -> front, back -> middle
      middleCard.classList.remove('pos-2');
      middleCard.classList.add('pos-1');

      backCard.classList.remove('pos-3');
      backCard.classList.add('pos-2');

      backCard1.classList.remove('pos-4');
      backCard1.classList.add('pos-3');




      // Phase 2: After transition (600ms), send old front card to the back of the stack
      setTimeout(() => {
        frontCard.classList.remove('pos-1', 'exiting');
        frontCard.classList.add('pos-4');
        isTransitioning = false;
      }, 600); // Timed with --transition-slow (0.6s) in CSS
    }

    // Run the slideshow cycle every 4.5 seconds
    let slideshowInterval = setInterval(rotateStack, 2500);

    // Pause slideshow on hover for readability, resume on leave
    stackContainer.addEventListener('mouseenter', () => {
      clearInterval(slideshowInterval);
    });

    stackContainer.addEventListener('mouseleave', () => {
      slideshowInterval = setInterval(rotateStack, 4500);
    });
  }


  // --- 4. FAQ ACCORDION CONTROLLER ---
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const parent = question.parentElement;
      const isOpen = parent.classList.contains('open');

      // Close all other FAQs for accordion action
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        parent.classList.add('open');
      }
    });
  });


  // --- 5. TOAST NOTIFICATION UTILITY ---
  const toastContainer = document.getElementById('toast-container');

  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="toast-success-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation slide in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Slide out and remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }


  // --- 6. FEEDBACK FORM CONTROLLER ---
  const feedbackForm = document.getElementById('community-feedback-form');
  const formCard = document.getElementById('feedback-form-card');
  const successCard = document.getElementById('feedback-success-card');
  const submitBtn = document.getElementById('form-submit-btn');
  const resetBtn = document.getElementById('form-reset-btn');

  if (feedbackForm && formCard && successCard && submitBtn) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const college = document.getElementById('form-college').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const linkedin = document.getElementById('form-linkedin').value.trim();
      const message = document.getElementById('form-message').value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!name || !college || !email || !message) {
        showToast("Please fill in all required fields!");
        return;
      }

      if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address!");
        return;
      }

      // Show loading spinner
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <div class="form-spinner" style="display:inline-block; margin-right:8px;"></div>
        <span>Submitting...</span>
      `;

      const resetSubmitButton = () => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      };

      const handleSuccess = () => {
        feedbackForm.reset();
        resetSubmitButton();
        formCard.style.display = 'none';
        successCard.style.display = 'flex';
        showToast("Story submitted successfully!");
      };

      if (isEmailJSConfigured && typeof emailjs !== 'undefined') {
        // Live Mode: Send real email using EmailJS
        const templateParams = {
          from_name: name,
          college: college,
          email: email,
          linkedin: linkedin || "Not Provided",
          message: message,
          reply_to: email
        };

        emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.FEEDBACK_TEMPLATE_ID,
          templateParams
        ).then(() => {
          handleSuccess();
        }).catch((error) => {
          console.error("EmailJS feedback error:", error);
          resetSubmitButton();
          showToast("Failed to submit feedback. Please try again.");
        });
      } else {
        // Simulation Mode fallback
        console.warn(
          "%c[AbhiyantriX Simulation] Feedback form submitted! To activate live emails, follow these steps:\n" +
          "1. Sign up for a free account at https://www.emailjs.com/\n" +
          "2. Add your Gmail/email service and create a template for 'Feedback' with variables: {{from_name}}, {{college}}, {{email}}, {{linkedin}}, {{message}}\n" +
          "3. Populate the EMAILJS_CONFIG object at the top of app.js with your public key, service ID, and feedback template ID.",
          "color: #3b82f6; font-weight: bold; font-size: 12px;"
        );

        setTimeout(() => {
          handleSuccess();
          showToast("Story submitted (Simulation Mode)!");
        }, 1500);
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        successCard.style.display = 'none';
        formCard.style.display = 'block';
      });
    }
  }


  // --- 7. NEWSLETTER SUBSCRIPTION CONTROLLER ---
  const newsletterBtn = document.getElementById('newsletter-btn');
  const newsletterInput = document.getElementById('newsletter-email');

  if (newsletterBtn && newsletterInput) {
    const handleNewsletterSubmit = () => {
      const email = newsletterInput.value.trim();

      // Simple regex check for valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showToast("Please enter a valid student email!");
        return;
      }

      // Disable input and button during submission
      newsletterInput.disabled = true;
      newsletterBtn.disabled = true;
      const originalBtnContent = newsletterBtn.innerHTML;

      // Show small loading spinner inside the button
      newsletterBtn.innerHTML = `<div class="form-spinner" style="display:inline-block; width: 14px; height: 14px; border-width: 2px; margin: 0 auto;"></div>`;

      const resetNewsletter = () => {
        newsletterInput.disabled = false;
        newsletterBtn.disabled = false;
        newsletterBtn.innerHTML = originalBtnContent;
      };

      const handleSuccess = () => {
        newsletterInput.value = '';
        resetNewsletter();
        showToast("Subscribed! Welcome to AX Playbook snippets.");
      };

      const isNewsletterTemplateConfigured =
        EMAILJS_CONFIG.NEWSLETTER_TEMPLATE_ID &&
        EMAILJS_CONFIG.NEWSLETTER_TEMPLATE_ID.trim() !== "" &&
        !EMAILJS_CONFIG.NEWSLETTER_TEMPLATE_ID.includes("YOUR_");

      if (isEmailJSConfigured && typeof emailjs !== 'undefined' && isNewsletterTemplateConfigured) {
        // Live Mode: Send a welcome message to the subscriber's email
        const templateParams = {
          subscriber_email: email,
          reply_to: "teamabhiyantrix@gmail.com"
        };

        emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.NEWSLETTER_TEMPLATE_ID,
          templateParams
        ).then(() => {
          handleSuccess();
        }).catch((error) => {
          console.error("EmailJS newsletter error:", error);
          resetNewsletter();
          showToast("Failed to subscribe. Please try again.");
        });
      } else {
        // Simulation Mode fallback
        console.warn(
          "%c[AbhiyantriX Simulation] Newsletter subscription submitted for email: " + email + "\n" +
          "To trigger actual welcome emails, follow these steps:\n" +
          "1. Sign up for a free account at https://www.emailjs.com/\n" +
          "2. Create a template for 'Welcome Message' where the 'To Email' is set to {{subscriber_email}}\n" +
          "3. Populate the EMAILJS_CONFIG object at the top of app.js with your credentials.",
          "color: #3b82f6; font-weight: bold; font-size: 12px;"
        );

        setTimeout(() => {
          handleSuccess();
          showToast("Subscribed (Simulation Mode)!");
        }, 1200);
      }
    };

    newsletterBtn.addEventListener('click', handleNewsletterSubmit);

    // Support submitting by pressing Enter
    newsletterInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleNewsletterSubmit();
      }
    });
  }


  // --- 8. MOBILE NAV NAVIGATION TOGGLE ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
    });

    // Close menu when clicking outside navbar area
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('mobile-active');
      }
    });
  }


  // --- 9. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ---
  function triggerScrollAnimations() {
    const fadeItems = document.querySelectorAll('.animate-fade-up');

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, observerOptions);

    fadeItems.forEach(item => {
      // In case we re-route, clear old state and register
      item.classList.remove('visible');
      observer.observe(item);
    });
  }

  // Trigger initial scroll observer setup
  triggerScrollAnimations();


  // --- 10. PLAYBOOK PAGE CATEGORIES TAB FILTER ---
  const tabButtons = document.querySelectorAll('.category-tab');
  const playbookCards = document.querySelectorAll('.playbook-card, .playbook-locked-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active tab button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      playbookCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all') {
          card.style.display = 'flex';
        } else if (cardCategory === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================================================
  // --- 11. EVENTS SYSTEM (DATA, RENDERER, 3D PHOTO DECK & MODAL) ---
  // ==========================================================================

  // Seeds for conducted past events with detailed description and assets
  const EVENTS_DATA = [
    {
      id: "fastapi-nextjs-handshake",
      name: "Fresher Guidance Sessions",
      category: "build",
      categoryLabel: "Orientation",
      date: "May 18, 2026",
      speaker: "Team AbhiyantriX",
      participants: "60+ Student Builders",
      description: "A kickoff session for first-year students to understand how to navigate engineering the right way. We covered skill planning, project-building strategies, senior insights, and how to start shaping a strong tech journey from day one.",
      longDescription: "In this interactive orientation session, we introduced second-year students to the foundations of navigating their engineering journey the right way. The session covered how to choose the right skills, plan learning tracks, build projects from day one, and avoid common mistakes most freshers make. We also walked through real examples from senior-led projects, shared roadmap templates, and opened the floor for guidance on academics, hackathons, careers, and building a strong tech profile. Students left with clarity, direction, and a practical starting point for their Second year.",
      takeaways: [
        'Understanding how to plan your engineering journey from Semester 3',
        'Clarity on what skills to learn first and how to avoid common beginner mistakes',
        'A realistic roadmap for projects, hackathons, internships, and career development',
        'Exposure to real senior- led projects and how to build your own'
      ]

      ,

      images: [
        "assets/live_builds.png",
        "assets/abimg1.jfif",
        "assets/abimg0.png"
      ],
      lumaLink: "https://lu.ma/fastapi-nextjs-handshake",
      githubLink: "https://github.com/abhiyantrix/nextjs-fastapi-handshake",
      slidesLink: "https://linkedin.com/company/abhiyantrix27"
},
  {
    id: "hackathon-prep-tactics",
    name: "Detailed Subject Analysis",
    category: "hackathon",
    categoryLabel: "Orientation",
    date: "May 26, 2026",
    speaker: "Nidhi Vekhande, Jignyasa Patil, Team AbhiyantriX",
    participants: "80+ Builders",
    description: "A quick, clear breakdown of all Second-Year subjects, how they connect to real engineering, and what students should focus on. Seniors shared study tips, scoring patterns, and how to link each subject to practical, industry-relevant skills.",
    longDescription: "In this focused SE Subjects Introduction Session, students were given a clear breakdown of the core subjects they will encounter in second year and how each one connects to real-world software engineering. The session highlighted what every subject actually teaches, how it builds on first-year knowledge, the skills required to excel, and how these subjects map to industry expectations like system design, backend fundamentals, algorithms, and databases. Seniors shared insights, study strategies, project ideas, and common pitfalls so students can approach SE with clarity, confidence, and the right mindset.",
    takeaways: [
      "Understanding the role and importance of each SE subject",
      "How subjects like DSA, DBMS, Automata, and Applied Maths translate to real industry work",
      "Study strategies, resources, and how to pace learning through the semester",
      "Common mistakes SE students make and how to avoid them"
    ],
    images: [
      "assets/hackathon_prep.png",
      "assets/abimg2.jfif",
      "assets/abimg0.png"
    ],
    lumaLink: "https://lu.ma/hackathon-prep-tactics",
    githubLink: "https://github.com/abhiyantrix/hackathon-boilerplate",
    slidesLink: "https://linkedin.com/company/abhiyantrix27"
  },
  {
    id: "subject-roadmaps-orientation",
    name: "The Internship Reality Check: Insights from HR & Industry",
    category: "orientation",
    categoryLabel: "Academic Sprints",
    date: "June 06, 2026",
    speaker: "Bhargavi M",
    participants: "100+ Students",
    description: "​Getting an internship is often the first step toward building a successful career, but many students struggle with where to start, how to prepare, and what companies actually expect.",
    longDescription: "A special academic alignment sprint focused on bridging the gap between textbook engineering models and corporate engineering environments. We provided subject roadmaps for Data Structures, Database Systems, and Computer Networks. Muthusam and Shreyas shared their own notes, mapping dry academic theories to live stacks (like mapping network handshakes to API request lifecycles and SQL normalization to scalable PostgreSQL indexing).",
    takeaways: [
      "Interactive roadmap PDFs for core engineering subjects",
      "Recommended open-source tools matching university specs",
      "Direct peer guidance for mastering DSA during college",
      "Real-world application briefs for academic projects"
    ],
    images: [
      "assets/subjects session.jpg",
      "assets/logo.png",
      "assets/abimg0.png"
    ],
    lumaLink: "https://luma.com/0jc1mjfb",
    githubLink: "https://github.com/abhiyantrix/subject-roadmaps",
    slidesLink: "https://linkedin.com/company/abhiyantrix27",
    directRedirect: true
  },
  // {
  //   id: "weekly-checkins-sprints",
  //   name: "Weekly Technical Check-Ins & Sprints",
  //   category: "orientation",
  //   categoryLabel: "Academic Sprints",
  //   date: "Ongoing (Weekly Tuesdays & Thursdays)",
  //   speaker: "Muthusam & Shreyas",
  //   participants: "40+ Members / Session",
  //   description: "Regular online hanging calls where builders show off side builds, debug database errors, and lock weekly targets.",
  //   longDescription: "The heartbeat of AbhiyantriX! Every Tuesday and Thursday evening, student developers across multiple colleges connect to align on their building goals. Members present their screen shares to get direct support on Docker builds, FastAPI configurations, CORS, React state bugs, or Git branch conflicts. It is a highly active, zero-fluff engineering hub designed to keep developers shipping constantly.",
  //   takeaways: [
  //     "Real-time debugging blocks with experienced peers",
  //     "Live showcases of active localhost side builds",
  //     "Accountability channels to lock weekly coding milestones",
  //     "Direct networking with top building peers in multiple locations"
  //   ],
  //   images: [
  //     "assets/community_calls.png",
  //     "assets/logo.png",
  //     "assets/abimg0.png"
  //   ],
  //   lumaLink: "https://lu.ma/weekly-checkins-sprints",
  //   githubLink: "https://github.com/abhiyantrix/community-resources",
  //   slidesLink: "https://linkedin.com/company/abhiyantrix27"
  // }
  ];

const eventsContainer = document.getElementById('events-grid-container');
const eventModal = document.getElementById('event-detail-modal');
const eventModalBody = document.getElementById('event-modal-body-content');
const eventModalCloseBtn = document.getElementById('event-modal-close-btn');

// Dynamic grid card renderer
function renderEvents(filter = "all") {
  if (!eventsContainer) return;
  eventsContainer.innerHTML = "";

  const filteredEvents = filter === "all"
    ? EVENTS_DATA
    : EVENTS_DATA.filter(evt => evt.category === filter);

  if (filteredEvents.length === 0) {
    eventsContainer.innerHTML = `
        <div class="no-events-found" style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-light);">
          <p>No conducted events found in this category yet. Check back soon!</p>
        </div>
      `;
    return;
  }

  filteredEvents.forEach(evt => {
    const card = document.createElement('div');
    card.className = "event-card animate-fade-up visible";
    card.setAttribute('data-id', evt.id);

    const actionBtnHTML = evt.directRedirect
      ? `
          <button class="event-card-action-btn view-luma-trigger" data-luma-url="${evt.lumaLink}">
            <span>View on Luma</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        `
      : `
          <button class="event-card-action-btn view-details-trigger" data-evt-id="${evt.id}">
            <span>View Details & Resources</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        `;

    card.innerHTML = `
        <div class="event-gallery-stack" data-evt-id="${evt.id}">
          <span class="gallery-interactive-hint">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            <span>Shuffle</span>
          </span>
          <img src="${evt.images[0]}" alt="${evt.name} image 1" class="event-gallery-photo photo-top" data-index="0">
          <img src="${evt.images[1]}" alt="${evt.name} image 2" class="event-gallery-photo photo-middle" data-index="1">
          <img src="${evt.images[2]}" alt="${evt.name} image 3" class="event-gallery-photo photo-back" data-index="2">
        </div>
        
        <div class="event-card-body">
          <span class="event-card-type-tag">${evt.categoryLabel}</span>
          <h3 class="event-card-title">${evt.name}</h3>
          
          <div class="event-card-meta-list">
            <div class="event-card-meta-item">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${evt.date}</span>
            </div>
            
            <div class="event-card-meta-item">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>${evt.participants}</span>
            </div>
            
            <div class="event-card-meta-item">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
              <span>Conducted by: <strong>${evt.speaker}</strong></span>
            </div>
          </div>
          
          ${actionBtnHTML}
        </div>
      `;
    eventsContainer.appendChild(card);
  });

  // Setup interactive events
  bindGalleryShuffler();
  bindModalTriggers();
}

// 3D Photo Stack Click Shuffler Logic
function bindGalleryShuffler() {
  const stacks = document.querySelectorAll('.event-gallery-stack');

  stacks.forEach(stack => {
    stack.addEventListener('click', (e) => {
      // Stop bubbling so clicking the image stack does not open details modal simultaneously
      e.stopPropagation();

      const topPhoto = stack.querySelector('.photo-top');
      const middlePhoto = stack.querySelector('.photo-middle');
      const backPhoto = stack.querySelector('.photo-back');

      if (!topPhoto || !middlePhoto || !backPhoto) return;

      if (stack.classList.contains('animating')) return;
      stack.classList.add('animating');

      // Slide out to the side
      topPhoto.classList.add('shuffling-out');

      // Re-arrange layers halfway through the slide
      setTimeout(() => {
        topPhoto.classList.remove('photo-top', 'shuffling-out');
        topPhoto.classList.add('photo-back');

        middlePhoto.classList.remove('photo-middle');
        middlePhoto.classList.add('photo-top');

        backPhoto.classList.remove('photo-back');
        backPhoto.classList.add('photo-middle');

        stack.classList.remove('animating');
      }, 580);
    });
  });
}

// Modal Dynamic Openers Bindings
function bindModalTriggers() {
  document.querySelectorAll('.view-details-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-evt-id');
      openEventDetails(id);
    });
  });

  document.querySelectorAll('.view-luma-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const url = btn.getAttribute('data-luma-url');
      window.open(url, '_blank');
    });
  });

  document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.event-gallery-stack') || e.target.closest('.event-card-action-btn')) {
        return;
      }
      const id = card.getAttribute('data-id');
      const evt = EVENTS_DATA.find(evt => evt.id === id);
      if (evt && evt.directRedirect) {
        window.open(evt.lumaLink, '_blank');
      } else {
        openEventDetails(id);
      }
    });
  });
}

// Dynamic content injection into details modal
function openEventDetails(evtId) {
  const evt = EVENTS_DATA.find(e => e.id === evtId);
  if (!evt || !eventModal || !eventModalBody) return;

  // Add scroll lock to page body
  document.body.classList.add('modal-open');

  eventModalBody.innerHTML = `
      <div class="modal-header-section">
        <span class="event-card-type-tag" style="align-self: flex-start;">${evt.categoryLabel}</span>
        <h2 class="modal-title">${evt.name}</h2>
      </div>
      
      <div class="modal-meta-grid">
        <div class="modal-meta-card">
          <span class="modal-meta-label">Date & Time</span>
          <span class="modal-meta-val">${evt.date}</span>
        </div>
        <div class="modal-meta-card">
          <span class="modal-meta-label">Speaker / Host</span>
          <span class="modal-meta-val">${evt.speaker}</span>
        </div>
        <div class="modal-meta-card">
          <span class="modal-meta-label">Participants</span>
          <span class="modal-meta-val">${evt.participants}</span>
        </div>
      </div>
      
      <div>
        <h3 class="modal-description-title">Retrospective Overview</h3>
        <p class="modal-description-text">${evt.longDescription || evt.description}</p>
      </div>
      
      <div>
        <h3 class="modal-description-title">Key Core Takeaways</h3>
        <ul class="modal-takeaway-list">
          ${evt.takeaways.map(takeaway => `
            <li class="modal-takeaway-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>${takeaway}</span>
            </li>
          `).join('')}
        </ul>
      <div>
        <h3 class="modal-gallery-title">Session Snapshot Slides</h3>
        <div class="modal-image-grid">
          ${evt.images.map((img, idx) => `
            <img src="${img}" alt="${evt.name} gallery image ${idx + 1}" class="modal-grid-photo modal-gallery-lightbox-trigger" data-img-src="${img}">
          `).join('')}
        </div>
      </div>
    `;

  // Toggle active state CSS class
  eventModal.classList.add('open');

  // Lightbox hook
  bindLightboxTriggers();
}

function closeEventDetails() {
  if (!eventModal) return;
  eventModal.classList.remove('open');
  document.body.classList.remove('modal-open');
}

if (eventModalCloseBtn) {
  eventModalCloseBtn.addEventListener('click', closeEventDetails);
}

if (eventModal) {
  eventModal.addEventListener('click', (e) => {
    if (e.target === eventModal) {
      closeEventDetails();
    }
  });
}

// Escape key closer
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && eventModal && eventModal.classList.contains('open')) {
    closeEventDetails();
  }
});

// Lightbox click handler
function bindLightboxTriggers() {
  document.querySelectorAll('.modal-gallery-lightbox-trigger').forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('data-img-src');
      window.open(src, '_blank');
    });
  });
}

// --- 12. EVENTS FILTER TAB CONTROLLER ---
const eventTabs = document.querySelectorAll('.event-tab');
if (eventTabs) {
  eventTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      eventTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterValue = tab.getAttribute('data-filter');
      renderEvents(filterValue);
    });
  });
}

// Initial Seed Draw
renderEvents();

});

