import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import logo from "../../public/logo.webp";
import { BACKEND_URL } from "../utils/utils";

function AdminSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post(
        `${BACKEND_URL}/admin/signup`,
        { firstName, lastName, email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data.message);
      navigate("/admin/login");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.errors || "Admin signup failed"
      );
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-9 h-9 rounded-full" />
          <Link to="/" className="text-xl font-bold text-orange-500">
            Online Classroom
          </Link>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/login"
            className="border px-4 py-2 rounded hover:bg-white hover:text-black transition"
          >
            Admin Login
          </Link>
          <Link
            to="/courses"
            className="bg-orange-500 px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            View Courses
          </Link>
        </div>
      </header>

      {/* Admin Signup Card */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md mt-20">
          <h2 className="text-2xl font-bold text-center mb-2">
            Admin Signup
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Create an admin account to manage courses
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-400 mb-1">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-1">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                required
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                required
                className="w-full px-4 py-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-1">
                Password
              </label>
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
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
