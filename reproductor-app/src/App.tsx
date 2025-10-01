import { useEffect, useState } from 'react';
import { useLibrary } from './useLibrary';
import { usePlaylist, type RepeatMode } from './usePlaylist';
import { useAudioPlayer } from './useAudioPlayer';

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh > 0) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};

import { FolderIcon, LoopIcon, MutedIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, ShuffleIcon, VolumeIcon } from './Icons';
function App() {
  const {
    library,
    filteredLibrary,
    searchTerm,
    setSearchTerm,
    fileInputRef,
    handleFolderSelection,
    triggerFolderSelector,
  } = useLibrary();

  const {
    currentSong,
    nextSong,
    prevSong,
    playSongNow,
    isShuffle,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
  } = usePlaylist(filteredLibrary);

  const {
    audioRef,
    isPlaying,
    duration,
    currentTime,
    volume,
    togglePlay: baseTogglePlay,
    handleSeek,
    handleVolumeChange,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  } = useAudioPlayer(currentSong, nextSong, repeatMode);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(volume);

  useEffect(() => {
    return () => {
      library.forEach(song => URL.revokeObjectURL(song.url));
    };
  }, [library]);

  const togglePlay = () => {
    if (!currentSong && filteredLibrary.length > 0) {
      playSongNow(filteredLibrary[0]);
    } else {
      baseTogglePlay();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      // Si el volumen antes de silenciar era 0, restauramos a un valor por defecto (ej. 50%)
      const newVolume = volumeBeforeMute > 0 ? volumeBeforeMute : 0.5;
      handleVolumeChange({ target: { value: String(newVolume) } } as React.ChangeEvent<HTMLInputElement>);
      setIsMuted(false);
    } else {
      setVolumeBeforeMute(volume);
      handleVolumeChange({ target: { value: '0' } } as React.ChangeEvent<HTMLInputElement>);
      setIsMuted(true);
    }
  };

  useEffect(() => {
    setIsMuted(volume === 0);    
  }, [volume]);

  const getRepeatIcon = (mode: RepeatMode) => {
    if (mode === 'one') {
      return (
        <div className="relative">
          <LoopIcon />
          <span className="absolute -top-1 -right-1 text-xs font-bold text-purple-400">1</span>
        </div>
      );
    }
    return <LoopIcon />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 font-sans">

      
      <input type="file" webkitdirectory="" directory="" multiple ref={fileInputRef} onChange={handleFolderSelection} className="hidden" />

      <header className="flex-shrink-0 w-full h-16 bg-gray-900 text-white shadow-lg flex items-center justify-between px-6 border-b border-gray-800 z-10">
        <h1 className="text-xl font-bold text-purple-400 w-1/4 flex-shrink-0">Reproductor-app</h1>
        <div className="relative w-1/2 flex justify-center">
          <input
            type="text"
            placeholder="Buscar en la Biblioteca..."
            className="bg-gray-800 text-white rounded-full px-4 py-2 w-full max-w-lg focus:ring-1 focus:ring-purple-500 focus:outline-none placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4 w-1/4 justify-end flex-shrink-0">
          <button onClick={triggerFolderSelector} title="Abrir carpeta de música" className="text-gray-400 hover:text-purple-400 transition-colors">
            <FolderIcon />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full flex overflow-hidden">
        <aside className="flex-shrink-0 w-[250px] bg-gray-900 text-white p-6 border-r border-gray-800 hidden md:flex flex-col">
          <div className="h-full w-full flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold text-purple-300 mb-4">Ahora Suena</h3>
            <div className="w-full max-w-[180px] aspect-square bg-gray-700 rounded-lg shadow-xl mb-4">
              <img src={currentSong?.picture || `https://placehold.co/250x250/1e1b4b/9333ea?text=${currentSong?.album || '...'}`} alt="Carátula" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="space-y-1 w-full max-w-[200px]">
              <p className="text-lg font-extrabold text-white break-words" title={currentSong?.title}>{currentSong?.title || 'Selecciona una canción'}</p>
              <p className="text-sm text-gray-400">{currentSong?.artist || '...'}</p>
              <p className="text-xs text-purple-400">{currentSong ? `${currentSong.album} - ${currentSong.year}` : '...'}</p>
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-gray-800 text-white p-4 sm:p-8 overflow-hidden relative">
          <div className="absolute inset-0 p-4 sm:p-8">
            <div className="bg-gray-900 rounded-lg shadow-xl h-full flex flex-col overflow-hidden">
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_60px_60px_40px] gap-4 p-4 text-xs font-semibold uppercase text-gray-400 border-b border-gray-700 flex-shrink-0">
                <div>Título</div>
                <div className="hidden sm:block">Artista</div>
                <div className="hidden md:block">Álbum</div>
                <div className="text-center hidden lg:block">Año</div>
                <div className="text-right">Duración</div>
                <div></div>
              </div>
              <div className="divide-y divide-gray-800 text-sm overflow-y-auto">
                  {filteredLibrary.length > 0 ? filteredLibrary.map((song) => (
                    <div
                      key={song.id}
                      onClick={() => playSongNow(song)}
                      className={`grid grid-cols-[2fr_1.5fr_1.5fr_60px_60px_40px] gap-4 p-3 sm:p-4 text-gray-300 cursor-pointer transition-colors ${currentSong?.id === song.id ? 'bg-purple-900/40 text-purple-400 font-semibold' : 'hover:bg-gray-700'}`}
                    >
                      <div className="truncate">{song.title}</div>
                      <div className="truncate hidden sm:block">{song.artist}</div>
                      <div className="truncate hidden md:block">{song.album}</div>
                      <div className="text-center hidden lg:block">{song.year || ''}</div>
                      <div className="text-right col-span-2">{song.duration}</div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-gray-500 flex-1 flex flex-col items-center justify-center gap-2">
                      {library.length === 0 ? (
                        <b className='flex items-center gap-2'>Usa el icono de carpeta <FolderIcon /> para cargar tu música.</b>
                      ) : (
                        "No se encontraron resultados."
                      )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="flex-shrink-0 w-full h-24 bg-gray-900 shadow-2xl flex items-center justify-between px-4 sm:px-6 border-t border-purple-900 z-10">
        <div className="text-white w-full flex flex-col sm:flex-row items-center justify-between">
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            className="hidden"
          />
          
          <div className="sm:w-1/4 flex items-center justify-center sm:justify-start gap-2 w-full sm:order-1">
            <button onClick={toggleShuffle} disabled={filteredLibrary.length === 0} className={`group rounded-full p-2 transition-colors relative ${isShuffle ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:bg-white/10'} disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent`} title="Aleatorio">              
              <ShuffleIcon />
              {isShuffle && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>}
            </button>
            <button onClick={prevSong} disabled={!currentSong} className="rounded-full p-2 text-gray-400 hover:bg-white/10 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent" title="Anterior">
              <PrevIcon />
            </button>
            <button onClick={togglePlay} disabled={!currentSong && filteredLibrary.length === 0} className="bg-purple-600 rounded-full p-3 text-white hover:bg-purple-500 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed" title={isPlaying ? 'Pausar' : 'Reproducir'}>
              {isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </button>
            <button onClick={nextSong} disabled={!currentSong} className="rounded-full p-2 text-gray-400 hover:bg-white/10 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent" title="Siguiente">
              <NextIcon />
            </button>
            <button onClick={cycleRepeatMode} disabled={filteredLibrary.length === 0} className={`group rounded-full p-2 transition-colors relative ${repeatMode !== 'none' ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:bg-white/10'} disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent`} title="Repetir">
              {getRepeatIcon(repeatMode)}
              {repeatMode !== 'none' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>}
            </button>
          </div>

          <div className="sm:w-1/2 flex items-center gap-3 w-full sm:order-2 order-1 mt-2 sm:mt-0">
            <span className="text-xs text-gray-400 w-12 text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 group">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-gray-700 rounded-full pointer-events-none group-hover:h-1.5 transition-all duration-200"></div>
              <div 
                className="absolute top-1/2 -translate-y-1/2 left-0 h-1 rounded-full bg-purple-500 pointer-events-none group-hover:h-1.5 transition-all duration-200"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
              <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-transparent rounded-full appearance-none cursor-pointer group-hover:h-1.5 transition-all duration-200
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:scale-0"
              />
            </div>
            <span className="text-xs text-gray-400 w-12 text-left">{formatTime(duration)}</span>
          </div>

          <div className="sm:w-1/4 flex items-center justify-end gap-4 w-full sm:order-3 order-2 mt-2 sm:mt-0">            
            <div className="flex items-center gap-2 w-full max-w-[150px] group" title="Volumen">
              <button onClick={toggleMute} className={`transition-colors ${isMuted ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>
                {isMuted ? (
                  <MutedIcon />
                ) : (
                  <VolumeIcon />
                )}
              </button>
              <div className="relative flex-1">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-gray-700 rounded-full pointer-events-none group-hover:h-1.5 transition-all duration-200"></div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 left-0 h-1 rounded-full bg-purple-500 pointer-events-none group-hover:h-1.5 transition-all duration-200"
                  style={{ width: `${volume * 100}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-transparent rounded-full appearance-none cursor-pointer group-hover:h-1.5 transition-all duration-200
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:scale-0"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
