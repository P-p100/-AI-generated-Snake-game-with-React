import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black bg-static flex flex-col font-mono text-cyan-400 overflow-hidden relative">
      <div className="scanline"></div>
      
      <header className="w-full p-4 border-b-4 border-fuchsia-600 flex items-center justify-between bg-black z-10">
        <h1 className="text-4xl font-bold glitch uppercase tracking-widest" data-text="SYS.SNAKE_PROTOCOL">
          SYS.SNAKE_PROTOCOL
        </h1>
        <div className="text-fuchsia-500 text-2xl animate-pulse">
          [STATUS: ONLINE]
        </div>
      </header>

      <main className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-8 p-4 md:p-8 z-10">
        <div className="flex-1 flex justify-center w-full max-w-2xl border-4 border-cyan-500 p-2 tear bg-black/80 relative">
          <div className="absolute top-0 right-0 bg-cyan-500 text-black px-2 text-sm z-30">SEC_01</div>
          <SnakeGame />
        </div>
        
        <div className="xl:w-96 flex justify-center border-4 border-fuchsia-500 p-2 tear bg-black/80 relative" style={{animationDelay: '0.5s'}}>
          <div className="absolute top-0 right-0 bg-fuchsia-500 text-black px-2 text-sm z-30">SEC_02</div>
          <MusicPlayer />
        </div>
      </main>
      
      <footer className="w-full p-2 border-t-4 border-cyan-800 text-center text-xl text-cyan-700 bg-black z-10">
        WARNING: UNAUTHORIZED ACCESS DETECTED. INITIATING COUNTERMEASURES.
      </footer>
    </div>
  );
}
