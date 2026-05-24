export function LoadingScreen({ visible }) {
  return (
    <div className={visible ? "loader-screen" : "loader-screen loader-screen--hidden"} aria-hidden={!visible}>
      <div className="loader-card" role="status" aria-live="polite">
        <div className="loader-core" aria-hidden="true">
          <span />
          <span />
        </div>
        <p className="loader-kicker">AI Portfolio System</p>
        <h2>Initializing Developer Profile</h2>
        <div className="loader-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </div>
  );
}
