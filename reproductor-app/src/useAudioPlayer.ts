import { useState, useRef, useEffect, useCallback } from 'react';
import type { Song } from './DoublyLinkedListPlaylist';
import type { RepeatMode } from './usePlaylist';

/**
 * Hook personalizado para gestionar la lógica del reproductor de audio HTML5.
 * @param currentSong La canción que se debe reproducir.
 * @param onNext Callback para reproducir la siguiente canción cuando la actual termina.
 */
export function useAudioPlayer(currentSong: Song | null, onNext: () => void, repeatMode: RepeatMode) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  // Efecto para controlar la reproducción cuando cambia la canción actual
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = repeatMode === 'one';

      if (currentSong) {
        if (audioRef.current.src !== currentSong.url) {
          audioRef.current.src = currentSong.url;
        }
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(e => {
          console.error("Error al reproducir audio:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [currentSong, repeatMode]);

  // Alternar entre reproducir y pausar
  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Manejadores de eventos del elemento <audio>
  const handleTimeUpdate = () => setCurrentTime(audioRef.current?.currentTime || 0);
  const handleLoadedMetadata = () => setDuration(audioRef.current?.duration || 0);
  const handleEnded = useCallback(() => {
    onNext();
  }, [onNext]);

  // Funciones para controlar el reproductor desde la UI
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  return {
    audioRef,
    isPlaying,
    duration,
    currentTime,
    volume,
    togglePlay,
    handleSeek,
    handleVolumeChange,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
  };
}