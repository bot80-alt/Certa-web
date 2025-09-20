import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaDatabase,
  FaBrain,
  FaGlobe,
  FaVideo,
  FaShieldAlt,
} from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import "./Home.css";
import Spline from "@splinetool/react-spline";
import Navbar from "@/components/navbar";

const Home = () => {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineEnabled, setSplineEnabled] = useState(true);

  const features = [
    {
      icon: <FaBolt className="text-4xl text-blue-500" />,
      title: "Real-Time Detection",
      description:
        "Instant fact-checking during live broadcasts with millisecond response time",
    },
    {
      icon: <FaBrain className="text-4xl text-blue-500" />,
      title: "AI-Powered Analysis",
      description:
        "Advanced machine learning models trained on vast datasets for accurate verification",
    },
    {
      icon: <FaDatabase className="text-4xl text-blue-500" />,
      title: "Knowledge Graph",
      description:
        "Comprehensive fact database with Neo4j for contextual understanding of information",
    },
    {
      icon: <FaGlobe className="text-4xl text-blue-500" />,
      title: "Multilingual Support",
      description:
        "Fact-checking across multiple languages to combat global misinformation",
    },
    {
      icon: <FaVideo className="text-4xl text-blue-500" />,
      title: "Deepfake Detection",
      description:
        "Advanced computer vision to identify manipulated videos and images",
    },
    {
      icon: <FaShieldAlt className="text-4xl text-blue-500" />,
      title: "Misinformation Shield",
      description:
        "Proactive alerts to prevent the spread of false information",
    },
  ];

  const teamMembers = [
    {
      name: "Madesh Vaithya",
      role: "Team Lead/Full Stack Engineer",
      description: "Oversees project management and full-stack development",
    },
    {
      name: "Madhanraj",
      role: "Developer Relations/DevOps",
      description: "Focuses on integration and deployment of AI models",
    },
    {
      name: "Shyam Sundar",
      role: "ML Engineer",
      description:
        "Built the NLP models for fact-checking and deepfake detection",
    },
    {
      name: "Prieyen",
      role: "AI Engineer",
      description:
        "Works on developing and optimizing AI algorithms for various applications",
    },
    {
      name: "Sajid",
      role: "Web Dev Engineer",
      description:
        "Creates the user interface and ensures a seamless user experience",
    },
  ];

  const handleSplineLoad = () => {
    setSplineLoaded(true);
  };

  const toggleSpline = () => {
    setSplineEnabled(!splineEnabled);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <div className="h-screen relative">
          {/* Toggle Button */}
          <button
            onClick={toggleSpline}
            className="absolute top-20 right-4 z-50 bg-white/95 backdrop-blur-sm border border-blue-200 rounded-full p-3 shadow-xl hover:bg-white transition-all duration-200"
            title={splineEnabled ? "Disable 3D Experience" : "Enable 3D Experience"}
          >
            {splineEnabled ? (
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>

          {!splineLoaded && splineEnabled && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white z-10">
              <BiLoaderAlt className="animate-spin text-6xl text-blue-500 mb-4" />
              <p className="text-slate-800 text-xl font-medium">
                Loading Experience...
              </p>
            </div>
          )}
          
          {splineEnabled && (
            <Spline
              scene="https://prod.spline.design/Jj5RJqqqAn1O8W8h/scene.splinecode"
              onLoad={handleSplineLoad}
              className={
                splineLoaded
                  ? "opacity-100 transition-opacity duration-1000"
                  : "opacity-0"
              }
            />
          )}
          
          {!splineEnabled && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-slate-800 mb-4">Certa</h1>
                <p className="text-xl text-slate-600 mb-8">AI-Powered Fact-Checking Platform</p>
                <p className="text-slate-500">Click the eye icon to enable 3D experience</p>
              </div>
            </div>
          )}

          {/* Scroll Down Button */}
          <button
            onClick={() => {
              const contentSection = document.querySelector('.content-section');
              if (contentSection) {
                contentSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm border border-blue-200 rounded-full p-3 shadow-xl hover:bg-white transition-all duration-200 animate-bounce"
            title="Scroll to content"
          >
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>

        <motion.div
          className="content-section p-8 relative bg-gradient-to-br from-slate-50 to-blue-50"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >

          {/* About Us Section */}
          <motion.div
            className="relative z-10 max-w-6xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-blue-200 shadow-xl mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-slate-800 text-center">
              About Certa
            </h2>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              We are second-year students from CIT Chennai, passionate about
              building impactful AI solutions. At Gen AI Exchange hackathon, we
              developed Certa — an AI-powered tool & platform that detects
              deepfakes, fact-checks news articles, and flags misinformation in
              real time. With multilingual support and live-streaming alerts,
              our tool is designed to combat the spread of false information
              across digital platforms.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50/80 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-600 mb-3">
                  Our Mission
                </h3>
                <p className="text-slate-700">
                  To create a more informed digital ecosystem where truth
                  prevails over misinformation, empowering users to make
                  decisions based on verified facts rather than manipulated
                  content.
                </p>
              </div>
              <div className="bg-blue-50/80 p-6 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold text-blue-600 mb-3">
                  Our Approach
                </h3>
                <p className="text-slate-700">
                  We combine cutting-edge AI technologies including natural
                  language processing, computer vision, and knowledge graphs to
                  create a comprehensive fact-checking system that works across
                  multiple media formats.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center my-16 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              Powered by Google
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Our platform leverages state-of-the-art technologies to deliver
              accurate and reliable fact-checking
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {[
                "TensorFlow",
                "PyTorch",
                "BERT",
                "Real-time broadcasting",
                "NLP",
                "Python",
                "React",
                "Fact-check API",
                "Neo4j",
                "Computer Vision",
                "Gemini AI",
                "Knowledge Graphs",
              ].map((tech, index) => (
                <motion.span
                  key={index}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            <h2 className="text-4xl font-bold mb-12 text-slate-800">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center content-center gap-8 my-16 relative z-10">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-xl border border-blue-200 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                  }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-50 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-center text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-center text-slate-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            className="relative z-10 max-w-6xl mx-auto mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-slate-800 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200 text-center"
                whileHover={{ scale: 1.03 }}
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">
                  Input Content
                </h3>
                <p className="text-slate-600">
                  Upload articles, videos, or connect to live streams for
                  real-time analysis
                </p>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200 text-center"
                whileHover={{ scale: 1.03 }}
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">
                  AI Analysis
                </h3>
                <p className="text-slate-600">
                  Our algorithms extract claims, verify facts, and detect
                  manipulated media
                </p>
              </motion.div>
              <motion.div
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200 text-center"
                whileHover={{ scale: 1.03 }}
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">Results</h3>
                <p className="text-slate-600">
                  Receive detailed reports with accuracy scores, evidence, and
                  explanations
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            className="relative z-10 max-w-6xl mx-auto mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <h2 className="text-4xl font-bold mb-12 text-slate-800 text-center">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                  }}
                >
                  <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-slate-800">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 mb-3 text-sm">{member.role}</p>
                  <p className="text-slate-600 text-sm">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="relative z-10 max-w-4xl mx-auto text-center mb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-slate-800">
              Ready to Fight Misinformation?
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Join us in our mission to create a more truthful digital world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-blue-500 text-white rounded-full font-medium text-lg hover:bg-blue-600 transition-colors shadow-lg"
              >
                Try Demo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-transparent border-2 border-blue-500 text-slate-800 rounded-full font-medium text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="relative z-10 py-8 border-t border-blue-200 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p className="text-slate-600">
              © 2025 Certa | Created by CIT chennai Students
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Home;
