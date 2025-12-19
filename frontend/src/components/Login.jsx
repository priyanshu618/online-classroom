import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import logo from "../../public/logo.webp";
import { BACKEND_URL } from "../utils/utils";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.errors || "Invalid email or password"
      );
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen text-white">
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-9 h-9 rounded-full" />
          <Link to="/" className="text-xl font-bold text-orange-500">
            Online Classroom
          </Link>
        </div>

        <div className="flex gap-3">
          <Link
            to="/signup"
            className="border px-4 py-2 rounded hover:bg-white hover:text-black transition"
          >
            Signup
          </Link>
          <Link
            to="/courses"
            className="bg-orange-500 px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Explore
          </Link>
        </div>
      </header>

      {/* Login Card */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Login to continue learning
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm text-center mb-4">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 py-3 rounded font-semibold hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-orange-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
