# Gestión de Empresas

Este proyecto consta de un backend y un frontend que deben ser levantados por separado. A continuación, se presentan las instrucciones para iniciar ambos componentes.

## Requisitos

- Node.js (v18 o superior)
- npm (v9 o superior)

## Instrucciones

1. **Abre dos terminales.**

2. **En la primera terminal:**

   - Navega a la raiz del proyecto
     
   - Ejecuta el comando para iniciar el backend:
     ```bash
     npm run start:backend
     ```

   Esto levantará el servidor backend y lo mantendrá escuchando en el puerto especificado. La salida en la terminal debe indicar que el servidor está en ejecución.

3. **En la segunda terminal:**

   - Navega a la misma ruta del proyecto
   
   - Ejecuta el comando para iniciar el frontend:
     ```bash
     npm run start:frontend
     ```

   Esto iniciará el servidor de desarrollo del frontend, y la salida en la terminal debe mostrar la dirección local en la que el frontend está corriendo (por defecto, http://localhost:5173/).

## Notas

- Asegúrate de que todas las dependencias estén instaladas. Puedes hacer esto ejecutando `npm install` en la raíz del proyecto.
- Si encuentras problemas con los comandos, verifica que las rutas sean correctas y que todos los scripts estén bien definidos en el archivo `package.json`.

