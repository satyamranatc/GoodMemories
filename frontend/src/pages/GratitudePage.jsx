import React, { useEffect, useState, useMemo, memo } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Clock, Share2, Check, CornerDownRight, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

// Memoized countdown timer component to prevent parent re-renders
const CountdownTimer = memo(({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const created = new Date(createdAt).getTime();
    const expires = created + 24 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = expires - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("EXPIRED");
        setIsExpired(true);
      } else {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-black/5 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-mono text-gray-600 flex items-center gap-2"
    >
      <Clock size={12} /> Disappears in {timeLeft}
    </motion.div>
  );
});

CountdownTimer.displayName = "CountdownTimer";

// Memoized feedback item to prevent re-renders
const FeedbackItem = memo(({ feedback, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      duration: 0.4,
      delay: index * 0.1,
      type: "spring",
      stiffness: 100,
    }}
    className="flex gap-3 md:gap-4 items-start"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg md:text-xl shadow-sm shrink-0"
    >
      {feedback.emoji}
    </motion.div>
    <div className="bg-white p-4 rounded-xl rounded-tl-none shadow-sm flex-1">
      <p className="text-gray-700 text-base">{feedback.message}</p>
      <p className="text-xs text-gray-400 mt-2 text-right">
        {new Date(feedback.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  </motion.div>
));

FeedbackItem.displayName = "FeedbackItem";

// Share button component with copy-to-clipboard functionality
const ShareButton = memo(({ pageId }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    return `${window.location.origin}/view/${pageId}`;
  }, [pageId]);

  const handleShare = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className="bg-black/5 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:bg-black/10 active:bg-black/15 transition-all flex items-center gap-2 touch-manipulation"
      aria-label="Share page link"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="copied"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="flex items-center gap-2"
          >
            <Check size={14} className="text-green-600" />
            <span className="text-green-600">Copied!</span>
          </motion.div>
        ) : (
          <motion.div
            key="share"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <Share2 size={14} />
            <span>Share</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
});

ShareButton.displayName = "ShareButton";

const GratitudePage = () => {
  const { pageId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-2xl"
        >
          ⏳
        </motion.div>
      </div>
    );
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[#FDFBF7]"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-serif text-gray-400 mb-4"
        >
          Nothing here.
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mb-8"
        >
          {error}
        </motion.p>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/create" className="text-black underline font-medium">
            Create your own
          </Link>
        </motion.div>
      </motion.div>
    );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#333]">
      {/* Minimal absolute header for this page */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10"
      >
        <Link
          to="/"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <Heart size={20} />
          </motion.div>
        </Link>
        <div className="flex items-center gap-3">
          <CountdownTimer createdAt={data.createdAt} />
          <ShareButton pageId={pageId} />
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-16 md:pb-24">
        {/* Name and nickname with emotional entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-2 mb-10 md:mb-12"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xs md:text-sm font-medium tracking-widest text-gray-400 uppercase"
          >
            A message for
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
            className="text-4xl md:text-5xl lg:text-7xl font-serif text-gray-900 leading-tight px-4"
          >
            {data.lovedOneName}
          </motion.h1>
          {data.nickname && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg md:text-xl text-rose-400 font-serif italic"
            >
              "{data.nickname}"
            </motion.p>
          )}
        </motion.div>

        {/* Beautiful warm heading message with gentle fade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-center mb-8 md:mb-10 px-4"
        >
          <p className="text-base md:text-lg text-gray-500 italic leading-relaxed max-w-2xl mx-auto">
            Some moments deserve to be felt, not saved.
            <br />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-gray-600 font-medium"
            >
              This is one of those moments — a thank you for this year.
            </motion.span>
          </p>
        </motion.div>

        {/* Main message card with heartfelt entrance */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 1.1,
            duration: 0.9,
            type: "spring",
            stiffness: 80,
          }}
          whileHover={{ y: -5, transition: { duration: 0.3 } }}
          className="bg-white p-6 md:p-12 rounded-3xl md:rounded-4xl shadow-sm mb-10 md:mb-12 relative overflow-hidden group"
        >
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ delay: 1.3, duration: 1.2, ease: "easeOut" }}
            className="absolute top-0 left-0 w-1 bg-gradient-to-b from-rose-200 to-teal-200"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-700 whitespace-pre-wrap font-serif pl-2 md:pl-0"
          >
            "{data.message}"
          </motion.p>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="mt-6 md:mt-8 flex justify-end"
          >
            <span className="text-sm text-gray-400 font-medium">
              — {data.creatorName}
            </span>
          </motion.div>
        </motion.div>

        {/* Photos with staggered entrance */}
        {data.photos && data.photos.length > 0 && (
          <div
            className={`grid gap-3 md:gap-4 mb-12 md:mb-16 ${
              data.photos.length === 1
                ? "grid-cols-1"
                : "grid-cols-2 md:grid-cols-3"
            }`}
          >
            {data.photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{
                  delay: 1.9 + index * 0.15,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.05,
                  rotateZ: index % 2 === 0 ? 2 : -2,
                  transition: { duration: 0.3 },
                }}
                className="rounded-2xl overflow-hidden shadow-sm"
              >
                <img
                  src={photo}
                  alt="Memory"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Wishes with gentle fade */}
        {data.wishes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="text-center mb-16 md:mb-20 max-w-xl mx-auto px-4"
          >
            <p className="text-gray-400 uppercase tracking-widest text-xs mb-4">
              Wishes for the future
            </p>
            <p className="text-base md:text-lg text-gray-600 italic">
              "{data.wishes}"
            </p>
          </motion.div>
        )}

        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="border-t border-gray-200 pt-12 md:pt-16"
        >
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.5 }}
            className="text-xl md:text-2xl font-serif text-center mb-6 md:mb-8"
          >
            Send a Whisper Back
          </motion.h3>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.5 }}
            className="bg-gray-50 p-2 rounded-2xl flex gap-2 mb-6 md:mb-8"
          >
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFeedbackSubmit}
              className="bg-white shadow-sm px-5 md:px-6 py-3 min-w-[70px] rounded-xl font-medium text-base hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            >
              Send
            </motion.button>
          </motion.div>

          <div className="space-y-4">
            {feedback.map((f, index) => (
              <FeedbackItem key={f._id} feedback={f} index={index} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.6 }}
          className="mt-16 md:mt-24 text-center space-y-4"
        >
          <p className="text-gray-400 text-sm">Feeling moved?</p>
          <Link to="/create">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-6 py-3 rounded-full font-medium transition-colors touch-manipulation"
            >
              Create one for someone else <CornerDownRight size={16} />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default GratitudePage;
