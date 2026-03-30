import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/simulation/Header";
import SimulationArea from "../components/simulation/SimulationArea";
import ControlPanel from "../components/simulation/ControlPanel";

const TOWERS = [
  { id: "T1", x: 10, y: 20, power: 80 },
  { id: "T2", x: 100, y: 20, power: 5 },
  { id: "T3", x: 55, y: 50, power: 90 },
  { id: "T4", x: 10, y: 80, power: 50 },
  { id: "T5", x: 100, y: 80, power: 75 },
];

const Index = () => {
  const [userPos, setUserPos] = useState({ x: 50, y: 50 });
  const [speed, setSpeed] = useState(0.1);
  const [activeTower, setActiveTower] = useState(null);
  const [previousTower, setPreviousTower] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [signalData, setSignalData] = useState([]);

  const angleRef = useRef(0);

  const calculateSignals = useCallback((pos) => {
    return TOWERS.map((t) => {
      const dist = Math.sqrt((t.x - pos.x) ** 2 + (t.y - pos.y) ** 2);
      const rawStrength = Math.round((t.power / (dist ** 2 + 10)) * 100);
      const strength = Math.max(0, Math.min(100, rawStrength));
      return { ...t, strength };
    });
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      angleRef.current += 0.01 * speed;

      const x = 50 + 35 * Math.cos(angleRef.current);
      const y = 50 + 25 * Math.sin(angleRef.current * 0.8);

      setUserPos({ x, y });
    }, 16);

    return () => clearInterval(interval);
  }, [isRunning, speed]);

  useEffect(() => {
    const signals = calculateSignals(userPos);
    setSignalData(signals);

    const strongest = signals.reduce((prev, curr) =>
      prev.strength > curr.strength ? prev : curr,
    );

    setActiveTower((prevTower) => {
      const isSameTower = prevTower?.id === strongest.id;

      if (!isSameTower) {
        const timestamp = new Date().toLocaleTimeString([], {
          hour12: false,
          minute: "2-digit",
          second: "2-digit",
        });

        setPreviousTower(prevTower);

        setLogs((prev) =>
          [
            {
              id: Date.now(),
              msg: prevTower
                ? `Handoff from ${prevTower.id} to ${strongest.id}`
                : `Connected to ${strongest.id}`,
              time: timestamp,
            },
            ...prev,
          ].slice(0, 30),
        );
      }
      return strongest;
    });
  }, [userPos, calculateSignals]);

  return (
    <div className="app">
      <Header />

      <main className="main">
        <section className="simulation-section">
          <SimulationArea
            towers={signalData}
            userPos={userPos}
            activeTower={activeTower}
          />
        </section>

        <aside className="control-section">
          <ControlPanel
            speed={speed}
            setSpeed={setSpeed}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            activeTower={activeTower}
            previousTower={previousTower}
            logs={logs}
          />
        </aside>
      </main>
    </div>
  );
};

export default Index;
