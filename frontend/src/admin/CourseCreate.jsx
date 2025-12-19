import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { BACKEND_URL } from "../utils/utils";

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !image) {
      toast.error("All fields are required");
      return;
    }

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    if (!token) {
      navigate("/admin/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", Number(price));
    formData.append("image", image);

    try {
      setLoading(true);

      const res = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Course created successfully");
      navigate("/admin/our-courses");

      // reset
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setImagePreview("");
    } catch (error) {
      toast.error(
        error?.response?.data?.errors || "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Create New Course
        </h2>

        <form onSubmit={handleCreateCourse} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-lg mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg mb-1">Description</label>
            <textarea
              rows="4"
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-lg mb-1">Price</label>
            <input
              type="number"
              placeholder="Enter course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-lg mb-2">Course Image</label>

            <div className="flex justify-center mb-4">
              <img
                src={imagePreview || "/imgPL.webp"}
                alt="Preview"
                className="w-full max-w-sm h-52 object-cover rounded"
              />
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={changePhotoHandler}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CourseCreate;
