export default function Logo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`${className} flex flex-col items-center justify-center space-y-1`}>
      <svg 
        viewBox="0 0 100 120" 
        className="w-full h-full"
        fill="none"
      >
        {/* Top rounded rectangle */}
        <rect 
          x="20" 
          y="20" 
          width="60" 
          height="20" 
          rx="10" 
          ry="10" 
          fill="#10b981"
          className="fill-emerald-500"
        />
        
        {/* Bottom rounded rectangle */}
        <rect 
          x="20" 
          y="45" 
          width="60" 
          height="20" 
          rx="10" 
          ry="10" 
          fill="#10b981"
          className="fill-emerald-500"
        />
        
        {/* Circle */}
        <circle 
          cx="50" 
          cy="85" 
          r="15" 
          fill="#22c55e"
          className="fill-emerald-400"
        />
      </svg>
    </div>
  );
}