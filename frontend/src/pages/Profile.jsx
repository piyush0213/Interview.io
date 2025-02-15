import React, { useState, useEffect, useRef } from 'react';
import './Profile.scss';
import Sidebar from '../components/Sidebar';
import { useStore } from '../store/store.js';
import { AiFillCamera } from "react-icons/ai";
const API_URL = import.meta.env.VITE_API_URL;
import axios from 'axios';
import { toast } from 'react-toastify';
import Chatbot from '../components/Chatbot.jsx';

const Profile = () => {
  const { user } = useStore(); // For user's name if needed
  const inputFile = useRef(null);
  const [avatar, setAvatar] = useState(user.avatar || "blank_avatar.png");
  const [isUploading, setIsUploading] = useState(false);

  const [resume, setResume] = useState(null);
  const [resumeURL, setResumeURL] = useState(null);

  // State to store form data, with defaults either from localStorage or empty strings
  const loadInitialData = () => {
    const savedData = JSON.parse(localStorage.getItem('profileData'));
    return savedData || {
      name: user.name,
      role: user.role,
      dob: '',
      institute: '',
      department: '',
      year: '',
      email: user.email,
      github: '',
      linkedin: '',
      stackoverflow: '',
      skills: [],
      token: localStorage.getItem('jwt-interview-coach')
    };
  };

  const [profileData, setProfileData] = useState(loadInitialData);
  // Load the saved data from localStorage on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('profileData'));
    if (savedData) {
      setProfileData(savedData);
    }
  }, []);

  // Save the data to localStorage every time it changes
  useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }, [profileData]);

  // Handle input changes and update the state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Add a skill to the skills array
  const handleAddSkill = (e) => {
    e.preventDefault();
    const skillInput = document.getElementById('skill-input');
    const newSkill = skillInput.value.trim();
    if (newSkill) {
      setProfileData((prevData) => ({
        ...prevData,
        skills: [...prevData.skills, newSkill],
      }));
      skillInput.value = ''; // Clear input after adding
    }
  };

  const changeAvatar = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const toastId = toast.info("Uploading...", { autoClose: false });

    try {
      // get file
      const file = e.target.files[0];
      let formData = new FormData();
      formData.append("avatar", file);
      // upload to cloudinary
      const res = await axios.post(`${API_URL}/api/v1/auth/updateAvatar`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem('jwt-interview-coach')}`
        },
        // onUploadProgress: (x) => {
        //   if (x.total < 1024000)
        //     return toast.info("Uploading");
        // },
      });
      setIsUploading(false);
      // console.log(res);
      toast.dismiss(toastId); 
      toast.success(res.data.msg);
  
      user.avatar = res.data.url;
      setAvatar(res.data.url);
    } catch (err) {
      toast.dismiss(toastId); 
      toast.error(err.response.data.msg)
      setIsUploading(false);
    }
  };

   // Utility function to convert a file to base64
   const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    // On component mount, check if resume data exists in localStorage
    const savedResumeBase64 = localStorage.getItem('resumeBase64');
    const savedResumeName = localStorage.getItem('resumeName');
    const savedResumeType = localStorage.getItem('resumeType');

    if (savedResumeBase64 && savedResumeName && savedResumeType) {
      // Create a Blob URL from the base64 content to display it
      const byteCharacters = atob(savedResumeBase64.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: savedResumeType });
      const fileURL = URL.createObjectURL(blob);

      setResume({ name: savedResumeName });
      setResumeURL(fileURL);
    }
  }, []);


  const handleResumeChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Ensure it's a PDF file
      if (file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);

        // Convert file to base64
        const base64File = await convertFileToBase64(file);

        // Save file info to state
        setResume(file);
        setResumeURL(fileURL);
        const userData = JSON.parse(localStorage.getItem('profileData'));
        userData.resume = fileURL;
        setProfileData(userData);
        localStorage.setItem('profileData', JSON.stringify(userData));
        // Persist file info and content (in base64) to localStorage
        localStorage.setItem('resumeName', file.name);
        localStorage.setItem('resumeType', file.type);
        localStorage.setItem('resumeBase64', base64File);
      } else {
        alert("Please upload a valid PDF file");
      }
    }
  };


  const handlePreviewClick = () => {
    if (resumeURL) {
      window.open(resumeURL); // Open the file in a new tab for preview
    }
    else {
      toast.error('No resume uploaded yet!');
    }
  };

  const handleInput = () => {
    inputFile.current.click();
  };

  return (
    <div className="profile-container">
      {/* <!-- Sidebar Section --> */}
      <Sidebar />
      <Chatbot />
      {/* <!-- Profile Section --> */}
      <section className="profile-section">
        <div className="profile-card">
          <div className='profile-img-wrapper' onClick={handleInput}>
          {isUploading ? (
            <span className="loader-avatar invert"></span>
          ) : (<>
            <img src={avatar} alt="User Picture" className="profile-pic" />
            <AiFillCamera />
            </>
          )}
            
          </div>
          <input
            type="file"
            name="avatar"
            ref={inputFile}
            className="profile-avatar-input"
            onChange={changeAvatar}
          />
          <h2>{profileData.name || 'Name of the User'}</h2>
          <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
          <p className="profile-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rhoncus mi
            accumsan.
          </p>
          <ul className="stats">
            <li>Total Interviews <span>10</span></li>
            <li>Pending Interviews <span>04</span></li>
            <li>Completed Interviews <span>06</span></li>
            {user.role==="candidate" && <li>
              Your Resume  <button onClick={handlePreviewClick}>
              <span>Preview</span>
          </button>
            </li>}
          </ul>
        </div>

        {/* <!-- User Info Form --> */}
        <div className="user-info">
          <form className="profile-form">
            <div className="form-group">
              <label>Name of the Student</label>
              <input
                type="text"
                name="name"
                disabled
                placeholder={profileData.name}
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={profileData.dob}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Name of the {user.role === "candidate" ? "Institute" : "Company"}</label>
              <input
                type="text"
                name="institute"
                required
                value={profileData.institute}
                onChange={handleInputChange}
                placeholder="Enter institute name"
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={profileData.department}
                onChange={handleInputChange}
                placeholder="Enter your department"
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input
                type="text"
                name="year"
                value={profileData.year}
                onChange={handleInputChange}
                placeholder="Enter year"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                disabled
                value={profileData.email}
                className='cursor-no-drop'
              />
            </div>
            <div className="form-group">
            <label>Upload Resume</label>
              <input
                type="file"
                accept='.pdf'
                placeholder=''
                onChange={handleResumeChange}
              /> 
            </div>
            <div className="form-group">
              <label>Github URL</label>
              <input
                type="url"
                name="github"
                value={profileData.github}
                onChange={handleInputChange}
                placeholder="Enter Github URL"
              />
            </div>
            <div className="form-group">
              <label>LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleInputChange}
                placeholder="Enter LinkedIn URL"
              />
            </div>
            <div className="form-group">
              <label>Stack Overflow URL</label>
              <input
                type="url"
                name="stackoverlfow"
                value={profileData.behance}
                onChange={handleInputChange}
                placeholder="Enter Stack Overflow URL"
              />
            </div>
            
            <div className="form-group">
              <label>Skills You Have</label>
              <input
                type="text"
                id="skill-input"
                placeholder="Add skills"
              />
              <button className="add-skill" onClick={handleAddSkill}>
                + Add Skill
              </button>
              <ul className='skills'>
                {profileData.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
            

          </form>
        </div>
      </section>
    </div>
  );
};

export default Profile;
