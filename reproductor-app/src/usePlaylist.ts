import { useState, useCallback } from 'react';
import type { Song } from './useLibrary';

export type RepeatMode = 'none' | 'all' | 'one';

export function usePlaylist(library: Song[]) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');

  const nextSong = useCallback(() => {
    if (library.length === 0) {
      setCurrentSong(null);
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * library.length);
      setCurrentSong(library[randomIndex]);
      return;
    }

    const currentIndex = currentSong ? library.findIndex(song => song.id === currentSong.id) : -1;
    const nextIndex = (currentIndex + 1);

    if (nextIndex < library.length) {
      setCurrentSong(library[nextIndex]);
    } else if (repeatMode === 'all') {
      setCurrentSong(library[0]);
    } else {
      setCurrentSong(null);
    }
  }, [currentSong, library, isShuffle, repeatMode]);
  
  const prevSong = useCallback(() => {
    if (!currentSong || library.length === 0) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * library.length);
      setCurrentSong(library[randomIndex]);
      return;
    }

    const currentIndex = library.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + library.length) % library.length;
    setCurrentSong(library[prevIndex]);
  }, [currentSong, library, isShuffle]);

  const playSongNow = useCallback((song: Song) => {
    setCurrentSong(song);
  }, []);

  const toggleShuffle = useCallback(() => setIsShuffle(s => !s), []);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode(mode => {
      if (mode === 'all') return 'one';
      if (mode === 'one') return 'none';
      return 'all';
    });
  }, []);

  return {
    currentSong,
    nextSong,
    prevSong,
    playSongNow,
    isShuffle,
    toggleShuffle,
    repeatMode,
    cycleRepeatMode,
  };
}