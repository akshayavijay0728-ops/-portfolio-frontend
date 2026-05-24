import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer" id="app-footer">
      <p>&copy; {currentYear} &lt;<span>Akshaya Vijay</span>/&gt;. All rights reserved.</p>
    </footer>
  );
}
