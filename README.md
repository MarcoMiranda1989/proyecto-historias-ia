# 📚 Historias IA - Creador de Cuentos Infantiles con Inteligencia Artificial

Historias IA es una aplicación web interactiva que permite a los usuarios crear, gestionar y leer cuentos infantiles personalizados. El proyecto integra herramientas de Inteligencia Artificial para generar automáticamente ilustraciones y textos narrativos cortos basados en las descripciones de las escenas (prompts) proporcionadas por el usuario.

---

## 📖 ¿De qué trata el proyecto?

La aplicación ofrece un flujo completo para la creación de libros ilustrados:
1. **Registro e Inicio de Sesión:** Cada usuario cuenta con un espacio personal protegido donde almacena sus libros.
2. **Dashboard Personal:** Visualización de la colección de libros creados por el usuario, con opciones para verlos, añadirles páginas o eliminarlos.
3. **Creador de Historias:** Permite definir el título y una breve descripción de una nueva historia.
4. **Generador de Páginas:** Para cada página del libro, el usuario introduce un *prompt* (ej. *"Un osito navegando en un barco de papel sobre un río de estrellas"*). A partir de esta descripción, la aplicación:
   * Genera una ilustración mágica utilizando IA.
   * Redacta una narrativa infantil corta (máximo 50 palabras) coherente con la escena.
5. **Lectura del Cuento:** Una interfaz limpia para hojear el libro, ver las ilustraciones creadas y repasar los prompts originales utilizados.

---

## 💻 Herramientas del Frontend

El frontend está desarrollado como una Single Page Application (SPA) moderna, rápida y responsiva:
* **React 19:** Biblioteca principal para la creación de la interfaz mediante componentes reactivos.
* **Vite:** Herramienta de construcción y servidor de desarrollo ultrarrápido.
* **React Router DOM v6:** Gestión de la navegación del lado del cliente, implementando rutas protegidas (`ProtectedRoute`) para restringir el acceso a usuarios no autenticados.
* **Tailwind CSS v4:** Framework de diseño para aplicar estilos modernos y adaptables a dispositivos móviles y de escritorio.
* **Context API (AuthContext):** Manejo global del estado de autenticación (usuario, inicio de sesión, registro y persistencia de tokens de sesión en `localStorage`).

---

## ⚙️ Herramientas del Backend

El servidor backend expone una API REST robusta que maneja la lógica de negocio y la integración con servicios externos:
* **Node.js:** Entorno de ejecución para Javascript en el servidor.
* **Express:** Framework web ligero para estructurar las rutas y middlewares.
* **JSON Web Tokens (JWT):** Generación de tokens seguros y middleware de autorización para validar las solicitudes en las rutas protegidas.
* **bcryptjs:** Algoritmo para el hashing y encriptación segura de contraseñas de usuarios.
* **CORS & dotenv:** Permite peticiones de origen cruzado seguras y la configuración del entorno mediante variables de configuración locales.
* **Integración con Pollinations AI:** Conexión directa mediante llamadas HTTP a las APIs gratuitas de Pollinations AI para la generación de imágenes y generación de texto narrativa.

---

## 🗄️ Base de Datos Utilizada

La persistencia de datos del proyecto se gestiona mediante una base de datos relacional:
* **MySQL:** Motor de base de datos relacional utilizado para almacenar toda la información del sistema.
* **mysql2/promise:** Controlador para Node.js que implementa el uso de promesas y un pool de conexiones optimizado para realizar consultas asíncronas de manera eficiente.

### Estructura de Tablas
El servidor backend inicializa automáticamente las siguientes tablas al arrancar:
1. **`users`:** Almacena la información de los usuarios (ID, nombre de usuario, correo electrónico, contraseña encriptada y URL del avatar).
2. **`stories`:** Contiene los cuentos creados (ID, user_id, título, descripción y marcas de tiempo). Cuenta con una relación de clave foránea hacia la tabla `users` con eliminación en cascada.
3. **`story_pages`:** Registra las páginas pertenecientes a cada libro (ID, story_id, número de página, prompt, URL de la imagen y texto de la narrativa). Vinculada a `stories` con eliminación en cascada para facilitar la limpieza de datos.
