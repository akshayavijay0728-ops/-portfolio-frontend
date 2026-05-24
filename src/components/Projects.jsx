import React, { useState } from 'react';
import { Search, ExternalLink, X } from 'lucide-react';
import { api } from '../api';

const Github = ({ size = 20, ...props }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Projects({ projects }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'python', label: 'Python Scripts' },
    { id: 'ml', label: 'Machine Learning' },
    { id: 'other', label: 'Other' }
  ];

  // Filtering and searching logic
  const filteredProjects = (projects || []).filter(p => {
    const matchesCategory = filter === 'all' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.stack.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.desc && p.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="projects">
      <h2 className="section-title">Featured <span>Projects</span></h2>
      <p className="section-subtitle">A collection of applications, analysis tools, and backend utilities I've engineered.</p>

      <div className="projects-controls">
        {/* Category filters */}
        <div className="projects-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${filter === cat.id ? 'active' : ''}`}
              onClick={() => setFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="projects-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by tech or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map(p => {
            const imageUrl = p.image ? `${api.base}${p.image}` : null;
            return (
              <div 
                className="project-card" 
                key={p._id}
                onClick={() => setSelectedProject(p)}
              >
                <div className="project-img-wrapper">
                  {imageUrl ? (
                    <img src={imageUrl} alt={p.title} className="project-img" />
                  ) : (
                    <span className="project-card-emoji">{p.emoji || '🚀'}</span>
                  )}
                </div>
                <div className="project-content">
                  <span className="project-category-badge">{p.category}</span>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc-short">{p.desc}</p>
                  
                  <div className="project-footer">
                    <div className="project-stack-icons">
                      {p.stack.slice(0, 3).map((s, idx) => (
                        <span className="stack-badge" key={idx}>{s}</span>
                      ))}
                      {p.stack.length > 3 && <span className="stack-badge">+{p.stack.length - 3}</span>}
                    </div>
                    <span className="project-link-indicator">
                      Details <ExternalLink size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: 'hsl(var(--text-muted))' }}>
          No projects match your filter or search criteria.
        </div>
      )}

      {/* Project Detail Modal Overlay */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <div className="modal-img-banner">
              {selectedProject.image ? (
                <img src={`${api.base}${selectedProject.image}`} alt={selectedProject.title} />
              ) : (
                <span className="modal-emoji-banner">{selectedProject.emoji || '🚀'}</span>
              )}
            </div>
            
            <div className="modal-body">
              <div className="modal-header">
                <span className="project-category-badge">{selectedProject.category}</span>
                <h3 className="modal-title">{selectedProject.title}</h3>
              </div>
              
              <p className="modal-desc">{selectedProject.desc}</p>
              
              <h4 className="modal-section-title">Technology Stack</h4>
              <div className="modal-stack">
                {selectedProject.stack.map((s, idx) => (
                  <span className="modal-stack-badge" key={idx}>{s}</span>
                ))}
              </div>
              
              <div className="modal-actions">
                {selectedProject.github && (
                  <a href={selectedProject.github} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    <Github size={18} /> View Source
                  </a>
                )}
                {selectedProject.demo && (
                  <a href={selectedProject.demo} target="_blank" rel="noreferrer" className="btn btn-primary">
                    <ExternalLink size={18} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
