import React, { useState } from 'react';

export default function About({ settings }) {
  const [activeTab, setActiveTab] = useState(0);

  const defaultSkills = [
    {
      category: "Languages",
      items: [
        { name: "Python", level: 95 },
        { name: "SQL (PostgreSQL/MySQL)", level: 90 },
        { name: "C++", level: 85 },
        { name: "R Language", level: 65 }
      ]
    },
    {
      category: "Data Analysis",
      items: [
        { name: "Power BI", level: 95 },
        { name: "Excel (Advanced / DAX)", level: 90 },
        { name: "Pandas & NumPy", level: 92 },
        { name: "Matplotlib & Seaborn", level: 85 }
      ]
    },
    {
      category: "DSA & Core",
      items: [
        { name: "Data Structures", level: 88 },
        { name: "Algorithms", level: 85 },
        { name: "Problem Solving", level: 90 },
        { name: "C++ DSA Coding", level: 80 }
      ]
    },
    {
      category: "Tools & Databases",
      items: [
        { name: "Git & GitHub", level: 90 },
        { name: "PostgreSQL", level: 85 },
        { name: "MongoDB", level: 80 },
        { name: "Jupyter Notebooks", level: 95 }
      ]
    }
  ];

  const skillsData = settings?.skills || defaultSkills;
  const aboutText = settings?.about || "I am a passionate software engineer and aspiring Data Analyst focused on data visualization, business intelligence, and algorithm design. I love extracting insights from raw data, building interactive Power BI dashboards, and solving complex problems using Data Structures and Algorithms (DSA) in Python and C++. My goal is to bridge the gap between engineering and analytics to deliver data-driven solutions.";

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
