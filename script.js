document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = localStorage.getItem('theme');
    const sunIcon = '<i class="ri-sun-line"></i>';
    const moonIcon = '<i class="ri-moon-line"></i>';
    const htmlElement = document.documentElement; // Target <html> element

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.add('dark-mode');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = sunIcon;
                themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
            }
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark-mode');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = moonIcon;
                themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
            }
            localStorage.setItem('theme', 'light');
        }
    };

    // Apply initial theme
    if (currentTheme === 'dark' || (!currentTheme && userPrefersDark)) {
        applyTheme('dark');
    } else {
        applyTheme('light'); // Default to light
    }

    // Add event listener for toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = htmlElement.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    } else {
        console.warn("Theme toggle button (#themeToggleBtn) not found.");
    }
    // --- End Theme Toggle ---


    // --- Mobile Navigation Toggle ---
    const navToggleBtn = document.getElementById('navToggleBtn');
    const navCloseBtn = document.getElementById('navCloseBtn');
    const navLinksContainer = document.getElementById('navLinksContainer');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('#navLinksContainer .nav-link');
    const body = document.body;
    const formPopupOverlay = document.getElementById('formPopupOverlay'); // Added ref

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
            // Only remove body-no-scroll if the popup is *also* not active
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
            // Trigger if element top is within viewport minus a small offset
            if (rect.top < viewportHeight - 50 && rect.bottom >= 0 && !el.classList.contains('fade-in-active')) {
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
        threshold: 0.1, // Trigger when 10% of the element is visible
    });

    if (fadeElements.length > 0) {
        fadeElements.forEach(el => {
            fadeInObserver.observe(el);
        });
        // Run initial check for elements already in view on load
        triggerInitialFadeIn();
    } else {
        // Changed this from console.warn as it's not necessarily an error if no elements use it.
        // console.info("No elements found for fade-in animation with class 'js-fade-in'.");
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
    // const formPopupOverlay = document.getElementById('formPopupOverlay'); // Defined above
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
        // Only remove body-no-scroll if the nav menu is *also* not active
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
            // Close only if clicking the overlay itself, not the popup content
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
        // Initialize aria-pressed state and populate array from initial active classes
        tagButtons.forEach(button => {
            const isActive = button.classList.contains('active');
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            if (isActive) {
                 const service = button.textContent.trim();
                 if (!selectedServices.includes(service)) { selectedServices.push(service); }
            }
        });
        selectedServicesInput.value = selectedServices.join(', '); // Set initial value

        // Add click listener
        tagButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default button behavior
                button.classList.toggle('active');
                const service = button.textContent.trim();
                const isPressed = button.classList.contains('active');
                button.setAttribute('aria-pressed', isPressed ? 'true' : 'false');

                if (isPressed) {
                    // Add service if it's not already included
                    if (!selectedServices.includes(service)) { selectedServices.push(service); }
                } else {
                    // Remove service
                    selectedServices = selectedServices.filter(s => s !== service);
                }
                selectedServicesInput.value = selectedServices.join(', '); // Update hidden input
                // console.log("Selected Services:", selectedServicesInput.value); // For debugging
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
    // IMPORTANT: Replace with your actual Google Apps Script Web App URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiAeS-scT3mzQtnSOLa6icZumojg2XGcqqw6OQBXh-YEPI0bYT15ppzmMuBRxNLdKG/exec'; // Example URL

    if (contactForm && submitButton && SCRIPT_URL) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // --- Validation ---
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            // selectedServicesInput is defined above and updated by tag selection logic

            if (!nameInput || !emailInput || !selectedServicesInput) {
                console.error("Required form fields not found during submit.");
                showPopup("An error occurred setting up the form. Please refresh.", false);
                return;
            }
            // Read the current value directly from the input at submission time
            const currentSelectedServicesValue = selectedServicesInput.value || '';
            const currentSelectedServicesArray = currentSelectedServicesValue.split(',').map(s => s.trim()).filter(s => s !== '');

            let errors = [];
            if (!nameInput.value.trim()) errors.push("Name is required.");
            if (!emailInput.value.trim()) errors.push("Email is required.");
            if (emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                errors.push("Please enter a valid email address.");
            }
            // Validate the array derived from the input's value
            if (currentSelectedServicesArray.length === 0) {
                errors.push("Please select at least one area of interest.");
            }

            if (errors.length > 0) {
                // Use the popup for validation errors - join with newlines for readability
                showPopup("Please correct the following:\n\n- " + errors.join("\n- "), false);
                return; // Stop submission
            }
            // --- End Validation ---

            // --- Start Submission Logic ---
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending... <span class="submit-arrow"></span>'; // Keep arrow for consistency
            if (responseNote) responseNote.textContent = "Submitting your message...";

            const formData = new FormData(contactForm);
            // Ensure the hidden input value is correctly included if not already handled by FormData
            formData.set('selected_services', selectedServicesInput.value);

            try {
                // Using fetch with 'no-cors' mode means we won't get a readable response body,
                // but the request will be sent. We assume success if no network error occurs.
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' // Important for Google Apps Script simple POST endpoint
                });

                // 'no-cors' responses have type 'opaque' and status 0, so checking response.ok is not useful.
                // We proceed assuming success if fetch itself didn't throw an error.
                console.log('Form submitted successfully (assumed due to no-cors mode).');
                showPopup('Thank you for your message! I will get back to you soon.', true);

                // Reset form and related state AFTER showing success popup
                contactForm.reset();
                // Also visually reset tag buttons and the internal array/input value
                tagButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                selectedServices = []; // Clear the JS array
                if (selectedServicesInput) selectedServicesInput.value = ''; // Clear the hidden input

            } catch (error) {
                console.error('Error submitting form:', error);
                // Provide a more user-friendly error message
                showPopup('Sorry, there was an error sending your message. Please check your internet connection or try again later. You can also contact me directly via email.', false);

            } finally {
                // Re-enable button and restore original text, reset response note regardless of success/failure
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                if (responseNote) responseNote.textContent = "I will try to get back to you within 24 hours.";
            }
            // --- End Submission Logic ---
        });
    } else {
        if (!contactForm) console.warn("Contact form with ID 'contact-form-real' not found.");
        if (contactForm && !submitButton) console.warn("Submit button within the contact form not found.");
        if (!SCRIPT_URL) console.error("Google Apps Script URL (SCRIPT_URL) is missing or empty in script.js.");
        else if (SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
             console.error("Please replace 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' with your actual Google Apps Script URL in script.js.");
        }
    }
    // --- End Contact Form Submission ---

});