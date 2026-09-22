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
    2. LIQUID GLASS NAVIGATION PILL CONTROLLER
  --------------------------------------------------*/
  const navCenterMenu = document.getElementById('nav-center-menu');
  const navLiquidPill = document.getElementById('nav-liquid-pill');
  const navLinks = document.querySelectorAll('.nav-center-menu .nav-link');

  let currentActiveNavLink = document.querySelector('.nav-center-menu .nav-link.active') || (navLinks.length ? navLinks[0] : null);

  function moveLiquidPill(targetEl) {
    if (!navLiquidPill || !navCenterMenu || !targetEl) return;
    const menuRect = navCenterMenu.getBoundingClientRect();
    const linkRect = targetEl.getBoundingClientRect();
    const left = linkRect.left - menuRect.left;
    const width = linkRect.width;

    navLiquidPill.style.opacity = '1';
    navLiquidPill.style.width = `${width}px`;
    navLiquidPill.style.transform = `translateX(${left}px)`;
  }

  if (navCenterMenu && navLiquidPill && navLinks.length) {
    // Initial positioning once layout renders
    requestAnimationFrame(() => {
      moveLiquidPill(currentActiveNavLink);
    });
    window.addEventListener('resize', () => moveLiquidPill(currentActiveNavLink), { passive: true });

    navLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        moveLiquidPill(link);
      });
      link.addEventListener('click', () => {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        currentActiveNavLink = link;
        moveLiquidPill(link);
      });
    });

    navCenterMenu.addEventListener('mouseleave', () => {
      moveLiquidPill(currentActiveNavLink);
    });
  }

  /*--------------------------------------------------
    3. SCROLL PROGRESS DRIVER (--page-progress, --hero-blur, --dive-progress)
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

    // Update liquid nav active link based on scroll position
    if (navLinks && navLinks.length) {
      const navSections = [
        { id: 'hero', link: navLinks[0] },
        { id: 'architecture', link: navLinks[1] },
        { id: 'roles', link: navLinks[2] },
        { id: 'projects', link: navLinks[3] },
        { id: 'neural', link: navLinks[4] },
        { id: 'contact', link: navLinks[5] }
      ];
      const scrollThreshold = scrollY + winHeight * 0.35;
      let activeCandidate = navSections[0].link;
      for (const item of navSections) {
        const sec = document.getElementById(item.id);
        if (sec && scrollThreshold >= sec.offsetTop) {
          activeCandidate = item.link;
        }
      }
      if (activeCandidate && activeCandidate !== currentActiveNavLink) {
        navLinks.forEach((l) => l.classList.remove('active'));
        activeCandidate.classList.add('active');
        currentActiveNavLink = activeCandidate;
        moveLiquidPill(currentActiveNavLink);
      }
    }

    // Cyber HUD Telemetry Sector Tracking
    const hudSectorEl = document.getElementById('hud-sector');
    const hudPctEl = document.getElementById('hud-pct');
    if (hudPctEl) {
      hudPctEl.textContent = `${Math.min(99, Math.round(pageProgress * 100)).toString().padStart(2, '0')}%`;
    }
    if (hudSectorEl) {
      const sectors = [
        { id: 'hero', label: 'SECTOR // 01 HERO' },
        { id: 'architecture', label: 'SECTOR // 02 ARCHITECTURE' },
        { id: 'roles', label: 'SECTOR // 03 DISCIPLINES' },
        { id: 'projects', label: 'SECTOR // 04 PROJECTS' },
        { id: 'neural', label: 'SECTOR // 05 NEURAL' },
        { id: 'contact', label: 'SECTOR // 06 CONTACT' }
      ];
      const scrollCenter = scrollY + winHeight * 0.35;
      let currentSector = sectors[0].label;
      for (const sector of sectors) {
        const el = document.getElementById(sector.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollCenter >= top) {
            currentSector = sector.label;
          }
        }
      }
      if (pageProgress > 0.88) {
        currentSector = 'SECTOR // 08 NEXUS';
      }
      if (hudSectorEl.textContent !== currentSector) {
        hudSectorEl.textContent = currentSector;
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
    6. HERO CYBER OPTIC & OVERDRIVE CONTROLS
  --------------------------------------------------*/
  const btnCore = document.getElementById('hero-btn-core');
  const btnVision = document.getElementById('hero-btn-vision');
  const btnForce = document.getElementById('hero-btn-force');
  const heroBtnToast = document.getElementById('hero-btn-toast');
  const heroRevealLayer = document.getElementById('reveal-img');
  const heroSpecsBox = document.querySelector('.specs');

  // Interactive Web Audio synthesizer for futuristic tactile feedback
  let cyberAudioCtx = null;
  function playCyberTone(type) {
    try {
      if (!cyberAudioCtx) {
        cyberAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (cyberAudioCtx.state === 'suspended') {
        cyberAudioCtx.resume();
      }
      const osc = cyberAudioCtx.createOscillator();
      const gain = cyberAudioCtx.createGain();
      osc.connect(gain);
      gain.connect(cyberAudioCtx.destination);

      const now = cyberAudioCtx.currentTime;
      if (type === 'core') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(760, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'vision') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(1300, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.24);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'force') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.24);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
        osc.start(now);
        osc.stop(now + 0.32);
      }
    } catch (e) {
      // AudioContext unavailable
    }
  }

  let toastTimer = null;
  function showHeroToast(text) {
    if (!heroBtnToast) return;
    heroBtnToast.textContent = text;
    heroBtnToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      heroBtnToast.classList.remove('show');
    }, 2400);

    const hudSector = document.getElementById('hud-sector');
    if (hudSector) {
      hudSector.textContent = text;
    }
  }

  if (btnCore) {
    btnCore.addEventListener('click', (e) => {
      e.stopPropagation();
      playCyberTone('core');
      btnCore.classList.toggle('is-active');
      const active = btnCore.classList.contains('is-active');
      if (active) {
        showHeroToast('CORE // NEURAL LINK 100% ONLINE');
        if (heroSpecsBox) {
          heroSpecsBox.style.boxShadow = '0 0 32px rgba(251, 219, 175, 0.45)';
          heroSpecsBox.style.borderColor = '#FFF4E5';
        }
      } else {
        showHeroToast('CORE // STANDBY MODE');
        if (heroSpecsBox) {
          heroSpecsBox.style.boxShadow = '';
          heroSpecsBox.style.borderColor = '';
        }
      }
    });
  }

  if (btnVision) {
    let visionLocked = false;
    btnVision.addEventListener('click', (e) => {
      e.stopPropagation();
      playCyberTone('vision');
      visionLocked = !visionLocked;
      btnVision.classList.toggle('is-active', visionLocked);
      if (heroRevealLayer) {
        if (visionLocked) {
          showHeroToast('VISION // TACTICAL SCANNER ENGAGED');
          heroRevealLayer.style.webkitMaskImage = 'radial-gradient(circle 380px at 50% 45%, #fff 65%, transparent 100%)';
          heroRevealLayer.style.maskImage = 'radial-gradient(circle 380px at 50% 45%, #fff 65%, transparent 100%)';
        } else {
          showHeroToast('VISION // SCANNER OFF');
          heroRevealLayer.style.webkitMaskImage = '';
          heroRevealLayer.style.maskImage = '';
        }
      }
    });
  }

  if (btnForce) {
    let overdriveActive = false;
    btnForce.addEventListener('click', (e) => {
      e.stopPropagation();
      playCyberTone('force');
      overdriveActive = !overdriveActive;
      btnForce.classList.toggle('is-active', overdriveActive);
      document.body.classList.toggle('cyber-overdrive-mode', overdriveActive);
      if (overdriveActive) {
        showHeroToast('OVERDRIVE // 144Hz MAX POWER');
      } else {
        showHeroToast('OVERDRIVE // NOMINAL FLUX');
      }
    });
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

      ctx.fillStyle = '#3B1202';
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

      ctx.fillStyle = '#FBDBAF';

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
            ctx.strokeStyle = `rgba(251, 219, 175, ${opacity * 0.28})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // Mouse field indicator
      if (mouse.active) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = isRepelling ? 'rgba(239, 68, 68, 0.7)' : 'rgba(224, 112, 32, 0.85)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 110, 0, Math.PI * 2);
        ctx.strokeStyle = isRepelling ? 'rgba(239, 68, 68, 0.12)' : 'rgba(224, 112, 32, 0.2)';
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
    const openDrawer = () => {
      mobileDrawer.classList.add('open');
      document.body.classList.add('nav-drawer-open');
    };

    const closeDrawer = () => {
      mobileDrawer.classList.remove('open');
      document.body.classList.remove('nav-drawer-open');
    };

    navMobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDrawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    mobileDrawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on tapping outside/backdrop or Escape key
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
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
    chatbotToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      chatbotContainer.classList.toggle('active');
      if (chatbotContainer.classList.contains('active') && chatbotInput) {
        setTimeout(() => chatbotInput.focus(), 150);
      }
    });

    if (chatbotClose) {
      chatbotClose.addEventListener('click', (e) => {
        e.stopPropagation();
        chatbotContainer.classList.remove('active');
      });
    }

    // Close chatbot when tapping outside on mobile/desktop
    document.addEventListener('click', (e) => {
      if (chatbotContainer.classList.contains('active')) {
        if (!chatbotContainer.contains(e.target) && !chatbotToggle.contains(e.target)) {
          chatbotContainer.classList.remove('active');
        }
      }
    });

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

  /*--------------------------------------------------
    4. CYBER RONIN CARD SPOTLIGHT HOVER TRACKING
  --------------------------------------------------*/
  const spotlightCards = document.querySelectorAll('.arch-card, .fw-card, .neural-telemetry-box, .contact-card-box');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-mx', `${x}px`);
      card.style.setProperty('--card-my', `${y}px`);
    }, { passive: true });
  });
});

