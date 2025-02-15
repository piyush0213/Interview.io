import { useState } from "react";
import "./AuthStyles.scss";
import SignUpForm from "../components/SignUp.jsx";
import SignInForm from "../components/SignIn.jsx";

export default function AuthPage() {
  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "auth-container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="Auth  w-full min-h-screen">
      <div className={containerClass} id="auth-container">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your account
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Candidate!</h1>
              <p>Enter your personal details and start your job cracking journey with us</p>
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


