import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function Contact({ settings }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: '' }

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    
    if (!name || !email || !subject || !message) {
      showToast('error', 'Please fill in all form fields.');
      return;
    }

    setLoading(true);
    try {
      await api.submitContact(formData);
      showToast('success', 'Message sent successfully! Talk to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      showToast('error', err.message || 'Failed to submit contact message. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const emailVal = settings?.socials?.email || "akshayavijay0728@gmail.com";
  const locationVal = settings?.location || "Chennai, India";

  return (
    <section id="contact" className="contact">
      <h2 className="section-title">Get In <span>Touch</span></h2>
      <p className="section-subtitle">Have an interesting project, job opportunity, or just want to say hi? Drop me a message.</p>

      <div className="contact-grid">
        <div className="contact-meta">
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <Mail size={24} />
            </div>
            <div>
              <span className="contact-info-label">Direct Mail</span>
              <span className="contact-info-value">{emailVal}</span>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-info-icon">
              <MapPin size={24} />
            </div>
            <div>
              <span className="contact-info-label">Location</span>
              <span className="contact-info-value">{locationVal}</span>
            </div>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                name="subject"
                placeholder="Message subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Your detailed message..."
                value={formData.message}
                onChange={handleInputChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ display: 'flex', justifyContent: 'center', width: '100%', gap: '8px' }}
            >
              {loading ? 'Submitting...' : (
                <>
                  Send Message <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Floating toast alerts */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={20} style={{ color: '#10b981' }} />
          ) : (
            <AlertCircle size={20} style={{ color: '#ef4444' }} />
          )}
          <span>{toast.msg}</span>
        </div>
      )}
    </section>
  );
}
