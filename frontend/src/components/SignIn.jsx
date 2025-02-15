import { useState, useEffect } from "react";
import { useStore } from "../store/store.js";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';

function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useStore();
    const navigate = useNavigate();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        try {
            await login({ email, password });
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoggingIn(false);
        }  
    };


    return (

    <div className="form-container sign-in-container">
        <form onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <span>Use your account</span>
            <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-area relative w-full">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <a 
                    type="button"
                    id='password-toggle'
                    aria-label='Toggle Password Visibility'
                    className="absolute right-3  text-gray-500 hover:text-gray-700"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onTouchStart={() => setShowPassword(true)}
                    onTouchEnd={() => setShowPassword(false)}
                >
                    {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </a>
            <Tooltip anchorSelect='#password-toggle' place='right' effect='solid' type='dark'>
              {showPassword ? 'Hide Password' : 'Show Password'}
            </Tooltip>
          </div>
            <button disabled={isLoggingIn} type="submit">Sign In</button>
        </form>
    </div>
  );
}

export default SignInForm;
