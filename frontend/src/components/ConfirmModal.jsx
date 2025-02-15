import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ConfirmModal.scss';

const ConfirmModal = ({ techstack, difficulty, qty, onClose }) => {
  const navigate = useNavigate();

  const handleBegin = () => {
    const quizDetails = JSON.parse(localStorage.getItem('quizDetails'));
    quizDetails.status = 'Ongoing';
    quizDetails.qsRemaining = quizDetails.qty;
    quizDetails.qsNo = 1;
    localStorage.setItem('quizDetails', JSON.stringify(quizDetails));
    navigate(`/quiz/${quizDetails.quizID}`);
  };

  const handleMistake = () => {
    localStorage.removeItem('quizDetails');
    onClose();
  };

  return (
    <div className="modal-overlay z-20">
      <div className="modal-content">
        <h2 className='text-2xl font-bold'>Get Ready for Your Quiz!</h2>
        <p className='text-lg flex flex-row items-center justify-center gap-1 p-1'><h2 className='font-semibold'>Techstack</h2>: {techstack}</p>
        <p className='text-lg flex flex-row items-center justify-center gap-1 p-1'><h2 className='font-semibold'>Difficulty</h2>: {difficulty || "Random"}</p>
        <p className='text-lg flex flex-row items-center justify-center gap-1 p-1'><h2 className='font-semibold'>Number of Questions:</h2> {qty}</p>
        <div className="modal-buttons">
          <button className="begin-button font-semibold" onClick={handleBegin}>Begin</button>
          <button className="mistake-button font-semibold" onClick={handleMistake}>Made a Mistake?</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;