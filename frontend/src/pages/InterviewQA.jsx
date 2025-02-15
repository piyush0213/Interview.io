import React, { useState } from 'react';
import './InterviewQA.scss'
import axios from 'axios';
import { marked } from 'marked';
import Sidebar from '../components/Sidebar'
import Chatbot from '../components/Chatbot.jsx'
const API_URL = import.meta.env.VITE_API_URL;

const InterviewQA = () => {
    const [techstack, setTechstack] = useState('');
    const [qty, setQty] = useState();
    const [difficulty, setDifficulty] = useState('');
    const [questions, setQuestions] = useState('');
    const [ogResponse, setOgResponse] = useState('');
    const [Loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/v1/questions/generate-questions`, {
                techstack,
                qty,
                difficulty
            });
            setOgResponse(response.data.questions);
            console.log(marked(response.data.questions));
            const content = marked(response.data.questions);
            setQuestions(content);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching questions:', error);
        }
    };

     const copyToClipboard = () => {
        navigator.clipboard.writeText(ogResponse).then(() => {
            alert('Questions copied to clipboard!');
        }).catch(err => {
            console.error('Error copying text: ', err);
        });
    };

    const downloadAsTxt = () => {
        const element = document.createElement('a');
        const file = new Blob([ogResponse], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'questions.txt';
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    return (
        <div className='main-container'>
            <Sidebar />
            <Chatbot />
            <div className='main-content'>
                <h1>Interview Q/A Suggestions(AI-Based)</h1>
                
                <div className='questions'>
                <form className='input-fields' onSubmit={handleSubmit}>
                    <div>
                        <label>Topic:</label>
                        <input
                            type="text"
                            value={techstack}
                            placeholder="Enter topic"
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
                    <button className='generate-questions' type="submit">Generate Questions</button>
                </form>
            </div>
            <div className='flex flex-row justify-end m-2'>
                <button className='btn' onClick={downloadAsTxt}>Download as .txt</button>
                <button className='btn' onClick={copyToClipboard}>Copy to Clipboard</button>
            </div>

            <div className=''>
                {Loading ? <span className='loader-qs'></span> :
                <iframe
                    className='textbox'
                    title="Generated Questions"
                    style={{ width: '100%', height: '100vh',  border: '1px solid #ccc' }}
                    srcDoc={questions}
                />
                }
                
            </div>
            </div>
            
            
            
        </div>
    );
};

export default InterviewQA;