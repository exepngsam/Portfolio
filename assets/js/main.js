/*==================================================
   DOSSIER EDITORIAL MOTION SYSTEM & INTERACTION ENGINE
   Optimized for 60-120fps Zero-Lag Smooth Performance
==================================================*/

document.addEventListener('DOMContentLoaded', () => {
  /*--------------------------------------------------
    1. LENIS SMOOTH MOMENTUM SCROLLING & GSAP
  --------------------------------------------------*/
  let lenis;
  const isTouchOrMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 900;

  if (typeof Lenis !== 'undefined' && !isTouchOrMobile) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      infinite: false
    });

    // Synchronize Lenis with GSAP ScrollTrigger if present
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Desktop anchor smooth scrolling via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -40, duration: 1.3 });
          }
        }
      });
    });
  } else {
    // Mobile native smooth anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  /*--------------------------------------------------
    2. SCROLL PROGRESS DRIVER (--page-progress, --hero-blur, --dive-progress)
  --------------------------------------------------*/
  const root = document.documentElement;
  const siteNav = document.getElementById('site-nav');
  const heroSection = document.getElementById('hero');

  let scrollTicking = false;
  function updateScrollMetrics() {
    const scrollY = window.scrollY;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - winHeight;

    // Overall page progress (0 to 1)
    const pageProgress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
    root.style.setProperty('--page-progress', pageProgress.toFixed(4));

    // Nav scrolled state
    if (siteNav) {
      if (scrollY > 50) {
        siteNav.classList.add('scrolled');
      } else {
        siteNav.classList.remove('scrolled');
      }
    }

    // Hero lift & blur calculation (disabled on mobile to ensure zero lag & maximum readability)
    if (heroSection) {
      if (isTouchOrMobile) {
        root.style.setProperty('--hero-blur', '0');
      } else {
        const heroHeight = heroSection.offsetHeight;
        const heroBlurProgress = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.75)));
        root.style.setProperty('--hero-blur', heroBlurProgress.toFixed(4));
      }
    }

    scrollTicking = false;
  }

  function requestScrollTick() {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollMetrics);
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', requestScrollTick, { passive: true });
  updateScrollMetrics();

  /*--------------------------------------------------
    3. VARIABLE FONT PROXIMITY ENGINE (Roboto Flex)
       Cached layout metrics to prevent layout thrashing
  --------------------------------------------------*/
  const vftContainers = document.querySelectorAll('[data-variable-font-text]');
  const defaultBoldWght = 900;
  const defaultBoldWdth = 130;
  const pinchWght = 120;
  const pinchWdth = 30;
  const pinchRadius = 150;

  vftContainers.forEach((container) => {
    const text = container.getAttribute('data-text') || container.textContent.trim();
    container.innerHTML = '';

    const letters = text.split('').map((char) => {
      const span = document.createElement('span');
      span.className = 'vft-letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.fontVariationSettings = `"wght" ${defaultBoldWght}, "wdth" ${defaultBoldWdth}`;
      container.appendChild(span);
      return span;
    });

    let isMouseOver = false;
    let animFrame = null;
    let letterMetrics = [];

    function cacheMetrics() {
      letterMetrics = letters.map((span) => {
        const rect = span.getBoundingClientRect();
        return {
          span,
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2
        };
      });
    }

    function onMouseMove(e) {
      if (!isMouseOver) return;
      if (animFrame) cancelAnimationFrame(animFrame);

      animFrame = requestAnimationFrame(() => {
        for (let i = 0; i < letterMetrics.length; i++) {
          const item = letterMetrics[i];
          const dist = Math.hypot(e.clientX - item.cx, e.clientY - item.cy);

          if (dist < pinchRadius) {
            const factor = Math.max(0, 1 - dist / pinchRadius);
            const wght = Math.round(defaultBoldWght + (pinchWght - defaultBoldWght) * factor);
            const wdth = Math.round(defaultBoldWdth + (pinchWdth - defaultBoldWdth) * factor);
            item.span.style.fontVariationSettings = `"wght" ${wght}, "wdth" ${wdth}`;
          } else {
            item.span.style.fontVariationSettings = `"wght" ${defaultBoldWght}, "wdth" ${defaultBoldWdth}`;
          }
        }
      });
    }

    function onMouseLeave() {
      isMouseOver = false;
      if (animFrame) cancelAnimationFrame(animFrame);
      for (let i = 0; i < letters.length; i++) {
        letters[i].style.fontVariationSettings = `"wght" ${defaultBoldWght}, "wdth" ${defaultBoldWdth}`;
      }
    }

    container.addEventListener('mouseenter', () => {
      isMouseOver = true;
      cacheMetrics();
    });
    window.addEventListener('mousemove', (e) => {
      if (isMouseOver) onMouseMove(e);
    }, { passive: true });
    container.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', cacheMetrics, { passive: true });
  });

  /*--------------------------------------------------
    4. HERO ROTATING WORD (3D Flip Animation)
  --------------------------------------------------*/
  const rotatingWordEl = document.getElementById('hero-rotating-word');
  if (rotatingWordEl) {
    const words = [
      'INTELLIGENCE',
      'SYSTEMS',
      'NEURAL MODELS',
      'ZERO-BLOAT CODE',
      'AI EXPERIENCES'
    ];
    let currentIdx = 0;

    setInterval(() => {
      currentIdx = (currentIdx + 1) % words.length;
      rotatingWordEl.style.animation = 'none';
      void rotatingWordEl.offsetHeight; // force reflow
      rotatingWordEl.textContent = words[currentIdx];
      rotatingWordEl.style.animation = '0.55s cubic-bezier(0.22, 1, 0.36, 1) heroWordIn';
    }, 2600);
  }

  /*--------------------------------------------------
    5. HERO CINEMATIC VIDEO LIGHTBOX MODAL
  --------------------------------------------------*/
  const heroVidBtn = document.getElementById('hero-vid-btn');
  const heroModal = document.getElementById('hero-modal');
  const heroModalClose = document.getElementById('hero-modal-close');
  const heroModalVideo = document.getElementById('hero-modal-video');

  if (heroVidBtn && heroModal) {
    heroVidBtn.addEventListener('click', () => {
      heroModal.classList.add('active');
      if (heroModalVideo) {
        heroModalVideo.currentTime = 0;
        heroModalVideo.play();
      }
    });

    const closeModal = () => {
      heroModal.classList.remove('active');
      if (heroModalVideo) {
        heroModalVideo.pause();
      }
    };

    if (heroModalClose) heroModalClose.addEventListener('click', closeModal);
    heroModal.addEventListener('click', (e) => {
      if (e.target === heroModal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && heroModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  /*--------------------------------------------------
    6. LIQUID AMOEBA SPOTLIGHT REVEAL
       Pure SVG mask with cosmic human to chrome cyber suit transition
  --------------------------------------------------*/
  const revealCard = document.getElementById('reveal-card');
  const revealMaskShape = document.getElementById('reveal-mask-shape');
  const revealEdge = document.getElementById('reveal-edge');
  const revealEdgeGroup = document.getElementById('reveal-edge-group');

  if (revealCard && revealMaskShape && revealEdge) {
    let isHovering = false;
    let isForced = false;
    let targetR = 0;
    let currentR = 0;
    let targetX = 600;
    let targetY = 340;
    let currentX = 600;
    let currentY = 340;

    function getSvgCoords(clientX, clientY) {
      const rect = revealCard.getBoundingClientRect();
      const normX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const normY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      return {
        x: normX * 1200,
        y: normY * 680
      };
    }

    revealCard.addEventListener('mouseenter', (e) => {
      isHovering = true;
      revealCard.classList.add('is-active');
      if (!isForced) {
        targetR = 210;
      }
      const coords = getSvgCoords(e.clientX, e.clientY);
      targetX = coords.x;
      targetY = coords.y;
      currentX = targetX;
      currentY = targetY;
    });

    revealCard.addEventListener('mousemove', (e) => {
      const coords = getSvgCoords(e.clientX, e.clientY);
      targetX = coords.x;
      targetY = coords.y;
    }, { passive: true });

    revealCard.addEventListener('mouseleave', () => {
      isHovering = false;
      if (!isForced) {
        revealCard.classList.remove('is-active');
        targetR = 0;
      }
    });

    // Click to toggle full reveal mode (Suit revealed vs concealed)
    revealCard.addEventListener('click', () => {
      isForced = !isForced;
      if (isForced) {
        revealCard.classList.add('is-active');
        targetR = 1400;
      } else {
        targetR = isHovering ? 210 : 0;
        if (!isHovering) revealCard.classList.remove('is-active');
      }
    });

    // Mobile touch interaction
    revealCard.addEventListener('touchstart', (e) => {
      isHovering = true;
      revealCard.classList.add('is-active');
      targetR = isForced ? 1400 : 190;
      if (e.touches && e.touches[0]) {
        const coords = getSvgCoords(e.touches[0].clientX, e.touches[0].clientY);
        targetX = coords.x;
        targetY = coords.y;
        currentX = targetX;
        currentY = targetY;
      }
    }, { passive: true });

    revealCard.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const coords = getSvgCoords(e.touches[0].clientX, e.touches[0].clientY);
        targetX = coords.x;
        targetY = coords.y;
      }
    }, { passive: true });

    revealCard.addEventListener('touchend', () => {
      if (!isForced) {
        isHovering = false;
        revealCard.classList.remove('is-active');
        targetR = 0;
      }
    });

    function updateAmoeba() {
      // Smooth spring interpolation
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      currentR += (targetR - currentR) * 0.14;

      const rVal = Math.max(0, currentR);
      revealMaskShape.setAttribute('cx', currentX.toFixed(1));
      revealMaskShape.setAttribute('cy', currentY.toFixed(1));
      revealMaskShape.setAttribute('r', rVal.toFixed(1));

      revealEdge.setAttribute('cx', currentX.toFixed(1));
      revealEdge.setAttribute('cy', currentY.toFixed(1));
      revealEdge.setAttribute('r', rVal.toFixed(1));

      // Hide glowing stroke edge when radius is tiny or fully expanded
      if (revealEdgeGroup) {
        if (rVal < 2 || rVal > 1100) {
          revealEdgeGroup.style.opacity = '0';
        } else {
          revealEdgeGroup.style.opacity = '1';
        }
      }

      requestAnimationFrame(updateAmoeba);
    }
    requestAnimationFrame(updateAmoeba);
  }

  /*--------------------------------------------------
    7. INTERACTIVE ROLES LIST & CURSOR MEDIA FOLLOWER
  --------------------------------------------------*/
  const rolesList = document.getElementById('roles-list');
  const rolesPreview = document.getElementById('roles-cursor-preview');
  const rolesPreviewVideo = document.getElementById('roles-preview-video');
  const rolesPreviewImg = document.getElementById('roles-preview-img');

  if (rolesList && rolesPreview) {
    const roleMedia = [
      { type: 'video', src: 'assets/img/creative.mp4' },
      { type: 'image', src: 'assets/img/nexora_showcase.png' },
      { type: 'image', src: 'assets/img/trustverse_showcase.png' },
      { type: 'image', src: 'assets/img/agritech_showcase.png' }
    ];

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentPosX = mouseX;
    let currentPosY = mouseY;
    let isHoveringRoles = false;
    let roleAnimRunning = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function updateRoleCursorFollower() {
      if (!isHoveringRoles) {
        roleAnimRunning = false;
        return;
      }

      currentPosX += (mouseX - currentPosX) * 0.16;
      currentPosY += (mouseY - currentPosY) * 0.16;

      rolesPreview.style.left = `${currentPosX}px`;
      rolesPreview.style.top = `${currentPosY}px`;

      requestAnimationFrame(updateRoleCursorFollower);
    }

    const roleItems = rolesList.querySelectorAll('.roles-item');
    roleItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        isHoveringRoles = true;
        rolesPreview.classList.add('active');

        if (!roleAnimRunning) {
          roleAnimRunning = true;
          requestAnimationFrame(updateRoleCursorFollower);
        }

        const media = roleMedia[index % roleMedia.length];
        if (media.type === 'video' && rolesPreviewVideo) {
          rolesPreviewVideo.style.display = 'block';
          if (rolesPreviewImg) rolesPreviewImg.style.display = 'none';
          rolesPreviewVideo.src = media.src;
          rolesPreviewVideo.play();
        } else if (rolesPreviewImg) {
          if (rolesPreviewVideo) {
            rolesPreviewVideo.pause();
            rolesPreviewVideo.style.display = 'none';
          }
          rolesPreviewImg.style.display = 'block';
          rolesPreviewImg.src = media.src;
        }
      });
    });

    rolesList.addEventListener('mouseleave', () => {
      isHoveringRoles = false;
      rolesPreview.classList.remove('active');
      if (rolesPreviewVideo) rolesPreviewVideo.pause();
    });
  }

  /*--------------------------------------------------
    8. FEATURED WORKS LIGHTBOX MODAL
  --------------------------------------------------*/
  const fwModal = document.getElementById('fw-modal');
  const fwModalClose = document.getElementById('fw-modal-close');
  const fwModalTitle = document.getElementById('fw-modal-title');
  const fwModalDesc = document.getElementById('fw-modal-desc');
  const fwModalImg = document.getElementById('fw-modal-img');
  const fwModalDemo = document.getElementById('fw-modal-demo');
  const fwModalRepo = document.getElementById('fw-modal-repo');
  const fwCards = document.querySelectorAll('.fw-card');

  const projectDetails = {
    nexora: {
      title: 'Nexora — Autonomous AI Coordination Platform',
      desc: 'NEXORA 🚀 is an autonomous AI incident coordination platform that turns incoming infrastructure incidents into verified actions in real time. Equipped with distributed multi-agent meshes, telemetry synthesis, and automated self-healing pipelines.',
      img: 'assets/img/nexora_showcase.png',
      demo: 'https://nexora-three-mu.vercel.app/',
      repo: 'https://github.com/exepngsam/nexora'
    },
    civicfix: {
      title: 'CivicFix & AgriTech — Serverless AI Infrastructure',
      desc: 'High-throughput logistics and civic management engine optimizing real-time routing, farm inventory telemetry, and serverless AI infrastructure scaling on AWS.',
      img: 'assets/img/agritech_showcase.png',
      demo: 'https://civicfix-ai-roan.vercel.app/',
      repo: 'https://github.com/exepngsam/CivicFix'
    },
    truthseal: {
      title: 'TruthSeal / TrustVerse — Verifiable Digital Integrity',
      desc: 'Next-generation digital trust engine integrating cryptographic locks, real-time media forensics, and immutable provenance grids to detect deepfakes and verify content authenticity.',
      img: 'assets/img/trustverse_showcase.png',
      demo: 'https://truth-seal-ai.vercel.app/',
      repo: 'https://github.com/exepngsam/TruthSeal-AI'
    },
    yieldway: {
      title: 'YieldWay Algorithmic DeFi Platform',
      desc: 'YieldWay combines real-time financial market telemetry with machine learning predictive modeling for automated risk budgeting, liquidity provision, and high-yield strategy execution.',
      img: 'assets/img/yieldway.jpg',
      demo: 'https://github.com/exepngsam',
      repo: 'https://github.com/exepngsam'
    }
  };

  fwCards.forEach((card) => {
    const expandBtn = card.querySelector('.fw-expand-trigger');
    const projectKey = card.getAttribute('data-project');

    if (expandBtn && projectKey && projectDetails[projectKey]) {
      expandBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = projectDetails[projectKey];
        if (fwModalTitle) fwModalTitle.textContent = data.title;
        if (fwModalDesc) fwModalDesc.textContent = data.desc;
        if (fwModalImg) fwModalImg.src = data.img;
        if (fwModalDemo) fwModalDemo.href = data.demo;
        if (fwModalRepo) fwModalRepo.href = data.repo;

        fwModal.classList.add('active');
      });
    }
  });

  const closeFwModal = () => {
    if (fwModal) fwModal.classList.remove('active');
  };

  if (fwModalClose) fwModalClose.addEventListener('click', closeFwModal);
  if (fwModal) {
    fwModal.addEventListener('click', (e) => {
      if (e.target === fwModal) closeFwModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fwModal && fwModal.classList.contains('active')) {
      closeFwModal();
    }
  });

  /*--------------------------------------------------
    9. INTERACTIVE 3D NEURAL CANVAS & TELEMETRY
       IntersectionObserver to only render when in view
  --------------------------------------------------*/
  const neuralCanvas = document.getElementById('neural-canvas');
  const neuralSection = document.getElementById('neural');

  if (neuralCanvas && neuralSection) {
    const ctx = neuralCanvas.getContext('2d', { alpha: false });
    let width = (neuralCanvas.width = 440);
    let height = (neuralCanvas.height = 440);

    const isMobileDevice = window.innerWidth <= 768 || isTouchOrMobile;
    const particleCount = isMobileDevice ? 140 : 360;
    const particles = [];
    let mouse = { x: width / 2, y: height / 2, active: false };
    let isRepelling = false;
    let isVisible = false;
    let isRendering = false;

    function resizeCanvas() {
      const rect = neuralCanvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        width = neuralCanvas.width = Math.round(rect.width);
        height = neuralCanvas.height = Math.round(rect.height);
      }
    }
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    // Intersection Observer to prevent CPU/GPU consumption offscreen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !isRendering) {
          isRendering = true;
          requestAnimationFrame(renderNeuralMesh);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(neuralSection);

    neuralCanvas.addEventListener('mousemove', (e) => {
      const rect = neuralCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }, { passive: true });

    neuralCanvas.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    neuralCanvas.addEventListener('click', () => {
      isRepelling = !isRepelling;
    });

    // Initialize particles in 3D sphere projection
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        baseX: width / 2,
        baseY: height / 2,
        radius: Math.random() * 1.4 + 0.6
      });
    }

    let time = 0;
    function renderNeuralMesh() {
      if (!isVisible) {
        isRendering = false;
        return;
      }

      ctx.fillStyle = '#030406';
      ctx.fillRect(0, 0, width, height);

      time += 0.012;
      const sphereRadius = Math.min(width, height) * 0.35;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5) + time;
        particles[i].baseX = centerX + Math.cos(theta) * Math.sin(phi) * sphereRadius;
        particles[i].baseY = centerY + Math.sin(theta) * Math.sin(phi) * sphereRadius;
      }

      ctx.fillStyle = '#efe9d8';

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.vx += (p.baseX - p.x) * 0.018;
        p.vy += (p.baseY - p.y) * 0.018;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 110 * 110 && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (110 - dist) / 110;
            const factor = isRepelling ? force * 4.5 : -force * 2.5;
            p.vx += (dx / dist) * factor;
            p.vy += (dy / dist) * factor;
          }
        }

        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillRect(p.x, p.y, p.radius * 2, p.radius * 2);

        // Synaptic connections (optimized for zero lag)
        for (let j = i + 1; j < Math.min(i + 8, particleCount); j++) {
          const p2 = particles[j];
          const dxx = p.x - p2.x;
          const dyy = p.y - p2.y;
          const distSq = dxx * dxx + dyy * dyy;

          if (distSq < 34 * 34) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - Math.sqrt(distSq) / 34;
            ctx.strokeStyle = `rgba(239, 233, 216, ${opacity * 0.22})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Mouse field indicator
      if (mouse.active) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = isRepelling ? 'rgba(239, 68, 68, 0.7)' : 'rgba(34, 197, 94, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 110, 0, Math.PI * 2);
        ctx.strokeStyle = isRepelling ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)';
        ctx.stroke();
      }

      requestAnimationFrame(renderNeuralMesh);
    }

    // Simulated training telemetry updates
    const epochEl = document.getElementById('epoch-count');
    const lossEl = document.getElementById('loss-value');
    const accEl = document.getElementById('accuracy-value');

    if (epochEl && lossEl && accEl) {
      let epoch = 168;
      let loss = 0.0094;
      let acc = 99.12;

      setInterval(() => {
        epoch = (epoch + 1) % 600;
        loss = Math.max(0.0001, loss - (Math.random() * 0.0004));
        acc = Math.min(99.98, acc + (Math.random() * 0.02));

        if (epoch === 0) {
          loss = 0.42;
          acc = 78.4;
        }

        epochEl.textContent = epoch;
        lossEl.textContent = loss.toFixed(4);
        accEl.textContent = acc.toFixed(2) + '%';
      }, 1600);
    }
  }

  /*--------------------------------------------------
    10. NAVIGATION MOBILE DRAWER
  --------------------------------------------------*/
  const navMobileToggle = document.getElementById('nav-mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link');

  if (navMobileToggle && mobileDrawer) {
    navMobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
    };

    if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeDrawer);
    mobileDrawerLinks.forEach((link) => link.addEventListener('click', closeDrawer));
  }

  /*--------------------------------------------------
    11. CHATBOT WIDGET
  --------------------------------------------------*/
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');

  if (chatbotToggle && chatbotContainer) {
    chatbotToggle.addEventListener('click', () => {
      chatbotContainer.classList.toggle('active');
      if (chatbotContainer.classList.contains('active') && chatbotInput) {
        chatbotInput.focus();
      }
    });

    if (chatbotClose) {
      chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
      });
    }

    const aiKnowledge = [
      {
        triggers: ['who are you', 'about', 'soumyajit', 'background'],
        reply: "I am Soumyajit's personal AI agent. Soumyajit Jena is an AI & Machine Learning engineer and full-stack developer passionate about building autonomous agent platforms, computer vision architectures, and zero-bloat web systems."
      },
      {
        triggers: ['projects', 'works', 'nexora', 'civicfix', 'truthseal', 'yieldway'],
        reply: "Soumyajit has developed several flagship AI systems: Nexora (autonomous incident triage), CivicFix AI (smart civic reporting with AWS computer vision), TruthSeal AI (deepfake & cryptographic provenance detection), and YieldWay (algorithmic DeFi intelligence)."
      },
      {
        triggers: ['skills', 'stack', 'tech', 'technologies', 'python', 'pytorch'],
        reply: "Core technical stack includes PyTorch, Transformers, Multi-Agent MoE architectures, Python, TypeScript, React/Next.js, Tailwind, FastAPI, and AWS Cloud infrastructure."
      },
      {
        triggers: ['contact', 'hire', 'email', 'reach'],
        reply: "You can reach Soumyajit directly at soumyajit19pvt@gmail.com, via GitHub @exepngsam, or on X @exesam19. He is actively open for high-impact innovation roles!"
      }
    ];

    function handleChatSend() {
      const userText = chatbotInput.value.trim();
      if (!userText) return;

      const userMsg = document.createElement('div');
      userMsg.className = 'chatbot-message user';
      userMsg.textContent = userText;
      chatbotMessages.appendChild(userMsg);
      chatbotInput.value = '';
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

      setTimeout(() => {
        const lower = userText.toLowerCase();
        let match = aiKnowledge.find((k) =>
          k.triggers.some((t) => lower.includes(t))
        );
        const replyText = match
          ? match.reply
          : "That's an interesting question! Feel free to explore Soumyajit's featured projects above or reach out directly at soumyajit19pvt@gmail.com.";

        const aiMsg = document.createElement('div');
        aiMsg.className = 'chatbot-message ai';
        aiMsg.textContent = replyText;
        chatbotMessages.appendChild(aiMsg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }, 500);
    }

    if (chatbotSend) chatbotSend.addEventListener('click', handleChatSend);
    if (chatbotInput) {
      chatbotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleChatSend();
      });
    }
  }

  /*--------------------------------------------------
    CYBER RONIN HERO COMPONENT ENGINE
    (Word Split, Scroll Reveal & Spotlight Mask)
  --------------------------------------------------*/
  // 1. WORD SPLIT
  const pullUpElements = document.querySelectorAll('.words-pull-up');
  pullUpElements.forEach((el) => {
    if (el.dataset.split) return;
    el.dataset.split = 'true';

    let wordIndex = 0;
    const directSpans = Array.from(el.children).filter((child) => child.tagName === 'SPAN');

    if (el.tagName === 'H1' && directSpans.length > 0) {
      directSpans.forEach((span) => {
        span.classList.add('pull-line');
        const text = span.textContent.trim();
        const words = text.split(/\s+/).filter(Boolean);
        span.innerHTML = words
          .map((word) => {
            const delay = (wordIndex * 0.1).toFixed(2);
            wordIndex++;
            return `<span class="pull-word" style="animation-delay: ${delay}s">${word}</span>`;
          })
          .join('');
      });
    } else {
      const text = el.textContent.trim();
      const words = text.split(/\s+/).filter(Boolean);
      el.innerHTML = words
        .map((word) => {
          const delay = (wordIndex * 0.1).toFixed(2);
          wordIndex++;
          return `<span class="pull-word" style="animation-delay: ${delay}s">${word}</span>`;
        })
        .join('');
    }
  });

  // 2. SCROLL REVEAL (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const wordsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('words-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.words-pull-up').forEach((el) => wordsObserver.observe(el));

    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay;
            if (delay) {
              entry.target.style.animationDelay = delay + 's';
            }
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.fade-up-reveal').forEach((el) => fadeObserver.observe(el));
  } else {
    // Fallback for unsupported browsers
    document.querySelectorAll('.words-pull-up').forEach((el) => {
      el.classList.add('words-visible');
    });
    document.querySelectorAll('.fade-up-reveal').forEach((el) => {
      const delay = el.dataset.delay;
      if (delay) {
        el.style.animationDelay = delay + 's';
      }
      el.classList.add('is-visible');
    });
  }

  // 3. SPOTLIGHT REVEAL
  const revealImg = document.getElementById('reveal-img');
  if (revealImg) {
    const updateSpotlight = (e) => {
      const rect = revealImg.getBoundingClientRect();
      const touch = e.touches && e.touches.length > 0 ? e.touches[0] : null;
      const clientX = touch ? touch.clientX : e.clientX;
      const clientY = touch ? touch.clientY : e.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const width = window.innerWidth;
      const r = width < 480 ? 120 : width < 720 ? 160 : 260;

      const gradient = `radial-gradient(circle ${r}px at ${x}px ${y}px, #fff 0%, #fff 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, transparent 100%)`;

      revealImg.style.webkitMaskImage = gradient;
      revealImg.style.maskImage = gradient;
    };

    window.addEventListener('mousemove', updateSpotlight);
    window.addEventListener('touchmove', updateSpotlight, { passive: true });
  }
});
