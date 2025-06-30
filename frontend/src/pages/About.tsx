import React from 'react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-gray-300 py-16 font-outfit">
      {/* About Us Section */}
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
          About Us
        </h1>
        <p className="text-lg text-center max-w-3xl mx-auto mb-20">
          At VedRix, we're passionate about building innovative solutions that help
          businesses thrive in the digital landscape.
        </p>

        {/* CEO Profile Section */}
        <div className="max-w-6xl mx-auto bg-zinc-900 rounded-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative h-[500px] w-full">
              <img
                src="/meet.jpeg"
                alt="Meet Vaghani - Founder & CEO"
                className="rounded-l-lg w-full h-full object-cover"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white mb-2">Meet Vaghani</h2>
              <p className="text-xl text-gray-400 mb-6">Founder & CEO</p>
              <p className="text-gray-300 mb-8">
                Meet has been instrumental in elevating VedRix from its humble beginnings
                to a position of industry prominence. His strategic foresight, relentless pursuit of
                excellence, and visionary leadership remain the cornerstone of our continued
                success.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://github.com/meetvaghani12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                >
                  <FaGithub size={24} />
                </a>
              </div>
              <div className="mt-8 space-y-2">
                <p className="flex items-center gap-2">
                  <span>📧</span>
                  <a href="mailto:meetvaghani1239@gmail.com" className="hover:text-white">
                    meetvaghani1239@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span>📞</span>
                  <a href="tel:+919510880097" className="hover:text-white">
                    +91 95108 80097
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Company Culture Section */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
            Our Company Culture
          </h2>
          <p className="text-center max-w-3xl mx-auto mb-16">
            At VedRix, we believe that a positive and inclusive culture is essential for
            innovation and success. We foster an environment where creativity thrives, collaboration
            is encouraged, and every team member feels valued and respected.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 p-8 rounded-lg text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
              <p>
                We encourage creative thinking and embrace new technologies to stay ahead of the curve.
              </p>
            </div>
            <div className="bg-zinc-900 p-8 rounded-lg text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Collaboration</h3>
              <p>
                We believe that the best results come from teamwork and diverse perspectives.
              </p>
            </div>
            <div className="bg-zinc-900 p-8 rounded-lg text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Excellence</h3>
              <p>
                We are committed to delivering high-quality solutions that exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 