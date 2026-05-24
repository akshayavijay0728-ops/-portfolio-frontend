import React, { useState, useEffect } from 'react';
import { Download, Mail, Code, Star, Award } from 'lucide-react';
import { api } from '../api';
import profilePhoto from '../assets/profile.jpg';

export default function Hero({ settings, onContactClick }) {
  const [typedTitle, setTypedTitle] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const titles = [
    settings?.title || "Full Stack Developer",
    "Python Programmer",
    "Machine Learning Engineer",
    "Problem Solver"
  ];

  // Typing speed logic
  useEffect(() => {
    const currentTitle = titles[titleIndex];
    let typingSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIndex === currentTitle.length) {
      typingSpeed = 2000; // hold
      setIsDeleting(true);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
      typingSpeed = 500; // delay before next title
    }

    const timer = setTimeout(() => {
      setTypedTitle(
        isDeleting
          ? currentTitle.substring(0, charIndex - 1)
          : currentTitle.substring(0, charIndex + 1)
      );
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, titleIndex]);

  const name = settings?.name || "Akshaya Vijay";
  const bio = settings?.bio || "Building robust full-stack applications and deploying machine learning solutions using Python, React, and cloud platforms.";
  const avatarUrl = settings?.avatar ? `${api.base}${settings.avatar}?t=${Date.now()}` : profilePhoto;
  const resumeUrl = settings?.resume ? `${api.base}${settings.resume}` : null;
  
  const stats = settings?.stats || {
    experience: "2+ Years",
    projects: "15+",
    commits: "800+"
  };

  const socials = settings?.socials || {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    leetcode: "https://leetcode.com",
    twitter: "https://twitter.com"
  };

  return (
    <section id="home" className="hero">
      <div className="hero-grid">
        <div className="hero-text">
          <h2>Welcome to my space</h2>
          <h1>Hi, I'm <span>{name}</span></h1>
          <div className="hero-role">
            I am a {typedTitle}<span className="console-cursor"></span>
          </div>
          <p className="hero-desc">
            {bio}
          </p>
          
          <div className="hero-socials">
            {socials.github && (
              <a href={socials.github} target="_blank" rel="noreferrer" className="social-icon-btn github-btn" title="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            )}
            {socials.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="social-icon-btn linkedin-btn" title="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            )}
            {socials.leetcode && (
              <a href={socials.leetcode} target="_blank" rel="noreferrer" className="social-icon-btn leetcode-btn" title="LeetCode">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-11.75 11.75a1.377 1.377 0 0 0 .551 2.225l5.031 1.258a1.378 1.378 0 0 0 1.282-.363l6.517-6.517a1.371 1.371 0 0 0-1.939-1.942l-5.229 5.23-1.881-.47 8.924-8.924L20.8 10.4a1.371 1.371 0 0 0 1.939-1.94L14.444.415a1.372 1.372 0 0 0-.961-.415Zm-10.73 15.022a1.371 1.371 0 0 0-1.939 1.94l5.605 5.603a1.372 1.372 0 0 0 1.939-1.94l-5.605-5.603Z"/>
                </svg>
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} target="_blank" rel="noreferrer" className="social-icon-btn twitter-btn" title="Twitter/X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
            )}
          </div>

          <div className="hero-buttons">
            {resumeUrl ? (
              <a href={resumeUrl} download className="btn btn-primary" target="_blank" rel="noreferrer">
                <Download size={18} /> Download Resume
              </a>
            ) : (
              <button className="btn btn-primary" onClick={() => alert("Resume not uploaded yet. Log in to upload in the Admin panel!")}>
                <Download size={18} /> Download Resume
              </button>
            )}
            <button className="btn btn-secondary" onClick={onContactClick}>
              <Mail size={18} /> Get In Touch
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="profile-ring"></div>
          
          <div className="profile-circle">
            <img 
              src={avatarUrl} 
              alt={name} 
              className="profile-avatar-img" 
              onError={(e) => { e.target.onerror = null; e.target.src = profilePhoto; }} 
            />
          </div>

          {/* Experience Stats Badge */}
          <div className="stats-badge stats-badge-1">
            <div className="stats-icon">
              <Award size={20} />
            </div>
            <div>
              <span className="stats-number">{stats.experience}</span>
              <span className="stats-label">Experience</span>
            </div>
          </div>

          {/* Projects Stats Badge */}
          <div className="stats-badge stats-badge-2">
            <div className="stats-icon">
              <Code size={20} />
            </div>
            <div>
              <span className="stats-number">{stats.projects}</span>
              <span className="stats-label">Projects Built</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
