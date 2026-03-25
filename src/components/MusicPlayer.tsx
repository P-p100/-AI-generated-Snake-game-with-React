import { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: 'ERR_NEON_DRIVE', artist: 'SYS.AI_SYNTH', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CYBER_PULSE.EXE', artist: 'SYS.AI_DARK', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'HORIZON_CORRUPTED', artist: 'SYS.AI_RETRO', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrack((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrack((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const track = TRACKS[currentTrack];

  return (
    <div className="bg-black p-6 w-full max-w-sm relative overflow-hidden text-cyan-400 font-mono">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6 border-b-4 border-cyan-500 pb-2">
          <h2 className="text-fuchsia-500 font-bold text-3xl tracking-widest uppercase glitch" data-text="AUDIO_SUBSYS">
            AUDIO_SUBSYS
          </h2>
          <button onClick={toggleMute} className="text-cyan-400 hover:text-black hover:bg-cyan-500 px-2 py-1 border-2 border-cyan-500 uppercase text-xl transition-none">
            {isMuted ? '[MUTE: ON]' : '[MUTE: OFF]'}
          </button>
        </div>

        <div className="text-left mb-8 border-l-4 border-fuchsia-500 pl-4 bg-fuchsia-900/20 py-2">
          <div className="text-xl text-fuchsia-500 mb-1">&gt;&gt; TRACK_DATA_STREAM</div>
          <h3 className="text-4xl font-bold text-cyan-300 uppercase truncate tear">{track.title}</h3>
          <p className="text-fuchsia-400 text-2xl uppercase mt-1">SRC: {track.artist}</p>
          <div className="text-lg text-cyan-500 mt-2 animate-pulse">
            {isPlaying ? '&gt;&gt; PLAYBACK_ACTIVE...' : '&gt;&gt; PLAYBACK_HALTED.'}
          </div>
        </div>

        <div className="h-6 bg-black border-2 border-cyan-500 mb-6 cursor-pointer relative" onClick={handleProgressClick}>
          <div className="absolute top-0 left-0 h-full bg-fuchsia-600" style={{ width: `${progress}%` }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50 pointer-events-none"></div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button onClick={prevTrack} className="flex-1 py-3 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black uppercase text-2xl font-bold transition-none">
            &lt;&lt; PREV
          </button>
          
          <button onClick={togglePlay} className="flex-1 py-3 border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black uppercase text-2xl font-bold transition-none glitch" data-text={isPlaying ? 'HALT' : 'EXEC'}>
            {isPlaying ? 'HALT' : 'EXEC'}
          </button>

          <button onClick={nextTrack} className="flex-1 py-3 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black uppercase text-2xl font-bold transition-none">
            NEXT &gt;&gt;
          </button>
        </div>

        <audio ref={audioRef} src={track.url} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />
      </div>
    </div>
  );
}
