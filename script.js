document.addEventListener('DOMContentLoaded', function() {

    // Hero Section Counter Animation
    const heroSection = document.getElementById('hero');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animationTriggered = false;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationTriggered) {
                animationTriggered = true;
                statNumbers.forEach(statNumber => {
                    const target = parseInt(statNumber.getAttribute('data-count'));
                    let count = 0;
                    const duration = 2000;
                    const increment = target / (duration / 10);

                    const updateCount = () => {
                        statNumber.textContent = Math.ceil(count) + '+';
                        if (count < target) {
                            count += increment;
                            setTimeout(updateCount, 10);
                        } else {
                            statNumber.textContent = target + '+';
                        }
                    };
                    updateCount();
                });
            }
        });
    }, observerOptions);

    if (heroSection) {
        observer.observe(heroSection);
    }

    // Services Section Carousel Navigation
    const scroller = document.getElementById('services-scroller');
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');

    if (scroller && leftArrow && rightArrow) {
        leftArrow.addEventListener('click', () => {
            scroller.scrollBy({
                left: -320,
                behavior: 'smooth'
            });
        });

        rightArrow.addEventListener('click', () => {
            scroller.scrollBy({
                left: 320,
                behavior: 'smooth'
            });
        });
    }

    // Research Magazine Carousel
    const magazineCarousel = document.getElementById('magazine-carousel');
    const cubeIndicators = document.querySelectorAll('.cube-indicator');
    let currentSlide = 0;
    const totalSlides = cubeIndicators.length;

    function updateMagazineCarousel() {
        const itemWidth = magazineCarousel.children[0].offsetWidth;
        magazineCarousel.style.transform = `translateX(-${currentSlide * itemWidth}px)`;

        cubeIndicators.forEach(indicator => indicator.classList.remove('active'));
        cubeIndicators[currentSlide].classList.add('active');
    }

    cubeIndicators.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.dataset.slide);
            currentSlide = slideIndex;
            updateMagazineCarousel();
        });
    });

    // Auto-advance the carousel every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateMagazineCarousel();
    }, 5000);
    
    // Health Tips Dynamic Generation and Mobile Toggle
    const healthTips = [
        "Stay hydrated! Drink at least 8 glasses of water a day.",
        "Eat a balanced diet rich in fruits, vegetables, and lean proteins.",
        "Aim for at least 30 minutes of moderate exercise most days of the week.",
        "Prioritize sleep. Most adults need 7-9 hours of quality sleep per night.",
        "Wash your hands frequently with soap and water to prevent the spread of germs.",
        "Don't skip your annual check-up, even if you feel healthy.",
        "Manage stress through activities like meditation, yoga, or spending time in nature.",
        "Limit your intake of processed foods, sugar, and unhealthy fats."
    ];

    const healthTipsListDesktop = document.getElementById('health-tips-list-desktop');
    const healthTipsListMobile = document.getElementById('health-tips-list-mobile');

    const generateTips = (container) => {
        if (container) {
            healthTips.forEach(tip => {
                const tipElement = document.createElement('p');
                tipElement.className = 'health-tip';
                tipElement.textContent = tip;
                container.appendChild(tipElement);
            });
        }
    };

    // Generate tips for both desktop and mobile containers
    generateTips(healthTipsListDesktop);
    generateTips(healthTipsListMobile);

    // Mobile sidebar toggle functionality
    const toggleTipsBtn = document.getElementById('toggle-tips-btn');
    const closeTipsBtn = document.getElementById('close-tips-btn');
    const tipsSidebar = document.getElementById('health-tips-sidebar');

    if (toggleTipsBtn && tipsSidebar) {
        toggleTipsBtn.addEventListener('click', () => {
            tipsSidebar.classList.add('open');
        });
    }

    if (closeTipsBtn && tipsSidebar) {
        closeTipsBtn.addEventListener('click', () => {
            tipsSidebar.classList.remove('open');
        });
    }

    // Emergency Modal Functionality
    const emergencyBtns = document.querySelectorAll('.emergency-btn');
    const emergencyModal = new bootstrap.Modal(document.getElementById('emergencyModal'));
    const getRouteBtn = document.getElementById('getRouteBtn');
    const clearRouteBtn = document.getElementById('clearRouteBtn');
    const routeResultDiv = document.getElementById('routeResult');
    const routeMapDiv = document.getElementById('routeMap');
    const incidentTypeSelect = document.getElementById('incidentType');
    const firstAidResultDiv = document.getElementById('firstAidResult');

    if (emergencyBtns.length > 0) {
        emergencyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                emergencyModal.show();
            });
        });
    }

    const hospitalDestination = 'Mile 1, Port Harcourt, around Emenike, Mile One Flyover';
    const apiKey = 'AIzaSyDtXupr2Oeq1NiTpe-ecQhCgZHuqH4Klwg';

    // New reset function to clear the route and map
    function resetRoute() {
        routeResultDiv.classList.add('d-none');
        routeResultDiv.classList.remove('alert-success', 'alert-warning', 'alert-info');
        routeResultDiv.innerHTML = '<i class="fas fa-route"></i> Calculating best route...';
        routeMapDiv.innerHTML = ''; // Clear the map iframe
    }

    // Add click listener to the new clear button
    if (clearRouteBtn) {
        clearRouteBtn.addEventListener('click', resetRoute);
    }

    if (getRouteBtn) {
        getRouteBtn.addEventListener('click', () => {
            if (navigator.geolocation) {
                routeResultDiv.classList.remove('d-none', 'alert-success', 'alert-warning');
                routeResultDiv.classList.add('alert-info');
                routeResultDiv.innerHTML = '<i class="fas fa-route"></i> Getting your location...';

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;
                        const userLocation = `${userLat},${userLng}`;

                        // The Maps Embed API URL returns HTML, not JSON, which caused the SyntaxError.
                        // We need to use the Directions API to get the travel time data in JSON format.
                        fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${userLocation}&destination=${encodeURIComponent(hospitalDestination)}&key=${apiKey}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(data => {
                                if (data.status === 'OK' && data.routes.length > 0) {
                                    const route = data.routes[0];
                                    const leg = route.legs[0];
                                    const travelDuration = leg.duration.text;

                                    routeResultDiv.innerHTML = `<i class="fas fa-car-side"></i> Estimated travel time: <strong>${travelDuration}</strong>`;
                                    routeResultDiv.classList.add('alert-success');
                                    routeResultDiv.classList.remove('alert-info');

                                    // Use the correct Maps Embed URL to display the route
                                    const mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${userLocation}&destination=${encodeURIComponent(hospitalDestination)}`;
                                    if (routeMapDiv) {
                                        routeMapDiv.innerHTML = `<iframe src="${mapSrc}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
                                    }
                                } else {
                                    routeResultDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error: Unable to calculate route. Please try again.';
                                    routeResultDiv.classList.remove('d-none', 'alert-success', 'alert-info');
                                    routeResultDiv.classList.add('alert-warning');
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching directions:', error);
                                routeResultDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error: Failed to connect to the directions service.';
                                routeResultDiv.classList.remove('d-none', 'alert-success', 'alert-info');
                                routeResultDiv.classList.add('alert-warning');
                            });
                    },
                    (error) => {
                        routeResultDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error: Unable to get your location. Please check your browser settings.';
                        routeResultDiv.classList.remove('d-none', 'alert-success', 'alert-info');
                        routeResultDiv.classList.add('alert-warning');
                        console.error('Geolocation error:', error);
                    }
                );
            } else {
                routeResultDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Geolocation is not supported by your browser.';
                routeResultDiv.classList.remove('d-none', 'alert-success', 'alert-info');
                routeResultDiv.classList.add('alert-warning');
            }
        });
    }

    const firstAidTips = {
        cut: "Apply direct pressure with a clean cloth to stop the bleeding. Elevate the wound above the heart if possible. Do not remove any embedded objects.",
        burn: "Cool the burn with cool (not cold) running water for 10-20 minutes. Do not use ice. Cover with a sterile, non-fluffy dressing.",
        fracture: "Immobilize the injured area using a splint if possible. Do not try to realign the bone. Apply a cold pack to reduce swelling.",
        choking: "Administer the Heimlich maneuver. If the person becomes unconscious, begin CPR. Call for emergency help immediately.",
        fainting: "Lie the person down and elevate their legs slightly. Loosen any tight clothing. Once they regain consciousness, have them rest before standing up slowly."
    };

    if (incidentTypeSelect) {
        incidentTypeSelect.addEventListener('change', (e) => {
            const selectedType = e.target.value;
            const tip = firstAidTips[selectedType];
            
            if (tip) {
                firstAidResultDiv.innerHTML = `<i class="fas fa-hand-holding-medical"></i> <strong>First Aid:</strong> ${tip}`;
                firstAidResultDiv.classList.remove('d-none', 'alert-warning');
                firstAidResultDiv.classList.add('alert-info');
            }
        });
    }
});
