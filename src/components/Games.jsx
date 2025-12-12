import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaMemory, FaBug, FaTrophy, FaPlay, FaRedo, FaTimes } from 'react-icons/fa';

const Games = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'typing',
      name: 'Code Typing Challenge',
      icon: <FaCode />,
      description: 'Type code snippets as fast as you can!',
      color: '#6366f1'
    },
    {
      id: 'memory',
      name: 'Memory Match',
      icon: <FaMemory />,
      description: 'Match pairs of tech stack cards',
      color: '#8b5cf6'
    },
    {
      id: 'bug',
      name: 'Bug Hunter',
      icon: <FaBug />,
      description: 'Click bugs (errors) before they escape!',
      color: '#ec4899'
    }
  ];

  return (
    <section id="games" className="games">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Developer Challenges
        </motion.h2>
        <motion.p
          className="section-subtitle"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Test your skills with these fun interactive challenges!
        </motion.p>

        {!activeGame ? (
          <div className="games-grid">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                className="game-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02
                }}
                onClick={() => setActiveGame(game.id)}
              >
                <div className="game-icon" style={{ color: game.color }}>
                  {game.icon}
                </div>
                <h3>{game.name}</h3>
                <p>{game.description}</p>
                <motion.button
                  className="game-play-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaPlay /> Play Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <GameComponent 
            gameId={activeGame} 
            onBack={() => setActiveGame(null)}
          />
        )}
      </div>
    </section>
  );
};

// Individual Game Components
const GameComponent = ({ gameId, onBack }) => {
  if (gameId === 'typing') {
    return <TypingChallenge onBack={onBack} />;
  } else if (gameId === 'memory') {
    return <MemoryMatch onBack={onBack} />;
  } else if (gameId === 'bug') {
    return <BugHunter onBack={onBack} />;
  }
  return null;
};

// Typing Challenge Game
const TypingChallenge = ({ onBack }) => {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);
  const scoreRef = useRef(0);

  const codeSnippets = [
    'const greet = (name) => { return `Hello, ${name}!`; }',
    'function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }',
    'const users = data.filter(user => user.active).map(user => user.name);',
    'async function fetchData() { const response = await fetch(url); return response.json(); }',
    'const sum = numbers.reduce((acc, num) => acc + num, 0);',
    'class Component extends React.Component { render() { return <div>Hello</div>; } }',
    'const doubled = array.map(item => item * 2);',
    'if (condition) { doSomething(); } else { doSomethingElse(); }',
  ];

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (userInput === codeSnippet && codeSnippet) {
      const words = codeSnippet.split(' ').length;
      scoreRef.current += words;
      setScore(scoreRef.current);
      setUserInput('');
      const newSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      setCodeSnippet(newSnippet);
    }
  }, [userInput, codeSnippet]);

  useEffect(() => {
    if (isPlaying && userInput) {
      const wordsTyped = userInput.split(' ').length;
      const timeElapsed = 60 - timeLeft;
      if (timeElapsed > 0) {
        setWpm(Math.round((wordsTyped / timeElapsed) * 60));
      }
      
      let correct = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === codeSnippet[i]) correct++;
      }
      setAccuracy(Math.round((correct / userInput.length) * 100) || 100);
    }
  }, [userInput, timeLeft, isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(60);
    scoreRef.current = 0;
    setScore(0);
    setUserInput('');
    setWpm(0);
    setAccuracy(100);
    const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    setCodeSnippet(snippet);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (e) => {
    if (!isPlaying) return;
    setUserInput(e.target.value);
  };

  return (
    <motion.div
      className="game-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>
          <FaTimes /> Back
        </button>
        <h3>Code Typing Challenge</h3>
        <div className="game-stats">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
          <span>WPM: {wpm}</span>
          <span>Accuracy: {accuracy}%</span>
        </div>
      </div>

      <div className="typing-game">
        {!isPlaying ? (
          <div className="game-start">
            <FaCode className="start-icon" />
            <h3>Ready to test your typing speed?</h3>
            <p>Type the code snippets as fast and accurately as you can!</p>
            <motion.button
              className="start-game-btn"
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay /> Start Game
            </motion.button>
          </div>
        ) : (
          <>
            <div className="code-display">
              {codeSnippet.split('').map((char, index) => {
                const isCorrect = userInput[index] === char;
                const isCurrent = index === userInput.length;
                const isWrong = userInput[index] && userInput[index] !== char;
                
                return (
                  <span
                    key={index}
                    className={`char ${isCurrent ? 'current' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                  >
                    {char}
                  </span>
                );
              })}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="typing-input"
              placeholder="Start typing..."
              autoFocus
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

// Memory Match Game
const MemoryMatch = ({ onBack }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const techStack = ['React', 'Node', 'Python', 'Java', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS'];

  useEffect(() => {
    // Game completion is handled in the render
  }, [matchedPairs, moves, isGameStarted]);

  const initializeGame = () => {
    const gameCards = [...techStack, ...techStack]
      .map((tech, index) => ({ id: index, tech, flipped: false }))
      .sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setIsGameStarted(true);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || matchedPairs.includes(cards[cardId].tech)) return;

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      if (cards[first].tech === cards[second].tech) {
        setMatchedPairs([...matchedPairs, cards[first].tech]);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  return (
    <motion.div
      className="game-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>
          <FaTimes /> Back
        </button>
        <h3>Memory Match</h3>
        <div className="game-stats">
          <span>Moves: {moves}</span>
          <span>Pairs: {matchedPairs.length}/{techStack.length}</span>
        </div>
      </div>

      {!isGameStarted ? (
        <div className="game-start">
          <FaMemory className="start-icon" />
          <h3>Match the Tech Stack Cards!</h3>
          <p>Find all matching pairs with the fewest moves possible.</p>
          <motion.button
            className="start-game-btn"
            onClick={initializeGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay /> Start Game
          </motion.button>
        </div>
      ) : (
        <div className="memory-grid">
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedPairs.includes(card.tech);
            return (
              <motion.div
                key={card.id}
                className={`memory-card ${isFlipped ? 'flipped' : ''}`}
                onClick={() => handleCardClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card-front">?</div>
                <div className="card-back">{card.tech}</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {matchedPairs.length === techStack.length && (
        <motion.div
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FaTrophy className="trophy-icon" />
          <h3>Congratulations!</h3>
          <p>You completed the game in {moves} moves!</p>
          <motion.button
            className="restart-btn"
            onClick={initializeGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRedo /> Play Again
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Bug Hunter Game
const BugHunter = ({ onBack }) => {
  const [bugs, setBugs] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [missed, setMissed] = useState(0);
  const gameAreaRef = useRef(null);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (!isPlaying) return;

    const spawnBug = () => {
      if (gameAreaRef.current) {
        const area = gameAreaRef.current.getBoundingClientRect();
        const newBug = {
          id: Date.now(),
          x: Math.random() * (area.width - 60),
          y: Math.random() * (area.height - 60),
          speed: Math.random() * 2 + 1,
        };
        setBugs(prev => [...prev, newBug]);

        setTimeout(() => {
          setBugs(prev => {
            const updated = prev.filter(b => b.id !== newBug.id);
            if (updated.length !== prev.length) {
              setMissed(missed + 1);
            }
            return updated;
          });
        }, 3000);
      }
    };

    const interval = setInterval(spawnBug, 1500);
    return () => clearInterval(interval);
  }, [isPlaying, missed]);

  useEffect(() => {
    if (isPlaying) {
      const moveBugs = setInterval(() => {
        setBugs(prev => prev.map(bug => ({
          ...bug,
          x: bug.x + (Math.random() - 0.5) * bug.speed * 10,
          y: bug.y + (Math.random() - 0.5) * bug.speed * 10,
        })));
      }, 100);
      return () => clearInterval(moveBugs);
    }
  }, [isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setBugs([]);
    setMissed(0);
  };

  const killBug = (bugId) => {
    setBugs(prev => prev.filter(b => b.id !== bugId));
    setScore(prev => prev + 10);
  };

  return (
    <motion.div
      className="game-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>
          <FaTimes /> Back
        </button>
        <h3>Bug Hunter</h3>
        <div className="game-stats">
          <span>Time: {timeLeft}s</span>
          <span>Score: {score}</span>
          <span>Missed: {missed}</span>
        </div>
      </div>

      {!isPlaying ? (
        <div className="game-start">
          <FaBug className="start-icon" />
          <h3>Hunt the Bugs!</h3>
          <p>Click on bugs (errors) before they escape. You have 30 seconds!</p>
          <motion.button
            className="start-game-btn"
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay /> Start Game
          </motion.button>
        </div>
      ) : (
        <div className="bug-hunter-area" ref={gameAreaRef}>
          <AnimatePresence>
            {bugs.map(bug => (
              <motion.div
                key={bug.id}
                className="bug"
                style={{ left: bug.x, top: bug.y }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 360,
                  x: [0, 10, -10, 0],
                  y: [0, -10, 10, 0]
                }}
                exit={{ scale: 0, rotate: -360 }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  x: { duration: 1, repeat: Infinity },
                  y: { duration: 1, repeat: Infinity }
                }}
                onClick={() => killBug(bug.id)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                <FaBug />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!isPlaying && score > 0 && (
        <motion.div
          className="game-complete"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FaTrophy className="trophy-icon" />
          <h3>Game Over!</h3>
          <p>Final Score: {score}</p>
          <p>Bugs Caught: {score / 10} | Missed: {missed}</p>
          <motion.button
            className="restart-btn"
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRedo /> Play Again
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Games;

