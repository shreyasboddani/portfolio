import { Github, Linkedin, Mail } from 'lucide-react';

export const HERO = {
    title: "SHREYAS",
    surname: "BODDANI",
    role: "FULL STACK ENGINEER",
    location: "ATLANTA, GA"
};

export const STORY = [
    {
        id: "01",
        title: "THE ORIGIN",
        description: "Freshman year. Boarding school. While others slept, I found my language in the glowing terminal of a computer lab.",
        year: "2023"
    },
    {
        id: "02",
        title: "THE ACCELERATION",
        description: "Dual Enrollment at Georgia Tech. I didn't want to just use AI; I wanted to build it. Neural Networks became my new playground.",
        year: "2024"
    },
    {
        id: "03",
        title: "THE IMPACT",
        description: "From GHP State Nominee to building full-stack apps. My code isn't just theoretical—it solves real human problems.",
        year: "PRESENT"
    }
];

export const PROJECTS = [
    {
        id: 1,
        title: "MENTICS",
        category: "AI PLATFORM",
        description: "Fixing the broken college admissions process with Gemini AI. A full-stack mentor that builds personalized roadmaps.",
        tech: "REACT / FLASK / OAUTH",
        link: "https://mentics.onrender.com/",
        color: "bg-blue-600",
        image: "/mentics.png"
    },
    {
        id: 2,
        title: "SAFEROUTE",
        category: "HACKATHON SPRINT",
        description: "Civilian survival routing engineered in just 5.5 hours. A high-pressure test of rapid prototyping and API integration.",
        tech: "PYTHON / OPENSTREETMAP",
        link: "https://github.com/shreyasboddani/SafeRoute",
        color: "bg-emerald-600",
        image: "/saferoute.png"
    },
    {
        id: 3,
        title: "ANIME ML",
        category: "DEEP LEARNING",
        description: "A neural network that mathematically understands your taste. Used Autoencoders to capture complex viewer patterns.",
        tech: "TENSORFLOW / PANDAS",
        link: "https://anime-discovery-48yh.onrender.com/",
        color: "bg-purple-600",
        image: "/anime.png"
    }
];