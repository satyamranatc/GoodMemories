import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Upload,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";

const CreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    creatorName: "",
    lovedOneName: "",
    nickname: "",
    message: "",
    wishes: "",
    photos: [],
  });
  const [preview, setPreview] = useState([]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Revoke old preview URLs before creating new ones
    preview.forEach((url) => URL.revokeObjectURL(url));

    setFormData({ ...formData, photos: files });

    // Create new previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreview(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("creatorName", formData.creatorName);
    data.append("lovedOneName", formData.lovedOneName);
    data.append("nickname", formData.nickname);
    data.append("message", formData.message);
    data.append("wishes", formData.wishes);

    formData.photos.forEach((photo) => {
      data.append("photos", photo);
    });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/pages`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate(`/view/${res.data.pageId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create page. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.lovedOneName || !formData.message)) {
      alert("Please fill in the required fields");
      return;
    }
    setStep(step + 1);
  };

  // Memoize preview rendering to avoid unnecessary re-renders
  const previewImages = useMemo(() => {
    return preview.map((src, i) => (
      <div
        key={i}
        className="aspect-square relative rounded-xl overflow-hidden border border-gray-100"
      >
        <img src={src} alt="preview" className="w-full h-full object-cover" />
      </div>
    ));
  }, [preview]);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        <div className="mb-6 md:mb-8">
          <div className="flex gap-2 mb-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-black" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 font-medium">Step {step} of 2</p>
        </div>

        <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-4xl soft-shadow fade-in">
          {step === 1 ? (
            <div className="space-y-5 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-serif text-gray-900">
                Who is this for?
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Their Name *
                  </label>
                  <input
                    type="text"
                    name="lovedOneName"
                    value={formData.lovedOneName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sarah"
                    className="w-full px-4 py-3.5 md:py-3 text-base rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 transition-all outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cute Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="e.g. Sunshine"
                    className="w-full px-4 py-3.5 md:py-3 text-base rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Main Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write something from the heart..."
                    rows={5}
                    className="w-full px-4 py-3.5 md:py-3 text-base rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 transition-all outline-none resize-none"
                  />
                </div>
              </div>

              <button
                onClick={nextStep}
                className="w-full bg-black text-white py-4 md:py-4 rounded-xl font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 text-base touch-manipulation"
              >
                Next Step <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-2xl md:text-3xl font-serif text-gray-900">
                Add Memories
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wishes for the Future (Optional)
                </label>
                <textarea
                  name="wishes"
                  value={formData.wishes}
                  onChange={handleInputChange}
                  placeholder="I hope you always..."
                  rows={4}
                  className="w-full px-4 py-3.5 md:py-3 text-base rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 transition-all outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  name="creatorName"
                  value={formData.creatorName}
                  onChange={handleInputChange}
                  placeholder="e.g. Alex"
                  className="w-full px-4 py-3.5 md:py-3 text-base rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black/5 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Photos (Max 5)
                </label>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {previewImages}
                  {preview.length < 5 && (
                    <label className="aspect-square flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-400 hover:text-gray-600 touch-manipulation">
                      <ImageIcon size={20} className="md:w-6 md:h-6" />
                      <span className="text-xs mt-1">Add</span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 rounded-xl font-medium text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-black text-white py-4 rounded-xl font-medium hover:bg-gray-900 active:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create Page"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
