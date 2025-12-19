import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";

import { BACKEND_URL } from "../utils/utils";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // auth check
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [token, navigate]);

  // fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setPurchases(res.data.courseData || []);
      } catch {
        setErrorMessage("Failed to fetch purchase data");
      }
    };

    if (token) fetchPurchases();
  }, [token]);

  // logout
  const handleLogout = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      localStorage.removeItem("user");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-20 h-screen w-64 bg-white border-r p-6 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <nav className="mt-12 md:mt-0">
          <ul className="space-y-4">
            <li>
              <Link to="/" className="flex items-center gap-2">
                <RiHome2Fill /> Home
              </Link>
            </li>
            <li>
              <Link to="/courses" className="flex items-center gap-2">
                <FaDiscourse /> Courses
              </Link>
            </li>
            <li className="text-blue-600">
              <FaDownload className="inline mr-2" /> Purchases
            </li>
            <li>
              <IoMdSettings className="inline mr-2" /> Settings
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600"
                >
                  <IoLogOut /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center gap-2">
                  <IoLogIn /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-blue-600 text-white p-2 rounded"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Main */}
      <main className="flex-1 p-8 md:ml-64">
        <h2 className="text-2xl font-semibold mb-6">My Purchases</h2>

        {errorMessage && (
          <p className="text-red-500 mb-6 text-center">{errorMessage}</p>
        )}

        {purchases.length === 0 ? (
          <p className="text-gray-500">You have no purchases yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <img
                  src={course.image?.url}
                  alt={course.title}
                  className="h-44 w-full object-cover rounded-t-lg"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {course.description.length > 100
                      ? course.description.slice(0, 100) + "..."
                      : course.description}
                  </p>
                  <span className="text-green-700 font-semibold">
                    ${course.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Purchases;
