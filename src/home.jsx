import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // custom styles

export default function Home() {
  return (
    <div className="hero-container">
      <div className="hero-card">
        {/* Logo + Name */}
        <h1 className="app-name">Social Media Content Analyser</h1>

        {/* Hero Text */}
        <h2 className="hero-title">Revolutionize Your Content Creation</h2>
        <p className="hero-subtitle">
          Our AI-powered Social Media Analyzer helps you extract insights, analyze sentiment,
          and create engaging, high-quality content in seconds.
        </p>

        {/* CTA */}
        <Link to="/login" className="cta-button">
          Get Started
        </Link>
      </div>
    </div>
  );
}
