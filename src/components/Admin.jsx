import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Settings, Award, Layers, Inbox, Edit, Trash, Plus, Upload, X, ShieldAlert, Check } from 'lucide-react';
import { api } from '../api';

export default function Admin({ 
  onClose, 
  onSettingsUpdate, 
  onProjectsUpdate, 
  onCertsUpdate,
  initialSettings,
  initialProjects,
  initialCerts
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(api.isLoggedIn());
  const [loginForm, setLoginForm] = useState({ username: 'AKSHAYA', password: '' });
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    name: 'Akshaya Vijay',
    title: 'Full Stack Developer & AI Engineer',
    bio: '',
    about: '',
    location: 'Chennai, India',
    github: '',
    linkedin: '',
    leetcode: '',
    email: '',
    twitter: '',
    experience: '2+ Years',
    projectsCount: '15+',
    commitsCount: '800+',
    avatar: '',
    resume: ''
  });

  // Projects State
  const [projectsList, setProjectsList] = useState(initialProjects || []);
  const [projectDialog, setProjectDialog] = useState(null); // { mode: 'add'|'edit', data: {} }

  // Certs State
  const [certsList, setCertsList] = useState(initialCerts || []);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', date: '', icon: '🏆' });

  // Messages State
  const [messagesList, setMessagesList] = useState([]);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync settings form
  useEffect(() => {
    if (initialSettings) {
      setSettingsForm({
        name: initialSettings.name || 'Akshaya Vijay',
        title: initialSettings.title || 'Full Stack Developer & AI Engineer',
        bio: initialSettings.bio || '',
        about: initialSettings.about || '',
        location: initialSettings.location || 'Chennai, India',
        github: initialSettings.socials?.github || '',
        linkedin: initialSettings.socials?.linkedin || '',
        leetcode: initialSettings.socials?.leetcode || '',
        email: initialSettings.socials?.email || '',
        twitter: initialSettings.socials?.twitter || '',
        experience: initialSettings.stats?.experience || '2+ Years',
        projectsCount: initialSettings.stats?.projects || '15+',
        commitsCount: initialSettings.stats?.commits || '800+',
        avatar: initialSettings.avatar || '',
        resume: initialSettings.resume || ''
      });
    }
  }, [initialSettings]);

  // Load Admin Data on login
  useEffect(() => {
    if (isLoggedIn) {
      loadProjects();
      loadCerts();
      loadMessages();
    }
  }, [isLoggedIn]);

  const loadProjects = async () => {
    try {
      const p = await api.getProjects('all');
      setProjectsList(p);
      onProjectsUpdate(p);
    } catch(err) { console.error('Failed to load projects', err); }
  };

  const loadCerts = async () => {
    try {
      const c = await api.getCerts();
      setCertsList(c);
      onCertsUpdate(c);
    } catch(err) { console.error('Failed to load certs', err); }
  };

  const loadMessages = async () => {
    try {
      const m = await api.getContacts();
      setMessagesList(m);
    } catch(err) { console.error('Failed to load messages', err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await api.login(loginForm.username, loginForm.password);
      setIsLoggedIn(true);
      showToast('success', 'Successfully logged in as Admin!');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    showToast('info', 'Logged out of admin panel.');
  };

  // Settings saving
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const bulkData = {
        name: settingsForm.name,
        title: settingsForm.title,
        bio: settingsForm.bio,
        about: settingsForm.about,
        location: settingsForm.location,
        socials: {
          github: settingsForm.github,
          linkedin: settingsForm.linkedin,
          leetcode: settingsForm.leetcode,
          email: settingsForm.email,
          twitter: settingsForm.twitter
        },
        stats: {
          experience: settingsForm.experience,
          projects: settingsForm.projectsCount,
          commits: settingsForm.commitsCount
        },
        avatar: settingsForm.avatar,
        resume: settingsForm.resume
      };

      await api.saveSettingsBulk(bulkData);
      onSettingsUpdate(bulkData);
      showToast('success', 'Profile settings updated successfully!');
    } catch (err) {
      showToast('error', err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  // Upload Files handlers
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await api.uploadAvatar(file);
      setSettingsForm(prev => ({ ...prev, avatar: res.url }));
      showToast('success', 'Avatar image uploaded!');
    } catch (err) {
      showToast('error', err.message || 'Avatar upload failed');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await api.uploadResume(file);
      setSettingsForm(prev => ({ ...prev, resume: res.url }));
      showToast('success', 'Resume PDF uploaded!');
    } catch (err) {
      showToast('error', err.message || 'Resume upload failed');
    }
  };

  // Project managers
  const openAddProject = () => {
    setProjectDialog({
      mode: 'add',
      data: { title: '', desc: '', category: 'web', stack: '', demo: '', github: '', emoji: '🚀', image: '' }
    });
  };

  const openEditProject = (proj) => {
    setProjectDialog({
      mode: 'edit',
      data: { ...proj, stack: proj.stack.join(', ') }
    });
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const pData = {
      ...projectDialog.data,
      stack: projectDialog.data.stack.split(',').map(s => s.trim()).filter(Boolean)
    };

    setLoading(true);
    try {
      if (projectDialog.mode === 'add') {
        await api.createProject(pData);
        showToast('success', 'Project created successfully!');
      } else {
        await api.updateProject(pData._id, pData);
        showToast('success', 'Project updated successfully!');
      }
      setProjectDialog(null);
      loadProjects();
    } catch (err) {
      showToast('error', err.message || 'Project saving failed');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await api.uploadProjectImage(file);
      setProjectDialog(prev => ({
        ...prev,
        data: { ...prev.data, image: res.url }
      }));
      showToast('success', 'Project image uploaded!');
    } catch(err) {
      showToast('error', err.message || 'Project image upload failed');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      showToast('success', 'Project deleted!');
      loadProjects();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete project');
    }
  };

  // Cert managers
  const handleCertSubmit = async (e) => {
    e.preventDefault();
    if (!certForm.name || !certForm.issuer) return;
    setLoading(true);
    try {
      await api.createCert(certForm);
      showToast('success', 'Certificate added!');
      setCertForm({ name: '', issuer: '', date: '', icon: '🏆' });
      loadCerts();
    } catch (err) {
      showToast('error', err.message || 'Failed to add certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      await api.deleteCert(id);
      showToast('success', 'Certificate deleted!');
      loadCerts();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete certificate');
    }
  };

  // Contact messages manager
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this contact message?')) return;
    try {
      await api.deleteContact(id);
      showToast('success', 'Message deleted from inbox.');
      loadMessages();
    } catch (err) {
      showToast('error', err.message || 'Failed to delete message');
    }
  };

  // If not logged in, render login panel
  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <div className="admin-login-card">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: 'hsl(var(--accent))' }}>
            <ShieldAlert size={48} />
          </div>
          <h2 className="admin-login-title">Admin Console</h2>
          <p style={{ textAlign: 'center', color: 'hsl(var(--text-muted))', fontSize: '0.85rem', marginBottom: '30px' }}>
            Enter credentials to manage portfolio features.
          </p>

          {errorMsg && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}>{errorMsg}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Sign In'}
            </button>
            
            <button type="button" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
              Back to Portfolio
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container" id="admin-panel">
      <div className="admin-header">
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Control Panel</h2>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>Welcome back, AKSHAYA. Add assets or modify settings keys.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Back to Site
          </button>
          <button className="btn btn-primary" style={{ backgroundColor: '#ef4444', boxShadow: 'none' }} onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="admin-nav">
        <button className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
          <Settings size={16} /> Profile Details
        </button>
        <button className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
          <Layers size={16} /> Projects CMS
        </button>
        <button className={`admin-tab ${activeTab === 'certs' ? 'active' : ''}`} onClick={() => setActiveTab('certs')}>
          <Award size={16} /> Credentials
        </button>
        <button className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
          <Inbox size={16} /> Inbox Inquiries ({messagesList.length})
        </button>
      </div>

      {/* Settings Panel */}
      <div className="admin-content">
        {activeTab === 'settings' && (
          <form className="admin-form-section" onSubmit={handleSettingsSubmit}>
            <div className="admin-form-row">
              <div className="form-group">
                <label>Developer Name</label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Job Title (Typewriter Prefix)</label>
                <input
                  type="text"
                  value={settingsForm.title}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Hero Summary Bio (One-liner)</label>
              <input
                type="text"
                value={settingsForm.bio}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Brief welcome line..."
              />
            </div>

            <div className="form-group">
              <label>About Me Paragraph</label>
              <textarea
                rows="4"
                value={settingsForm.about}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, about: e.target.value }))}
                placeholder="Full biography write-up..."
              />
            </div>

            <div className="admin-form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={settingsForm.location}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="form-group">
                <label>GitHub Profile Link</label>
                <input
                  type="url"
                  value={settingsForm.github}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, github: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>LinkedIn Profile Link</label>
                <input
                  type="url"
                  value={settingsForm.linkedin}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, linkedin: e.target.value }))}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="form-group">
                <label>LeetCode Profile Link</label>
                <input
                  type="url"
                  value={settingsForm.leetcode}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, leetcode: e.target.value }))}
                  placeholder="https://leetcode.com/username"
                />
              </div>
              <div className="form-group">
                <label>Twitter/X Profile Link</label>
                <input
                  type="url"
                  value={settingsForm.twitter}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, twitter: e.target.value }))}
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>

            {/* Avatar & Resume File upload fields */}
            <div className="admin-form-row">
              <div className="form-group">
                <label>Avatar Photo</label>
                <div className="upload-container">
                  <div className="upload-preview">
                    {settingsForm.avatar ? (
                      <img src={`${api.base}${settingsForm.avatar}`} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      '👤'
                    )}
                  </div>
                  <div className="file-input-wrapper">
                    <button type="button" className="btn btn-secondary">
                      <Upload size={14} /> Upload Avatar
                    </button>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Resume File (PDF)</label>
                <div className="upload-container" style={{ height: '60px' }}>
                  <div className="upload-preview" style={{ borderRadius: '8px', fontSize: '18px' }}>
                    {settingsForm.resume ? '📄' : '❌'}
                  </div>
                  <div className="file-input-wrapper">
                    <button type="button" className="btn btn-secondary">
                      <Upload size={14} /> Upload PDF
                    </button>
                    <input type="file" accept=".pdf" onChange={handleResumeUpload} />
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ marginTop: '20px', fontSize: '1.2rem', borderBottom: '1px solid hsl(var(--card-border))', paddingBottom: '8px' }}>Dashboard Quick Stats</h3>
            <div className="admin-form-row">
              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="text"
                  value={settingsForm.experience}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, experience: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Projects Completed</label>
                <input
                  type="text"
                  value={settingsForm.projectsCount}
                  onChange={(e) => setSettingsForm(prev => ({ ...prev, projectsCount: e.target.value }))}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }} disabled={loading}>
              Save Settings Changes
            </button>
          </form>
        )}

        {/* Projects CMS */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Project Portfolio Assets</h3>
              <button className="btn btn-primary" onClick={openAddProject}>
                <Plus size={16} /> Add Project
              </button>
            </div>

            <div className="admin-projects-list">
              {projectsList.map(proj => (
                <div className="admin-item-card" key={proj._id}>
                  <div>
                    <span className="admin-item-title">{proj.title}</span>
                    <span className="admin-item-subtitle">{proj.category}</span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="edit-btn" onClick={() => openEditProject(proj)}>
                      <Edit size={14} /> Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteProject(proj._id)}>
                      <Trash size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications CMS */}
        {activeTab === 'certs' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>Add Certification Credentials</h3>
            <form onSubmit={handleCertSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', borderBottom: '1px solid hsl(var(--card-border))', paddingBottom: '30px' }}>
              <div className="admin-form-row">
                <div className="form-group">
                  <label>Cert Name</label>
                  <input
                    type="text"
                    value={certForm.name}
                    onChange={(e) => setCertForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Tensorflow Developer Certificate"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Issuer Body</label>
                  <input
                    type="text"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm(prev => ({ ...prev, issuer: e.target.value }))}
                    placeholder="e.g. Google / Coursera"
                    required
                  />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="form-group">
                  <label>Date Earned</label>
                  <input
                    type="text"
                    value={certForm.date}
                    onChange={(e) => setCertForm(prev => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g. January 2025"
                  />
                </div>
                <div className="form-group">
                  <label>Emoji glyph icon</label>
                  <input
                    type="text"
                    value={certForm.icon}
                    onChange={(e) => setCertForm(prev => ({ ...prev, icon: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                Create Credential
              </button>
            </form>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '15px' }}>Existing Certifications</h3>
            <div className="admin-certs-list">
              {certsList.map(c => (
                <div className="admin-item-card" key={c._id}>
                  <div>
                    <span className="admin-item-title">{c.icon} {c.name}</span>
                    <span className="admin-item-subtitle">{c.issuer} ({c.date})</span>
                  </div>
                  <div className="admin-item-actions">
                    <button className="delete-btn" onClick={() => handleDeleteCert(c._id)}>
                      <Trash size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inbox panel */}
        {activeTab === 'messages' && (
          <div className="admin-inbox-list">
            {messagesList.length > 0 ? (
              messagesList.map(msg => (
                <div className={`message-card ${!msg.read ? 'unread' : ''}`} key={msg._id}>
                  <div className="message-header">
                    <div>
                      <span className="message-from">{msg.name}</span>
                      <span className="message-meta"> &lt;{msg.email}&gt;</span>
                    </div>
                    <span className="message-meta">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="message-subject">Subject: {msg.subject}</div>
                  <div className="message-text">{msg.message}</div>
                  <div className="message-actions">
                    <button className="delete-btn" onClick={() => handleDeleteMessage(msg._id)}>
                      <Trash size={14} /> Remove Message
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: 'hsl(var(--text-muted))' }}>
                Your contact inbox is empty.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Project Dialog Modal */}
      {projectDialog && (
        <div className="admin-dialog-overlay">
          <div className="admin-dialog">
            <h3 className="admin-dialog-title">{projectDialog.mode === 'add' ? 'Add New Project' : 'Edit Project Details'}</h3>
            <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={projectDialog.data.title}
                  onChange={(e) => setProjectDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, title: e.target.value }
                  }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={projectDialog.data.desc}
                  onChange={(e) => setProjectDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, desc: e.target.value }
                  }))}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={projectDialog.data.category}
                    onChange={(e) => setProjectDialog(prev => ({
                      ...prev,
                      data: { ...prev.data, category: e.target.value }
                    }))}
                    style={{
                      padding: '10px',
                      backgroundColor: 'hsl(var(--background))',
                      color: 'hsl(var(--text))',
                      border: '1px solid hsl(var(--card-border))',
                      borderRadius: 'var(--radius)',
                      outline: 'none'
                    }}
                  >
                    <option value="web">Web Apps</option>
                    <option value="python">Python Scripts</option>
                    <option value="ml">Machine Learning</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Emoji Icon</label>
                  <input
                    type="text"
                    value={projectDialog.data.emoji}
                    onChange={(e) => setProjectDialog(prev => ({
                      ...prev,
                      data: { ...prev.data, emoji: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tech Stack (Comma-separated)</label>
                <input
                  type="text"
                  value={projectDialog.data.stack}
                  onChange={(e) => setProjectDialog(prev => ({
                    ...prev,
                    data: { ...prev.data, stack: e.target.value }
                  }))}
                  placeholder="e.g. React, Node, MongoDB, Python"
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="form-group">
                  <label>GitHub Source URL</label>
                  <input
                    type="url"
                    value={projectDialog.data.github}
                    onChange={(e) => setProjectDialog(prev => ({
                      ...prev,
                      data: { ...prev.data, github: e.target.value }
                    }))}
                  />
                </div>
                <div className="form-group">
                  <label>Live Demo URL</label>
                  <input
                    type="url"
                    value={projectDialog.data.demo}
                    onChange={(e) => setProjectDialog(prev => ({
                      ...prev,
                      data: { ...prev.data, demo: e.target.value }
                    }))}
                  />
                </div>
              </div>

              {/* Upload project image option */}
              <div className="form-group">
                <label>Project Cover Image</label>
                <div className="upload-container">
                  <div className="upload-preview" style={{ borderRadius: '8px', fontSize: '18px', width: '80px' }}>
                    {projectDialog.data.image ? (
                      <img src={`${api.base}${projectDialog.data.image}`} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      '🖼️'
                    )}
                  </div>
                  <div className="file-input-wrapper">
                    <button type="button" className="btn btn-secondary">
                      <Upload size={14} /> Upload Banner
                    </button>
                    <input type="file" accept="image/*" onChange={handleProjectImgUpload} />
                  </div>
                </div>
              </div>

              <div className="admin-dialog-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setProjectDialog(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Floating Toast notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <Check size={20} style={{ color: toast.type === 'success' ? '#10b981' : '#f59e0b' }} />
          <span>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
