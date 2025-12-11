import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRandom, FaQuoteLeft, FaCode, FaSmile } from 'react-icons/fa';

const devQuotes = [
  'Programs must be written for people to read, and only incidentally for machines to execute. – Harold Abelson',
  'Simplicity is prerequisite for reliability. – Edsger W. Dijkstra',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand. – Martin Fowler',
  'Before software can be reusable it first has to be usable. – Ralph Johnson',
  'The most disastrous thing that you can ever learn is your first programming language. – Alan Kay',
  'First, solve the problem. Then, write the code. – John Johnson',
  'Fix the cause, not the symptom. – Steve Maguire',
  'Code is like humor. When you have to explain it, it\'s bad. – Cory House',
  'The best way to get a project done faster is to start sooner. – Jim Highsmith',
  'The only way to learn a new programming language is by writing programs in it. – Dennis Ritchie',
];

const funQuotes = [
  'To iterate is human, to recurse divine.',
  'There are only two hard things in Computer Science: cache invalidation, naming things, and off-by-one errors.',
  'It works on my machine.',
  'I have a joke about UDP, but you might not get it.',
  'Debugging: like being the detective in a crime movie where you are also the murderer.',
  'There are 10 kinds of people in the world: those who understand binary and those who don\'t.',
  'If at first you don\'t succeed; call it version 1.0.',
  'Why do programmers prefer dark mode? Because light attracts bugs.',
  'A SQL query goes into a bar, walks up to two tables and asks: "Can I join you?"',
  'How many programmers does it take to change a light bulb? None, that\'s a hardware problem.',
];

const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

const getNextSequential = (pool, lastIndex) => {
  if (!pool.length) return { nextQuote: null, nextIndex: lastIndex };
  if (pool.length === 1) return { nextQuote: pool[0], nextIndex: 0 };
  const nextIndex = (lastIndex + 1) % pool.length;
  return { nextQuote: pool[nextIndex], nextIndex };
};

const Quotes = () => {
  const [quote, setQuote] = useState(() => pickRandom([...devQuotes, ...funQuotes]));
  const [lastIndexDev, setLastIndexDev] = useState(-1);
  const [lastIndexFun, setLastIndexFun] = useState(-1);
  const [isDev, setIsDev] = useState(true);

  const currentList = useMemo(() => (isDev ? devQuotes : funQuotes), [isDev]);

  const refreshQuote = () => {
    const pool = currentList;
    const { nextQuote, nextIndex } = getNextSequential(pool, isDev ? lastIndexDev : lastIndexFun);
    if (nextQuote === null) return;
    setQuote(nextQuote);
    if (isDev) setLastIndexDev(nextIndex);
    else setLastIndexFun(nextIndex);
  };

  return (
    <section id="quotes" className="quotes">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Quotes
        </motion.h2>

        <motion.div
          className="quotes-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="quotes-header">
            <div className="quote-type-toggle">
              <button
                className={`quote-type ${isDev ? 'active' : ''}`}
                onClick={() => {
                  setIsDev(true);
                  const { nextQuote, nextIndex } = getNextSequential(devQuotes, lastIndexDev);
                  if (nextQuote !== null) {
                    setQuote(nextQuote);
                    setLastIndexDev(nextIndex);
                  }
                }}
              >
                <FaCode /> Dev Quotes
              </button>
              <button
                className={`quote-type ${!isDev ? 'active' : ''}`}
                onClick={() => {
                  setIsDev(false);
                  const { nextQuote, nextIndex } = getNextSequential(funQuotes, lastIndexFun);
                  if (nextQuote !== null) {
                    setQuote(nextQuote);
                    setLastIndexFun(nextIndex);
                  }
                }}
              >
                <FaSmile /> Fun Quotes
              </button>
            </div>
            <button className="refresh-btn" onClick={refreshQuote} aria-label="New quote">
              <FaRandom />
            </button>
          </div>

          <motion.div
            key={quote}
            className="quote-body"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <FaQuoteLeft className="quote-icon" />
            <p>{quote}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Quotes;
