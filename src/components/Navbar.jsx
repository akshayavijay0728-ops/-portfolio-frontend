import React, { useState, useEffect } from 'react';
import { Sun, Moon, Palette, Menu, X, ShieldAlert, LogOut } from 'lucide-react';

export default function Navbar({ 
  activeSection, 
  setActiveSection, 
  theme, 
  setTheme, 
  accent, 
  setAccent,
  isLoggedIn,
  onLogout,
  onOpenAdmin
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'certs', label: 'Certs' },
    { id: 'contact', label: 'Contact' }
  ];

  const accents = [
    { name: 'violet', label: 'Violet', color: '#8b5cf6' },
    { name: 'emerald', label: 'Emerald', color: '#10b981' },
    { name: 'indigo', label: 'Indigo', color: '#6366f1' },
    { name: 'amber', label: 'Amber', color: '#f59e0b' }
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleNavClick = (id) => {
    setIsOpen(false);
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 70; // height of navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="navbar" id="app-nav">
      <div className="navbar-container">
        <a href="#home" className="nav-logo" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
          <span>&lt;</span>Akshaya<span>/&gt;</span>
        </a>

        {/* Mobile menu trigger */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation links */}
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          {sections.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              className={`nav-link ${activeSection === sec.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(sec.id);
              }}
            >
              {sec.label}
            </a>
          ))}
          {isLoggedIn && (
            <a
              href="#admin"
              className={`nav-link ${activeSection === 'admin' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                onOpenAdmin();
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'hsl(var(--accent))' }}
            >
              <ShieldAlert size={16} /> Admin CMS
            </a>
          )}
        </div>

        {/* Actions panel */}
        <div className="nav-actions">
          {/* Accent Color Palette Selector */}
          <div className="accent-picker">
            <button 
              className="nav-action-btn" 
              onClick={() => setShowPicker(!showPicker)} 
              title="Select Accent Color"
              aria-expanded={showPicker}
            >
              <Palette size={20} />
            </button>
            {showPicker && (
              <div className="accent-dropdown">
                {accents.map((item) => (
                  <div
                    key={item.name}
                    className={`color-dot ${accent === item.name ? 'active' : ''}`}
                    style={{ backgroundColor: item.color }}
                    onClick={() => {
                      setAccent(item.name);
                      setShowPicker(false);
                    }}
                    title={`${item.label} Accent`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Light/Dark Toggle */}
          <button className="nav-action-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Admin shortcut (if not logged in) or logout button */}
          {isLoggedIn ? (
            <button className="nav-action-btn" onClick={onLogout} title="Admin Sign Out" style={{ color: '#ef4444' }}>
              <LogOut size={20} />
            </button>
          ) : (
            <button 
              className="nav-action-btn" 
              onClick={onOpenAdmin} 
              title="Admin Portal"
            >
              <ShieldAlert size={20} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
