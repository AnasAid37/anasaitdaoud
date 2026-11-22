import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Github, Linkedin, MessageCircle, Volume2, VolumeX } from 'lucide-react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { siteConfig, whatsappUrl } from '../config/site'
import { cinematic, heroVideo, sceneLabels } from '../config/cinematic'
import EmailComposer from './EmailComposer'
import DustField from './cinematic/DustField'
import { useAmbientSound } from './cinematic/useAmbientSound'

/**
 * SCENES 01 → 03 — the title sequence.
 * 01 Obscurité   : black frame, letterbox, a gold line draws where the wall lamp is.
 * 02 Révélation  : darkness recedes from the lamp, the character emerges from the shadow.
 * 03 Introduction: name, role and introduction are typeset; then scrolling drives the camera.
 * All motion is programmatic (CSS + Motion + canvas); the portrait pixels are never altered.
 */
type Phase = 'dark' | 'light' | 'reveal' | 'title' | 'ready'
const ORDER: Phase[] = ['dark', 'light', 'reveal', 'title', 'ready']
const TIMELINE: [Phase, number][] = [['light', 350], ['reveal', 1350], ['title', 2700], ['ready', 4300]]

function SplitLine({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return <span className={`cine-line ${className}`} aria-hidden="true">
    {[...text].map((char, index) => <span key={index} className="cine-char" style={{ '--i': index, '--d': `${delay}ms` } as CSSProperties}>{char === ' ' ? ' ' : char}</span>)}
  </span>
}

export default function Hero() {
  const reduce = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<Phase>(reduce ? 'ready' : 'dark')
  const [copyHidden, setCopyHidden] = useState(false)
  const [replay, setReplay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [saveData] = useState(() => typeof navigator !== 'undefined' && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData))
  const sound = useAmbientSound()
  /** Real generated footage when available; otherwise the still cut-out (never a fake animation). */
  const performer = !reduce && heroVideo && !saveData && !videoFailed ? heroVideo : null
  const at = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p)

  /* ---------- Title sequence (time based, skippable, once per session in full) ---------- */
  useEffect(() => {
    if (reduce) { setPhase('ready'); return }
    let seen = false
    try { seen = sessionStorage.getItem(cinematic.sessionKey) === '1'; sessionStorage.setItem(cinematic.sessionKey, '1') } catch { /* storage is optional */ }
    const speed = seen ? .4 : 1
    setReplay(seen)
    const timers = TIMELINE.map(([p, t]) => window.setTimeout(() => setPhase(current => ORDER.indexOf(current) < ORDER.indexOf(p) ? p : current), t * speed))
    const skip = () => setPhase('ready')
    const onKey = (event: KeyboardEvent) => { if (!event.metaKey && !event.ctrlKey && !event.altKey) skip() }
    const opts = { once: true, passive: true } as const
    window.addEventListener('wheel', skip, opts)
    window.addEventListener('touchmove', skip, opts)
    window.addEventListener('keydown', onKey, { once: true })
    document.addEventListener('focusin', skip, { once: true })
    return () => {
      timers.forEach(window.clearTimeout)
      window.removeEventListener('wheel', skip); window.removeEventListener('touchmove', skip)
      window.removeEventListener('keydown', onKey); document.removeEventListener('focusin', skip)
    }
  }, [reduce])

  // Lets the header (and anything else) know when the opening is still playing.
  useEffect(() => {
    const root = document.documentElement
    root.dataset.cineIntro = at('title') ? 'done' : 'playing'
    return () => { delete root.dataset.cineIntro }
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- Camera: scroll-driven push-in, lateral move and layer parallax ---------- */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: .5 })
  const camScale = useTransform(p, [0, .72], [1.04, 1.24])
  const camX = useTransform(p, [0, .72], ['0%', '-3.5%'])
  const camY = useTransform(p, [0, .72], ['0%', '1.5%'])
  const plateX = useTransform(p, [0, 1], ['0%', '1.1%'])
  const charX = useTransform(p, [0, 1], ['0%', '-1.6%'])
  const charScale = useTransform(p, [0, .72], [1, 1.045])
  const fogBackX = useTransform(p, [0, 1], ['0%', '-7%'])
  const fogFrontX = useTransform(p, [0, 1], ['0%', '-16%'])
  const fogFrontOpacity = useTransform(p, [0, .5], [.55, 1])
  const copyOpacity = useTransform(p, [.04, .26], [1, 0])
  const copyY = useTransform(p, [0, .3], [0, -80])
  const copyFilter = useTransform(p, [.04, .28], ['blur(0px)', 'blur(10px)'])
  const line1 = useTransform(p, [.28, .36, .58, .66], [0, 1, 1, 0])
  const line2 = useTransform(p, [.34, .42, .6, .68], [0, 1, 1, 0])
  const line3 = useTransform(p, [.4, .48, .62, .7], [0, 1, 1, 0])
  const lineY = useTransform(p, [.28, .7], [40, -40])
  const exitDark = useTransform(p, [.72, .97], [0, 1])
  const flare = useTransform(p, [.7, .86, 1], [0, 1, 0])
  const railOpacity = useTransform(p, [0, .2], [1, 0])
  const sideOpacity = useTransform(p, [.55, .74], [1, 0])
  useMotionValueEvent(scrollYProgress, 'change', value => setCopyHidden(value > .3))

  /* ---------- Performance video: starts as the character emerges, pauses off-screen ---------- */
  const revealed = at('reveal')
  useEffect(() => {
    const video = videoRef.current
    if (!video || !revealed) return
    let visible = true
    const sync = () => { if (visible && !document.hidden) void video.play().catch(() => { /* autoplay refused: poster stays */ }); else video.pause() }
    video.currentTime = 0
    sync()
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    io.observe(video)
    document.addEventListener('visibilitychange', sync)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause() }
  }, [revealed, performer])

  /* ---------- Pointer parallax (desktop only) ---------- */
  const mx = useMotionValue(0), my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 38, damping: 16 }), sy = useSpring(my, { stiffness: 38, damping: 16 })
  const plateMX = useTransform(sx, v => v * -7), plateMY = useTransform(sy, v => v * -4)
  const charMX = useTransform(sx, v => v * -16), charMY = useTransform(sy, v => v * -6)
  const fogMX = useTransform(sx, v => v * -30)
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== 'mouse') return
    mx.set(event.clientX / window.innerWidth - .5); my.set(event.clientY / window.innerHeight - .5)
  }

  const live = !reduce
  const box = cinematic.character_box
  const [firstName, ...rest] = siteConfig.name.split(' ')
  const sceneIndex = at('title') ? 2 : at('reveal') ? 1 : 0
  const socialLinks = [
    { icon: MessageCircle, label: 'WhatsApp', href: whatsappUrl('Bonjour Anas, je souhaite discuter de mon projet web.') },
    { icon: Linkedin, label: 'LinkedIn', href: siteConfig.socials.linkedin || null },
    { icon: Github, label: 'GitHub', href: siteConfig.socials.github || null },
  ].filter(item => item.href)

  return <section ref={sectionRef} id="accueil" className={`cine ${reduce ? 'is-static' : ''} ${replay ? 'is-replay' : ''}`} aria-labelledby="hero-title"
    data-lit={at('light')} data-revealed={at('reveal')} data-titled={at('title')} data-ready={at('ready')}>
    <div className="cine-stage" onPointerMove={onPointerMove}>

      {/* ===== The frame: everything positioned in % of the original 16:9 photograph ===== */}
      <motion.div className="cine-frame" style={live ? { scale: camScale, x: camX, y: camY } : undefined} aria-hidden="true">
        <div className="cine-drift">
          {reduce
            ? <img className="cine-plate" src={cinematic.poster} alt="" decoding="async" fetchPriority="high" />
            : <motion.div className="cine-fill" style={{ x: plateX }}>
                <motion.div className="cine-fill" style={{ x: plateMX, y: plateMY }}>
                  <img className="cine-plate" src={cinematic.plate} alt="" decoding="async" fetchPriority="high" />
                  {performer && <div className="cine-performer" style={{ left: `${performer.box.left}%`, width: `${performer.box.width}%` }}>
                    <div className="cine-character__body">
                      {/* Generated image-to-video footage of the real portrait, locked to the set (same camera & parallax). */}
                      <video ref={videoRef} className="cine-performer__video" muted playsInline loop preload="auto" poster={performer.poster}
                        disablePictureInPicture disableRemotePlayback aria-hidden="true" tabIndex={-1} onError={() => setVideoFailed(true)}>
                        {performer.webm && <source src={performer.webm} type="video/webm" />}
                        <source src={performer.mp4} type="video/mp4" onError={() => setVideoFailed(true)} />
                      </video>
                    </div>
                  </div>}
                </motion.div>
              </motion.div>}
          <div className="cine-lamp" style={{ left: `${cinematic.lamp.x}%`, top: `${cinematic.lamp.y}%` }} />
          <div className="cine-beam" />
          {live && <motion.div className="cine-fog cine-fog--back" style={{ x: fogBackX }}><span className="cine-fog__tile" style={{ backgroundImage: `url(${cinematic.fogBack})` }} /></motion.div>}
          {live && <>
            {!performer && <>
              <div className="cine-shadow" style={{ left: `${box.left + box.width / 2}%` }} />
              <motion.div className="cine-character" style={{ left: `${box.left}%`, top: `${box.top}%`, width: `${box.width}%`, height: `${box.height}%`, x: charX, scale: charScale }}>
                <motion.div className="cine-character__pointer" style={{ x: charMX, y: charMY }}>
                  <div className="cine-character__body">
                    <img src={cinematic.character} alt="" decoding="async" fetchPriority="high" />
                    <span className="cine-rim" style={{ WebkitMaskImage: `url(${cinematic.character})`, maskImage: `url(${cinematic.character})` }} />
                  </div>
                </motion.div>
              </motion.div>
            </>}
            <motion.div className="cine-fog cine-fog--front" style={{ x: fogFrontX, opacity: fogFrontOpacity }}>
              <motion.div className="cine-fog__pointer" style={{ x: fogMX }}><span className="cine-fog__tile" style={{ backgroundImage: `url(${cinematic.fogFront})` }} /></motion.div>
            </motion.div>
          </>}
          {live && <div className="cine-darkness" style={{ '--lx': `${cinematic.lamp.x}%`, '--ly': `${cinematic.lamp.y}%`, '--slit-x-m-c': `${cinematic.mobileLightX}%` } as CSSProperties} />}
          {live && <div className="cine-slit" style={{ left: `${cinematic.lamp.x - 1.6}%`, '--slit-x-m': `${cinematic.mobileLightX - 1.6}%` } as CSSProperties} />}
        </div>
      </motion.div>

      {live && <DustField origin={{ x: .8, y: .36 }} className="cine-dust--hero" />}
      <div className="cine-vignette" aria-hidden="true" />

      {/* ===== Scene 03 — typography ===== */}
      <div className="cine-content site-container">
        <motion.div className="cine-copy" style={live ? { opacity: copyOpacity, y: copyY, filter: copyFilter, visibility: copyHidden ? 'hidden' : 'visible' } : undefined}>
          <p className="cine-kicker"><span className="cine-kicker__line" /> {siteConfig.title.toUpperCase()} <span className="cine-kicker__divider" /> {siteConfig.location.split(',')[0].toUpperCase()}</p>
          <h1 id="hero-title" className="cine-name">
            <span className="sr-only">{siteConfig.name} — {siteConfig.title} à Marrakech</span>
            <SplitLine text={firstName} />
            <SplitLine text={rest.join(' ')} className="is-gold" delay={260} />
          </h1>
          <p className="cine-tagline">Des sites web qui font grandir <span>votre activité.</span></p>
          <p className="cine-description">Je conçois des sites web et des solutions digitales sur mesure pour les riads, les entreprises et les entrepreneurs qui veulent aller plus loin.</p>
          <div className="cine-cta">
            <a className="button button-gold" href="#assistant">Discuter de mon projet <ArrowRight size={17} /></a>
            <a className="button button-outline" href="#projets">Découvrir mes projets <ArrowUpRight size={16} /></a>
          </div>
        </motion.div>

        {live && <div className="cine-statement" aria-hidden="true">
          <motion.span style={{ opacity: line1, y: lineY }}>Construire utile.</motion.span>
          <motion.span style={{ opacity: line2, y: lineY }} className="is-gold">Penser durable.</motion.span>
          <motion.small style={{ opacity: line3, y: lineY }}>Laravel / PHP &amp; React — {siteConfig.location}</motion.small>
        </div>}
      </div>

      {/* ===== Rails ===== */}
      <motion.div className="cine-rails" style={live ? { opacity: sideOpacity } : undefined}>
      <motion.div className="cine-bottom" style={live ? { opacity: railOpacity } : undefined}>
        <div className="cine-specialties">DÉVELOPPEMENT WEB <span /> UI / UX <span /> PERFORMANCE <span /> AUTOMATISATION</div>
        <a className="cine-scroll" href="#projets"><span className="cine-scroll__track"><span /></span> DÉFILER</a>
      </motion.div>

      <div className="cine-social" aria-label="Réseaux et contacts">
        {socialLinks.map(({ icon: Icon, label, href }) => <a key={label} href={href!} target={href!.startsWith('https:') ? '_blank' : undefined} rel={href!.startsWith('https:') ? 'noopener noreferrer' : undefined} aria-label={label}><Icon size={19} strokeWidth={1.5} /></a>)}
        <EmailComposer variant="hero" subject="Prise de contact — projet web" body={"Bonjour Anas,\n\nJe souhaite discuter de mon projet web.\n\nMerci !"} />
        <button type="button" className="cine-sound" onClick={sound.toggle} aria-pressed={sound.enabled}
          aria-label={sound.enabled ? 'Couper l’ambiance sonore' : 'Activer l’ambiance sonore'} title={sound.enabled ? 'Couper le son' : 'Ambiance sonore'}>
          {sound.enabled ? <Volume2 size={18} strokeWidth={1.5} /> : <VolumeX size={18} strokeWidth={1.5} />}
          <span className="cine-sound__bars" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>

      <ol className="cine-index" aria-hidden="true">
        {sceneLabels.map((label, index) => <li key={label} className={index === sceneIndex ? 'is-active' : ''}><span>0{index + 1}</span><i />{label}</li>)}
      </ol>
      </motion.div>

      {live && <>
        <motion.div className="cine-exit" style={{ opacity: exitDark }} aria-hidden="true" />
        <motion.div className="cine-flare" style={{ opacity: flare }} aria-hidden="true" />
        <div className="cine-letterbox" aria-hidden="true"><span /><span /></div>
        {!at('ready') && <button type="button" className="cine-skip" onClick={() => setPhase('ready')}>Passer l’intro <ArrowDown size={13} /></button>}
      </>}
    </div>
  </section>
}
