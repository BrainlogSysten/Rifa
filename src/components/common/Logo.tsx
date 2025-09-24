import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'medium' }) => {
  const sizes = {
    small: { icon: 32, text: 'text-xl' },
    medium: { icon: 40, text: 'text-2xl' },
    large: { icon: 56, text: 'text-4xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Clover Icon Container */}
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Square */}
        <div
          className="rounded-xl bg-gradient-to-br from-indigo-900 via-blue-900 to-blue-950 shadow-xl flex items-center justify-center p-1.5"
          style={{ width: currentSize.icon, height: currentSize.icon }}
        >
          {/* Clover SVG */}
          <svg
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="cloverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2ECC40" />
                <stop offset="50%" stopColor="#27AE60" />
                <stop offset="100%" stopColor="#229954" />
              </linearGradient>
            </defs>
            <g>
              <path
                fill="url(#cloverGradient)"
                d="M78.168,239.257c0,0,4.892-0.048,13.166-0.104c29.705-0.226,102.546-0.275,149.765-0.21
                  c0.057-48.109-0.016-122.346-0.209-150.671c-0.065-7.345-0.105-11.631-0.105-11.631c0.016-41.498-33.62-75.124-75.102-75.109
                  c-41.481,0-75.117,33.628-75.108,75.109c0,0,0.032,4.561,0.096,12.302c-7.87,0.056-12.503,0.105-12.503,0.105
                  c-41.481,0-75.109,33.628-75.109,75.1C3.059,205.622,36.694,239.25,78.168,239.257z"
              />
              <path
                fill="url(#cloverGradient)"
                d="M437.198,272.973c0,0-4.892,0.017-13.166,0.008c-29.705,0.025-102.546-0.46-149.758-0.864
                  c-0.403,48.108-0.879,122.346-0.872,150.67c0.008,7.346,0.017,11.624,0.017,11.624c-0.307,41.506,33.079,75.367,74.568,75.666
                  c41.481,0.291,75.351-33.103,75.641-74.576c0,0,0-4.56-0.008-12.309c7.87-0.008,12.504,0,12.504,0
                  c41.472,0.29,75.351-33.094,75.634-74.568C512.064,307.142,478.671,273.273,437.198,272.973z"
              />
              <path
                fill="url(#cloverGradient)"
                d="M274.581,239.799c48.116,0.056,122.354,0,150.67-0.218c7.346-0.064,11.64-0.097,11.64-0.097
                  c41.482,0.008,75.117-33.628,75.11-75.109c-0.008-41.474-33.636-75.109-75.11-75.109c0,0-4.568,0.04-12.301,0.105
                  c-0.065-7.871-0.098-12.512-0.098-12.512c0-41.465-33.635-75.101-75.109-75.101c-41.481-0.008-75.117,33.628-75.109,75.101
                  c0,0,0.049,4.908,0.105,13.173C274.606,119.737,274.654,192.578,274.581,239.799z"
              />
              <path
                fill="url(#cloverGradient)"
                d="M90.736,272.102c-7.345,0.016-11.631,0.016-11.631,0.016c-41.489-0.307-75.359,33.079-75.649,74.568
                  c-0.255,36.501,25.584,67.086,60.042,74.108c-7.099,8.992-15.243,17.25-23.67,24.184c-7.435,6.143-15.03,11.292-22.005,15.135
                  c-6.958,3.842-13.342,6.36-17.822,7.434l9.811,40.141c12.285-3.035,24.745-8.952,37.442-17.031
                  c15.539-9.976,31.142-23.481,44.762-39.665c7.156,33.756,36.974,59.223,72.901,59.474c41.474,0.306,75.352-33.095,75.642-74.553
                  c0,0-0.008-4.907-0.008-13.189c-0.016-29.704,0.452-102.529,0.856-149.75C193.306,272.57,119.069,272.094,90.736,272.102z"
              />
            </g>
          </svg>
        </div>

        {/* Gold accent dot */}
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg" />
        </div>
      </motion.div>

      {/* Text Logo */}
      {showText && (
        <div className="flex flex-col">
          <div className={`font-bold ${currentSize.text} leading-none flex items-baseline`}>
            <span className="text-blue-900 dark:text-white">Sort</span>
            <span className="text-yellow-500">.IO</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            faça sua sorte
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;