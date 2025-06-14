import { useState } from "react";
import { RiLockPasswordFill, RiLockPasswordLine } from "react-icons/ri";
import { CiLogin } from "react-icons/ci";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/iips.png";

const CreatePasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      // const response = await fetch('/api/create-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, password }),
    //     Credential:true
      // });
      
    //   await new Promise(resolve => setTimeout(resolve, 1000));
      
      // if (!response.ok) throw new Error('Failed to set password');
      console.log(password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to set password. Please try again.");
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  if (success) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl w-96 p-12 max-[680px]:p-6 text-center">
          <h1 className="text-3xl font-bold text-center mb-6">Password Set!</h1>
          <p className="mb-8 text-gray-600">
            Your password has been successfully set. You can now log in to your account.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#1e40af] text-white py-2 px-4 rounded-lg hover:bg-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center bg-gray-100 max-[680px]:flex-col max-[680px]:gap-4">
      {/* Left-Section*/}
      <div className="w-1/2 h-full flex flex-col items-center justify-center bg-[linear-gradient(135deg,#1e3a8a,#0f766e)] max-[680px]:w-full max-[680px]:h-1/4 max-[680px]:flex-row">
        <div className="items-center text-center">
          <img
            src={logo}
            alt="IIPS-LOGO"
            className="w-55 h-55 max-[680px]:w-20 max-[680px]:h-20"
          />
        </div>
        <div className="text-white p-8 max-[680px]:p-4 max-[680px]:w-full">
          <h1 className="text-2xl font-bold mb-4 max-[680px]:text-center max-[680px]:text-lg max-[680px]:mb-2">
            International Institute of Professional Studies
          </h1>
          <p className="text-lg mb-8 max-[680px]:text-center max-[680px]:text-sm max-[680px]:mb-1">
            Devi Ahilya Vishwavidyalaya (DAVV)
          </p>
          <div className="flex items-center space-x-2 max-[680px]:w-full max-[680px]:flex-col max-[680px]:space-x-0">
            <div className="bg-opacity-20 p-2 rounded-lg bg-gray-400 text-3xl max-[680px]:text-2xl">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-lg font-bold max-[680px]:text-sm">
                KnowledgeTime@iips
              </p>
              <p className="text-sm max-[680px]:text-xs">
                TimeTable Management System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right-Section*/}
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-2xl w-96 p-12 max-[680px]:p-6">
          <h1 className="text-3xl font-bold text-center mb-3 max-[680px]:mb-1">
            Create Password
          </h1>
          <p className="text-center mb-8 text-gray-400 max-[680px]:mb-1">
            Set your account password
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium" htmlFor="password">
                New Password
              </label>
              <div className="relative p-2">
                <input
                  type="password"
                  id="password"
                  value={password}
                  className="w-full px-6 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter new password (min 8 characters)"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 max-[680px]:text-sm">
                  <RiLockPasswordFill />
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative p-2">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  className="w-full px-6 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Re-enter your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="8"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 max-[680px]:text-sm">
                  <RiLockPasswordLine />
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#1e40af] text-white py-2 px-4 rounded-lg hover:bg-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex row-auto justify-center items-center max-[680px]:text-xs ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <CiLogin />
                  Set Password
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-8 text-xs text-gray-400">
            © {currentYear} KnowledgeTime@iips - IIPS DAVV
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePasswordPage;