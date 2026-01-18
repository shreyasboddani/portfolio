import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring as useMotionSpring,
  useMotionValue,
  AnimatePresence
} from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import {
  Code2,
  Cpu,
  Zap,
  Trophy,
  User,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Terminal,
  Briefcase,
  GraduationCap,
  Atom,
  GitBranch,
  Database,
  Brain,
  Layout,
  Server,
  Smartphone
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- DATA: THE ARCHIVE ---
const DATA = {
  hero: {
    first: "SHREYAS",
    last: "BODDANI",
    role: "FULL STACK ENGINEER",
    sub: "ARCHITECTING INTELLIGENCE",
    location: "ATLANTA, GA"
  },
  about: {
    bio: "I don't just write code; I engineer logic. A high school junior at North Forsyth, I operate at the intersection of Full-Stack Development and Artificial Intelligence. Whether it's dual-enrolling at Georgia Tech or prototyping 5-hour hackathon saves, I build systems that solve human problems.",
  },
  timeline: [
    {
      id: 1,
      year: "2023",
      title: "The Origin",
      role: "Boarding School Freshman",
      desc: "Joined the CS Club & Innovation Workshop. While others slept, I was compiling my first Python scripts. This was the moment the hobby became a vocation.",
      icon: Terminal,
      color: "text-blue-400"
    },
    {
      id: 2,
      year: "2024",
      title: "The Acceleration",
      role: "Dual Enrollment Student",
      desc: "Accepted into Georgia State University (Summer) and Georgia Tech (Fall) for CS 1301. Started diving deep into Machine Learning and Neural Networks.",
      icon: GraduationCap,
      color: "text-purple-400"
    },
    {
      id: 3,
      year: "2025",
      title: "Leadership & Service",
      role: "VP of Community Service",
      desc: "Leading service initiatives for FBLA (North Forsyth) and Educo (Tutoring). Organized school supply drives and managed mentor matching for middle schoolers.",
      icon: Briefcase,
      color: "text-emerald-400"
    },
    {
      id: 4,
      year: "PRESENT",
      title: "The Recognition",
      role: "GHP State Nominee",
      desc: "Nominated for the Governor's Honors Program in Computer Science. Currently building Mentics and scaling AI architectures.",
      icon: Trophy,
      color: "text-yellow-400"
    }
  ],
  skills: [
    { name: "React", icon: Atom, x: 0, y: -40, color: "text-blue-400" },
    { name: "Python", icon: Terminal, x: 40, y: -20, color: "text-yellow-400" },
    { name: "TensorFlow", icon: Brain, x: 40, y: 20, color: "text-orange-500" },
    { name: "Flask", icon: Server, x: 0, y: 40, color: "text-white" },
    { name: "Java", icon: Code2, x: -40, y: 20, color: "text-red-400" },
    { name: "Git", icon: GitBranch, x: -40, y: -20, color: "text-gray-300" },
    { name: "Next.js", icon: Layout, x: 25, y: -35, color: "text-white" },
    { name: "Gemini", icon: Zap, x: -25, y: 35, color: "text-purple-400" },
    { name: "SQL", icon: Database, x: -25, y: -35, color: "text-blue-300" }
  ],
  projects: [
    {
      id: "mentics",
      title: "MENTICS",
      subtitle: "AI COLLEGE PLANNER",
      desc: "A full-stack platform fixing the broken admissions process. Uses Gemini AI to provide real-time mentorship and personalized roadmaps.",
      tags: ["Flask", "React", "OAuth 2.0", "Gemini AI"],
      link: "https://mentics.onrender.com/",
      image: "/mentics.png",
      color: "from-blue-600 to-cyan-400"
    },
    {
      id: "saferoute",
      title: "SAFEROUTE",
      subtitle: "HACKATHON SPRINT",
      desc: "Civilian survival routing engineered in 5.5 hours. Integrates OpenStreetMap and OSRM to calculate evacuation paths in real-time.",
      tags: ["Python", "Tkinter", "OSRM API", "Hackathon"],
      link: "https://github.com/shreyasboddani/SafeRoute",
      image: "/saferoute.png",
      color: "from-emerald-600 to-green-400"
    },
    {
      id: "anime",
      title: "ANIME ML",
      subtitle: "NEURAL RECOMMENDER",
      desc: "Teaching AI to understand Animw. A Content-Based Filtering engine using TF-IDF and Variational Autoencoders to find your next obsession.",
      tags: ["TensorFlow", "TF-IDF", "Deep Learning"],
      link: "https://anime-discovery-48yh.onrender.com/",
      image: "/anime.png",
      color: "from-purple-600 to-pink-400"
    },
    {
      id: "stress",
      title: "MIND METRICS",
      subtitle: "STRESS PREDICTION",
      desc: "90% accuracy ML pipeline identifying student stress factors using Random Forests and SVMs. Data science applied to wellness.",
      tags: ["Scikit-Learn", "SVM", "Pandas"],
      link: "https://www.kaggle.com/code/shreyasboddani/shreyas-student-stress-monitoring-ml-project",
      image: "/ml.png",
      color: "from-red-600 to-orange-400"
    }
  ]
};

// --- COMPONENT: THE PRELOADER (RESTORED) ---
function Preloader({ onComplete }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center font-mono text-cyan-500"
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="w-64 mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span>SYSTEM_BOOT</span>
          <span>{count}%</span>
        </div>
        <div className="h-1 w-full bg-cyan-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
      <div className="h-4 text-xs text-cyan-700">
        {count < 30 && "INITIALIZING KERNEL..."}
        {count >= 30 && count < 60 && "LOADING MODULES: [AI, REACT, FLASK]..."}
        {count >= 60 && count < 90 && "ESTABLISHING NEURAL LINK..."}
        {count >= 90 && "ACCESS GRANTED."}
      </div>
    </motion.div>
  );
}

// --- COMPONENT: GRAIN OVERLAY (RESTORED) ---
function Grain() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[50] opacity-20 mix-blend-overlay">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}

// --- COMPONENT: INTERACTIVE MAGNETIC CURSOR ---
function CustomCursor() {
  const cursorRef = useRef(null);
  const [mouseState, setMouseState] = useState("default"); // default, text, card

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the cursor
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useMotionSpring(mouseX, springConfig);
  const cursorY = useMotionSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check what we are hovering
      const target = e.target;
      const isText = target.tagName === 'P' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3' || target.tagName === 'SPAN';
      const isLink = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button');
      const isCard = target.closest('.project-card') || target.closest('.skill-node');

      if (isCard) setMouseState("card");
      else if (isLink) setMouseState("link");
      else if (isText) setMouseState("text");
      else setMouseState("default");
    };

    window.addEventListener("mousemove", moveMouse);
    return () => window.removeEventListener("mousemove", moveMouse);
  }, []);

  const variants = {
    default: { height: 16, width: 16, opacity: 1, backgroundColor: "#06b6d4", mixBlendMode: "normal" },
    text: { height: 60, width: 60, opacity: 1, backgroundColor: "#ffffff", mixBlendMode: "difference" },
    link: { height: 40, width: 40, opacity: 1, backgroundColor: "#06b6d4", mixBlendMode: "difference", scale: 1.2 },
    card: { height: 80, width: 80, opacity: 0.5, backgroundColor: "transparent", borderWidth: "2px", borderColor: "#06b6d4", mixBlendMode: "normal" }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] pointer-events-none rounded-full flex items-center justify-center hidden md:flex"
      style={{
        translateX: cursorX,
        translateY: cursorY,
        x: "-50%",
        y: "-50%"
      }}
      variants={variants}
      animate={mouseState}
    >
      {mouseState === 'card' && <div className="w-1 h-1 bg-cyan-400 rounded-full" />}
    </motion.div>
  );
}

// --- COMPONENT: TECH-TREE TIMELINE (NEON SPINE) ---
function TimelineSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="py-40 bg-[#050505] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative">

        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter">THE CHRONICLES</h2>
          <p className="text-gray-500 font-mono text-sm">/// INITIALIZING HISTORICAL DATA</p>
        </div>

        {/* Central Neon Spine */}
        <div className="absolute left-6 md:left-1/2 top-32 bottom-0 w-[2px] bg-white/10 origin-top">
          <motion.div style={{ scaleY }} className="w-full h-full bg-cyan-500 origin-top shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
        </div>

        <div className="relative space-y-24">
          {DATA.timeline.map((item, idx) => (
            <TimelineItem key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, index }) {
  const isEven = index % 2 === 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn("relative flex items-center md:justify-between pl-16 md:pl-0", isEven ? "md:flex-row" : "md:flex-row-reverse")}
    >
      {/* Node (The "Joint") */}
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-[#050505] border-2 border-cyan-500 rounded-full z-10 shadow-[0_0_15px_rgba(6,182,212,1)]">
        <div className="absolute inset-0 bg-cyan-400 animate-ping rounded-full opacity-20" />
      </div>

      {/* Content Card */}
      <div className={cn("w-full md:w-[45%]", isEven ? "text-left" : "md:text-right")}>
        <div className="group relative bg-white/5 border border-white/10 p-8 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-colors duration-500">

          {/* Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className={cn("flex items-center gap-4 mb-4", !isEven && "md:flex-row-reverse")}>
            <div className={cn("p-3 rounded-lg bg-white/5", item.color)}>
              <item.icon size={20} />
            </div>
            <span className="font-mono text-cyan-500 text-sm tracking-widest">{item.year}</span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2 relative z-10">{item.title}</h3>
          <h4 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider relative z-10">{item.role}</h4>
          <p className="text-gray-400 text-sm leading-relaxed relative z-10">
            {item.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// --- COMPONENT: POP-OUT RADAR ---
function RadarSection() {
  return (
    <section className="py-32 px-4 bg-[#080808] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        <div className="order-2 lg:order-1 relative z-10">
          <h2 className="text-cyan-500 font-mono text-sm tracking-widest mb-6">// ARSENAL</h2>
          <h3 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
            TECHNICAL<br />PROFICIENCY
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed max-w-lg mb-8">
            My stack is built for speed and intelligence. Hover over the nodes to analyze the core technologies powering my applications.
          </p>
        </div>

        <div className="order-1 lg:order-2 relative aspect-square flex items-center justify-center">
          {/* Background Grid Elements */}
          <div className="absolute inset-0 border border-white/5 rounded-full" />
          <div className="absolute inset-[25%] border border-white/5 rounded-full" />
          <div className="absolute inset-[50%] border border-white/5 rounded-full" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_70%)]" />

          {/* Radar Sweep */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.1)_360deg)]"
          />

          {/* Skill Nodes */}
          {DATA.skills.map((skill, i) => (
            <SkillNode key={skill.name} skill={skill} index={i} />
          ))}

          {/* Center Core */}
          <div className="absolute w-12 h-12 bg-black border border-cyan-500 rounded-full flex items-center justify-center z-20 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Code2 size={20} className="text-cyan-500" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillNode({ skill, index }) {
  // Position calculation based on x/y percentages from DATA
  return (
    <motion.div
      className="absolute skill-node group"
      style={{ left: `${50 + skill.x}%`, top: `${50 + skill.y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: "spring" }}
    >
      <div className="relative flex items-center justify-center">
        {/* The Node Dot */}
        <div className="w-3 h-3 bg-white rounded-full transition-all duration-300 group-hover:scale-[3] group-hover:bg-cyan-500 shadow-[0_0_10px_white]" />

        {/* The Pop-out Icon (Hidden by default, scales up on hover) */}
        <div className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 z-50">
          <skill.icon size={24} className="text-black" />
        </div>

        {/* Tooltip Card */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-max z-40">
          <div className="bg-black/90 border border-cyan-500/30 px-4 py-2 rounded-lg backdrop-blur-md">
            <span className={cn("text-sm font-bold block", skill.color)}>{skill.name}</span>
          </div>
          {/* Connector Line */}
          <div className="w-[1px] h-4 bg-cyan-500/50 absolute -top-4 left-1/2 -translate-x-1/2" />
        </div>
      </div>
    </motion.div>
  );
}

// --- COMPONENT: HERO ---
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="h-screen relative flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative z-10 text-center px-4 w-full max-w-7xl">
        <motion.div style={{ y }}>
          {/* FIX: Added 'pr-4' or 'pl-4' to manually balance the text. 
             If it looks too far left, use 'pl-4'. 
             If it looks too far right, use 'pr-4'.
             I've added 'pr-5' here to counteract the tracking-tighter pulling it left.
          */}
          <h1 className="text-[12vw] font-black text-white leading-[0.85] tracking-tighter mix-blend-difference mb-8 pr-5">
            {DATA.hero.first}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-500 to-white">{DATA.hero.last}</span>
          </h1>
        </motion.div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 text-cyan-400">
            <div className="h-[1px] w-12 bg-cyan-900" />
            <p className="font-mono text-sm tracking-[0.3em] uppercase">{DATA.hero.role}</p>
            <div className="h-[1px] w-12 bg-cyan-900" />
          </div>

          <div className="flex gap-6 mt-8">
            <SocialBtn href="https://github.com/shreyasboddani" icon={Github} />
            <SocialBtn href="https://linkedin.com/in/shreyas-boddani-15785834a" icon={Linkedin} />
            <SocialBtn href="mailto:shreyasboddani@gmail.com" icon={Mail} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialBtn({ href, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="p-4 rounded-full border border-white/10 bg-white/5 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
    >
      <Icon size={20} />
    </a>
  );
}

// --- COMPONENT: PROJECTS ---
function Projects() {
  return (
    <section className="py-32 px-4 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl md:text-9xl font-black text-[#1a1a1a] mb-20 tracking-tighter">
          WORKS
        </h2>
        <div className="flex flex-col gap-32">
          {DATA.projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8 }}
      className="project-card group relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
    >
      <div className={cn("lg:col-span-5 order-2", index % 2 === 1 ? "lg:order-2" : "lg:order-1")}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full border border-white/20 text-gray-300">0{index + 1}</span>
          <span className="text-xs font-mono text-cyan-500 uppercase">{project.subtitle}</span>
        </div>

        <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 group-hover:text-cyan-400 transition-colors">
          {project.title}
        </h3>

        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          {project.desc}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">#{tag}</span>
          ))}
        </div>

        <a href={project.link} target="_blank" className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-cyan-400 hover:border-cyan-400 transition-all">
          VIEW PROJECT <ArrowUpRight size={16} />
        </a>
      </div>

      <div className={cn("lg:col-span-7 h-[400px] md:h-[600px] relative rounded-3xl overflow-hidden order-1 border border-white/10 group-hover:border-cyan-500/30 transition-colors", index % 2 === 1 ? "lg:order-1" : "lg:order-2")}>
        <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-br", project.color)} />
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          onError={(e) => e.target.style.display = 'none'}
        />
        {/* Cool Wireframe overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
    </motion.div>
  );
}

// --- COMPONENT: FOOTER ---
function Footer() {
  return (
    <footer className="relative bg-[#050505] pt-32 pb-12 border-t border-white/10 z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <h2 className="text-[10vw] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 mb-8">
          IMPOSSIBLE?
        </h2>
        <a href="mailto:shreyasboddani@gmail.com" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform mb-20">
          START A CONVERSATION
        </a>
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs font-mono text-gray-600 border-t border-white/10 pt-8">
          <p>© 2026 SHREYAS BODDANI</p>
          <p>ATLANTA, GA</p>
        </div>
      </div>
    </footer>
  );
}

// --- MAIN APP ---
function App() {
  const [loading, setLoading] = useState(true);

  // Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <>
      <AnimatePresence mode='wait'>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-cyan-500 selection:text-black cursor-none">
          <Grain />
          <CustomCursor />
          <nav className="fixed top-0 left-0 w-full p-6 z-40 flex justify-between items-center mix-blend-difference">
            <span className="font-black text-xl tracking-tighter">SB.</span>
            <a href="/resume.pdf" className="text-xs font-bold border border-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors cursor-none">RESUME</a>
          </nav>

          <main>
            <Hero />
            <TimelineSection />
            <RadarSection />
            <Projects />
          </main>

          <Footer />
        </div>
      )}
    </>
  );
}

export default App;