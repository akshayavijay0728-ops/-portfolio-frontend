import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Console from './components/Console';
import About from './components/About';
import Projects from './components/Projects';
import Certs from './components/Certs';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Footer from './components/Footer';
import { api } from './api';
import './App.css';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [theme, setTheme] = useState(localStorage.getItem('portfolio_theme') || 'dark');
  const [accent, setAccent] = useState(localStorage.getItem('portfolio_accent') || 'violet');
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(api.isLoggedIn());

  // Database settings/projects/certs
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);

  // Fetch initial database assets
  useEffect(() => {
    async function loadData() {
      try {
        const [sData, pData, cData] = await Promise.all([
          api.getSettings(),
          api.getProjects('all'),
          api.getCerts()
        ]);
        setSettings(sData);
        setProjects(pData);
        setCerts(cData);
      } catch (err) {
        console.error('Failed to load portfolio DB data, using placeholders.', err);
      }
    }
    loadData();
  }, []);

  // Sync theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio_theme', theme);
  }, [theme]);

  // Sync accent color to document body classes
  useEffect(() => {
    // Remove previous accent classes
    const body = document.body;
    body.className = body.className.replace(/\baccent-\w+\b/g, '');
    body.classList.add(`accent-${accent}`);
    localStorage.setItem('portfolio_accent', accent);
  }, [accent]);

  // Scroll section highlight listener
  useEffect(() => {
    if (showAdmin) return;
    
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'certs', 'contact'];
      const scrollPosition = window.scrollY + 200; // Offset for navbar

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAdmin]);

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    setShowAdmin(false);
  };

  const handleOpenAdmin = () => {
    setShowAdmin(true);
    setActiveSection('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-scroll to contact
  const handleScrollToContact = () => {
    const contactSec = document.getElementById('contact');
    if (contactSec) {
      window.scrollTo({
        top: contactSec.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic Background Glow Canvas */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      <Navbar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        theme={theme}
        setTheme={setTheme}
        accent={accent}
        setAccent={setAccent}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onOpenAdmin={handleOpenAdmin}
      />

      {showAdmin ? (
        <Admin 
          onClose={() => {
            setShowAdmin(false);
            setActiveSection('home');
          }}
          onSettingsUpdate={(newSettings) => setSettings(newSettings)}
          onProjectsUpdate={(newProjects) => setProjects(newProjects)}
          onCertsUpdate={(newCerts) => setCerts(newCerts)}
          initialSettings={settings}
          initialProjects={projects}
          initialCerts={certs}
        />
      ) : (
        <main>
          {/* Landing / Hero view */}
          <Hero 
            settings={settings} 
            onContactClick={handleScrollToContact} 
          />

          {/* Interactive Console Shell */}
          <section style={{ padding: '0 24px 40px 24px' }}>
            <Console 
              settings={settings} 
              projects={projects} 
            />
          </section>

          {/* About Me & Tech tab lists */}
          <About settings={settings} />

          {/* Catalog project lists */}
          <Projects projects={projects} />

          {/* Credentials listing */}
          <Certs certs={certs} />

          {/* Messaging form submission */}
          <Contact settings={settings} />
        </main>
      )}

      <Footer />
    </div>
  );
}
