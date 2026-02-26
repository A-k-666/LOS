export default function OceanBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Simple animated gradient background - very subtle */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 dark:from-cyan-500/3 via-blue-500/3 dark:via-blue-500/2 to-teal-500/5 dark:to-teal-500/3 animate-pulse" />
      
      {/* Floating particles using CSS - subtle */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 dark:bg-cyan-400/15 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
