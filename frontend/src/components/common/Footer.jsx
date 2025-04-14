import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-copyright">
            <p>&copy; {currentYear} F1 Management System. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <a href="#" target="_blank" rel="noopener noreferrer">Terms</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Privacy</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Contact</a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--secondary-color);
          color: var(--light-text-color);
          padding: 20px 0;
          margin-top: 40px;
        }
        
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .footer-copyright p {
          margin: 0;
          font-size: 14px;
        }
        
        .footer-links {
          display: flex;
        }
        
        .footer-links a {
          color: var(--light-text-color);
          margin-left: 20px;
          font-size: 14px;
          text-decoration: none;
        }
        
        .footer-links a:hover {
          color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            text-align: center;
          }
          
          .footer-links {
            margin-top: 15px;
          }
          
          .footer-links a:first-child {
            margin-left: 0;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
