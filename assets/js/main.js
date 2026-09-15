/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* Menu show */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/* Menu hidden */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE BACKGROUND HEADER ===============*/
const scrollHeader = () =>{
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    this.scrollY >= 50 ? header.classList.add('bg-header') 
                       : header.classList.remove('bg-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== SCROLL SECTIONS ACTIVE LINK (IntersectionObserver) ===============*/
const sections = document.querySelectorAll('section[id]')

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // Trigger when 30% of the section is visible
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            const sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');
            
            // Remove active class from all links
            document.querySelectorAll('.nav__menu a').forEach(a => a.classList.remove('active-link'));
            
            if (sectionsClass) {
                sectionsClass.classList.add('active-link');
            }
        }
    });
};

const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => sectionObserver.observe(section));

/*=============== SHOW SCROLL UP ===============*/ 
let scrollTimeout;
const scrollUp = () =>{
    if (scrollTimeout) return;
    scrollTimeout = requestAnimationFrame(() => {
        const scrollUp = document.getElementById('scroll-up')
        window.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                              : scrollUp.classList.remove('show-scroll')
        scrollTimeout = null;
    });
}
window.addEventListener('scroll', scrollUp, { passive: true })


/*=============== HOME CIRCULAR TEXT ===============*/
const text = document.querySelector('.home__circular-text');
if (text) {
    const chars = text.innerText.split('');
    text.innerText = '';
    chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.innerText = char;
        // Calculate rotation based on the number of characters and 360 degrees
        span.style.transform = `rotate(${i * (360 / chars.length)}deg)`;
        text.appendChild(span);
    });
}

/*=============== TYPED JS ===============*/
if (document.getElementById('home-typed')) {
    var typed = new Typed('#home-typed', {
        strings: ['Enthusiast', 'Developer', 'Designer'],
        typeSpeed: 50,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
    });
}

/*=============== CUSTOM CURSOR & DOT MATRIX BACKGROUND ===============*/
const cursor = document.getElementById('cursor');
const canvas = document.getElementById('dot-matrix');

if (cursor && canvas) {
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    let width, height;
    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    
    // Custom cursor variables
    let mouseX = width / 2;
    let mouseY = height / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });
    
    // Grid settings
    const spacing = 35; // Space between dots
    const mouseRadius = 150; // Interaction radius
    
    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Smooth scrolling parallax offset
        const yOffset = (scrollY * 0.5) % spacing;
        
        // Determine color based on theme
        const isLight = document.body.classList.contains('light-theme');
        const dotColor = isLight ? '0, 0, 0' : '255, 255, 255';
        
        for (let x = 0; x <= width; x += spacing) {
            for (let y = -spacing; y <= height + spacing; y += spacing) {
                const drawY = y - yOffset;
                
                const dx = x - mouseX;
                const dy = drawY - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                let radius = 1.5;
                let opacity = 0.15;
                let offsetX = 0;
                let offsetY = 0;
                
                // Interaction when close to mouse
                if (dist < mouseRadius) {
                    const factor = 1 - dist / mouseRadius;
                    radius = 1.5 + factor * 2.5;
                    opacity = 0.15 + factor * 0.5;
                    
                    // Subtle push-away effect
                    const angle = Math.atan2(dy, dx);
                    const push = factor * 8;
                    offsetX = Math.cos(angle) * push;
                    offsetY = Math.sin(angle) * push;
                    
                    // Connect close dots to cursor
                    if (dist < mouseRadius * 0.6) {
                        ctx.beginPath();
                        ctx.moveTo(x + offsetX, drawY + offsetY);
                        ctx.lineTo(mouseX, mouseY);
                        ctx.strokeStyle = `rgba(${dotColor}, ${factor * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
                
                ctx.beginPath();
                ctx.arc(x + offsetX, drawY + offsetY, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${dotColor}, ${opacity})`;
                ctx.fill();
            }
        }
        
        // Custom cursor animation (smooth follow)
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        
        if(cursor.style.display === 'none' || !cursor.style.display) {
            cursor.style.display = 'block';
        }
        
        requestAnimationFrame(animate);
    };
    animate();
    
    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .bento-card, .nav__toggle, .nav__close');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });
}

/*=============== SWIPER WORKS ===============*/
let swiperWorks = new Swiper('.work__content', {
    spaceBetween: 24,
    loop: true,
    grabCursor: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        576: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 2,
        },
        1150: {
            slidesPerView: 3,
        }
    }
});

/*=============== SERVICES BENTO HOVER EFFECT ===============*/
const bentoCards = document.querySelectorAll('.bento-card');

bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
        const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
        
        card.style.setProperty('--x', `${x}%`);
        card.style.setProperty('--y', `${y}%`);
    });
});

/*=============== EMAIL JS (Mock setup) ===============*/
const contactForm = document.getElementById('contact-form'),
      contactMessage = document.getElementById('contact-message');

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'bottom', // Start animations slightly from bottom for a natural lift
    distance: '80px', // Slightly longer distance
    duration: 1200,   // Faster, snappier duration (was 2500)
    delay: 200,       // Quicker delay
    easing: 'cubic-bezier(0.2, 1, 0.2, 1)', // Smooth ease out
    // reset: true // Animations repeat
})

sr.reveal(`.home__data, .about__data, .skills__info, .testimonials__data`)
sr.reveal(`.home__img-box, .home__circular, .about__img-box`, {delay: 300, origin: 'bottom'})
sr.reveal(`.work__card, .bento-card`, {interval: 150})
sr.reveal(`.skills__group, .testimonials__slider`, {interval: 150, origin: 'right'})
sr.reveal(`.contact__info`, {origin: 'left', delay: 200})
sr.reveal(`.contact__form`, {origin: 'right', delay: 300})
sr.reveal(`.footer__title`, {origin: 'bottom'})
sr.reveal(`.footer__links li`, {origin: 'bottom', interval: 100, delay: 300})
sr.reveal(`.footer__socials a`, {origin: 'bottom', interval: 100, delay: 400})
sr.reveal(`.footer__copy`, {origin: 'bottom', delay: 600})

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const lightTheme = 'light-theme'
const iconTheme = 'ri-sun-line'

// Previously selected theme (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the light-theme class
const getCurrentTheme = () => document.body.classList.contains(lightTheme) ? 'light' : 'dark'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-sun-line' : 'ri-moon-line'

// We validate if the user previously chose a theme
if (selectedTheme) {
  document.body.classList[selectedTheme === 'light' ? 'add' : 'remove'](lightTheme)
  themeButton.classList[selectedIcon === 'ri-sun-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
if (themeButton) {
  themeButton.addEventListener('click', () => {
      // Add or remove the light / icon theme
      document.body.classList.toggle(lightTheme)
      themeButton.classList.toggle(iconTheme)
      // We save the theme and the current icon that the user chose
      localStorage.setItem('selected-theme', getCurrentTheme())
      localStorage.setItem('selected-icon', getCurrentIcon())
  })
}

/*=============== FOOTER ASCII WAVE ===============*/
const asciiCanvas = document.getElementById('ascii-canvas');
if (asciiCanvas) {
    const ctx = asciiCanvas.getContext('2d');
    
    let width, height;
    const resizeAscii = () => {
        width = asciiCanvas.width = asciiCanvas.parentElement.clientWidth;
        height = asciiCanvas.height = 300;
    };
    window.addEventListener('resize', resizeAscii);
    resizeAscii();

    // The characters from the user's reference, from darkest/thinnest to brightest/densest
    const chars = " .,-~:;=!*#$";
    let time = 0;

    const nameAscii = [
        "  ___  ___  _   _ __  __ __   __ _      _ ___ _____ ",
        " / __|/ _ \\| | | |  \\/  |\\ \\ / //_\\  _ | |_ _|_   _|",
        " \\__ \\ (_) | |_| | |\\/| | \\ V // _ \\| || || |  | |  ",
        " |___/\\___/ \\___/|_|  |_|  |_|/_/ \\_\\\\__/|___| |_|  "
    ];

    const bioText = ">> AI & ML ENTHUSIAST | DEVELOPER <<";
    const codeLines = [
        "sys.boot(0x00F);",
        "load(AI_MODELS);",
        "while(true) {",
        "  optimize();",
        "}"
    ];

    const drawAsciiWave = () => {
        // Clear background
        ctx.clearRect(0, 0, width, height);
        
        // Determine color based on theme
        const isLight = document.body.classList.contains('light-theme');
        ctx.fillStyle = isLight ? '#000000' : '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const cols = Math.floor(width / 12); 
        const rows = Math.floor(height / 12); 
        
        // Calculate center position for the name
        const nameWidth = nameAscii[0].length;
        const nameHeight = nameAscii.length;
        const startX = Math.floor((cols - nameWidth) / 2);
        const startY = Math.floor((rows - nameHeight) / 2);
        
        // Calculate position for bio
        const bioStartX = Math.floor((cols - bioText.length) / 2);
        const bioY = startY + nameHeight + 1; // One row below the name

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                
                let drawNameChar = false;
                let charToDraw = '';
                let isHighlight = false;
                
                // Check if we are inside the bounding box of the ASCII name
                if (x >= startX && x < startX + nameWidth && y >= startY && y < startY + nameHeight) {
                    const nameChar = nameAscii[y - startY][x - startX];
                    if (nameChar !== ' ') {
                        drawNameChar = true;
                        charToDraw = nameChar;
                        isHighlight = true;
                    }
                } 
                // Check if we are inside the bio text
                else if (y === bioY && x >= bioStartX && x < bioStartX + bioText.length) {
                    drawNameChar = true;
                    charToDraw = bioText[x - bioStartX];
                    isHighlight = true;
                }
                // Check if we are drawing the live program code on the left (if screen is wide enough)
                else if (cols > 70 && x >= 4 && x < 30 && y >= rows - codeLines.length - 2 && y < rows - 2) {
                    const lineIdx = y - (rows - codeLines.length - 2);
                    const line = codeLines[lineIdx];
                    if (x - 4 < line.length) {
                        drawNameChar = true;
                        charToDraw = line[x - 4];
                        // Simulate typing or glitching
                        if (Math.random() < 0.01) {
                            charToDraw = chars[Math.floor(Math.random() * chars.length)];
                        }
                    }
                }

                if (drawNameChar) {
                    // Draw the specific character
                    ctx.globalAlpha = isHighlight ? 1.0 : 0.7;
                    if (isHighlight) {
                        ctx.shadowBlur = 8;
                        ctx.shadowColor = isLight ? '#000000' : '#ffffff';
                    } else {
                        ctx.shadowBlur = 0;
                    }
                    ctx.fillText(charToDraw, x * 12 + 6, y * 12 + 6);
                    ctx.shadowBlur = 0; // reset
                } else {
                    // Draw the interference pattern background
                    const nx = (x / cols) * 20 - 10;
                    const ny = (y / rows) * 10 - 5;
                    
                    const d1 = Math.sqrt(Math.pow(nx - Math.sin(time * 0.7) * 4, 2) + Math.pow(ny - Math.cos(time * 0.8) * 2, 2));
                    const d2 = Math.sqrt(Math.pow(nx + Math.cos(time * 0.5) * 4, 2) + Math.pow(ny + Math.sin(time * 0.6) * 2, 2));
                    const d3 = Math.sqrt(Math.pow(nx - Math.cos(time * 0.9) * 2, 2) + Math.pow(ny + Math.sin(time * 0.4) * 3, 2));

                    const v = Math.sin(d1 * 1.5 - time * 2) + Math.sin(d2 * 1.5 + time) + Math.cos(d3 * 1.5 - time);
                    
                    let z = (v + 3) / 6;
                    if (z < 0) z = 0;
                    if (z > 1) z = 1;
                    
                    // Add some random noise to the background for the "live program" feel
                    if (Math.random() < 0.02) {
                        z = Math.random();
                    }
                    
                    const charIndex = Math.floor(z * (chars.length - 1));
                    const char = chars[charIndex];
                    
                    // Make background significantly fainter to let the text pop
                    ctx.globalAlpha = 0.15;
                    ctx.fillText(char, x * 12 + 6, y * 12 + 6);
                }
            }
        }
        ctx.globalAlpha = 1.0;

        time += 0.05;
        requestAnimationFrame(drawAsciiWave);
    };
    
    drawAsciiWave();
}

/*=============== NEURAL INTERFACE ANIMATION ===============*/
const neuralCanvas = document.getElementById('neural-canvas');
const epochCountEl = document.getElementById('epoch-count');
const lossValueEl = document.getElementById('loss-value');
const accuracyValueEl = document.getElementById('accuracy-value');

if (neuralCanvas) {
    const ctx = neuralCanvas.getContext('2d', { alpha: false });
    const width = neuralCanvas.width;
    const height = neuralCanvas.height;
    
    let particles = [];
    const particleCount = 800; // Increased for shape density
    const connectionDistance = 40;
    
    let mouse = { x: width / 2, y: height / 2, active: false };
    let isRepelling = false; // Toggle for magnetic attract/repel
    
    // Track mouse on canvas
    neuralCanvas.addEventListener('mousemove', (e) => {
        const rect = neuralCanvas.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) * (width / rect.width);
        mouse.y = (e.clientY - rect.top) * (height / rect.height);
        mouse.active = true;
    });
    
    neuralCanvas.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Toggle attract/repel on click
    neuralCanvas.addEventListener('click', () => {
        isRepelling = !isRepelling;
    });

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
            baseX: Math.random() * width,
            baseY: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5
        });
    }

    let time = 0;
    const drawNeuralNetwork = () => {
        const isLight = document.body.classList.contains('light-theme');
        const bgColor = isLight ? '#ffffff' : '#000000';
        const pColor = isLight ? '#000000' : '#ffffff';
        const pColorRgb = isLight ? '0,0,0' : '255,255,255';
        const highlightColor = isRepelling ? 'rgba(255, 60, 60,' : 'rgba(39, 201, 63,';

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // Sphere specific rotation logic
        time += 0.01;
        const radius = 130;
        for (let i = 0; i < particles.length; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5) + time;
            particles[i].baseX = width / 2 + Math.cos(theta) * Math.sin(phi) * radius;
            particles[i].baseY = height / 2 + Math.sin(theta) * Math.sin(phi) * radius;
        }

        ctx.fillStyle = pColor;

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Ease towards base target
            const dxTarget = p.baseX - p.x;
            const dyTarget = p.baseY - p.y;
            p.vx += dxTarget * 0.01;
            p.vy += dyTarget * 0.01;
            
            // Magnetic Mouse interaction
            if (mouse.active) {
                const dxm = p.x - mouse.x;
                const dym = p.y - mouse.y;
                const distm = Math.sqrt(dxm * dxm + dym * dym);
                
                if (distm < 100) {
                    const force = (100 - distm) / 100;
                    if (isRepelling) {
                        p.vx += (dxm / distm) * force * 5;
                        p.vy += (dym / distm) * force * 5;
                    } else {
                        p.vx -= (dxm / distm) * force * 2;
                        p.vy -= (dym / distm) * force * 2;
                    }
                }
            }
            
            // Friction/Damping
            p.vx *= 0.85;
            p.vy *= 0.85;
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Draw particle
            ctx.fillRect(p.x, p.y, p.radius * 2, p.radius * 2);
            
            // Connect to nearby particles (optimized)
            for (let j = i + 1; j < Math.min(i + 15, particles.length); j++) {
                let p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy; // avoid sqrt for speed
                
                if (distSq < connectionDistance * connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const opacity = 1 - (Math.sqrt(distSq) / connectionDistance);
                    ctx.strokeStyle = `rgba(${pColorRgb}, ${opacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        // Draw Mouse magnetic field indicator
        if (mouse.active) {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 15, 0, Math.PI * 2);
            ctx.strokeStyle = highlightColor + '0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
            ctx.strokeStyle = highlightColor + '0.1)';
            ctx.stroke();
            
            // Draw plus or minus to indicate mode
            ctx.fillStyle = highlightColor + '0.8)';
            ctx.font = '14px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(isRepelling ? '−' : '+', mouse.x, mouse.y);
        }
        
        requestAnimationFrame(drawNeuralNetwork);
    };
    
    drawNeuralNetwork();
    
    // Simulate fake AI training stats updates
    if (epochCountEl && lossValueEl && accuracyValueEl) {
        let currentEpoch = 142;
        let currentLoss = 0.0124;
        let currentAcc = 98.7;
        
        setInterval(() => {
            currentEpoch += 1;
            if (currentEpoch > 500) currentEpoch = 1;
            
            currentLoss = Math.max(0.0001, currentLoss - (Math.random() * 0.001));
            currentAcc = Math.min(99.99, currentAcc + (Math.random() * 0.05));
            
            if (currentEpoch === 1) {
                currentLoss = 0.5 + Math.random() * 0.5;
                currentAcc = 40 + Math.random() * 20;
            }
            
            epochCountEl.innerText = currentEpoch;
            lossValueEl.innerText = currentLoss.toFixed(4);
            accuracyValueEl.innerText = currentAcc.toFixed(2) + '%';
        }, 1500);
    }
}
