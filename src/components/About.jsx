import React, { useState } from 'react';

export default function About({ settings }) {
  const [activeTab, setActiveTab] = useState(0);

  const defaultSkills = [
    {
      category: "Languages",
      items: [
        { name: "Python", level: 95 },
        { name: "JavaScript", level: 85 },
        { name: "C++", level: 70 },
        { name: "SQL", level: 80 }
      ]
    },
    {
      category: "Web & Backend",
      items: [
        { name: "React", level: 90 },
        { name: "Node.js", level: 85 },
        { name: "Express.js", level: 80 },
        { name: "HTML & CSS", level: 95 }
      ]
    },
    {
      category: "AI & ML",
      items: [
        { name: "TensorFlow & Keras", level: 85 },
        { name: "PyTorch", level: 75 },
        { name: "Scikit-Learn", level: 90 },
        { name: "NLP (NLTK/SpaCy)", level: 80 }
      ]
    },
    {
      category: "Tools & Cloud",
      items: [
        { name: "Git & GitHub", level: 90 },
        { name: "MongoDB", level: 85 },
        { name: "PostgreSQL", level: 75 },
        { name: "Docker", level: 70 }
      ]
    }
  ];

  const skillsData = settings?.skills || defaultSkills;
  const aboutText = settings?.about || "I am a passionate software engineer specializing in web application development and artificial intelligence. I enjoy bridging the gap between database endpoints and visual frontend elements, ensuring both system reliability and aesthetic excellence. My experience spans full-stack JavaScript architectures, database management, machine learning models, and custom data processing with Python.";

  return (
    <section id="about" className="about">
      <h2 className="section-title">About <span>Me</span></h2>
      <p className="section-subtitle">A brief overview of my technical journey, values, and qualifications.</p>
      
      <div className="about-grid">
        <div className="about-info">
          <h3>Who I Am</h3>
          <p>{aboutText}</p>
          <p>
            I love learning new APIs, building interactive systems, and automating manual pipelines. 
            When I'm not writing code, I explore papers on neural networks, read books, or work on hobby automation systems.
          </p>
        </div>

        <div className="skills-wrapper">
          <div className="skills-tabs">
            {skillsData.map((cat, idx) => (
              <button
                key={idx}
                className={`skills-tab-btn ${activeTab === idx ? 'active' : ''}`}
                onClick={() => setActiveTab(idx)}
              >
                {cat.category}
              </button>
            ))}
          </div>

          <div className="skills-list">
            {skillsData[activeTab]?.items?.map((skill, sIdx) => {
              // Support both {name, level} objects and plain strings
              const name = typeof skill === 'object' ? skill.name : skill;
              const level = typeof skill === 'object' ? (skill.level || skill.val || 80) : 80;
              
              return (
                <div className="skill-item" key={sIdx}>
                  <div className="skill-info">
                    <span>{name}</span>
                    <span>{level}%</span>
                  </div>
                  <div className="skill-bar-container">
                    <div 
                      className="skill-bar-fill" 
                      style={{ width: `${level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
