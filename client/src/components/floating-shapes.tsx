export function FloatingShapes() {
  return (
    <div className="floating-shapes">
      {/* Primary animated shapes */}
      <div className="shape"></div>
      <div className="shape"></div>
      <div className="shape"></div>
      
      {/* Additional particle effects */}
      <div 
        className="absolute w-4 h-4 bg-gradient-to-br from-primary to-accent rounded-full opacity-70"
        style={{ 
          top: '15%', 
          right: '20%',
          animation: 'sparkle 3s ease-in-out infinite 1s'
        }}
      ></div>
      <div 
        className="absolute w-6 h-6 bg-gradient-to-br from-accent to-secondary rounded-full opacity-60"
        style={{ 
          bottom: '30%', 
          right: '40%',
          animation: 'sparkle 4s ease-in-out infinite 2s'
        }}
      ></div>
      <div 
        className="absolute w-3 h-3 bg-gradient-to-br from-secondary to-primary rounded-full opacity-80"
        style={{ 
          top: '70%', 
          left: '60%',
          animation: 'sparkle 2.5s ease-in-out infinite 0.5s'
        }}
      ></div>
      <div 
        className="absolute w-5 h-5 bg-gradient-to-br from-primary to-secondary rounded-full opacity-50"
        style={{ 
          top: '40%', 
          left: '80%',
          animation: 'sparkle 3.5s ease-in-out infinite 3s'
        }}
      ></div>
    </div>
  );
}
