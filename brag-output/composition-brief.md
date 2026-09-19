# Hyperframes Composition Brief: Soumyajit Jena — Developer Portfolio Launch

## Objective
Create a premium cinematic developer-portfolio launch video showcasing Soumyajit Jena's AI Systems Architect & Machine Learning Engineer portfolio.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 21.0 seconds

## Source Material
- Project root: `c:\Users\loudb\portfolio`
- Primary files read: `index.html`, `assets/css/styles.css`, `README.md`
- Product name: Soumyajit Jena — AI & ML Engineer
- Tagline / strongest claim: "ENGINEERING intelligence INTO SCALABLE REALITY — Transforming probabilistic neural models into resilient, deterministic production systems."
- Key UI or visual moments to recreate:
  - Hero wordmark with live status beacon pill ("AVAILABLE FOR AI INNOVATION") and rotating specialization
  - Liquid amoeba cybernetic suit reveal ("Hover to Pierce the Veil • Autonomous Neural Core")
  - Architectural Manifesto cards (<42ms Triage, 99.4% Precision, 10K+ Req/sec)
  - Bento Grid project showcases for Nexora, TruthSeal AI, and CivicFix
  - Live Neural Core 3D synaptic vector topology and real-time training loss/accuracy telemetry
  - Luxury footer reveal ("LET'S BUILD intelligence TOGETHER" + social / email contact channels)
- Copy that must appear verbatim:
  - `SOUMYAJIT JENA`
  - `AVAILABLE FOR AI INNOVATION`
  - `ENGINEERING intelligence INTO SCALABLE REALITY`
  - `<42ms Triage • 99.4% Precision • 10K+ Req/sec`
  - `NEXORA — AUTONOMOUS AI COORDINATION`
  - `TRUTHSEAL — CRYPTOGRAPHIC DIGITAL INTEGRITY`
  - `NEURAL CORE // LOSS: 0.0094 • ACCURACY: 99.12%`
  - `LET’S BUILD intelligence TOGETHER.`

## Creative Direction
- Tone preset: `cinematic` (polished luxury aesthetic)
- Creative direction: Futuristic AI/ML developer aesthetic, dark obsidian glassmorphism, premium product-launch feel
- Interpretation: Deep contrast, razor-sharp glowing accents, silky camera motions, deliberate settled holds for high text readability, and synchronized tech audio cues.
- Angle: A blockbuster product launch for a senior AI systems developer. It treats the portfolio not as a static resume, but as a live autonomous terminal and neural operating system.
- Hook: HUD boot sequence initializing neural interfaces, bursting into the giant obsidian headline.
- Outro: "LET’S BUILD intelligence TOGETHER" with high-impact contacts and resonant brand signature.
- Avoid:
  - Generic SaaS marketing buzzwords
  - Abstract filler graphics unrelated to AI or code
  - Garish neon clashing colors; preserve obsidian, bone, and emerald elegance

## Visual Identity
- Background: `#06070a` (Obsidian Deep)
- Text: `#efe9d8` (Bone Ivory) and `rgba(239, 233, 216, 0.72)` (Soft White)
- Accent: `#4ade80` (Emerald Glow), `#22c55e` (Terminal Green), `#c084fc` (Synaptic Violet)
- Glass / Borders: `rgba(239, 233, 216, 0.12)` border, `rgba(14, 18, 28, 0.75)` backdrop-filter blur(16px)
- Display font: `Archivo`, `Roboto Flex`, sans-serif
- Serif italic accent: `Instrument Serif`, serif
- Monospace font: `SF Mono`, `Menlo`, `Consolas`, monospace

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract:
1. Scene 1: Hero & Neural Interface Initialization — 4.20s (0.00s - 4.20s)
2. Scene 2: Cybernetic Identity & Architectural Manifesto — 4.60s (4.20s - 8.80s)
3. Scene 3: Featured Works Bento Showcase (Nexora & TruthSeal) — 4.60s (8.80s - 13.40s)
4. Scene 4: Neural Core Live Synaptic Topology & Telemetry — 4.20s (13.40s - 17.60s)
5. Scene 5: Outro Brand Mark & Initiate Contact — 3.40s (17.60s - 21.00s)

## Audio
- Audio role: Cinematic electronic support with steady rhythmic drive and crisp UI interaction feedback.
- Audio arc: Ambient atmospheric boot → driving rhythmic showcase → triumphant signature bell resolution.
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: Starts at 0.0s at volume 0.35; fades out smoothly across 20.2s–21.0s.
- Music cue guidance:
  - Strong cues: 8.74s (Scene 3 entrance), 13.11s (Scene 4 entrance), 17.47s (Scene 5 entrance), 20.75s (Final brand mark).
  - Beat grid: ~0.55s cadence for tech pills and card sequences.
- Audio-reactive treatment: Ambient background glows, grid pulses, and card borders breathe with music volume/energy.
- Audio-coupled moments:
  - 0.0s: Soft entrance impact (`assets/sfx/impact/impactSoft_medium_001.ogg`)
  - 0.8s: Status pill activation click (`assets/sfx/interface/click_002.ogg`)
  - 4.2s: Cybernetic transition slide (`assets/sfx/casino/card-slide-1.ogg`)
  - 8.74s: Projects bento reveal chime (`assets/sfx/interface/bong_001.ogg`)
  - 13.11s: Synaptic telemetry switch (`assets/sfx/ui/click2.ogg`)
  - 17.47s: Final brand signature bell (`assets/sfx/impact/impactBell_heavy_000.ogg`)
- SFX files: Copied into `brag-output/composition/assets/sfx/`.
- Audio elements: Timed precisely with `data-start`, `data-duration`, `data-volume`, and distinct `data-track-index` attributes.

## Hyperframes Instructions
- Implement the complete HTML/CSS/GSAP composition inside `brag-output/composition/index.html`.
- Use the 1920x1080 canvas resolution and total duration of 21 seconds.
- Adhere strictly to the HyperFrames contract:
  - Main container has `data-composition-id="main"`, `data-start="0"`, `data-duration="21"`, `data-width="1920"`, `data-height="1080"`.
  - All visual scenes have `class="clip"` and accurate `data-start` and `data-duration`.
  - Register the paused root timeline on `window.__timelines["main"]`.
  - Seek-safe keyframing with deterministic GSAP animations.
  - Zero overflow, passing contrast criteria, no console errors.
- Run `npx hyperframes check` to validate with 0 errors before final render.
