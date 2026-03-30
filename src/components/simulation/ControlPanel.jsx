
const ControlPanel = ({
  speed,
  setSpeed,
  isRunning,
  setIsRunning,
  activeTower,
  logs,
}) => {
  return (
    <>
      {/* Controls */}
      <div className="panel">
        <h3 className="panel-title">Controls</h3>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`btn ${isRunning ? "btn-secondary" : "btn-primary"}`}
        >
          {isRunning ? "⏸ Pause" : "▶ Resume"}
        </button>

        <div className="speed-box">
          <div className="speed-header">
            <span>Speed</span>
            <span>{(speed * 10).toFixed(1)}x</span>
          </div>

          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      {/* Live Connection */}
      <div className="panel">
        <h3 className="panel-title">Live Connection</h3>

        <div className="connection">
          <div>
            <div className="tower-id">
              {activeTower?.id || "--"}
            </div>
            <div className="label">Current Tower</div>
          </div>

          <div className="signal-box">
            <div className="signal">
              {activeTower?.strength || 0}%
            </div>
            <div className="label">Signal</div>
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="panel logs-panel">
        <h3 className="panel-title">Handoff Logs</h3>

        <div className="logs">
          {logs.map((log) => (
            <div key={log.id} className="log-item">
              {log.msg}
            </div>
          ))}

          {logs.length === 0 && (
            <p className="no-logs">No events yet</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ControlPanel;