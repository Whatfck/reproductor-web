import { useState, useMemo, useRef } from 'react';
import type { Song } from './DoublyLinkedListPlaylist';
import * as jsmediatags from 'jsmediatags';
// --- Funciones de Ayuda ---

/**
 * Obtiene la duración real de un archivo de audio.
 */
const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const audio = document.createElement('audio');
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      URL.revokeObjectURL(audio.src); // Limpiar URL del objeto
    };
    audio.onerror = () => resolve(0); // En caso de error, duración 0
  });
};

/**
 * Formatea la duración de segundos a un string MM:SS.
 */
const formatDuration = (durationInSeconds: number): string => {
  const secondsValue = durationInSeconds || 0;
  if (isNaN(secondsValue) || secondsValue === 0) return '-:--';
  const minutes = Math.floor(secondsValue / 60);
  const seconds = Math.floor(secondsValue % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Extrae la carátula del álbum y la convierte a una URL de datos.
 */
const getPictureDataUrl = (picture: any): string | undefined => {
  if (picture) {
    const { data, format } = picture;
    let base64String = "";
    for (let i = 0; i < data.length; i++) {
      base64String += String.fromCharCode(data[i]);
    }
    return `data:${format};base64,${window.btoa(base64String)}`;
  }
  return undefined;
};

/**
 * Extrae el año de los metadatos, que puede ser un número o un string (YYYY-MM-DD).
 */
const getYear = (yearTag: string | number | undefined): number | null => {
  if (!yearTag) return null;
  const yearString = String(yearTag);

  // Intenta extraer el año de formatos como "YYYY-MM-DDTHH:mm:ssZ" o simplemente "YYYY"
  const yearMatch = yearString.match(/^(\d{4})/);
  if (yearMatch) {
    const yearStr = yearMatch[1];
    const year = parseInt(yearStr, 10);
    // Valida que el año sea un número razonable, pero permite años futuros.
    if (year > 1000) return year;
  }
  return null;
};

/**
 * Hook personalizado para gestionar la biblioteca de música.
 * Encapsula la lógica de carga de archivos, búsqueda y filtrado.
 */
export function useLibrary() {
  // Estado para la biblioteca completa de canciones
  const [library, setLibrary] = useState<Song[]>([]);
  // Estado para la barra de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  // Referencia al input de tipo 'file' para poder hacerle click programáticamente
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Se activa cuando el usuario selecciona una carpeta.
   * Procesa los archivos y los convierte en una biblioteca de canciones.
   */
  const handleFolderSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const audioFiles = Array.from(files).filter(file =>
      file.type.startsWith('audio/')
    );
    
    const songsWithMetadata: Song[] = await Promise.all(
      audioFiles.map(async (file, index): Promise<Song> => {
        const duration = await getAudioDuration(file);
        return new Promise((resolve) => {
          jsmediatags.read(file, {
            onSuccess: (tag) => {
              const tags = tag.tags;
              resolve({
                id: Date.now() + index,
                title: tags.title || file.name.replace(/\.[^/.]+$/, ""),
                artist: tags.artist || 'Desconocido',
                album: tags.album || 'Desconocido',
                year: getYear(tags.year),
                duration: formatDuration(duration),
                picture: getPictureDataUrl(tags.picture),
                url: URL.createObjectURL(file),
              });
            },
            onError: () => {
              // Si falla, usamos los valores por defecto
              resolve({ id: Date.now() + index, title: file.name.replace(/\.[^/.]+$/, ""), artist: 'Desconocido', album: 'Desconocido', year: null, duration: formatDuration(duration), url: URL.createObjectURL(file) });
            }
          });
        });
      })
    );
    
    // Ordena las canciones alfabéticamente por título antes de guardarlas en el estado.
    songsWithMetadata.sort((a, b) => 
      a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    );
    setLibrary(songsWithMetadata);
  };

  /**
   * Simula un click en el input de archivo oculto para abrir el selector de carpetas.
   */
  const triggerFolderSelector = () => {
    fileInputRef.current?.click();
  };

  // Memoizamos el filtrado para que no se recalcule en cada render
  const filteredLibrary = useMemo(() => {
    if (!searchTerm) return library;
    return library.filter(song =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.album.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [library, searchTerm]);

  return {
    library,
    filteredLibrary,
    searchTerm,
    setSearchTerm,
    fileInputRef,
    handleFolderSelection,
    triggerFolderSelector,
  };
}