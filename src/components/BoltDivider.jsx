import { useEffect, useRef } from 'react';

/**
 * Thin lightning rule between sections — the divider from the source page.
 * 70px tall, so nine of them cost under one screen of scroll rather than the
 * ~13 screens the old full-height bridges added.
 */
const BoltDivider = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-on');
          io.disconnect(); // draws once
        }
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="fx-divider" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 1600 44" preserveAspectRatio="none">
        <path
          className="fx-divider__bolt"
          d="M0,22 L180,22 L210,8 L245,34 L275,14 L305,22 L520,22 L555,36 L585,10 L615,28 L645,22 L900,22 L935,6 L968,38 L1000,16 L1030,22 L1260,22 L1295,32 L1325,12 L1355,26 L1385,22 L1600,22"
        />
      </svg>
    </div>
  );
};

export default BoltDivider;
