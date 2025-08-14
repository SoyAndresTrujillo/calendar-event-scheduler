import { 
  CalendarOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined, 
  GlobalOutlined, 
  LinkOutlined
} from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';

import styles from './LandingPage.module.scss';

const LandingPage: React.FC = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: <CalendarOutlined />,
      title: 'Google Calendar Integration',
      description: 'Seamlessly create events that open directly in Google Calendar with one click.'
    },
    {
      icon: <GlobalOutlined />,
      title: 'Outlook Calendar Support',
      description: 'Full compatibility with Microsoft Outlook for personal accounts and Office 365.'
    },
    {
      icon: <LinkOutlined />,
      title: 'Shareable Event Links',
      description: 'Generate shareable URLs that anyone can use to add events to their calendar.'
    },
    {
      icon: <ClockCircleOutlined />,
      title: 'UTC Time Conversion',
      description: 'Automatic time zone conversion ensures events appear correctly for all users.'
    },
    {
      icon: <CheckCircleOutlined />,
      title: 'Form Validation',
      description: 'Smart validation ensures all required fields are filled and dates are logical.'
    },
    {
      icon: <CopyOutlined />,
      title: 'One-Click Copy to Clipboard',
      description: 'Instantly copy event links to your clipboard for easy sharing and distribution.'
    }
  ];

  return (
    <div className={styles.landingPage}>
      {/* Navigation Header */}
      <nav className={styles.nav}>
        <div className={styles.navContainer}>
          <div className={styles.logo}>
            <CalendarOutlined className={styles.logoIcon} />
            <span className={styles.logoText}>Calendar Scheduler</span>
          </div>
          <div className={styles.navLinks}>
            <button onClick={scrollToFeatures} className={styles.navLink}>Features</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            The Smart Way to Schedule Events
          </h1>
          <p className={styles.heroSubtitle}>
            Create shareable event links for Google Calendar and Outlook. 
            Pick a platform, fill in your event details, and generate URLs 
            that open directly in your preferred calendar application.
          </p>
          
          <div className={styles.heroButtons}>
            <Link to="/home" className={styles.primaryButton}>
              Get Started
            </Link>
            <button onClick={scrollToFeatures} className={styles.secondaryButton}>
              View Features
            </button>
          </div>

          {/* Code Preview */}
          <div className={styles.codePreview}>
            <div className={styles.terminal}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className={styles.terminalBody}>
                <div className={styles.terminalLine}>
                  <span className={styles.prompt}>▲</span>
                  <span className={styles.command}>Let&apos;s do simple things</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.featuresContainer}>
          <div className={styles.featuresHeader}>
            <h2 className={styles.featuresTitle}>What&apos;s in Calendar Scheduler?</h2>
            <p className={styles.featuresSubtitle}>
              Everything you need to create and share calendar events effortlessly.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p className={styles.footerText}>
            Built with React, TypeScript, and Ant Design
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
