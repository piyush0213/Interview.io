import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';
import { useGoogleLogin } from "@react-oauth/google";

function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("candidate"); // default to "candidate"
    const [googleRole, setGoogleRole] = useState(""); // separate role for Google signup
    const [showGoogleRoleModal, setShowGoogleRoleModal] = useState(false);
    const [pendingGoogleToken, setPendingGoogleToken] = useState(null);
    const { signup, googleSignup } = useStore();
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

    const handleGoogleRoleSubmit = async () => {
    if (!googleRole || !pendingGoogleToken) return;

    try {
      setIsSigningUp(true);

      const success = await googleSignup(pendingGoogleToken, googleRole);

      if (success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error in Google signup:", error);
    } finally {
      setIsSigningUp(false);
      setShowGoogleRoleModal(false);
      setGoogleRole("");
      setPendingGoogleToken(null);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const { access_token } = tokenResponse;
      setPendingGoogleToken(access_token);
      setShowGoogleRoleModal(true);
    },
    onError: (error) => console.error("Google Login Failed:", error),
  });


  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <span className="mb-3">Use your email for registration</span>

        {/* Enhanced Google OAuth button */}
        <button
          type="button"
          onClick={() => googleLogin()}
          style={{
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
            fontFamily: '"Google Sans", Arial, sans-serif',
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.3s ease",
            marginTop: "10px",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f8f9fa";
            e.target.style.borderColor = "#ccc";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.borderColor = "#000";
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
          Continue with Google
        </button>

        {/* Separation line between password signup and Google login */}
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
        <div className="role-selection flex flex-row p-2 mb-5">
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
      {/* Google Role Selection Modal */}
      {showGoogleRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Choose Your Role
              </h3>
              <p className="text-sm text-gray-600">
                How would you like to use our platform?
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  value="candidate"
                  checked={googleRole === "candidate"}
                  onChange={(e) => setGoogleRole(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Candidate</div>
                  <div className="text-sm text-gray-600">
                    Looking for job opportunities
                  </div>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                <input
                  type="radio"
                  value="interviewer"
                  checked={googleRole === "interviewer"}
                  onChange={(e) => setGoogleRole(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Interviewer</div>
                  <div className="text-sm text-gray-600">
                    Conducting interviews and hiring
                  </div>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowGoogleRoleModal(false);
                  setGoogleRole("");
                  setPendingGoogleToken(null);
                }}
                className="flex-1 px-4 py-2 border border-orange-500 rounded-md text-gray-700 hover:bg-orange-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGoogleRoleSubmit}
                disabled={!googleRole || isSigningUp}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSigningUp ? "Creating..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUpForm;
