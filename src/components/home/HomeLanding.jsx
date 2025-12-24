import React from "react";
import { Dumbbell, Brain, LineChart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomeLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Your AI-Powered
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Fitness Companion
          </span>
        </h1>

        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Personalized diet plans, smart workouts, progress tracking, and
          trainer support. All in one intelligent fitness platform.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/diet")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/trainer")}
            className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Explore Trainers
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            icon: <Brain className="w-6 h-6" />,
            title: "AI Diet Planning",
            desc: "Weekly adaptive meal plans generated from your body metrics and goals.",
          },
          {
            icon: <Dumbbell className="w-6 h-6" />,
            title: "Smart Workouts",
            desc: "Personalized exercise routines designed to maximize results.",
          },
          {
            icon: <LineChart className="w-6 h-6" />,
            title: "Progress Tracking",
            desc: "Visual analytics for calories, weight, and performance.",
          },
          {
            icon: <Users className="w-6 h-6" />,
            title: "Expert Trainers",
            desc: "Chat and train with certified fitness professionals.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
          >
            <div className="mb-4 text-purple-400">{f.icon}</div>
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            ["Create Profile", "Tell us your body data and fitness goal"],
            ["AI Generates Plan", "Diet and workout plans tailored to you"],
            ["Track & Improve", "Weekly updates based on progress"],
          ].map(([title, desc], i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="text-purple-500 text-xl font-bold mb-2">
                {i + 1}
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-sm text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center border-t border-gray-800">
        <h2 className="text-2xl font-bold mb-4">
          Start Your Fitness Journey Today
        </h2>
        <button
          onClick={() => navigate("/diet")}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold"
        >
          Generate My Diet Plan
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-gray-500">
        © 2025 FitAI. AI-powered fitness and nutrition platform.
      </footer>
    </div>
  );
};

export default HomeLanding;
