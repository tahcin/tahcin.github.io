// --- START OF FILE script.js ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggleBtn = document.getElementById('navToggleBtn');
    const navCloseBtn = document.getElementById('navCloseBtn');
    const navLinksContainer = document.getElementById('navLinksContainer');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('#navLinksContainer .nav-link'); // More specific selector
    const body = document.body;

    const openNav = () => {
        if (navLinksContainer && navOverlay && body) {
            navLinksContainer.classList.add('active');
            navOverlay.classList.add('active'); // Also make sure overlay becomes active
            body.classList.add('body-no-scroll');
            // CSS handles hiding the toggle button now
        } else {
            console.error("Error: Navigation elements not found for opening.");
        }
    };

    const closeNav = () => {
        if (navLinksContainer && navOverlay && body) {
            navLinksContainer.classList.remove('active');
            navOverlay.classList.remove('active'); // Deactivate overlay
            body.classList.remove('body-no-scroll');
            // CSS handles showing the toggle button
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

    // --- Stat Counter Animation ---
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.getElementById('stats');
    let statsAnimated = false; // Flag specific to counter animation

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
             // Check if the stats section itself is intersecting and hasn't been animated
            if (entry.target === statsSection && entry.isIntersecting && !statsAnimated) {
                 // console.log("Stats section intersecting, starting counter animation."); // Debug log
                statNumbers.forEach(numberElement => {
                    const target = +numberElement.getAttribute('data-target');
                    numberElement.innerText = '0';
                    let current = 0;
                    const duration = 1500; // Animation duration in ms
                    const stepTime = 16; // Approx 60fps
                    const steps = duration / stepTime;
                    const increment = Math.max(1, Math.ceil(target / steps)); // Calculate increment based on duration

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            numberElement.innerText = Math.min(current, target).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            numberElement.innerText = target.toLocaleString();
                        }
                    };
                    requestAnimationFrame(updateCounter); // Start animation
                });
                statsAnimated = true; // Mark counter animation as done
                observer.unobserve(statsSection); // Stop observing the section for counter animation
                // console.log("Unobserved stats section for counter animation."); // Debug log
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% visible - Adjusted threshold slightly
    });

    if (statsSection && statNumbers.length > 0) {
        // console.log("Observing stats section for counter animation."); // Debug log
        counterObserver.observe(statsSection);
    } else {
        console.warn("Stats section or numbers not found for counter animation.");
    }

    // --- Fade-in Animation on Scroll ---
    const fadeElements = document.querySelectorAll('.js-fade-in');

    // Function to manually trigger fade-in for elements initially in view
    const triggerInitialFadeIn = () => {
        const viewportHeight = window.innerHeight;
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            // Check if element is at least partially visible on load (top edge above bottom of viewport)
            // and hasn't already been animated (important for subsequent scrolls)
            if (rect.top < viewportHeight && !el.classList.contains('fade-in-active')) {
                 // console.log("Initially visible, triggering fade-in:", el); // Debug log
                el.classList.add('fade-in-active');
                // Optionally unobserve if using IntersectionObserver
                 // if (fadeInObserver) fadeInObserver.unobserve(el);
            }
        });
    };


    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // console.log("Fade-in intersecting:", entry.target); // Debug log
                entry.target.classList.add('fade-in-active');
                observer.unobserve(entry.target); // Stop observing once faded in
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% is visible
        // rootMargin: "0px 0px -50px 0px" // Optional: Trigger slightly before fully in view
    });

    if (fadeElements.length > 0) {
         // console.log(`Observing ${fadeElements.length} elements for fade-in animation.`); // Debug log
        // Observe all elements for scroll-triggered fade-in
        fadeElements.forEach(el => {
            fadeInObserver.observe(el);
        });
        // Manually trigger fade-in for elements visible on initial load
        triggerInitialFadeIn();
    } else {
        console.warn("No elements found for fade-in animation with class 'js-fade-in'.");
    }


    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    const scrollThreshold = 300;

    const toggleBackToTopButton = () => {
        if (!backToTopBtn) return; // Added check
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
        // Initial check in case page loads already scrolled down
        toggleBackToTopButton();
    } else {
         console.warn("Back to Top button not found.");
    }

    // --- Contact Form Tag Selection ---
    const tagButtons = document.querySelectorAll('.tag-btn');
    const selectedServicesInput = document.getElementById('selected_services');
    let selectedServices = [];

    if (tagButtons.length > 0) {
        tagButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent potential form submission if wrapped
                button.classList.toggle('active');
                const service = button.textContent.trim();
                if (button.classList.contains('active')) {
                    if (!selectedServices.includes(service)) {
                        selectedServices.push(service);
                    }
                } else {
                    selectedServices = selectedServices.filter(s => s !== service);
                }
                if (selectedServicesInput) {
                    selectedServicesInput.value = selectedServices.join(', ');
                } else {
                    console.warn("Hidden input for selected services not found.");
                }
                 // console.log("Selected services:", selectedServicesInput.value); // Debug log
            });
        });
    } else {
        console.warn("Tag selection buttons not found.");
    }

    // --- Contact Form Submission Placeholder ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const companyInput = document.getElementById('company');
            const formData = {
                name: nameInput?.value.trim() || '',
                email: emailInput?.value.trim() || '',
                company: companyInput?.value.trim() || '',
                services: selectedServices // Use the array maintained by tag selection
            };
            if (!formData.name || !formData.email || formData.services.length === 0) {
                alert('Please fill in required fields (Name*, Email*) and select at least one service mind*.');
                return;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(formData.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            console.log('Form submitted (placeholder). Data to send:', formData);
            alert('Thank you for your message! (This is a demo - no email sent)');
            contactForm.reset();
            // Reset tag buttons and hidden input
            tagButtons.forEach(btn => btn.classList.remove('active'));
            selectedServices = [];
            if (selectedServicesInput) selectedServicesInput.value = '';
        });
    } else {
        console.warn("Contact form not found.");
    }

}); // End DOMContentLoaded
// --- END OF FILE script.js ---