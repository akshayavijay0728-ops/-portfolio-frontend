import React, { useState, useEffect, useRef } from 'react';

export default function Console({ settings, projects }) {
  const [history, setHistory] = useState([
    { text: "Akshaya Vijay Terminal OS [Version 1.0.0]", type: "info" },
    { text: "Type 'help' to view all available commands.", type: "info" },
    { text: "", type: "spacing" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const bodyRef = useRef(null);

  const skillsList = settings?.skills || [
    { category: "Languages", items: ["Python", "JavaScript", "C++", "SQL"] },
    { category: "Web Stack", items: ["React", "Node.js", "Express", "HTML/CSS"] },
    { category: "Machine Learning", items: ["TensorFlow", "PyTorch", "Pandas", "Scikit-Learn"] }
  ];

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    // Add input command to history
    const newHistory = [...history, { text: `guest@akshaya:~$ ${inputVal}`, type: "command" }];

    switch (cmd) {
      case 'help':
        newHistory.push({ text: "Available commands:", type: "output" });
        newHistory.push({ text: "  bio      - Learn about Akshaya's journey", type: "output" });
        newHistory.push({ text: "  skills   - View core technical capabilities", type: "output" });
        newHistory.push({ text: "  projects - List summary of highlight projects", type: "output" });
        newHistory.push({ text: "  contact  - Show methods to reach out", type: "output" });
        newHistory.push({ text: "  clear    - Clear terminal shell output", type: "output" });
        break;
      case 'bio':
        newHistory.push({ 
          text: settings?.about || "I am a Full Stack Developer & AI Engineer focused on machine learning solutions and responsive modern web design. I enjoy turning complex data into intuitive interface experiences.",
          type: "output" 
        });
        break;
      case 'skills':
        newHistory.push({ text: "Core Technical Stack:", type: "output" });
        skillsList.forEach(cat => {
          newHistory.push({ text: `  [${cat.category}]: ${cat.items.join(', ')}`, type: "output" });
        });
        break;
      case 'projects':
        newHistory.push({ text: "Featured Projects:", type: "output" });
        if (projects && projects.length > 0) {
          projects.slice(0, 3).forEach(p => {
            newHistory.push({ text: `  * ${p.title} (${p.category}) - ${p.desc.substring(0, 60)}...`, type: "output" });
          });
        } else {
          newHistory.push({ text: "  * Sentiment Classifier - Python & TensorFlow", type: "output" });
          newHistory.push({ text: "  * Portfolio Dashboard - React, Node & Express", type: "output" });
        }
        break;
      case 'contact':
        newHistory.push({ text: "Contact Credentials:", type: "output" });
        newHistory.push({ text: `  Email:    ${settings?.socials?.email || "akshayavijay0728@gmail.com"}`, type: "output" });
        newHistory.push({ text: `  Github:   ${settings?.socials?.github || "https://github.com"}`, type: "output" });
        newHistory.push({ text: `  LinkedIn: ${settings?.socials?.linkedin || "https://linkedin.com"}`, type: "output" });
        newHistory.push({ text: `  LeetCode: ${settings?.socials?.leetcode || "https://leetcode.com"}`, type: "output" });
        break;
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;
      default:
        newHistory.push({ text: `bash: command not found: ${cmd}. Type 'help' for suggestions.`, type: "error" });
    }

    newHistory.push({ text: "", type: "spacing" });
    setHistory(newHistory);
    setInputVal('');
  };

  // Scroll to bottom on history change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="console-container">
      <div className="console-header">
        <div className="console-dots">
          <div className="console-dot red"></div>
          <div className="console-dot yellow"></div>
          <div className="console-dot green"></div>
        </div>
        <div className="console-title">guest@akshaya: ~</div>
        <div style={{ width: 52 }}></div>
      </div>
      
      <div className="console-body" ref={bodyRef}>
        {history.map((line, index) => (
          <div 
            key={index} 
            className={`console-line ${line.type === 'command' ? 'console-prompt' : ''}`}
            style={{ 
              color: line.type === 'error' ? '#ef4444' : 
                     line.type === 'command' ? 'hsl(var(--accent))' : 
                     line.type === 'info' ? '#a1a1aa' : '#e4e4e7' 
            }}
          >
            {line.text}
          </div>
        ))}
        
        <form onSubmit={handleCommand} className="console-input-row">
          <span className="console-prompt">guest@akshaya:~$</span>
          <input
            type="text"
            className="console-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            aria-label="Terminal prompt input"
          />
          <span className="console-cursor"></span>
        </form>
      </div>
    </div>
  );
}
