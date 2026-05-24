import React from 'react';

export default function Certs({ certs }) {
  const defaultCerts = [
    {
      _id: '1',
      name: "Machine Learning Specialization",
      issuer: "Stanford / Coursera",
      date: "Dec 2024",
      icon: "🤖"
    },
    {
      _id: '2',
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "Aug 2025",
      icon: "☁️"
    },
    {
      _id: '3',
      name: "Deep Learning Specialization",
      issuer: "DeepLearning.AI",
      date: "Mar 2025",
      icon: "🧠"
    },
    {
      _id: '4',
      name: "Data Structures & Algorithms in Python",
      issuer: "LeetCode",
      date: "Oct 2024",
      icon: "💻"
    }
  ];

  const displayCerts = certs && certs.length > 0 ? certs : defaultCerts;

  return (
    <section id="certs" className="certs">
      <h2 className="section-title">Credentials & <span>Certifications</span></h2>
      <p className="section-subtitle">A collection of industry courses and verified technical credentials I've earned.</p>
      
      <div className="certs-grid">
        {displayCerts.map(cert => (
          <div className="cert-card" key={cert._id}>
            <div className="cert-icon">
              {cert.icon || '🏆'}
            </div>
            <div className="cert-info">
              <h3>{cert.name}</h3>
              <p className="cert-issuer">{cert.issuer}</p>
              <p className="cert-date">{cert.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
