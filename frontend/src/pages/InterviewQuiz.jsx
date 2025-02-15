import React, { useState } from 'react';
import './InterviewQuiz.scss'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Sidebar from '../components/Sidebar.jsx'
import { useStore } from '../store/store.js';
const API_URL = import.meta.env.VITE_API_URL;
import { toast } from 'react-toastify';
import ConfirmModal from '../components/ConfirmModal';
import Chatbot from '../components/Chatbot.jsx';

const InterviewQuiz = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useStore();
    const userID = user._id;
    const navigate = useNavigate();
    const [techstack, setTechstack] = useState('');
    const [qty, setQty] = useState(1)
    const [difficulty, setDifficulty] = useState('');
    const [qs, setQs] = useState('');
    const [codeQs, setCodeQs] = useState('');
    const [options, setOptions] = useState([]);
    const [optionsCode, setOptionsCode] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const quizDetails = JSON.parse(localStorage.getItem('quizDetails') || null);
            if(quizDetails && quizDetails.status === 'Ongoing'){
                toast.error('You have an ongoing quiz. Please complete/terminate it first.');
            }
            
            else {
                const response = await axios.post(`${API_URL}/api/v1/quiz/generate-id`,{ userID, qty});
                console.log(response.data.quizID);
                const id = response.data.quizID;

                localStorage.setItem('quizDetails', JSON.stringify({quizID: id, techstack, qty, difficulty}));
                setShowModal(true);
                // navigate(`/quiz/${id}`);
            }

        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleTerminate = async () => {
        try {
            const quizDetails = JSON.parse(localStorage.getItem('quizDetails'));
            if(quizDetails){
                if(quizDetails.status === 'Ongoing'){
                    const response = await axios.post(`${API_URL}/api/v1/quiz/terminate-quiz`, {quizID: quizDetails.quizID});
                    console.log(response.data);
                }
                localStorage.removeItem('quizDetails');
                toast.success('Quiz terminated successfully! Now Start a new one!');
            }
            else{
                toast.error('No ongoing quiz found');
            }
        } catch (error) {
            console.error('Error terminating quiz:', error);
        }
    }


    return (
        <div className='main-container'>
            <Sidebar />
            <Chatbot />
            <div className='main-content'>
                {showModal && (
                <ConfirmModal
                    techstack={techstack}
                    difficulty={difficulty}
                    qty={qty}
                    onClose={() => setShowModal(false)}
                />
                )}
                <h1>Interview Quiz(AI-Based)</h1>

                <div className='questions'>
                <form className='input-fields' onSubmit={handleSubmit}>
                    <div>
                        <label>Topic:</label>
                        <input
                            type="text"
                            value={techstack}
                            placeholder="Enter the topic"
                            required
                            onChange={(e) => setTechstack(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Number of Questions:</label>
                        <input
                            type="number"
                            value={qty}
                            placeholder="No. of Qs"
                            required
                            onChange={(e) => setQty(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Difficulty:</label>
                        <input
                            type="text"
                            value={difficulty}
                            placeholder="Enter your Difficulty"
                            onChange={(e) => setDifficulty(e.target.value)}
                        />
                    </div>
                    
                    <button className='generate-questions' type="submit">Start Quiz</button>
                    <button className='generate-questions' type='button' onClick={handleTerminate}>Terminate Existing Quiz Session</button>

                </form>
                
            </div>
            <div className='quiz ml-4 mt-4'>
                <div className='mb-2'>
                    <p>{(qs)}</p>  
                    {codeQs && 
                    <SyntaxHighlighter language={techstack} style={base16AteliersulphurpoolLight}>
                        {codeQs}
                    </SyntaxHighlighter>
                    }
                </div>
                <div className='options-container'>

                {options.map((option, index) => {
                    if(optionsCode){
                        return (
                            <div key={index} className='flex items-center'>
                                <input type="radio" id={index} name="options" value={option} className='mb-1.5 mr-4'/>
                                <label htmlFor={index} >
                                <SyntaxHighlighter language={techstack} style={base16AteliersulphurpoolLight} >
                                    {option}
                                </SyntaxHighlighter>
                                </label>
                            </div>
                        );
                    }
                    else{
                        return (
                            <div key={index} className=''>
                            <input type="radio" id={index} name="options" value={option} className='mr-2' />
                            <label htmlFor={index}>{option}</label>
                        </div>
                        );
                    }
                })}

                </div>
                
            </div>
            </div>
            
            
            
        </div>
    );
};

export default InterviewQuiz;