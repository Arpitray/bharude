import React from 'react';

export default function AboutMe({ isDarkMode = true }) {
  return (
    <section id="about" className={`w-full h-screen px-6 py-45  ${
      isDarkMode ? 'bg-[#111928] text-white' : 'bg-[#f7efe3] text-black'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <h2 className="text-5xl lg:text-7xl font-bold leading-tight">
              About me
            </h2>
            
            <div className="space-y-6">
              <p className="text-lg lg:text-xl leading-relaxed opacity-90">
                I help startups turn messy positioning into a crisp brand, & a website that their customers love. I've been mastering the art & science of Brand Design, Visual Design, Communication Design, Product Design & Marketing for the past 5 years.
              </p>
              
              <p className="text-lg lg:text-xl leading-relaxed opacity-90">
                With a background in both computer science engineering & an MBA in marketing, I am fluent in all dialects of product, growth, tech, strategy and design.
              </p>
            </div>

            {/* More about me button */}
            <div className="pt-8">
              <button className={`group relative px-8 py-4 rounded-full border transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'border-white/20 hover:border-white/40 hover:bg-white/5' 
                  : 'border-black/20 hover:border-black/40 hover:bg-black/5'
              }`}>
                <span className="flex items-center gap-3 text-lg font-medium">
                  More about me
                  <svg 
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 8l4 4m0 0l-4 4m4-4H3" 
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Right side - Profile image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Background pattern/dots effect */}
              <div className={`absolute inset-0 rounded-2xl ${
                isDarkMode ? 'bg-white/5' : 'bg-black/5'
              }`} style={{
                backgroundImage: `radial-gradient(circle, ${
                  isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                } 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
                transform: 'rotate(-5deg)',
                zIndex: 0
              }} />
              
              {/* Profile image container */}
              <div className="relative z-10 w-80 h-96 lg:w-110 lg:h-[550px] rounded-2xl overflow-hidden">
                {/* Placeholder for profile image - replace with actual image */}
                <img src="https://res.cloudinary.com/dsjjdnife/image/upload/v1755711983/load2_z4atye.jpg" alt="" />
                <div className={`w-full h-full flex items-center justify-center text-6xl ${
                  isDarkMode ? 'bg-white/10 text-white/60' : 'bg-black/10 text-black/60'
                }`}>
                  <svg 
                    className="w-24 h-24" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                {/* 
                Uncomment and replace with actual image:
                <img 
                  src="/path-to-your-profile-image.jpg" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
