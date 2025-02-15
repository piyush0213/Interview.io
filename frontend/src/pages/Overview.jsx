import React from "react";
import './Overview.scss';
import Sidebar from '../components/Sidebar.jsx';
import { useStore } from '../store/store.js';
import Chatbot from '../components/Chatbot.jsx';
import { FaCalendarAlt, FaClock, FaBuilding, FaEye } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useStore();
  return (
    <>
      <Chatbot />
      <div className="overview-container">
        <Sidebar />
        <div className="main-content">
          <header>
            <h2>
              Hi, {user.name} welcome to <span className="font-bold">Interview.io</span>
            </h2>
          </header>

          {/* Upcoming Interview Section */}
          <div className="upcoming-interviews">
            <h3 className="font-bold">Upcoming Interviews</h3>
            <ul className="event-list">
              <li className="event-card">
                <span className="event-date">Oct 20, 2024</span>
                <div className="event-details">
                  <p>Company: TechCorp</p>
                  <p>Position: Software Engineer</p>
                  <p>Time: 2:00 PM</p>
                </div>
                <button className="view-details ml-[53%]">
                    <FaEye className="btn-icon" /> View Details
                  </button>
              </li>
              <li className="event-card">
                <span className="event-date">Oct 25, 2024</span>
                <div className="event-details">
                  <p>Company: InnovateX</p>
                  <p>Position: Frontend Developer</p>
                  <p>Time: 11:00 AM</p>
                </div>
                <button className="view-details ml-[52%]">
                    <FaEye className="btn-icon" /> View Details
                  </button>
              </li>
            </ul>
          </div>

          {/* Interview Feedback Request Section */}
          <div className="feedback-section">
            <div className="feedback-content">
              <h3 className="font-bold">Interview Feedback Request</h3>
              <p>Request feedback from your interviewer or practice partner:</p>
              <form className="feedback-form">
                <textarea
                  rows="4"
                  placeholder="Enter your feedback request message..."
                ></textarea>
                <button className="submit-feedback font-bold mb-4">Request Feedback</button>
              </form>
            </div>

            {/* Interview Image Section */}
            <div className="interview-image-section">
              <img
                src="./freepik__upload__17472.jpeg"
                alt="Interview Illustration"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

