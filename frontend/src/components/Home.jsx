import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import toast from "react-hot-toast";

import logo from "../../public/logo.webp";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { BACKEND_URL } from "../utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

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
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [BACKEND_URL]);

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

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 text-white">
      <div className="container mx-auto min-h-screen px-4">
        {/* HEADER */}
        <header className="flex justify-between items-center py-6">
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="w-9 h-9 rounded-full" />
            <h1 className="text-xl md:text-2xl font-bold text-orange-500">
              Online Classroom
            </h1>
          </div>

          <div className="flex gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="border px-4 py-2 rounded hover:bg-white hover:text-black transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="border px-4 py-2 rounded hover:bg-white hover:text-black transition">
                  Login
                </Link>
                <Link to="/signup" className="border px-4 py-2 rounded hover:bg-white hover:text-black transition">
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* HERO */}
        <section className="text-center py-20">
          <h2 className="text-4xl font-bold text-orange-500 mb-4">
            Learn Anytime, Anywhere
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Sharpen your skills with high-quality courses designed by experts.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/courses"
              className="bg-green-500 px-6 py-3 rounded font-semibold hover:bg-white hover:text-black transition"
            >
              Explore Courses
            </Link>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-green-500 hover:text-white transition"
            >
              Watch Videos
            </a>
          </div>
        </section>

        {/* COURSES SLIDER */}
        <section className="py-10">
          {loading ? (
            <p className="text-center text-gray-400">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-400">
              No courses available right now.
            </p>
          ) : (
            <Slider {...sliderSettings}>
              {courses.map((course) => (
                <div key={course._id} className="p-4">
                  <div className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition">
                    <img
                      src={course.image?.url}
                      alt={course.title}
                      className="h-40 w-full object-cover"
                    />
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-lg mb-3">
                        {course.title}
                      </h3>
                      <Link
                        to={`/buy/${course._id}`}
                        className="inline-block bg-orange-500 px-5 py-2 rounded-full hover:bg-blue-500 transition"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </section>

        <hr className="my-12 border-gray-700" />

        {/* FOOTER */}
        <footer className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <img src={logo} alt="" className="w-8 h-8 rounded-full" />
              <h2 className="text-xl font-bold text-orange-500">
                Online Classroom
              </h2>
            </div>

            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              <FaFacebook className="text-2xl hover:text-blue-400 cursor-pointer" />
              <FaInstagram className="text-2xl hover:text-pink-500 cursor-pointer" />
              <FaTwitter className="text-2xl hover:text-blue-500 cursor-pointer" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Connect</h3>
            <ul className="text-gray-400 space-y-2">
              <li className="hover:text-white cursor-pointer">YouTube</li>
              <li className="hover:text-white cursor-pointer">Telegram</li>
              <li className="hover:text-white cursor-pointer">GitHub</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="text-gray-400 space-y-2">
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Refund Policy</li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
