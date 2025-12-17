import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaMemory, FaBug, FaTrophy, FaPlay, FaRedo, FaTimes, FaGamepad, FaHandRock, FaHandPaper, FaHandScissors, FaCircle } from 'react-icons/fa';
import { GiSnake } from "react-icons/gi";
import { SiXo } from "react-icons/si";
const Games = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'typing',
      name: 'Code Typing Challenge',
      icon: <FaCode />,
      description: 'Type code snippets as fast as you can!',
      color: 'var(--accent-primary)'
    },
    {
      id: 'memory',
      name: 'Memory Match',
      icon: <FaMemory />,
      description: 'Match pairs of tech stack cards',
      color: 'var(--accent-secondary)'
    },
    {
      id: 'bug',
      name: 'Bug Hunter',
      icon: <FaBug />,
      description: 'Click bugs (errors) before they escape!',
      color: '#ec4899'
    },
    {
      id: 'tictactoe',
      name: 'Tic-Tac-Toe',
      icon: <SiXo />,
      description: 'Classic X and O game - Play against AI!',
      color: '#10b981'
    },
    {
      id: 'rps',
      name: 'Rock Paper Scissors',
      icon: <FaHandRock />,
      description: 'Classic hand game - Beat the AI!',
      color: '#f59e0b'
    },
    {
      id: 'snake',
      name: 'Snake Game',
      icon: <GiSnake />,
      description: 'Classic arcade game - Eat food and grow!',
      color: '#06b6d4'
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
          Developer Challenges <FaGamepad className="games-title-icon" />
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

        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div
              key="games-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
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
                      scale: 1.05,
                      y: -5,
                      boxShadow: `0 10px 30px ${game.color}40`
                    }}
                    onClick={() => setActiveGame(game.id)}
                    whileTap={{ scale: 0.98 }}
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
            </motion.div>
          ) : (
            <motion.div
              key="game-component"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <GameComponent 
                gameId={activeGame} 
                onBack={() => {
                  setActiveGame(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
  } else if (gameId === 'tictactoe') {
    return <TicTacToe onBack={onBack} />;
  } else if (gameId === 'rps') {
    return <RockPaperScissors onBack={onBack} />;
  } else if (gameId === 'snake') {
    return <SnakeGame onBack={onBack} />;
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
      // Add a small delay for visual feedback
      setTimeout(() => {
        const newSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        setCodeSnippet(newSnippet);
      }, 300);
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
        <button 
          className="back-btn" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onBack) {
              onBack();
            }
          }}
          style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
        >
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
                  <motion.span
                    key={index}
                    className={`char ${isCurrent ? 'current' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: isCurrent ? 1.2 : 1,
                      backgroundColor: isCurrent ? 'rgba(14, 165, 233, 0.18)' : 'transparent'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {char}
                  </motion.span>
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
        // Match found - add visual feedback
        setTimeout(() => {
          setMatchedPairs([...matchedPairs, cards[first].tech]);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match - flip back after delay
        setTimeout(() => setFlippedCards([]), 1200);
      }
    }
  };

  return (
    <motion.div
      className="game-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="game-header" style={{ position: 'relative', zIndex: 2000 }}>
        <button 
          className="back-btn" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onBack) {
              onBack();
            }
          }}
          style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
        >
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
                whileHover={{ scale: 1.08, zIndex: 10 }}
                whileTap={{ scale: 0.92 }}
                initial={{ rotateY: 0, scale: 0.8, opacity: 0 }}
                animate={{ 
                  rotateY: isFlipped ? 180 : 0,
                  scale: 1,
                  opacity: 1
                }}
                transition={{ 
                  rotateY: { duration: 0.4, ease: "easeInOut" },
                  scale: { duration: 0.2 },
                  opacity: { duration: 0.2 }
                }}
              >
                <div className="card-front">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    ?
                  </motion.span>
                </div>
                <div className="card-back">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {card.tech}
                  </motion.span>
                </div>
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
        <button 
          className="back-btn" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onBack) {
              onBack();
            }
          }}
          style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
        >
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
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: 360,
                  x: [0, 10, -10, 0],
                  y: [0, -10, 10, 0],
                  opacity: 1
                }}
                exit={{ 
                  scale: 0, 
                  rotate: -360,
                  opacity: 0,
                  filter: "blur(10px)"
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  x: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
                }}
                onClick={() => killBug(bug.id)}
                whileHover={{ scale: 1.3, zIndex: 20 }}
                whileTap={{ scale: 0.7 }}
              >
                <motion.div
                  animate={{ 
                    filter: [
                      "hue-rotate(0deg)",
                      "hue-rotate(90deg)",
                      "hue-rotate(180deg)",
                      "hue-rotate(270deg)",
                      "hue-rotate(360deg)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <FaBug />
                </motion.div>
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

// Tic-Tac-Toe Game
const TicTacToe = ({ onBack }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState(null); // 'player' or 'ai'
  const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares) => {
    return squares.every(square => square !== null);
  };

  const minimax = (squares, isMaximizing) => {
    const winner = calculateWinner(squares);
    
    if (winner === 'O') return 10;
    if (winner === 'X') return -10;
    if (isBoardFull(squares)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'O';
          const score = minimax(squares, false);
          squares[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = 'X';
          const score = minimax(squares, true);
          squares[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getBestMove = (squares) => {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        const score = minimax(squares, false);
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const handleClick = (index) => {
    if (board[index] || winner || !gameMode) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      if (gameMode === 'ai') {
        if (newWinner === 'X') {
          setScores(prev => ({ ...prev, player: prev.player + 1 }));
        } else {
          setScores(prev => ({ ...prev, ai: prev.ai + 1 }));
        }
      }
    } else if (isBoardFull(newBoard)) {
      setWinner('draw');
      if (gameMode === 'ai') {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    }
  };

  useEffect(() => {
    if (gameMode === 'ai' && !isXNext && !winner) {
      // AI's turn - check if board is full
      const boardCopy = [...board];
      if (isBoardFull(boardCopy)) {
        setWinner('draw');
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
        return;
      }

      // AI's turn
      const timer = setTimeout(() => {
        setBoard(currentBoard => {
          const currentBoardCopy = [...currentBoard];
          const aiMove = getBestMove(currentBoardCopy);
          if (aiMove !== null) {
            currentBoardCopy[aiMove] = 'O';
            setIsXNext(true);

            const newWinner = calculateWinner(currentBoardCopy);
            if (newWinner) {
              setWinner(newWinner);
              if (newWinner === 'O') {
                setScores(prev => ({ ...prev, ai: prev.ai + 1 }));
              } else if (newWinner === 'X') {
                setScores(prev => ({ ...prev, player: prev.player + 1 }));
              }
            } else if (isBoardFull(currentBoardCopy)) {
              setWinner('draw');
              setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
            }
            return currentBoardCopy;
          }
          return currentBoard;
        });
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, gameMode]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const startGame = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  return (
    <motion.div
      className="game-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="game-header">
        <button 
          className="back-btn" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onBack) {
              onBack();
            }
          }}
          style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
        >
          <FaTimes /> Back
        </button>
        <h3>Tic-Tac-Toe</h3>
        {gameMode && (
          <div className="game-stats">
            <span>Turn: {isXNext ? 'X' : 'O'}</span>
            {gameMode === 'ai' && (
              <>
                <span>You: {scores.player}</span>
                <span>AI: {scores.ai}</span>
                <span>Draws: {scores.draws}</span>
              </>
            )}
          </div>
        )}
      </div>

      {!gameMode ? (
        <div className="game-start">
          <FaGamepad className="start-icon" />
          <h3>Choose Your Mode!</h3>
          <p>Play against a friend or challenge the AI</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              className="start-game-btn"
              onClick={() => startGame('player')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay /> Player vs Player
            </motion.button>
            <motion.button
              className="start-game-btn"
              onClick={() => startGame('ai')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay /> Play vs AI
            </motion.button>
          </div>
        </div>
      ) : (
        <>
          <div className="tictactoe-board">
            {board.map((cell, index) => (
              <motion.button
                key={index}
                className={`tictactoe-cell ${cell ? 'filled' : ''}`}
                onClick={() => handleClick(index)}
                disabled={!!cell || !!winner || (gameMode === 'ai' && !isXNext)}
                whileHover={!cell && !winner && (gameMode !== 'ai' || isXNext) ? { scale: 1.1 } : {}}
                whileTap={!cell && !winner ? { scale: 0.9 } : {}}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05, type: "spring" }}
              >
                {cell && (
                  <motion.span
                    className={`tictactoe-mark ${cell}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    {cell}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>

          {winner && (
            <motion.div
              className="game-complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FaTrophy className="trophy-icon" />
              <h3>
                {winner === 'draw' 
                  ? "It's a Draw!" 
                  : winner === 'X' 
                    ? (gameMode === 'ai' ? 'You Win! 🎉' : 'Player X Wins! 🎉')
                    : (gameMode === 'ai' ? 'AI Wins! 🤖' : 'Player O Wins! 🎉')}
              </h3>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  className="restart-btn"
                  onClick={resetGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRedo /> Play Again
                </motion.button>
                <motion.button
                  className="restart-btn"
                  onClick={() => {
                    setGameMode(null);
                    setScores({ player: 0, ai: 0, draws: 0 });
                    resetGame();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Change Mode
                </motion.button>
              </div>
            </motion.div>
          )}

          {!winner && (
            <motion.button
              className="restart-btn"
              onClick={resetGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ marginTop: '1rem' }}
            >
              <FaRedo /> Reset Game
            </motion.button>
          )}
        </>
      )}
    </motion.div>
  );
};

// Rock Paper Scissors Game
const RockPaperScissors = ({ onBack }) => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [aiChoice, setAiChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, ai: 0, draws: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [finishPopup, setFinishPopup] = useState(false);
  const timersRef = useRef({ ai: null, result: null });

  const choices = [
    { name: 'rock', icon: <FaHandRock />, beats: 'scissors' },
    { name: 'paper', icon: <FaHandPaper />, beats: 'rock' },
    { name: 'scissors', icon: <FaHandScissors />, beats: 'paper' }
  ];

  const playRound = (playerSelection) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(playerSelection);
    setAiChoice(null);
    setResult(null);

    // Animate AI thinking
    if (timersRef.current.ai) clearTimeout(timersRef.current.ai);
    if (timersRef.current.result) clearTimeout(timersRef.current.result);
    timersRef.current.ai = setTimeout(() => {
      const aiSelection = choices[Math.floor(Math.random() * choices.length)];
      setAiChoice(aiSelection);

      // Determine winner
      timersRef.current.result = setTimeout(() => {
        let roundResult;
        if (playerSelection.name === aiSelection.name) {
          roundResult = 'draw';
          setScore(prev => ({ ...prev, draws: prev.draws + 1 }));
        } else if (playerSelection.beats === aiSelection.name) {
          roundResult = 'win';
          setScore(prev => ({ ...prev, player: prev.player + 1 }));
        } else {
          roundResult = 'lose';
          setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
        }
        setResult(roundResult);
        setIsAnimating(false);
      }, 500);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timersRef.current.ai) clearTimeout(timersRef.current.ai);
      if (timersRef.current.result) clearTimeout(timersRef.current.result);
    };
  }, []);

  const resetRound = () => {
    if (timersRef.current.ai) clearTimeout(timersRef.current.ai);
    if (timersRef.current.result) clearTimeout(timersRef.current.result);
    setPlayerChoice(null);
    setAiChoice(null);
    setResult(null);
    setIsAnimating(false);
  };

  const finishMatch = () => {
    setFinishPopup(true);
    // Stop any pending “thinking” UI
    setIsAnimating(false);
  };

  const resetMatch = () => {
    resetRound();
    setScore({ player: 0, ai: 0, draws: 0 });
    setFinishPopup(false);
  };

  return (
    <motion.div
      className="game-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ position: 'relative' }}
    >
      <div className="game-header" style={{ position: 'relative', zIndex: 2000 }}>
        <button 
          className="back-btn" 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onBack) onBack();
          }}
          style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
        >
          <FaTimes /> Back
        </button>
        <h3>Rock Paper Scissors</h3>
        <div className="game-stats">
          <span>You: {score.player}</span>
          <span>AI: {score.ai}</span>
          <span>Draws: {score.draws}</span>
        </div>
      </div>

      <div className="rps-game" style={{ position: 'relative', zIndex: 1, minHeight: '400px' }}>
        {/* <div className="rps-actions">
          <motion.button
            type="button"
            className="restart-btn"
            onClick={finishMatch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isAnimating}
            title="Finish the match"
          >
            <FaTrophy /> Finish Match
          </motion.button>
          <motion.button
            type="button"
            className="restart-btn"
            onClick={resetMatch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Reset match score"
          >
            <FaRedo /> Reset Match
          </motion.button>
        </div> */}

        <AnimatePresence mode="wait">
          {!playerChoice ? (
            <motion.div
              key="choices"
              className="rps-choices"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>Choose your weapon!</h3>
              <div className="rps-buttons">
                {choices.map((choice) => (
                  <motion.button
                    key={choice.name}
                    className="rps-choice-btn"
                    onClick={() => playRound(choice)}
                    disabled={isAnimating}
                    whileHover={!isAnimating ? { scale: 1.1, rotate: [0, -10, 10, -10, 0] } : {}}
                    whileTap={!isAnimating ? { scale: 0.9 } : {}}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="rps-icon">{choice.icon}</div>
                    <span>{choice.name.charAt(0).toUpperCase() + choice.name.slice(1)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              className="rps-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rps-comparison">
                <motion.div
                  className="rps-player-choice"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring" }}
                >
                  <div className="rps-icon-large">{playerChoice.icon}</div>
                  <p>You</p>
                </motion.div>

                <motion.div
                  className="rps-vs"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  VS
                </motion.div>

                <motion.div
                  className="rps-ai-choice"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  {aiChoice ? (
                    <>
                      <div className="rps-icon-large">{aiChoice.icon}</div>
                      <p>AI</p>
                    </>
                  ) : (
                    <div className="rps-thinking">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <FaHandRock />
                      </motion.div>
                      <p>Thinking...</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {result && (
                <motion.div
                  className={`rps-result-message ${result}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", delay: 0.5 }}
                  style={{ marginTop: '2rem' }}
                >
                  <h2>
                    {result === 'win' && '🎉 You Win!'}
                    {result === 'lose' && '😢 You Lose!'}
                    {result === 'draw' && "🤝 It's a Draw!"}
                  </h2>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                    <motion.button
                      className="restart-btn"
                      onClick={resetRound}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaRedo /> Play Again
                    </motion.button>
                  </div>
                </motion.div>
              )}
              
              {!result && aiChoice && (
                <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
                  <p>Determining winner...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {finishPopup && (
            <motion.div
              className="finish-popup"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-label="Match finished"
            >
              <div className="finish-popup-title">
                <FaTrophy /> Match Finished
              </div>
              <div className="finish-popup-body">
                <div><strong>You</strong>: {score.player}</div>
                <div><strong>AI</strong>: {score.ai}</div>
                <div><strong>Draws</strong>: {score.draws}</div>
              </div>
              <div className="finish-popup-actions">
                <button
                  type="button"
                  className="finish-popup-btn"
                  onClick={() => setFinishPopup(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="finish-popup-btn primary"
                  onClick={() => {
                    setFinishPopup(false);
                    if (onBack) onBack();
                  }}
                >
                  Back to Challenges
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Snake Game
const SnakeGame = ({ onBack }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(150);
  const gameAreaRef = useRef(null);
  const [finishPopup, setFinishPopup] = useState(false);

  const GRID_SIZE = 20;
  const CELL_SIZE = 20;


  const checkCollision = (head, snakeBody) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    for (let i = 1; i < snakeBody.length; i++) {
      if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (isPaused || gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        head.x += direction.x;
        head.y += direction.y;

        if (checkCollision(head, prevSnake)) {
          setGameOver(true);
          setIsPaused(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 10);
          setFood(prevFood => {
            const newFood = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE)
            };
            // Make sure food doesn't spawn on snake
            const isOnSnake = newSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
            if (isOnSnake) {
              // Try again
              return {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
              };
            }
            return newFood;
          });
          // Increase speed slightly
          setSpeed(prevSpeed => prevSpeed > 80 ? prevSpeed - 2 : prevSpeed);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameLoop);
  }, [direction, food, isPaused, gameOver, speed]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isPaused && !gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPaused, gameOver]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setSpeed(150);
    setFinishPopup(false);
  };

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPaused(true);
    setSpeed(150);
    setFinishPopup(false);
  };

  const finishGame = () => {
    setIsPaused(true);
    setFinishPopup(true);
  };

  return (
    <motion.div
      className="game-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="game-header">
        <button 
          className="back-btn" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onBack) {
              onBack();
            }
          }}
          style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
        >
          <FaTimes /> Back
        </button>
        <h3>Snake Game</h3>
        <div className="game-stats">
          <span>Score: {score}</span>
          <span>{isPaused && !gameOver ? 'Paused' : gameOver ? 'Game Over' : 'Playing'}</span>
        </div>
      </div>

      <div className="snake-game-area">
        {isPaused && !gameOver ? (
          <div className="game-start">
            <FaCircle className="start-icon" />
            <h3>Ready to Play Snake?</h3>
            <p>Use arrow keys to move. Press space to pause.</p>
            <motion.button
              className="start-game-btn"
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlay /> Start Game
            </motion.button>
          </div>
        ) : gameOver ? (
          <motion.div
            className="game-complete"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FaTrophy className="trophy-icon" />
            <h3>Game Over!</h3>
            <p>Final Score: {score}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                className="restart-btn"
                onClick={startGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaRedo /> Play Again
              </motion.button>
              <motion.button
                className="restart-btn"
                onClick={resetGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="snake-board" ref={gameAreaRef}>
            <div
              className="snake-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                gap: '1px',
                backgroundColor: 'var(--border-color)',
                padding: '1px'
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);
                const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                const isHead = snake[0].x === x && snake[0].y === y;
                const isFood = food.x === x && food.y === y;

                return (
                  <div
                    key={index}
                    className={`snake-cell ${isHead ? 'snake-head' : isSnake ? 'snake-body' : ''} ${isFood ? 'snake-food' : ''}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!isPaused && !gameOver && (
        <div className="snake-controls">
          <div className="snake-actions">
            <motion.button
              type="button"
              className="restart-btn"
              onClick={finishGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Finish game and reveal final score"
            >
              <FaTrophy /> Finish Game
            </motion.button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Use Arrow Keys to Move • Press Space to Pause
          </p>
        </div>
      )}

      <AnimatePresence>
        {finishPopup && (
          <motion.div
            className="finish-popup"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Game finished"
          >
            <div className="finish-popup-title">
              <FaTrophy /> Game Finished
            </div>
            <div className="finish-popup-body">
              <div><strong>Score</strong>: {score}</div>
              <div><strong>Snake Length</strong>: {snake.length}</div>
            </div>
            <div className="finish-popup-actions">
              <button
                type="button"
                className="finish-popup-btn"
                onClick={() => setFinishPopup(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="finish-popup-btn primary"
                onClick={() => {
                  setFinishPopup(false);
                  if (onBack) onBack();
                }}
              >
                Back to Challenges
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Games;

