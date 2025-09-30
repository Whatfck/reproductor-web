import { useEffect } from 'react';
import { useLibrary } from './useLibrary';
import { usePlaylist, type RepeatMode } from './usePlaylist';
import { useAudioPlayer } from './useAudioPlayer';

// --- Lógica de la Aplicación ---

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

  // Limpieza de las URLs de los objetos para evitar fugas de memoria
  useEffect(() => {
    return () => {
      library.forEach(song => URL.revokeObjectURL(song.url));
    };
  }, [library]);

  // Función mejorada para play/pause que inicia la playlist si es necesario
  const togglePlay = () => {
    if (!currentSong && filteredLibrary.length > 0) {
      playSongNow(filteredLibrary[0]); // Inicia con la primera canción de la biblioteca
    } else {
      baseTogglePlay();
    }
  };

  const getRepeatIcon = (mode: RepeatMode) => {
    const baseIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 12A8 8 0 1020 4h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-5h-5M4 12a8 8 0 100 8h5" />
      </svg>
    );

    if (mode === 'one') {
      return (
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.656 18.656A9 9 0 1021 12h-1" />
          </svg>
          <span className="absolute -top-1 -right-1 text-xs font-bold text-purple-400">1</span>
        </div>
      );
    } else if (mode === 'all') {
      return baseIcon;
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
    );
  };

  // --- Renderizado ---

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 font-sans">

      {/* Input oculto para seleccionar la carpeta */}
      {/* @ts-ignore */}
      <input type="file" webkitdirectory="" directory="" multiple ref={fileInputRef} onChange={handleFolderSelection} className="hidden"  />

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
          <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex items-center gap-4 w-1/4 justify-end flex-shrink-0">
          <button onClick={triggerFolderSelector} title="Abrir carpeta de música" className="text-gray-400 hover:text-purple-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
          </button>
          <button title="Configuración" className="text-gray-400 hover:text-purple-400 transition-colors">⚙️</button>
        </div>
      </header>

      <main className="flex-1 w-full flex overflow-hidden">
        <aside className="flex-shrink-0 w-[250px] bg-gray-900 text-white p-6 border-r border-gray-800 hidden md:flex flex-col">
          <div className="h-full w-full flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold text-purple-300 mb-4">🎵 Ahora Suena</h3>
            <div className="w-full max-w-[180px] aspect-square bg-gray-700 rounded-lg shadow-xl mb-4">
              <img src={currentSong?.picture || `https://placehold.co/250x250/1e1b4b/9333ea?text=${currentSong?.album || '...'}`} alt="Carátula" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="space-y-1 w-full max-w-[200px]">
              <p className="text-lg font-extrabold text-white break-words truncate" title={currentSong?.title}>{currentSong?.title || 'Selecciona una canción'}</p>
              <p className="text-sm text-gray-400">{currentSong?.artist || '...'}</p>
              <p className="text-xs text-purple-400">{currentSong ? `${currentSong.album} - ${currentSong.year}` : '...'}</p>
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-gray-800 text-white p-4 sm:p-8 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden h-full flex flex-col">
            <div className="grid grid-cols-[2fr_1.5fr_1.5fr_60px_60px_40px] gap-4 p-4 text-xs font-semibold uppercase text-gray-400 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
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
                  <div className="text-center hidden lg:block">{song.year}</div>
                  <div className="text-right col-span-2">{song.duration}</div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-500">
                  {library.length === 0 ? "Usa el icono de carpeta 📂 para cargar tu música." : "No se encontraron resultados."}
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      <footer className="flex-shrink-0 w-full h-24 bg-gray-900 shadow-2xl flex items-center justify-between px-4 sm:px-6 border-t border-purple-900 z-10">
        <div className="text-white w-full flex flex-col sm:flex-row items-center justify-between">
          {/* Elemento de audio, oculto pero funcional */}
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            className="hidden"
          />
          
          {/* Controles de Reproducción (Izquierda) - Ahora con SVGs */}
          <div className="sm:w-1/4 flex items-center justify-center sm:justify-start gap-2 w-full sm:order-1">
            <button onClick={toggleShuffle} className={`group rounded-full p-2 transition-colors relative ${isShuffle ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:bg-white/10'}`} title="Aleatorio">              
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              {isShuffle && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>}
            </button>
            <button onClick={prevSong} disabled={!currentSong} className="rounded-full p-2 text-gray-400 hover:bg-white/10 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent" title="Anterior">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14.03V5.969a1 1 0 00-1.555-.832L4.12 9.168a1 1 0 000 1.664l4.325 4.001zM12.89 14.03a1 1 0 01-1.555.832L7 10.832v-1.664l4.335-4.001a1 1 0 011.555.832v8.03z" /></svg>
            </button>
            <button onClick={togglePlay} disabled={!currentSong && filteredLibrary.length === 0} className="bg-purple-600 rounded-full p-3 text-white hover:bg-purple-500 transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed" title={isPlaying ? 'Pausar' : 'Reproducir'}>
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              )}
            </button>
            <button onClick={nextSong} disabled={!currentSong} className="rounded-full p-2 text-gray-400 hover:bg-white/10 transition-colors disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent" title="Siguiente">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M11.555 5.168A1 1 0 0010 5.97v8.06a1 1 0 001.555.832l4.325-4.03a1 1 0 000-1.664l-4.325-4.03zM7.11 5.97a1 1 0 011.555-.832l4.335 4.001v1.664l-4.335 4.001a1 1 0 01-1.555-.832V5.97z" /></svg>
            </button>
            <button onClick={cycleRepeatMode} className={`group rounded-full p-2 transition-colors relative ${repeatMode !== 'none' ? 'text-purple-400 bg-purple-500/10' : 'text-gray-400 hover:bg-white/10'}`} title="Repetir">
              {getRepeatIcon(repeatMode)}
              {repeatMode !== 'none' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>}
            </button>
          </div>

          {/* Barra de Progreso (Centro) */}
          <div className="sm:w-1/2 flex items-center gap-3 w-full sm:order-2 order-1 mt-2 sm:mt-0">
            <span className="text-xs text-gray-400 w-10 text-right">{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
            <div className="relative flex-1 group">
              <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer group-hover:h-1.5 transition-all duration-200
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                            [&::-webkit-slider-thumb]:scale-0 group-hover:[&::-webkit-slider-thumb]:scale-100 transition-transform duration-200"
              />
              <div 
                className="absolute top-0 left-0 h-1 rounded-full bg-purple-500 pointer-events-none group-hover:h-1.5 transition-all duration-200"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400 w-10 text-left">{new Date(duration * 1000).toISOString().substr(14, 5)}</span>
          </div>

          {/* Info y Volumen (Derecha) */}
          <div className="sm:w-1/4 flex items-center justify-end gap-4 w-full sm:order-3 order-2 mt-2 sm:mt-0">            
            <div className="flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-700 rounded-full appearance-none cursor-pointer group-hover:h-1.5 transition-all duration-200
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                           [&::-webkit-slider-thumb]:scale-0 group-hover:[&::-webkit-slider-thumb]:scale-100 transition-transform duration-200"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
