import React from 'react'
import { Link } from 'react-router-dom'


const CallNavbar = () => {
  return (
    <nav className='p-4 shadow-lg shadow-[#e7e9ec]'>
      <ul className='flex flex-col justify-center items-center'>
        <li className='text-xl font-semibold'>Mock Interview on Java</li>
        <Link to="/quiz-history">Quiz History</Link>

        {/* <li className=''>Interviewer - Samar Jain</li> */}
      </ul>
    </nav>
  )
}

export default CallNavbar