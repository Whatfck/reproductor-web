/**
 * Interfaz para un objeto de Canción.
 * Usada para tipado estático en toda la aplicación.
 */
export interface Song {
    id: number;
    title: string;
    artist: string;
    album: string;
    year: number | null;
    duration: string;
    url: string; // URL del objeto Blob para la reproducción,
    picture?: string; // URL de la carátula del álbum (opcional)
}

/**
 * Clase Nodo: Elemento de la Lista Doble.
 */
class Node {
    public data: Song;
    public next: Node | null = null;
    public prev: Node | null = null;

    constructor(data: Song) {
        this.data = data;
    }
}

/**
 * Clase ListaDoblePlaylist: Gestiona la cola de reproducción.
 * Implementa los requisitos del taller (agregar, eliminar, avanzar, retroceder).
 */
export class DoublyLinkedListPlaylist {
    private head: Node | null = null;
    private tail: Node | null = null;
    private current: Node | null = null;
    private size: number = 0;

    constructor(initialSongs: Song[] = []) {
        initialSongs.forEach(song => this.addLast(song));
        // Establece la primera canción como actual si la lista no está vacía
        if (this.head) {
            this.current = this.head;
        }
    }

    /**
     * Devuelve todas las canciones en formato de array para renderizado en React.
     */
    public getAllSongs(): Song[] {
        const songs: Song[] = [];
        let currentNode = this.head;
        while (currentNode) {
            songs.push(currentNode.data);
            currentNode = currentNode.next;
        }
        return songs;
    }

    /**
     * Obtiene la canción actualmente en reproducción.
     */
    public getCurrentSong(): Song | null {
        return this.current ? this.current.data : null;
    }
    
    // --- MÉTODOS REQUERIDOS POR EL TALLER (Lista Doble) ---

    /**
     * Agrega una canción al final (O(1)).
     */
    public addLast(song: Song): void {
        const newNode = new Node(song);
        if (!this.tail) { // Lista vacía
            this.head = newNode;
            this.tail = newNode;
            // Si la lista estaba vacía, la actual es la nueva canción
             if (!this.current) {
                this.current = newNode;
            }
        } else {
            newNode.prev = this.tail;
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }

    /**
     * Limpia la lista de reproducción actual y la reemplaza con una nueva lista de canciones,
     * opcionalmente comenzando desde una canción específica.
     * @param songs - El nuevo array de canciones.
     * @param startingSong - La canción desde la que se debe empezar a reproducir.
     */
    public playFrom(songs: Song[], startingSong: Song): void {
        this.head = null;
        this.tail = null;
        this.current = null;
        this.size = 0;

        songs.forEach(song => this.addLast(song));
        this.setCurrentById(startingSong.id);
    }

    /**
     * Establece la canción actual basándose en su ID.
     * @param songId - El ID de la canción a buscar.
     */
    public setCurrentById(songId: number): void {
        const node = this.find(songId);
        if (node) {
            this.current = node;
        } else {
            // Si la canción no está en la lista, no hacemos nada.
        }
    }

    /**
     * Elimina una canción por ID y ajusta el puntero 'current' si es necesario.
     */
    public removeById(id: number): Song | null {
        let nodeToRemove = this.head;
        while (nodeToRemove) {
            if (nodeToRemove.data.id === id) {
                
                // Si el nodo actual es el que se va a eliminar, avanzamos el puntero
                if (this.current === nodeToRemove) {
                    this.current = nodeToRemove.next || nodeToRemove.prev; // Intenta next, sino prev
                }
                
                if (nodeToRemove.prev) {
                    nodeToRemove.prev.next = nodeToRemove.next;
                } else { // Es el head
                    this.head = nodeToRemove.next;
                }

                if (nodeToRemove.next) {
                    nodeToRemove.next.prev = nodeToRemove.prev;
                } else { // Es el tail
                    this.tail = nodeToRemove.prev;
                }

                this.size--;
                // Si la lista queda vacía, reseteamos el puntero actual
                if (this.size === 0) {
                    this.current = null;
                }
                return nodeToRemove.data;
            }
            nodeToRemove = nodeToRemove.next;
        }
        return null;
    }

    /**
     * Requerimiento: Adelantar canción (mover a 'next').
     */
    public nextSong(): void {
        if (this.current && this.current.next) {
            this.current = this.current.next;
        } else if (this.head) { // Si está en el final, vuelve al inicio (loop)
             this.current = this.head;
        }
    }

    /**
     * Requerimiento: Retroceder canción (mover a 'prev').
     */
    public prevSong(): void {
        if (this.current && this.current.prev) {
            this.current = this.current.prev;
        } else if (this.tail) { // Si está en el inicio, va al final (loop)
            this.current = this.tail;
        }
    }

    /**
     * Busca un nodo por su ID.
     * @param id - El ID de la canción a buscar.
     */
    private find(id: number): Node | null {
        let currentNode = this.head;
        while (currentNode) {
            if (currentNode.data.id === id) return currentNode;
            currentNode = currentNode.next;
        }
        return null;
    }
}