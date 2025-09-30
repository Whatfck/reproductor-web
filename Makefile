# Makefile para el proyecto Reproductor-app

# --- Variables ---
# Define el gestor de paquetes a utilizar.
NPM = npm

# --- Targets ---

.PHONY: help all install dev build preview clean

# Target por defecto que se ejecuta con 'make'
all: build

help: ## Muestra esta ayuda.
	@echo "Uso: make [target]"
	@echo ""
	@echo "Targets disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Instala las dependencias del proyecto.
	@echo "📦  Instalando dependencias..."
	$(NPM) install

dev: ## Inicia el servidor de desarrollo.
	@echo "🚀  Iniciando servidor de desarrollo..."
	$(NPM) run dev

build: install ## Compila la aplicación para producción (asegura que las dependencias estén instaladas).
	@echo "🏗️   Compilando la aplicación para producción..."
	$(NPM) run build

preview: ## Sirve la compilación de producción localmente.
	@echo "👀  Previsualizando la compilación de producción..."
	$(NPM) run preview

clean: ## Elimina las dependencias y la carpeta de compilación.
	@echo "🧹  Limpiando el proyecto..."
	rm -rf node_modules dist
	@echo "Limpieza completada."
