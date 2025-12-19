import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { BACKEND_URL } from "../utils/utils";

function Buy() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // fetch payment intent + course
  useEffect(() => {
    const fetchBuyCourseData = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setCourse(res.data.course);
        setClientSecret(res.data.clientSecret);
      } catch (error) {
        if (error?.response?.status === 400) {
          setError("You have already purchased this course");
          navigate("/purchases");
        } else {
          setError(error?.response?.data?.errors || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchBuyCourseData();
  }, [courseId, token, navigate]);

  const handlePurchase = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setCardError("");

    const card = elements.getElement(CardElement);
    if (!card) {
      setLoading(false);
      return;
    }

    const { error: methodError } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (methodError) {
      setCardError(methodError.message);
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      const paymentInfo = {
        email: user?.user?.email,
        userId: user?.user?._id,
        courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };

      try {
        await axios.post(`${BACKEND_URL}/order`, paymentInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        toast.success("Payment successful");
        navigate("/purchases");
      } catch {
        toast.error("Error saving payment");
      }
    }

    setLoading(false);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg text-center">
          <p className="font-semibold mb-4">{error}</p>
          <Link
            to="/purchases"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            Go to Purchases
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-32 px-4 flex flex-col md:flex-row gap-10">
      {/* Order Details */}
      <div className="md:w-1/2">
        <h1 className="text-xl font-semibold underline mb-4">
          Order Details
        </h1>
        <p className="text-gray-600">
          Course: <span className="font-bold">{course.title}</span>
        </p>
        <p className="text-gray-600 mt-2">
          Total Price:{" "}
          <span className="text-red-500 font-bold">
            ${course.price}
          </span>
        </p>
      </div>

      {/* Payment */}
      <div className="md:w-1/2 flex justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4">
            Complete Payment
          </h2>

          <form onSubmit={handlePurchase}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />

            <button
              type="submit"
              disabled={!stripe || loading}
              className="mt-6 w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition"
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </form>

          {cardError && (
            <p className="text-red-500 text-sm mt-3">{cardError}</p>
          )}

          <button
            type="button"
            className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            Other Payment Methods
          </button>
        </div>
      </div>
    </div>
  );
}

export default Buy;
