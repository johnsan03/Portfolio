import { useEffect, useState } from 'react';

const formatClock = () => new Date().toTimeString().slice(0, 8);

/**
 * Bottom telemetry strip. The source page frames the viewport top and bottom,
 * but the portfolio's fixed nav already owns the top edge, so only the bottom
 * rail is used here.
 */
const Hud = () => {
  const [clock, setClock] = useState(formatClock);

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fx-hud" aria-hidden="true">
      <span className="fx-hud__state">SIGNAL // STABLE</span>
      <span>
        MJ <b>PORTFOLIO</b> · <time>{clock}</time>
      </span>
    </div>
  );
};

export default Hud;
