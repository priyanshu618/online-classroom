import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import logo from "../../public/logo.webp";
import { BACKEND_URL } from "../utils/utils";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      localStorage.removeItem("admin");
      navigate("/admin/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.errors || "Logout failed"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 flex flex-col">
        <div className="flex flex-col items-center mb-10">
          <img
            src={logo}
            alt="logo"
            className="h-20 w-20 rounded-full"
          />
          <h2 className="text-lg font-semibold mt-4">
            Admin Panel
          </h2>
          <p className="text-sm text-gray-500">
            Online Classroom
          </p>
        </div>

        <nav className="flex flex-col gap-4">
          <Link to="/admin/our-courses">
            <button className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded transition">
              Our Courses
            </button>
          </Link>

          <Link to="/admin/create-course">
            <button className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 rounded transition">
              Create Course
            </button>
          </Link>

          <Link to="/">
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition">
              Go to Home
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition mt-4"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-3">
            Welcome, Admin 👋
          </h1>
          <p className="text-gray-600">
            Manage courses and monitor your platform from here.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
