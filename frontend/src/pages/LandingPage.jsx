import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  Shield,
  Heart,
  Archive,
  MessageCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-20 md:pb-24 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center space-y-6 md:space-y-8 fade-in mb-16 md:mb-24">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-sm font-medium mb-4">
            Something small. Something that matters.
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 leading-tight px-4">
            Some feelings are meant to be{" "}
            <span className="text-rose-400 italic">felt</span>, not stored.
          </h1>

          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            Create a beautiful, temporary gratitude page for someone you love.
            It disappears forever after 24 hours. Because the best moments are
            fleeting.
          </p>

          <div className="pt-6 md:pt-8">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-black text-white px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-xl shadow-gray-200 touch-manipulation"
            >
              Create One Now <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Story Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">
          <StoryCard
            icon={<Archive className="text-blue-500" size={24} />}
            title="We save everything now"
            content="Photos. Messages. Screenshots. Feelings. But some emotions were never meant to be archived. They lose their truth when they stay too long."
            highlight="PureThanks is for those moments."
          />

          <StoryCard
            icon={<MessageCircle className="text-purple-500" size={24} />}
            title="Why this exists"
            content="Because you wanted to say thank you — not publicly, not permanently, not loudly. Just once. Just honestly."
            highlight="A few words for someone who mattered this year."
          />

          <StoryCard
            icon={<Sparkles className="text-amber-500" size={24} />}
            title="What happens here"
            content="You create a small page. You write what you actually feel. You share a private link. That page lives for 24 hours."
            highlight="No reminders. No extensions. No backups. After that, it's gone. Completely."
          />

          <StoryCard
            icon={<Calendar className="text-rose-500" size={24} />}
            title="Why only 24 hours"
            content="Because permanence makes us careless. Because knowing something will disappear forces us to be real. You choose your words more gently. You mean them more."
            highlight="That's the point."
          />
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
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

        {/* Final CTA */}
        <div className="text-center space-y-6 px-4">
          <p className="text-gray-500 italic text-base md:text-lg max-w-xl mx-auto">
            "Some things are beautiful because they don't last."
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-medium hover:bg-rose-100 active:bg-rose-200 transition-all duration-300 touch-manipulation"
          >
            Create a PureThanks Page <ArrowRight size={20} />
          </Link>
        </div>
      </main>
    </div>
  );
};

const StoryCard = ({ icon, title, content, highlight }) => (
  <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl soft-shadow hover:-translate-y-1 transition-all duration-300 border border-gray-100">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight pt-1">
        {title}
      </h3>
    </div>
    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-3">
      {content}
    </p>
    <p className="text-gray-900 font-medium text-sm md:text-base italic">
      {highlight}
    </p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl soft-shadow hover:-translate-y-1 transition-transform duration-300">
    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
      {icon}
    </div>
    <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">
      {title}
    </h3>
    <p className="text-gray-500 text-sm md:text-base leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
