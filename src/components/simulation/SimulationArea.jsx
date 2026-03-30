import { motion } from "framer-motion";


const SimulationArea = ({ towers, userPos, activeTower }) => {
  return (
    <div className="simulation-container">
      <div className="grid-overlay" />

      <svg
        className="simulation-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="coverageActive">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="coverageInactive">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {activeTower && (
          <motion.line
            x1={userPos.x}
            y1={userPos.y}
            x2={activeTower.x}
            y2={activeTower.y}
            stroke="url(#lineGradient)"
            strokeWidth="0.5"
            strokeDasharray="1 1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {towers.map((t) => {
          const isActive = activeTower?.id === t.id;

          return (
            <g key={t.id}>
              <circle
                cx={t.x}
                cy={t.y}
                r="18"
                fill={isActive ? "url(#coverageActive)" : "url(#coverageInactive)"}
                stroke={isActive ? "rgba(34,211,238,0.12)" : "rgba(255,255,255,0.03)"}
                strokeWidth="0.4"
              />

              <motion.g
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <image
                  href="src/assets/tower.png"
                  x={t.x - 7.5}
                  y={t.y - 13}
                  width="15"
                  height="15"
                  preserveAspectRatio="xMidYMid meet"
                  className={isActive ? "tower-active" : ""}
                />
              </motion.g>

              <text
                x={t.x}
                y={t.y + 12}
                textAnchor="middle"
                className="tower-label"
              >
                {t.id}
              </text>

              <text
                x={t.x}
                y={t.y + 6.5}
                textAnchor="middle"
                className="tower-power"
              >
                {t.power}W
              </text>
            </g>
          );
        })}

        <motion.g
          animate={{ x: userPos.x, y: userPos.y }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          <circle r="1.2" className="user-dot" filter="url(#glow)" />
          <circle r="1.2" className="user-pulse">
            <animate attributeName="r" from="1.2" to="3" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle r="0.5" className="user-core" />
        </motion.g>
      </svg>
    </div>
  );
};

export default SimulationArea;