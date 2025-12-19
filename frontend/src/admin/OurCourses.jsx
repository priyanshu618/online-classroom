import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin/login");
    }
  }, [token, navigate]);

  // ---------------- FETCH COURSES ----------------
  useEffect(() => {
    if (!token) return;

    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/course/courses`,
          { withCredentials: true }
        );
        setCourses(res.data.courses || []);
      } catch (error) {
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  // ---------------- DELETE COURSE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success(res.data.message);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      toast.error(
        error?.response?.data?.errors || "Failed to delete course"
      );
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading courses...
      </p>
    );
  }

  // ---------------- UI ----------------
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Courses</h1>

        <Link
          to="/admin/dashboard"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          Back to Dashboard
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-500">No courses created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={course.image?.url}
                alt={course.title}
                className="h-44 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {course.title}
                </h2>

                <p className="text-gray-600 text-sm mb-4">
                  {course.description.length > 150
                    ? `${course.description.slice(0, 150)}...`
                    : course.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-lg">
                    ₹{course.price}
                  </span>
                  <span className="text-green-600 text-sm">
                    Active
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <Link
                    to={`/admin/update-course/${course._id}`}
                    className="flex-1 text-center bg-orange-500 text-white py-2 rounded hover:bg-blue-600 transition"
                  >
                    Update
                  </Link>

                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OurCourses;
