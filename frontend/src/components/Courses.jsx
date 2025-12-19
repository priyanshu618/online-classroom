import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  FaCircleUser,
  FaDownload,
  FaDiscourse,
} from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";

import logo from "../../public/logo.webp";
import { BACKEND_URL } from "../utils/utils";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // check login
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("user"));
  }, []);

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/course/courses`,
          { withCredentials: true }
        );
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-10 h-screen w-64 bg-white border-r p-6 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-2 mb-10 mt-8 md:mt-0">
          <img src={logo} alt="logo" className="h-10 w-10 rounded-full" />
          <h2 className="font-bold text-lg">Online Classroom</h2>
        </div>

        <nav>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="flex items-center gap-2">
                <RiHome2Fill /> Home
              </Link>
            </li>
            <li className="text-blue-600">
              <FaDiscourse className="inline mr-2" /> Courses
            </li>
            <li>
              <Link to="/purchases" className="flex items-center gap-2">
                <FaDownload /> Purchases
              </Link>
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

      {/* Main Content */}
      <main className="flex-1 p-8 md:ml-64">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Courses</h1>

          <div className="flex items-center gap-4">
            <div className="flex">
              <input
                placeholder="Search courses..."
                className="border px-4 py-2 rounded-l-full outline-none"
              />
              <button className="border px-4 rounded-r-full">
                <FiSearch />
              </button>
            </div>
            <FaCircleUser className="text-3xl text-blue-600" />
          </div>
        </header>

        {/* Courses Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500">
            No courses available right now.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white border rounded-lg shadow-sm hover:shadow-md transition"
              >
                <img
                  src={course.image.url}
                  alt={course.title}
                  className="h-40 w-full object-cover rounded-t-lg"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {course.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4">
                    {course.description.length > 100
                      ? course.description.slice(0, 100) + "..."
                      : course.description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl">₹{course.price}</span>
                    <span className="text-green-600 text-sm">Best value</span>
                  </div>

                  <Link
                    to={`/buy/${course._id}`}
                    className="block text-center bg-orange-500 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Courses;
