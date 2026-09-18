/*==================================================
   DOSSIER EDITORIAL MOTION SYSTEM & INTERACTION ENGINE
==================================================*/

document.addEventListener('DOMContentLoaded', () => {
  /*--------------------------------------------------
    1. LENIS SMOOTH MOMENTUM SCROLLING & GSAP
  --------------------------------------------------*/
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
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

    // Anchor smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -40, duration: 1.4 });
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
  const diveSection = document.getElementById('dive-section');

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

    // Hero lift & blur calculation
    if (heroSection) {
      const heroHeight = heroSection.offsetHeight;
      const heroBlurProgress = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.75)));
      root.style.setProperty('--hero-blur', heroBlurProgress.toFixed(4));
    }

    // Dive sticky section progress
    if (diveSection) {
      const diveRect = diveSection.getBoundingClientRect();
      const diveTop = diveRect.top;
      const diveHeight = diveSection.offsetHeight - winHeight;
      if (diveHeight > 0) {
        const diveProg = Math.min(1, Math.max(0, -diveTop / diveHeight));
        root.style.setProperty('--dive-progress', diveProg.toFixed(4));
      }
    }
  }

  window.addEventListener('scroll', updateScrollMetrics, { passive: true });
  updateScrollMetrics();

  /*--------------------------------------------------
    3. VARIABLE FONT PROXIMITY ENGINE (Roboto Flex)
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

    function onMouseMove(e) {
      if (!isMouseOver) return;
      if (animFrame) cancelAnimationFrame(animFrame);

      animFrame = requestAnimationFrame(() => {
        letters.forEach((letter) => {
          const rect = letter.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

          if (dist < pinchRadius) {
            const factor = Math.max(0, 1 - dist / pinchRadius);
            // Bend weight & width towards thin/compressed on proximity
            const wght = Math.round(defaultBoldWght + (pinchWght - defaultBoldWght) * factor);
            const wdth = Math.round(defaultBoldWdth + (pinchWdth - defaultBoldWdth) * factor);
            letter.style.fontVariationSettings = `"wght" ${wght}, "wdth" ${wdth}`;
          } else {
            letter.style.fontVariationSettings = `"wght" ${defaultBoldWght}, "wdth" ${defaultBoldWdth}`;
          }
        });
      });
    }

    function onMouseLeave() {
      isMouseOver = false;
      if (animFrame) cancelAnimationFrame(animFrame);
      letters.forEach((letter) => {
        letter.style.fontVariationSettings = `"wght" ${defaultBoldWght}, "wdth" ${defaultBoldWdth}`;
      });
    }

    container.addEventListener('mouseenter', () => {
      isMouseOver = true;
    });
    window.addEventListener('mousemove', (e) => {
      if (isMouseOver) onMouseMove(e);
    });
    container.addEventListener('mouseleave', onMouseLeave);
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
  --------------------------------------------------*/
  const revealCard = document.getElementById('reveal-card');
  const revealMaskShape = document.getElementById('reveal-mask-shape');
  const revealEdge = document.getElementById('reveal-edge');

  if (revealCard && revealMaskShape && revealEdge) {
    let revealActive = false;
    let targetR = 0;
    let currentR = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    revealCard.addEventListener('mouseenter', (e) => {
      revealActive = true;
      revealCard.classList.add('is-active');
      targetR = 170;
      const rect = revealCard.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      currentX = targetX;
      currentY = targetY;
    });

    revealCard.addEventListener('mousemove', (e) => {
      const rect = revealCard.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    });

    revealCard.addEventListener('mouseleave', () => {
      revealActive = false;
      revealCard.classList.remove('is-active');
      targetR = 0;
    });

    // Touch events for mobile
    revealCard.addEventListener('touchstart', (e) => {
      revealActive = true;
      revealCard.classList.add('is-active');
      targetR = 150;
      const rect = revealCard.getBoundingClientRect();
      targetX = e.touches[0].clientX - rect.left;
      targetY = e.touches[0].clientY - rect.top;
      currentX = targetX;
      currentY = targetY;
    }, { passive: true });

    revealCard.addEventListener('touchmove', (e) => {
      const rect = revealCard.getBoundingClientRect();
      targetX = e.touches[0].clientX - rect.left;
      targetY = e.touches[0].clientY - rect.top;
    }, { passive: true });

    revealCard.addEventListener('touchend', () => {
      revealActive = false;
      revealCard.classList.remove('is-active');
      targetR = 0;
    });

    function updateAmoeba() {
      // Smooth lerp
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      currentR += (targetR - currentR) * 0.15;

      revealMaskShape.setAttribute('cx', currentX.toFixed(2));
      revealMaskShape.setAttribute('cy', currentY.toFixed(2));
      revealMaskShape.setAttribute('r', currentR.toFixed(2));

      revealEdge.setAttribute('cx', currentX.toFixed(2));
      revealEdge.setAttribute('cy', currentY.toFixed(2));
      revealEdge.setAttribute('r', currentR.toFixed(2));

      requestAnimationFrame(updateAmoeba);
    }
    updateAmoeba();
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
      { type: 'image', src: 'assets/img/nexora.jpg' },
      { type: 'image', src: 'assets/img/truthseal.jpg' },
      { type: 'image', src: 'assets/img/yieldway.jpg' }
    ];

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentPosX = mouseX;
    let currentPosY = mouseY;
    let isHoveringRoles = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const roleItems = rolesList.querySelectorAll('.roles-item');
    roleItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        isHoveringRoles = true;
        rolesPreview.classList.add('active');

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

    function updateRoleCursorFollower() {
      currentPosX += (mouseX - currentPosX) * 0.16;
      currentPosY += (mouseY - currentPosY) * 0.16;

      rolesPreview.style.left = `${currentPosX}px`;
      rolesPreview.style.top = `${currentPosY}px`;

      requestAnimationFrame(updateRoleCursorFollower);
    }
    updateRoleCursorFollower();
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
      title: 'Nexora Autonomous AI Platform',
      desc: 'NEXORA 🚀 is an autonomous AI incident coordination platform that turns incoming infrastructure incidents into verified resolutions in seconds. Built with Featherless AI, Caspian, and modern event-driven agent meshes.',
      img: 'assets/img/nexora.jpg',
      demo: 'https://nexora-three-mu.vercel.app/',
      repo: 'https://github.com/exepngsam/nexora'
    },
    civicfix: {
      title: 'CivicFix AI Smart Platform',
      desc: 'CivicFix AI leverages computer vision and multimodal LLMs to automate civic infrastructure issue triage, road hazard detection, and municipal dispatch on AWS serverless architecture.',
      img: 'assets/img/civicfix.jpg',
      demo: 'https://civicfix-ai-roan.vercel.app/',
      repo: 'https://github.com/exepngsam/CivicFix'
    },
    truthseal: {
      title: 'TruthSeal AI Digital Trust Engine',
      desc: 'TruthSeal AI provides cryptographic tamper detection, deepfake forensics, verifiable digital signatures, and provenance chain verification for mission-critical media and documents.',
      img: 'assets/img/truthseal.jpg',
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
  --------------------------------------------------*/
  const neuralCanvas = document.getElementById('neural-canvas');
  if (neuralCanvas) {
    const ctx = neuralCanvas.getContext('2d');
    let width = (neuralCanvas.width = 440);
    let height = (neuralCanvas.height = 440);

    const particleCount = 650;
    const particles = [];
    let mouse = { x: width / 2, y: height / 2, active: false };
    let isRepelling = false;

    // Canvas size responsiveness
    function resizeCanvas() {
      const rect = neuralCanvas.getBoundingClientRect();
      width = neuralCanvas.width = rect.width;
      height = neuralCanvas.height = rect.height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Mouse events
    neuralCanvas.addEventListener('mousemove', (e) => {
      const rect = neuralCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    neuralCanvas.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    neuralCanvas.addEventListener('click', () => {
      isRepelling = !isRepelling;
    });

    // Initialize particles in a 3D sphere projection
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        baseX: width / 2,
        baseY: height / 2,
        radius: Math.random() * 1.5 + 0.6
      });
    }

    let time = 0;
    function renderNeuralMesh() {
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

        // Spring towards base
        p.vx += (p.baseX - p.x) * 0.015;
        p.vy += (p.baseY - p.y) * 0.015;

        // Mouse interaction
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 110) {
            const force = (110 - dist) / 110;
            if (isRepelling) {
              p.vx += (dx / dist) * force * 5;
              p.vy += (dy / dist) * force * 5;
            } else {
              p.vx -= (dx / dist) * force * 2.5;
              p.vy -= (dy / dist) * force * 2.5;
            }
          }
        }

        // Friction
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillRect(p.x, p.y, p.radius * 2, p.radius * 2);

        // Synaptic connections
        for (let j = i + 1; j < Math.min(i + 10, particleCount); j++) {
          const p2 = particles[j];
          const dxx = p.x - p2.x;
          const dyy = p.y - p2.y;
          const distSq = dxx * dxx + dyy * dyy;

          if (distSq < 35 * 35) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - Math.sqrt(distSq) / 35;
            ctx.strokeStyle = `rgba(239, 233, 216, ${opacity * 0.25})`;
            ctx.lineWidth = 0.8;
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
    renderNeuralMesh();

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

      // Add user message
      const userMsg = document.createElement('div');
      userMsg.className = 'chatbot-message user';
      userMsg.textContent = userText;
      chatbotMessages.appendChild(userMsg);
      chatbotInput.value = '';
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

      // Generate response
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
});
