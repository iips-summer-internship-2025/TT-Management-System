import { useState } from "react";
import { FaUser, FaEnvelope, FaUserTag, FaCalendarAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { CiLogin } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import logo from "..//assets/iips.png";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    // In a real app, you would send this data to your backend
    // await signUp(name, email, password, role);
    console.log("Sign up attempted with:", { name, email, password, role });
    setSubmitted(true);
  };

  const currentYear = new Date().getFullYear();

  if (submitted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl w-96 p-12 max-[680px]:p-6 text-center">
          <h1 className="text-3xl font-bold text-center mb-6">Thank You!</h1>
          <p className="mb-8 text-gray-600">
            Your registration request has been submitted for admin approval.
            You'll receive an email once your account is approved.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-[#1e40af] text-white py-2 px-4 rounded-lg hover:bg-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Back to Login
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
            Register
          </h1>
          <p className="text-center mb-8 text-gray-400 max-[680px]:mb-1">
            Create your account
          </p>
          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block text-sm font-medium" htmlFor="name">
                Full Name
              </label>
              <div className="relative p-2">
                <input
                  type="text"
                  id="name"
                  value={name}
                  className="w-full px-6 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your full name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 max-[680px]:text-sm">
                  <FaUser />
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium" htmlFor="email">
                Email
              </label>
              <div className="relative p-2">
                <input
                  type="email"
                  id="email"
                  value={email}
                  className="w-full px-6 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 max-[680px]:text-sm">
                  <FaEnvelope />
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative p-2">
                <input
                  type="password"
                  id="password"
                  value={password}
                  className="w-full px-6 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Create a password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 max-[680px]:text-sm">
                  <RiLockPasswordFill />
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium" htmlFor="role">
                Role
              </label>
              <div className="relative p-2">
                <select
                  id="role"
                  value={role}
                  className="w-full px-6 py-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent appearance-none"
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="student">Admin</option>
                  <option value="faculty">Faculty</option>
                </select>
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 max-[680px]:text-sm">
                  <FaUserTag />
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e40af] text-white py-2 px-4 rounded-lg hover:bg-[#1e3a8a] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex row-auto justify-center items-center max-[680px]:text-xs"
            >
              <CiLogin />
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                Login
              </span>
            </p>
          </div>

          <div className="text-center mt-8 text-xs text-gray-400">
            © {currentYear} KnowledgeTime@iips - IIPS DAVV
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;