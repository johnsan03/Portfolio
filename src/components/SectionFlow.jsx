import { Children } from 'react';
import SectionReveal from './SectionReveal';
import BoltDivider from './BoltDivider';

/**
 * Wraps each section in its own scroll reveal and puts a thin bolt rule
 * between them. Adds no meaningful height to the page.
 *
 * The first child (the hero) is not revealed — it is above the fold on load,
 * so cracking it open would just delay first paint of the main content.
 */
const SectionFlow = ({ children }) => {
  const items = Children.toArray(children).filter(Boolean);

  return items.flatMap((child, index) => {
    const node = (
      <SectionReveal key={`reveal-${index}`} disabled={index === 0}>
        {child}
      </SectionReveal>
    );
    if (index === 0) return [node];
    return [<BoltDivider key={`rule-${index}`} />, node];
  });
};

export default SectionFlow;
