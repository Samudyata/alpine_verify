export default function MountainBg() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 pointer-events-none z-0"
      style={{
        height: '45vh',
        backgroundImage: 'url(/alps-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        opacity: 0.12,
        filter: 'brightness(0.6) saturate(0.3)',
        maskImage: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 100%)',
      }}
    />
  );
}
