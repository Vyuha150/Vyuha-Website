import React from "react";
import VyuhaLogo from "../public/logo.png";
import Image from "next/image";

export default function IconicLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#18120b] to-[#1a1207]">
      {/* Subtle Circular Glow */}
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        {/* Subtle blurred circle for glow */}
        <div className="absolute w-full h-full rounded-full bg-gradient-to-tr from-orange-400/30 via-yellow-300/20 to-white/10 blur-2xl animate-pulse" />
        {/* Loader in the center */}
        <div className="flex flex-col items-center justify-center z-10">
          <div className="w-20 h-20 rounded-full bg-[#18120b] border-2 border-orange-400 flex items-center justify-center shadow-lg relative">
            {/* Triple circular loaders */}
            <div className="absolute -inset-8 rounded-full border-2 border-transparent border-r-orange-400 animate-spin" />
            <div className="absolute -inset-6 rounded-full border-2 border-transparent border-r-orange-400 animate-[spin_2s_linear_infinite]" />
            <div className="absolute -inset-4 rounded-full border-2 border-transparent border-r-orange-400 animate-[spin_3s_linear_infinite]" />
            {/* Vyuha text in center */}
            <Image src={VyuhaLogo} alt="Vyuha Logo" width={70} height={70} />
          </div>
        </div>
      </div>
      {/* Glowing Company Name */}
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-white drop-shadow-[0_2px_20px_rgba(255,186,73,0.7)] animate-glow">
        VYUHA Innovation Foundation
      </h2>
      {/* Subtitle */}
      <p className="text-lg text-orange-200 mb-6 text-center font-medium">Loading the future of innovation...</p>
      {/* Progress Bar */}
      <div className="w-64 h-2 bg-[#2a1a0a] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-400 to-yellow-300 animate-loader-bar" style={{ width: '40%' }}></div>
      </div>
      <style jsx>{`
        .animate-loader-bar {
          animation: loader-bar 1.8s cubic-bezier(0.4,0,0.2,1) infinite alternate;
        }
        @keyframes loader-bar {
          0% { width: 10%; }
          100% { width: 90%; }
        }
        .animate-glow {
          animation: glow-text 2s ease-in-out infinite alternate;
        }
        @keyframes glow-text {
          0% { filter: drop-shadow(0 0 10px #ffba49) drop-shadow(0 0 20px #ff9100); }
          100% { filter: drop-shadow(0 0 30px #ffba49) drop-shadow(0 0 40px #ff9100); }
        }
      `}</style>
    </div>
  );
} 