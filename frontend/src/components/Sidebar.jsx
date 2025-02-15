import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.scss'
import { useStore } from '../store/store.js'
import { Tooltip } from 'react-tooltip';

const Sidebar = () => {
  const { logout } = useStore();
  const [isOpen, setIsOpen] = useState(true); // Sidebar open state
  const [isMobile, setIsMobile] = useState(false); // Mobile view state
  const userDetails = useStore(state => state.user);
  console.log(userDetails);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
  };
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
    // console.log(isMobile);
  }
  useEffect(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);



  return (
      <aside className={`sidebar font-semibold ${isOpen ? 'w-[250px]' : ' w-[50px] '}`}>
        <div id={isOpen ? "Minimize" : "Maximize"} className="toggle-btn" onClick={toggleSidebar}>
        <i className={`fas ${isOpen ? 'fa-arrow-left' : 'fa-arrow-right'}`}></i>
        </div>
        <Tooltip anchorSelect='#Minimize' place='right' content='Minimize the Sidebar' />
        <Tooltip anchorSelect='#Maximize' place='right' content='Maximize the Sidebar' />
        
        <h1 className={`logo`}>{isOpen ? "Interview.io" : ""}</h1>
        <nav className={`menu ${isOpen ? '': 'gap-2'}`}>
          <ul>
            <li><Link to={'/'} ><i className="fas fa-home overview-icon"></i> {isOpen ? "Overview" : ""} </Link></li>
            {userDetails.role==="candidate" && <li><Link to={'/qa'}>
              <i className="fa-solid fa-circle-question interviews-icon"></i> {isOpen ? "Interview Q/A" : ""}
            </Link></li>}
            {userDetails.role==="candidate" && <li><Link to={'/quiz'}>
              <i className="fa-solid fa-brain interviews-icon"></i> {isOpen ? "Interview Quiz" : ""}
            </Link></li>}
            <li><Link to={'/createroom'}><i className="fas fa-video video-icon"></i>  {isOpen ? "Create Room" : ""}
            </Link></li>
            <li><Link to={'/profile'} ><i className="fas fa-user profile-icon"></i>   {isOpen ? "Profile" : ""}
            </Link></li>
            <li onClick={logout}><i className="fas fa-sign-out-alt logout-icon"></i> {isOpen ? "Logout" : ""}
            </li>
          </ul>
        </nav>
      </aside>
  )
}

export default Sidebar
