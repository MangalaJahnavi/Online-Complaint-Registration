import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1>Online Complaint Registration and Management System</h1>
        <p style={{ marginTop: 12, lineHeight: 1.6 }}>
          A user-friendly platform to submit, track, and resolve complaints efficiently.
          Register your complaint, monitor its progress in real time, and communicate
          directly with assigned agents until resolution — all in one centralized,
          secure system.
        </p>
        <div style={{ marginTop: 20 }}>
          <Link to="/register" className="btn">Get Started</Link>
          <Link to="/login" className="btn btn-secondary" style={{ marginLeft: 10 }}>
            Login
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>Key Features</h2>
        <ul style={{ marginTop: 10, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>Secure user registration and authentication (JWT-based)</li>
          <li>Submit complaints with category and priority</li>
          <li>Real-time status tracking (Open, In Progress, Resolved, Closed)</li>
          <li>Agent assignment and admin oversight</li>
          <li>Comment thread for complainant-agent communication</li>
        </ul>
      </div>
    </div>
  );
}
