// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});


// Select the progress bar fill element
const progressBar = document.querySelector('.filled');

window.addEventListener('scroll', () => {
    // Calculate the scroll progress
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    // Update the width of the progress bar
    progressBar.style.width = scrollPercentage + '%';
});


// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Auto-advance slides
setInterval(nextSlide, 3000);

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Gallery Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(button => button.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Room Selection
function selectRoom(roomType) {
    const roomSelect = document.getElementById('roomtype');
    if (roomSelect) {
        if (roomType === 'double') {
            roomSelect.value = 'double';
        } else if (roomType === 'triple') {
            roomSelect.value = 'triple';
        }
        scrollToSection('booking');
    }
}

// Email sending function - moved inside DOMContentLoaded to ensure EmailJS is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS after DOM is loaded
    if (typeof emailjs !== 'undefined') {
        emailjs.init('NINLsGFU3T_M2zjP7'); // Your public key
        console.log('EmailJS initialized successfully');
    } else {
        console.error('EmailJS not loaded');
    }

    // Booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Form submission started');

            const termsChecked = document.getElementById('terms').checked;
            const privacyChecked = document.getElementById('privacy').checked;
            const errorDiv = document.getElementById('formError');
            const form = this;
            const submitBtn = form.querySelector('.submit-btn');
            const modal = document.getElementById('booking-success-modal');
            const overlay = document.getElementById('booking-overlay');

            // Clear previous error message
            errorDiv.textContent = '';

            // Validate checkboxes
            if (!privacyChecked) {
                errorDiv.textContent = 'Please read and agree to the Privacy Policy.';
                return;
            }

            if (!termsChecked) {
                errorDiv.textContent = 'Please accept the Terms and Conditions.';
                return;
            }

            // Validate EmailJS is available
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS not available');
                alert('❌ Email service not available. Please try again later.');
                return;
            }

            // Check if all required elements exist
            if (!submitBtn || !modal || !overlay) {
                console.error('Required elements not found:', { submitBtn, modal, overlay });
                alert('❌ Form elements not found. Please refresh the page.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            console.log('Sending form with EmailJS...');

            emailjs.sendForm('service_aryapg', 'template_booking', form) // Replace with your service ID and template ID
                .then((response) => {
                    console.log('✅ Email sent successfully:', response);
                    form.reset();
                    // Show success modal
                    modal.style.display = 'block';
                    overlay.style.display = 'block';

                    // Auto-close modal after 2 seconds
                    setTimeout(() => {
                        modal.style.display = 'none';
                        overlay.style.display = 'none';
                    }, 2000);
                })
                .catch((error) => {
                    console.error('❌ Failed to send booking request:', error);
                    alert('❌ Failed to send booking request. Please try again later.');
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Booking Request';
                });
        });
    } else {
        console.error('Booking form not found');
    }

    //contact form submission
    emailjs.init('NINLsGFU3T_M2zjP7'); // Your public key

    async function fetchIP() {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            return data.ip;
        } catch (err) {
            return 'Unavailable';
        }
    }

    function getDeviceInfo() {
        return navigator.userAgent || 'Unknown';
    }

    document.getElementById('contactForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = this;
        const submitBtn = form.querySelector('.submit-btn');

        document.getElementById('timestamp').value = new Date().toLocaleString();
        document.getElementById('device').value = getDeviceInfo();
        document.getElementById('ip').value = await fetchIP();

        const modal = document.getElementById('booking-success-modal');
        const overlay = document.getElementById('booking-overlay');
        const message = document.getElementById('modal-message');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        emailjs.sendForm('service_aryapg', 'template_contact', form)
            .then((response) => {
                console.log('✅ Email sent successfully:', response);
                form.reset();

                // Set success message and color
                message.textContent = '✅ Booking request sent successfully!';
                message.style.color = '#2e7d32';

                modal.style.display = 'block';
                overlay.style.display = 'block';

                setTimeout(() => {
                    modal.style.display = 'none';
                    overlay.style.display = 'none';
                }, 2500);
            })
            .catch((error) => {
                console.error('❌ Email send error:', error);

                // Set error message and color
                message.textContent = '❌ Failed to send message. Please try again later.';
                message.style.color = '#c62828';

                modal.style.display = 'block';
                overlay.style.display = 'block';

                setTimeout(() => {
                    modal.style.display = 'none';
                    overlay.style.display = 'none';

                    // Optional: Reset to default message for next use
                    message.textContent = '✅ Booking request sent successfully!';
                    message.style.color = '#2e7d32';
                }, 2000);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
    });


    // Smooth scrolling function
    function scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Loading animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, observerOptions);

    // Observe all sections for loading animations
    document.addEventListener('DOMContentLoaded', () => {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.classList.add('loading');
            observer.observe(section);
        });

        // Set minimum date for check-in
        const checkinInput = document.getElementById('checkin');
        if (checkinInput) {
            const today = new Date().toISOString().split('T')[0];
            checkinInput.setAttribute('min', today);
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Active menu link on scroll
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get current scroll position
    const scrollPosition = window.scrollY;
    
    // Loop through sections to find the one in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Offset for better UX
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active-link');
            });
            
            // Add active class to corresponding nav link
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active-link');
            }
        }
    });
}

// Domain renewal modal and countdown
const DOMAIN_RENEWAL_API_URL = 'https://vjkjvombhckuawwmdbis.supabase.co/functions/v1/domain-status';

function padCountdownValue(value) {
    return String(value).padStart(2, '0');
}

function formatCurrencyINR(value) {
    const amount = Number(value || 0);
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDateLabel(value) {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(parsed);
}

function createDomainRenewalModal() {
    if (document.getElementById('domainRenewalModal')) {
        return document.getElementById('domainRenewalModal');
    }

    const modal = document.createElement('div');
    modal.id = 'domainRenewalModal';
    modal.className = 'domain-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
        <div class="domain-modal__backdrop" data-domain-modal-close></div>
        <div class="domain-modal__dialog" role="document">
            <button type="button" class="domain-modal__close" aria-label="Close renewal notice" data-domain-modal-close>&times;</button>
            <div class="domain-modal__header">
                <div class="domain-modal__icon" aria-hidden="true">
                    <i class="fas fa-globe"></i>
                </div>
                <div>
                    <p class="domain-modal__eyebrow">Domain Renewal Notice</p>
                    <h2 id="domainRenewalTitle">Domain</h2>
                </div>
            </div>
            <div class="domain-modal__grid">
                <div class="domain-modal__item">
                    <span><i class="fas fa-globe" aria-hidden="true"></i> Domain</span>
                    <strong id="domainRenewalDomain">website.com</strong>
                </div>
                <div class="domain-modal__item">
                    <span><i class="fas fa-tag" aria-hidden="true"></i> Renewal Price</span>
                    <strong id="domainRenewalPrice">₹0</strong>
                </div>
                <div class="domain-modal__item">
                    <span><i class="fas fa-calendar-days" aria-hidden="true"></i> Payment Last Date</span>
                    <strong id="domainPaymentDeadline">N/A</strong>
                </div>
                <div class="domain-modal__item">
                    <span><i class="fas fa-clock" aria-hidden="true"></i> Expiration Date</span>
                    <strong id="domainExpirationDate">N/A</strong>
                </div>
                <div class="domain-modal__item">
                    <span><i class="fas fa-registered" aria-hidden="true"></i> Registered Date</span>
                    <strong id="domainRegisteredDate">N/A</strong>
                </div>
                <div class="domain-modal__item">
                    <span><i class="fas fa-rotate" aria-hidden="true"></i> Status</span>
                    <strong class="domain-modal__renew-text">Renew Required</strong>
                </div>
            </div>
            <div class="domain-modal__payment-note" id="domainModalMessage">Please make a payment to renew the domain and keep the website online.</div>
            <a class="domain-modal__pay-btn" id="domainPayButton" href="#" target="_blank" rel="noopener noreferrer">Pay Now</a>
            <p class="domain-modal__deadline" id="domainDeadlineLabel">Payment Last Date: N/A</p>
            <div class="domain-modal__countdown-wrap">
                <p class="domain-modal__countdown-title">Remaining Time</p>
                <div class="domain-modal__countdown" aria-live="polite">
                    <div class="domain-modal__time-block">
                        <strong id="domainDays">00</strong>
                        <span>Days</span>
                    </div>
                    <div class="domain-modal__separator">:</div>
                    <div class="domain-modal__time-block">
                        <strong id="domainHours">00</strong>
                        <span>Hours</span>
                    </div>
                    <div class="domain-modal__separator">:</div>
                    <div class="domain-modal__time-block">
                        <strong id="domainMinutes">00</strong>
                        <span>Minutes</span>
                    </div>
                    <div class="domain-modal__separator">:</div>
                    <div class="domain-modal__time-block">
                        <strong id="domainSeconds">00</strong>
                        <span>Seconds</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    return modal;
}

function openDomainRenewalModal(modal) {
    if (!modal) return;
    modal.classList.add('is-visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('domain-modal-open');
}

function closeDomainRenewalModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('domain-modal-open');
}

function updateDomainCountdown(modal, deadlineTimestamp) {
    const daysEl = modal?.querySelector('#domainDays');
    const hoursEl = modal?.querySelector('#domainHours');
    const minutesEl = modal?.querySelector('#domainMinutes');
    const secondsEl = modal?.querySelector('#domainSeconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        return;
    }

    const remaining = Math.max(deadlineTimestamp - Date.now(), 0);
    const totalSeconds = Math.floor(remaining / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = padCountdownValue(days);
    hoursEl.textContent = padCountdownValue(hours);
    minutesEl.textContent = padCountdownValue(minutes);
    secondsEl.textContent = padCountdownValue(seconds);
}

function populateDomainModal(modal, data) {
    if (!modal || !data) return;

    const domain = (data.domain || window.location.hostname || 'website.com').toLowerCase();
    const renewPrice = formatCurrencyINR(data.renewal_price ?? 0);
    const paymentDeadline = data.payment_deadline || data.paymentLastDate || '';
    const expirationDate = data.expiration_date || data.expirationDate || '';
    const registeredDate = data.registered_date || data.registeredDate || '';
    const customMessage = data.custom_message || 'Please make a payment to renew the domain and keep the website online.';

    const title = modal.querySelector('#domainRenewalTitle');
    const domainName = modal.querySelector('#domainRenewalDomain');
    const price = modal.querySelector('#domainRenewalPrice');
    const deadline = modal.querySelector('#domainPaymentDeadline');
    const expiration = modal.querySelector('#domainExpirationDate');
    const registered = modal.querySelector('#domainRegisteredDate');
    const message = modal.querySelector('#domainModalMessage');
    const deadlineLabel = modal.querySelector('#domainDeadlineLabel');
    const payButton = modal.querySelector('#domainPayButton');

    if (title) title.textContent = domain;
    if (domainName) domainName.textContent = domain;
    if (price) price.textContent = renewPrice;
    if (deadline) deadline.textContent = formatDateLabel(paymentDeadline);
    if (expiration) expiration.textContent = formatDateLabel(expirationDate);
    if (registered) registered.textContent = formatDateLabel(registeredDate);
    if (message) message.textContent = customMessage;
    if (deadlineLabel) deadlineLabel.textContent = `Payment Last Date: ${formatDateLabel(paymentDeadline)}`;
    if (payButton) {
        payButton.href = data.payment_link || '#';
        payButton.textContent = 'Pay Now';
    }

    const closeButton = modal.querySelector('.domain-modal__close');
    const allowClose = data.modal_allow_close === true;

    if (!allowClose) {
        closeButton?.setAttribute('title', 'Payment required');
        closeButton?.classList.add('is-disabled');
        if (message) {
            message.textContent = customMessage || 'Please make a payment or contact Site Administration.';
        }
    } else {
        closeButton?.classList.remove('is-disabled');
    }

    const paymentDeadlineValue = paymentDeadline ? new Date(paymentDeadline).getTime() : Date.now() + 86400000;
    updateDomainCountdown(modal, paymentDeadlineValue);
    setInterval(() => updateDomainCountdown(modal, paymentDeadlineValue), 1000);
}

function bindDomainModalEvents(modal, modalSettings) {
    if (!modal) return;

    const closeControls = modal.querySelectorAll('[data-domain-modal-close]');
    const message = modal.querySelector('#domainModalMessage');

    closeControls.forEach(control => {
        control.addEventListener('click', () => {
            if (modalSettings.modal_allow_close === false) {
                if (message) {
                    message.textContent = 'Please make a payment or contact Site Administration.';
                    message.classList.add('domain-modal__payment-note--blocked');
                }
                return;
            }
            closeDomainRenewalModal(modal);
        });
    });

    document.addEventListener('keydown', function handleDomainModalKeydown(event) {
        if (event.key !== 'Escape') return;
        if (!modal.classList.contains('is-visible')) return;
        if (modalSettings.modal_allow_close === false) {
            if (message) {
                message.textContent = 'Please make a payment or contact Site Administration.';
                message.classList.add('domain-modal__payment-note--blocked');
            }
            return;
        }
        closeDomainRenewalModal(modal);
    }, { once: false });
}

document.addEventListener('DOMContentLoaded', () => {
    const domainModal = createDomainRenewalModal();
    if (!domainModal) return;

    fetch(DOMAIN_RENEWAL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: window.location.hostname })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Domain status fetch failed');
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.modal_enabled !== true) {
                domainModal.remove();
                return;
            }

            populateDomainModal(domainModal, data);
            bindDomainModalEvents(domainModal, data);
            openDomainRenewalModal(domainModal);
        })
        .catch(() => {
            domainModal.remove();
        });
});

// Add scroll event listener for highlighting active nav link
window.addEventListener('scroll', highlightNavOnScroll);

// Initialize active link on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize active link
    highlightNavOnScroll();
});
