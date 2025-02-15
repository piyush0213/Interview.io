import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';

function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("candidate"); // default to "candidate"
    const { signup } = useStore();
    const navigate = useNavigate();
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSigningUp(true);
        try {
            await signup({ name, email, password, role });
            navigate('/');
        } catch (error) {
            console.error('Signup failed:', error);
        } finally {
            setIsSigningUp(false);
        }
    };


  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <span>Use your email for registration</span>
        <input
          type="text"
          name="name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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
            className="absolute right-3 text-gray-500 hover:text-gray-700"
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
        <div className="role-selection flex flex-row p-2">
          <label>
            <input
              type="radio"
              value="candidate"
              checked={role === "candidate"}
              onChange={(e) => setRole(e.target.value)}
            />
            Candidate
          </label>
          <label>
            <input
              type="radio"
              value="interviewer"
              checked={role === "interviewer"}
              onChange={(e) => setRole(e.target.value)}
            />
            Interviewer
          </label>
        </div>
        <button disabled={isSigningUp} type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
