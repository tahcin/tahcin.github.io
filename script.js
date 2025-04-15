document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggleBtn = document.getElementById('navToggleBtn');
    const navCloseBtn = document.getElementById('navCloseBtn');
    const navLinksContainer = document.getElementById('navLinksContainer');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('#navLinksContainer .nav-link');
    const body = document.body; 

    const openNav = () => {
        if (navLinksContainer && navOverlay && body) {
            navLinksContainer.classList.add('active');
            navOverlay.classList.add('active');
            body.classList.add('body-no-scroll'); 
        } else {
            console.error("Error: Navigation elements not found for opening.");
        }
    };

    const closeNav = () => {
        if (navLinksContainer && navOverlay && body) {
            navLinksContainer.classList.remove('active');
            navOverlay.classList.remove('active');
            if (!formPopupOverlay || !formPopupOverlay.classList.contains('active')) {
                 body.classList.remove('body-no-scroll');
            }
        } else {
            console.error("Error: Navigation elements not found for closing.");
        }
    };

    if (navToggleBtn && navCloseBtn && navLinksContainer && navOverlay && navLinks.length > 0 && body) {
        navToggleBtn.addEventListener('click', openNav);
        navCloseBtn.addEventListener('click', closeNav);
        navOverlay.addEventListener('click', closeNav);
        navLinks.forEach(link => {
            link.addEventListener('click', closeNav);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
                closeNav();
            }
        });
    } else {
        console.warn("Mobile navigation elements not fully found. Sidebar functionality might be disabled.");
    }
    // --- End Mobile Navigation Toggle ---

    // --- Stat Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.getElementById('stats');
    let statsAnimated = false;

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.target === statsSection && entry.isIntersecting && !statsAnimated) {
                statNumbers.forEach(numberElement => {
                    const target = +numberElement.getAttribute('data-target');
                    if (isNaN(target)) {
                         console.warn("Invalid data-target found for stat counter:", numberElement);
                         return;
                     }
                    numberElement.innerText = '0';
                    let current = 0;
                    const duration = 1500;
                    const stepTime = 16;
                    const steps = duration / stepTime;
                    const increment = Math.max(1, Math.ceil(target / steps));

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            numberElement.innerText = Math.min(current, target).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            numberElement.innerText = target.toLocaleString();
                        }
                    };
                    requestAnimationFrame(updateCounter);
                });
                statsAnimated = true;
                observer.unobserve(statsSection);
            }
        });
    }, {
        threshold: 0.2
    });

    if (statsSection && statNumbers.length > 0) {
        counterObserver.observe(statsSection);
    } else if (!statsSection && statNumbers.length > 0) {
        console.warn("Stat numbers found, but 'stats' section ID is missing. Counter animation disabled.");
    }
    // --- End Stat Counter ---

    // --- Fade-in Animation on Scroll ---
    const fadeElements = document.querySelectorAll('.js-fade-in');

    const triggerInitialFadeIn = () => {
        const viewportHeight = window.innerHeight;
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < viewportHeight - 50 && !el.classList.contains('fade-in-active')) {
                el.classList.add('fade-in-active');
            }
        });
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
    });

    if (fadeElements.length > 0) {
        fadeElements.forEach(el => {
            fadeInObserver.observe(el);
        });
        triggerInitialFadeIn(); 
        console.warn("No elements found for fade-in animation with class 'js-fade-in'.");
    }
    // --- End Fade-in Animation ---

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    const scrollThreshold = 300;

    const toggleBackToTopButton = () => {
        if (!backToTopBtn) return;
        if (window.scrollY > scrollThreshold) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (backToTopBtn) {
        window.addEventListener('scroll', toggleBackToTopButton);
        backToTopBtn.addEventListener('click', scrollToTop);
        toggleBackToTopButton(); // Initial check
    } else {
         console.warn("Back to Top button not found.");
    }
    // --- End Back to Top Button ---

    // --- Popup Handling ---
    const formPopupOverlay = document.getElementById('formPopupOverlay');
    const formPopup = document.getElementById('formPopup');
    const formPopupMessage = document.getElementById('formPopupMessage');
    const formPopupCloseBtn = document.getElementById('formPopupCloseBtn');

    const showPopup = (message, isSuccess = true) => {
        if (!formPopupOverlay || !formPopupMessage || !formPopup || !body) {
            console.error("Popup elements not found!");
            alert(message); // Fallback
            return;
        }
        formPopupMessage.textContent = message;

        if (isSuccess) {
            formPopup.classList.add('form-popup--success');
            formPopup.classList.remove('form-popup--error');
        } else {
            formPopup.classList.add('form-popup--error');
            formPopup.classList.remove('form-popup--success');
        }

        formPopupOverlay.classList.add('active');
        body.classList.add('body-no-scroll'); 
    };

    const hidePopup = () => {
        if (!formPopupOverlay || !body) return;
        formPopupOverlay.classList.remove('active');
        if (!navLinksContainer || !navLinksContainer.classList.contains('active')) {
            body.classList.remove('body-no-scroll');
        }
    };

    // Add event listeners for closing the popup
    if (formPopupCloseBtn) {
        formPopupCloseBtn.addEventListener('click', hidePopup);
    }
    if (formPopupOverlay) {
        formPopupOverlay.addEventListener('click', (e) => {
            if (e.target === formPopupOverlay) {
                hidePopup();
            }
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && formPopupOverlay && formPopupOverlay.classList.contains('active')) {
            hidePopup();
        }
    });
    // --- End Popup Handling ---

    // --- Contact Form Tag Selection ---
    const tagButtons = document.querySelectorAll('.tag-btn');
    const selectedServicesInput = document.getElementById('selected_services');
    let selectedServices = [];

    if (tagButtons.length > 0 && selectedServicesInput) {
        // Initialize aria-pressed state
        tagButtons.forEach(button => {
            const isActive = button.classList.contains('active');
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            if (isActive) {
                 const service = button.textContent.trim();
                 if (!selectedServices.includes(service)) { selectedServices.push(service); }
            }
        });
        selectedServicesInput.value = selectedServices.join(', ');

        // Add click listener
        tagButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                button.classList.toggle('active');
                const service = button.textContent.trim();
                const isPressed = button.classList.contains('active');
                button.setAttribute('aria-pressed', isPressed ? 'true' : 'false');

                if (isPressed) {
                    if (!selectedServices.includes(service)) { selectedServices.push(service); }
                } else {
                    selectedServices = selectedServices.filter(s => s !== service);
                }
                selectedServicesInput.value = selectedServices.join(', ');
            });
        });
    } else {
         if (!selectedServicesInput) { console.warn("Hidden input for selected services/interests (ID: 'selected_services') not found."); }
         if (tagButtons.length === 0){ console.warn("Tag selection buttons (.tag-btn) not found."); }
    }
    // --- End Contact Form Tag Selection ---

    // --- Contact Form Submission to Google Apps Script ---
    const contactForm = document.getElementById('contact-form-real');
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
    const responseNote = contactForm ? contactForm.querySelector('.response-note') : null;
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiAeS-scT3mzQtnSOLa6icZumojg2XGcqqw6OQBXh-YEPI0bYT15ppzmMuBRxNLdKG/exec'; 

    if (contactForm && submitButton && SCRIPT_URL) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // --- Validation ---
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            // selectedServicesInput is defined above

            if (!nameInput || !emailInput || !selectedServicesInput) {
                console.error("Required form fields not found during submit.");
                showPopup("An error occurred setting up the form. Please refresh.", false);
                return;
            }
            const currentSelectedServicesValue = selectedServicesInput.value || '';
            const currentSelectedServicesArray = currentSelectedServicesValue.split(',').map(s => s.trim()).filter(s => s !== '');
            let errors = [];
            if (!nameInput.value.trim()) errors.push("Name is required.");
            if (!emailInput.value.trim()) errors.push("Email is required.");
            if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                errors.push("Please enter a valid email address.");
            }
            if (currentSelectedServicesArray.length === 0) {
                errors.push("Please select at least one area of interest.");
            }
            if (errors.length > 0) {
                // Use the popup for validation errors - join with newlines for readability
                showPopup("Please correct the following:\n\n- " + errors.join("\n- "), false);
                return;
            }
            // --- End Validation ---

            // --- Start Submission Logic ---
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending... <span class="submit-arrow"></span>';
            if (responseNote) responseNote.textContent = "Submitting your message...";

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                });

                console.log('Form submitted successfully (assumed due to no-cors mode).');
                showPopup('Thank you for your message! I will get back to you soon.', true);

                // Reset form and related state AFTER showing success popup
                contactForm.reset();
                tagButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                if (selectedServicesInput) selectedServicesInput.value = '';
                selectedServices = [];

            } catch (error) {
                console.error('Error submitting form:', error);
                showPopup('Sorry, there was an error sending your message. Please try again later or contact me directly via email.', false);

            } finally {
                // Re-enable button and restore original text, reset response note
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                if (responseNote) responseNote.textContent = "I will get back to you within 24 hours.";
            }
            // --- End Submission Logic ---
        });
    } else {
        if (!contactForm) console.warn("Contact form with ID 'contact-form-real' not found.");
        if (contactForm && !submitButton) console.warn("Submit button within the contact form not found.");
        if (!SCRIPT_URL) console.error("Google Apps Script URL is missing or empty.");
    }
    // --- End Contact Form Submission ---

});