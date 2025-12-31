import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Shield, Heart } from "lucide-react";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <main className="container mx-auto px-4 pt-16 pb-24 max-w-4xl">
        <div className="text-center space-y-8 fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-4">
            Create something meaningless yet meaningful
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-tight">
            Some feelings are meant to be{" "}
            <span className="text-rose-400 italic">felt</span>, not stored.
          </h1>

          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
            Create a beautiful, temporary gratitude page for someone you love.
            It disappears forever after 24 hours. Because the best moments are
            fleeing.
          </p>

          <div className="pt-8">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-200"
            >
              Create One Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <FeatureCard
            icon={<Clock className="text-amber-500" />}
            title="24-Hour Ephemerality"
            desc="Your message exists for just one day. Make it count."
          />
          <FeatureCard
            icon={<Shield className="text-emerald-500" />}
            title="Private & Secure"
            desc="Only accessible via a unique link. No search, no history."
          />
          <FeatureCard
            icon={<Heart className="text-rose-500" />}
            title="Pure Emotion"
            desc="No likes, no comments, no distractions. Just love."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl soft-shadow hover:-translate-y-1 transition-transform duration-300">
    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
