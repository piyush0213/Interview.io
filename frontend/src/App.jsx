import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import React, { useEffect } from 'react'
import Room from './pages/Room.jsx'
import VideoCall from './pages/VideoCall.jsx'
import Page404 from './pages/Page404.jsx'
import RequireAuth from './utils/RequireAuth.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Profile from './pages/Profile.jsx'
import InterviewQA from './pages/InterviewQA.jsx'
import { Navigate } from 'react-router-dom'
import CallNavbar from './components/CallNavbar.jsx'
import { useStore } from './store/store.js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InterviewQuiz from './pages/InterviewQuiz.jsx'
import Quiz from './pages/Quiz.jsx'
import Results from './pages/Results.jsx'
import "./App.scss"
import 'react-tooltip/dist/react-tooltip.css'
import { useState } from 'react'
const API_URL = import.meta.env.VITE_API_URL;
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n"; // Import i18n configuration


function App() {
  // const user = false

  const {user, checkingAuth, getAuth} = useStore();  // checkingAuthi acts as a loading state to make an illusion of a loading effect when the user is being checked
  // // console.log("The authenticated user: ",user);
  const [serverStatus, setServerStatus] = useState('connecting'); // 'connecting', 'connected', 'error'

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          setServerStatus('connected');
          clearInterval(intervalId); // Clear the interval once connected
        } else {
          setServerStatus('error');
        }
      } catch (error) {
        setServerStatus('error');
      }
    };
  
    const intervalId = setInterval(checkServerStatus, 5000); // Check every 5 seconds
  
    // Initial check
    checkServerStatus();
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  
  useEffect(() => {
    getAuth();  // runs only once when the component mounts
  },[getAuth])  // runs when checkingAuth changes;

  if(checkingAuth) {
    return (
       <div className="flex justify-center items-center bg-black h-screen">
        <span className='loader-qs invert absolute'></span>
      </div>
    )
  }

  const Loader = () => {
    return (
      <div className="flex justify-center relative items-center bg-black h-screen">          
      <p className='text-white text-2xl font-semibold absolute top-3/4'>Server not responding, please hold on or try again after sometime...</p>
        <span className='loader-eye absolute'></span>
      </div>
    )
  }
  <I18nextProvider i18n={i18n}>
      <router />
    </I18nextProvider>
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RequireAuth />
    },
    {
      path: "/login",
      element: !user ? <AuthPage /> : <Navigate to="/" />
    },
    {
      path: "/qa",
      element: user ? <InterviewQA /> : <Navigate to="/" />
    },
    {
      path: "/quiz",
      element: user ? <InterviewQuiz /> : <Navigate to="/" />
    },
    {
      path: "/quiz/:id",
      element: user ? <Quiz /> : <Navigate to="/" />
    },
    {
      path: "/results/:id",
      element: user ? <Results /> : <Navigate to="/" />
    },
    // {
    //   path: "/questions",
    //   element: <InterviewQuestions />
    // },
    {
      path: "/profile",
      element: user ? <Profile /> : <Navigate to="/" />
    },
    {
      path: "/createroom",
      element: <><Room /></>
    },
    {
      path: "/createroom/:id",
      element: <><CallNavbar /><VideoCall /></>
    },
    {
      path: "/*",
      element: <Page404 />
    }
   ])

  return (
    <div>
      {serverStatus === 'error' && (
        <div>
          {Loader()}
        </div>
      )}
      {serverStatus === 'connected' && (
    <>
    < ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition: Bounce
        />
     <RouterProvider router={router} />
    </>

  )}
  </div>
)}


export default App
