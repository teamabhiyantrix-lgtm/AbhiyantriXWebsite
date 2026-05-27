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

});
