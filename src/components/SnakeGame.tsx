import { useState, useEffect } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

const generateFood = (currentSnake: {x: number, y: number}[]) => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = nextDirection;
        setDirection(currentDir);
        
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [nextDirection, food, gameOver, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted) {
        if (gameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      if (isPaused || gameOver) return;

      setNextDirection(prevNextDir => {
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            return direction.y !== 1 ? { x: 0, y: -1 } : prevNextDir;
          case 'ArrowDown':
          case 's':
          case 'S':
            return direction.y !== -1 ? { x: 0, y: 1 } : prevNextDir;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            return direction.x !== 1 ? { x: -1, y: 0 } : prevNextDir;
          case 'ArrowRight':
          case 'd':
          case 'D':
            return direction.x !== -1 ? { x: 1, y: 0 } : prevNextDir;
          default:
            return prevNextDir;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isPaused, gameOver, hasStarted]);

  const startGame = () => {
    setHasStarted(true);
    setIsPaused(false);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood({ x: 15, y: 5 });
    setIsPaused(false);
    setHasStarted(false);
  };

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center w-full max-w-md bg-black text-cyan-400 font-mono p-2">
      <div className="flex justify-between w-full mb-4 px-4 py-2 border-b-4 border-fuchsia-500 bg-black">
        <div className="flex flex-col">
          <span className="text-xl text-fuchsia-500 uppercase">&gt;&gt; YIELD</span>
          <span className="text-4xl font-bold text-cyan-400">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xl text-fuchsia-500 uppercase">&gt;&gt; MAX_YIELD</span>
          <span className="text-4xl font-bold text-cyan-400">{highScore}</span>
        </div>
      </div>

      <div 
        className="relative w-full aspect-square bg-black border-4 border-cyan-500 overflow-hidden" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.2) 1px, transparent 1px)', 
          backgroundSize: '5% 5%' 
        }}
      >
        <div 
          className="absolute bg-fuchsia-600 border-2 border-fuchsia-300 animate-pulse"
          style={{
            left: `${food.x * 5}%`,
            top: `${food.y * 5}%`,
            width: '5%',
            height: '5%'
          }}
        />

        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div 
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute border-2 border-black ${
                isHead 
                  ? 'bg-cyan-300 z-10' 
                  : 'bg-cyan-600'
              }`}
              style={{
                left: `${segment.x * 5}%`,
                top: `${segment.y * 5}%`,
                width: '5%',
                height: '5%'
              }}
            />
          )
        })}

        {!hasStarted && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-fuchsia-600 m-4 tear">
            <button 
              onClick={startGame}
              className="px-8 py-4 bg-black border-4 border-cyan-500 text-cyan-400 text-3xl uppercase hover:bg-cyan-500 hover:text-black glitch transition-none" 
              data-text="INITIATE_SEQ"
            >
              INITIATE_SEQ
            </button>
            <p className="mt-6 text-fuchsia-500 text-xl uppercase animate-pulse">&gt;&gt; INPUT: WASD / ARROWS</p>
          </div>
        )}

        {hasStarted && isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-cyan-600 m-4">
            <div className="text-fuchsia-500 text-5xl uppercase glitch" data-text="SYS_HALTED">
              SYS_HALTED
            </div>
            <p className="mt-4 text-cyan-400 text-2xl uppercase animate-pulse">&gt;&gt; AWAITING_SPACE_INPUT</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-red-600 m-4 tear" style={{ animationDuration: '0.2s' }}>
            <h3 className="text-6xl text-red-500 uppercase glitch mb-4" data-text="FATAL_ERR">
              FATAL_ERR
            </h3>
            <p className="text-cyan-400 text-3xl mb-8 uppercase">&gt;&gt; YIELD: {score}</p>
            <button 
              onClick={resetGame}
              className="px-8 py-4 bg-black border-4 border-red-500 text-red-500 text-3xl uppercase hover:bg-red-500 hover:text-black transition-none"
            >
              REBOOT_SYS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
