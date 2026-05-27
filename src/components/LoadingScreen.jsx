export function LoadingScreen({ visible, progress = 0 }) {
  return (
    <div className={visible ? "loader-screen" : "loader-screen loader-screen--hidden"} aria-hidden={!visible}>
      <div className="loader-card" role="status" aria-live="polite">
        <div className="loader-mark" aria-hidden="true">
          <span>YK</span>
        </div>
        <p className="loader-kicker">Associate Developer</p>
        <h2>Yugant D Koulgekar</h2>
        <p className="loader-role">Full Stack Developer / AI Systems Builder</p>
        <div className="loader-progress" aria-label={`Loading ${progress}%`}>
          <span style={{ transform: `scaleX(${Math.min(progress, 100) / 100})` }} />
        </div>
        <p className="loader-percent">{progress}%</p>
      </div>
    </div>
  );
}
