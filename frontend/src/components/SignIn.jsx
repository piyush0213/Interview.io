import { useState, useEffect } from "react";
import { useStore } from "../store/store.js";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import { useGoogleLogin } from "@react-oauth/google";

function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, googleLogin: googleLoginStore } = useStore();
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

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
        const { access_token } = tokenResponse;
        setIsLoggingIn(true);

        try {
            const success = await googleLoginStore(access_token);

            if (success) {
            navigate("/");
            }
        } catch (error) {
            console.error("Error in Google login:", error);
        } finally {
            setIsLoggingIn(false);
        }
        },
        onError: (error) => console.error("Google Login Failed:", error),
    });


    return (

    <div className="form-container sign-in-container">
        <form onSubmit={handleSubmit}>
            <h1>Sign in</h1>
            <span className="mb-3">Use your account</span>

            {/* Enhanced Google OAuth button */}
            <button
            type="button"
            onClick={() => googleLogin()}
            disabled={isLoggingIn}
            style={{
                fontFamily: '"Google Sans", Arial, sans-serif',
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "12px 20px",
                border: "1px solid #000",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                color: "#333",
                fontSize: "14px",
                fontWeight: "500",
                cursor: isLoggingIn ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                marginTop: "10px",
                opacity: isLoggingIn ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
                if (!isLoggingIn) {
                e.target.style.backgroundColor = "#f8f9fa";
                e.target.style.borderColor = "#ccc";
                }
            }}
            onMouseLeave={(e) => {
                if (!isLoggingIn) {
                e.target.style.backgroundColor = "#ffffff";
                e.target.style.borderColor = "#000";
                }
            }}
            >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                fill="#4285f4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                fill="#34a853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                fill="#fbbc05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                fill="#ea4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
            </svg>
            {isLoggingIn ? "Signing in..." : "Continue with Google"}
            </button>

            {/* Separation line between password login and Google login */}
            <div
            style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                margin: "20px 0",
                color: "#555",
            }}
            >
            <hr
                style={{
                flex: 1,
                border: "none",
                height: "1px",
                backgroundColor: "#ddd",
                }}
            />
            <span style={{ margin: "0 10px", fontSize: ".875rem", lineHeight: "1.25rem", fontWeight:"400", backgroundColor:"#ffffff"}}>Or continue with</span>
            <hr
                style={{
                flex: 1,
                border: "none",
                height: "1px",
                backgroundColor: "#ddd",
                }}
            />
            </div>


            <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-area relative w-full mb-8">
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
