import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Clock, Share2, CornerDownRight, Heart } from "lucide-react";
import Navbar from "../components/Navbar";

const GratitudePage = () => {
  const { pageId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  // Feedback State
  const [feedback, setFeedback] = useState([]);
  const [newFeedback, setNewFeedback] = useState({
    name: "",
    message: "",
    emoji: "❤️",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000"
          }/api/pages/${pageId}`
        );
        setData(res.data.page);
        setFeedback(res.data.feedback);

        // Calculate Time Left
        const created = new Date(res.data.page.createdAt).getTime();
        const expires = created + 24 * 60 * 60 * 1000;

        const timer = setInterval(() => {
          const now = new Date().getTime();
          const distance = expires - now;

          if (distance < 0) {
            clearInterval(timer);
            setTimeLeft("EXPIRED");
            setError("This page has faded away.");
          } else {
            const hours = Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            const minutes = Math.floor(
              (distance % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
          }
        }, 1000);

        return () => clearInterval(timer);
      } catch (err) {
        setError("This page does not exist or has already faded away.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageId]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!newFeedback.message) return;

    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/pages/${pageId}/feedback`,
        newFeedback
      );
      setFeedback([res.data, ...feedback]);
      setNewFeedback({ name: "", message: "", emoji: "❤️" });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-2xl">⏳</div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#FDFBF7]">
        <h1 className="text-4xl font-serif text-gray-400 mb-4">
          Nothing here.
        </h1>
        <p className="text-gray-500 mb-8">{error}</p>
        <Link to="/create" className="text-black underline font-medium">
          Create your own
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#333]">
      {/* Minimal absolute header for this page */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <Link
          to="/"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Heart size={20} />
        </Link>
        <div className="bg-black/5 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-mono text-gray-600 flex items-center gap-2">
          <Clock size={12} /> Disappears in {timeLeft}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="text-center space-y-2 mb-10 md:mb-12 fade-in">
          <p className="text-xs md:text-sm font-medium tracking-widest text-gray-400 uppercase">
            A message for
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-gray-900 leading-tight px-4">
            {data.lovedOneName}
          </h1>
          {data.nickname && (
            <p className="text-lg md:text-xl text-rose-400 font-serif italic">
              "{data.nickname}"
            </p>
          )}
        </div>

        <div className="bg-white p-6 md:p-12 rounded-3xl md:rounded-4xl shadow-sm mb-10 md:mb-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-200 to-teal-200"></div>
          <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-700 whitespace-pre-wrap font-serif pl-2 md:pl-0">
            "{data.message}"
          </p>
          <div className="mt-6 md:mt-8 flex justify-end">
            <span className="text-sm text-gray-400 font-medium">
              — {data.creatorName}
            </span>
          </div>
        </div>

        {data.photos && data.photos.length > 0 && (
          <div
            className={`grid gap-3 md:gap-4 mb-12 md:mb-16 ${
              data.photos.length === 1
                ? "grid-cols-1"
                : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {data.photos.map((photo, index) => (
              <div
                key={index}
                className="rounded-2xl overflow-hidden shadow-sm hover:scale-[1.02] transition-transform duration-500"
              >
                <img
                  src={photo}
                  alt="Memory"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {data.wishes && (
          <div className="text-center mb-16 md:mb-20 max-w-xl mx-auto px-4">
            <p className="text-gray-400 uppercase tracking-widest text-xs mb-4">
              Wishes for the future
            </p>
            <p className="text-base md:text-lg text-gray-600 italic">
              "{data.wishes}"
            </p>
          </div>
        )}

        {/* Feedback Section */}
        <div className="border-t border-gray-200 pt-12 md:pt-16">
          <h3 className="text-xl md:text-2xl font-serif text-center mb-6 md:mb-8">
            Send a Whisper Back
          </h3>

          <div className="bg-gray-50 p-2 rounded-2xl flex gap-2 mb-6 md:mb-8">
            <input
              className="flex-1 bg-transparent border-none px-3 md:px-4 py-3 focus:outline-none text-base"
              placeholder="Say something nice..."
              value={newFeedback.message}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, message: e.target.value })
              }
            />
            <select
              className="bg-transparent border-none focus:outline-none text-xl md:text-2xl touch-manipulation"
              value={newFeedback.emoji}
              onChange={(e) =>
                setNewFeedback({ ...newFeedback, emoji: e.target.value })
              }
            >
              <option>❤️</option>
              <option>🥹</option>
              <option>🥲</option>
              <option>🕊️</option>
              <option>✨</option>
            </select>
            <button
              onClick={handleFeedbackSubmit}
              className="bg-white shadow-sm px-4 md:px-6 rounded-xl font-medium hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            >
              Send
            </button>
          </div>

          <div className="space-y-4">
            {feedback.map((f) => (
              <div
                key={f._id}
                className="flex gap-3 md:gap-4 items-start animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg md:text-xl shadow-sm flex-shrink-0">
                  {f.emoji}
                </div>
                <div className="bg-white p-4 rounded-xl rounded-tl-none shadow-sm flex-1">
                  <p className="text-gray-700 text-base">{f.message}</p>
                  <p className="text-xs text-gray-400 mt-2 text-right">
                    {new Date(f.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 md:mt-24 text-center space-y-4">
          <p className="text-gray-400 text-sm">Feeling moved?</p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-6 py-3 rounded-full font-medium hover:bg-rose-100 active:bg-rose-200 transition-colors touch-manipulation"
          >
            Create one for someone else <CornerDownRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GratitudePage;
