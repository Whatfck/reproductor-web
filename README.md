# 🎶 Reproductor-app 🎶 #  

Debo crear un reproductor de musica, estos son los criterios del profesor:  

## ❗TALLER LISTAS DOBLES ##  
Lista de reproducción de canciones
Crear una app en Python o Typescript aplicando los conceptos de "listas dobles" que permita simular una lista de reproducción de canciones donde cumpla los siguientes **requerimientos:**  

- Para este taller se debe crear un Front donde el usuario pueda interactuar. Permita agregar una canción (al inicio, al final y en cualquier posición).
- Permita eliminar una canción de la lista.
- Permita adelantar canción.
- Permita retroceder canción.
- Otras funcionalidades que usted considere pertinente.

## 🔔 Funcionalidades pertinente ##  

Estas son las características que hacen que un reproductor de música sea útil y usable:  

**🎵 Reproducción Básica:**  

- Reproducir, Pausar, Detener.
- Pista Anterior/Siguiente.
- Barra de Progreso para saltar a cualquier punto de la canción.
- Control de Volumen.
- Gestión de Biblioteca:
- Escaneo de Carpetas Locales: Capacidad para escanear directorios del sistema para encontrar archivos de música (MP3, FLAC, AAC, OGG, etc.).
- Visualización por Artista, Álbum y Canción.  

**🔎 Búsqueda Rápida: Funcionalidad para buscar canciones, artistas o álbumes dentro de la biblioteca.**
- Listas de Reproducción (Playlists):
- Creación, Edición y Guardado de listas de reproducción personalizadas.
- Importar/Exportar listas (útil para compartir o hacer copias de seguridad, formato .m3u8 y almacenado en la memoria del dispositivo).  

**▶️ Opciones de Reproducción:**
- Modo Aleatorio (Shuffle).
- Repetir (canción actual o lista completa).  

**🔭 Visualización de Información:**
- Mostrar Metadatos (ID3 Tags): Título de la canción, artista, álbum, año.
- Visualización de la Carátula del Álbum (Album Art).  

**🌑 Funciones Avanzadas:**
- Soporte para Formatos de Alta Calidad (Lossless): Compatibilidad con formatos como FLAC y ALAC además de los comunes como MP3 y AAC, entre otros.

**🛠️ Tecnologías Utilizadas**

Para un desarrollo ágil y moderno, este proyecto fue construido utilizando el siguiente stack:
- Frontend: React con Vite para una interfaz de usuario dinámica.
- Estilos: Tailwind CSS para un diseño rápido y responsivo.
- Backend/Lógica: Node.js con TypeScript para una lógica robusta y tipada.

---
## 🚀 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos
- Node.js (v18 o superior)
- npm, yarn, o pnpm

### Instalación y Ejecución
1. Clona el repositorio: `git clone https://github.com/Whatfck/Reproductor-app.git`
2. Navega al directorio del proyecto: `cd Reproductor-app`
3. Instala las dependencias: `npm install`
4. Inicia la aplicación: `npm run dev` (asumiendo un script de Vite)

### Usando el Makefile

Para simplificar las tareas comunes de desarrollo, se ha incluido un `Makefile`. Puedes usar los siguientes comandos desde la raíz del proyecto:

- `make install`: Instala todas las dependencias.
- `make dev`: Inicia el servidor de desarrollo.
- `make build`: Compila la aplicación para producción.
- `make clean`: Elimina los artefactos de compilación y las dependencias.
- `make help`: Muestra una lista de todos los comandos disponibles.

## ✨ Estado Actual y Capturas

El reproductor ya cuenta con una interfaz funcional y moderna. Las características implementadas hasta ahora incluyen:

- **Carga de Biblioteca Local**: El usuario puede seleccionar una carpeta de su ordenador para cargar archivos de música.
- **Extracción de Metadatos**: Se leen las etiquetas ID3 (título, artista, álbum, año y carátula) de cada canción.
- **Controles de Reproducción Completos**:
  - Play, Pausa, Siguiente y Anterior.
  - Barra de progreso interactiva.
  - Control de volumen.
  - Modos de reproducción: Aleatorio (Shuffle) y Repetir (toda la lista, una canción).
- **Búsqueda en Tiempo Real**: Filtra la biblioteca de canciones mientras el usuario escribe.
- **Interfaz Responsiva**: Diseño limpio y funcional que se adapta a diferentes tamaños de pantalla.

---

## 🧑‍💻 Autor

Este proyecto fue desarrollado por: ***[@Whatfck](https://github.com/Whatfck)***  

## 📄 Licencia
Este proyecto está bajo la Licencia [**MIT**](LICENSE).