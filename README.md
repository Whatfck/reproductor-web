# 🎶 Reproductor-app 🎶 #  

Este proyecto es un reproductor de música de escritorio construido con tecnologías web modernas, como parte de un taller académico sobre estructuras de datos.

## 📝 Requerimientos del Taller: Listas Doblemente Enlazadas

El objetivo principal del taller era aplicar el concepto de **listas doblemente enlazadas** para simular una lista de reproducción de canciones. Los requisitos básicos eran:

- **Interfaz de Usuario**: Crear un frontend interactivo.
- **Gestión de Canciones**:
  - Agregar una canción (al inicio, al final o en una posición específica).
  - Eliminar una canción.
- **Controles de Reproducción**:
  - Adelantar a la siguiente canción.
  - Retroceder a la canción anterior.

## ✨ Funcionalidades Implementadas y Adicionales

Además de los requisitos básicos, se implementaron características adicionales para crear un reproductor de música más completo y funcional:

- **Carga de Biblioteca Local**: El usuario puede seleccionar una carpeta de su ordenador para cargar archivos de música.
- **Extracción de Metadatos**: Se leen las etiquetas ID3 (título, artista, álbum, año y carátula) de cada canción.
- **Controles de Reproducción Completos**:
  - Play, Pausa, Siguiente y Anterior.
  - Barra de progreso interactiva.
  - Control de volumen y silencio.
  - Modos de reproducción: Aleatorio (Shuffle) y Repetir (toda la lista o una sola canción).
- **Búsqueda en Tiempo Real**: Filtra la biblioteca de canciones mientras el usuario escribe.
- **Interfaz Responsiva**: Diseño limpio y funcional que se adapta a diferentes tamaños de pantalla.

## 🛠️ Tecnologías Utilizadas

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
2. Navega al directorio del proyecto: `cd Reproductor-app/reproductor-app`
3. Instala las dependencias: `npm install`
4. Inicia la aplicación: `npm run dev` (asumiendo un script de Vite)

### Usando el Makefile

Para simplificar las tareas comunes de desarrollo, se ha incluido un `Makefile`. Puedes usar los siguientes comandos desde la raíz del proyecto:

- `cd Reproductor-app/reproductor-app`: Entra al directorio del proyecto.
- `make install`: Instala todas las dependencias.
- `make dev`: Inicia el servidor de desarrollo.
- `make build`: Compila la aplicación para producción.
- `make clean`: Elimina los artefactos de compilación y las dependencias.
- `make help`: Muestra una lista de todos los comandos disponibles.

---

## 🧑‍💻 Autor

Este proyecto fue desarrollado por: ***[@Whatfck](https://github.com/Whatfck)***  

## 📄 Licencia
Este proyecto está bajo la Licencia [**MIT**](LICENSE).