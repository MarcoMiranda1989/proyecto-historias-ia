# Historias IA - Creador de cuentos infantiles con Inteligencia Artificial

Historias IA es una aplicación web interactiva pensada para crear, gestionar y leer cuentos infantiles personalizados de manera muy sencilla. La gracia del proyecto es que usa Inteligencia Artificial para generar de forma automática tanto las ilustraciones como los textos narrativos cortos de cada página a partir de las descripciones que el usuario escriba.

---

## De qué va el proyecto

La aplicación te permite hacer todo el flujo de creación de un libro ilustrado:
1. Registro e inicio de sesión para que cada usuario tenga su propia colección de cuentos guardada de forma segura.
2. Un panel principal (Dashboard) para ver todos tus cuentos creados, abrirlos, añadirles nuevas páginas o borrarlos si ya no los quieres.
3. Un creador de historias muy simple donde solo tienes que poner un título y una descripción general.
4. Un generador de páginas donde escribes una descripción (prompt) de la escena que te imaginas (por ejemplo: "un osito viajando en un cohete de cartón hacia la luna") y la app se encarga de:
   * Generar una ilustración mágica con IA.
   * Redactar un texto infantil corto (máximo 50 palabras) que combine con la escena.
5. Un visor del cuento para hojear el libro terminado, ver las imágenes a pantalla completa y repasar qué prompts usaste para crearlas.

---

## Qué usamos en el Frontend

Para armar la interfaz del cliente elegimos estas herramientas:
* React 19: La base para estructurar toda la aplicación web mediante componentes.
* Vite: Para levantar el servidor de desarrollo y compilar todo súper rápido.
* React Router DOM v6: Para manejar la navegación entre páginas y proteger las rutas que requieren inicio de sesión.
* Tailwind CSS v4: Para que el diseño se vea moderno, limpio y se adapte bien a pantallas de celular y computadora sin complicarnos con el CSS.
* Context API (AuthContext): Para controlar el estado de inicio de sesión en toda la app y guardar el token en el navegador (localStorage) para que no tengas que loguearte cada vez.

---

## Qué usamos en el Backend

El servidor que atiende las peticiones y procesa los datos está construido con:
* Node.js: El entorno de ejecución para correr JavaScript del lado del servidor.
* Express: Para estructurar las rutas de la API de forma organizada.
* JSON Web Tokens (JWT): Para la autenticación de usuarios de forma segura.
* bcryptjs: Para encriptar las contraseñas en la base de datos y que nadie pueda verlas.
* CORS y dotenv: Para configurar variables de entorno locales de forma segura y permitir la conexión con el frontend.
* Integración con la API de Pollinations AI: Hacemos llamadas directas para generar las imágenes y los textos de los cuentos de forma gratuita y al instante.

---

## Qué base de datos elegimos

Toda la información del proyecto se almacena de forma estructurada en:
* MySQL: El motor de base de datos relacional.
* mysql2/promise: El paquete que nos permite hacer consultas de forma asíncrona desde Node.js usando promesas.

### Cómo está organizada la base de datos
Cuando el servidor del backend arranca por primera vez, crea de forma automática estas tablas:
1. users: Guarda a los usuarios registrados con su nombre, correo, contraseña encriptada y su foto de avatar.
2. stories: Almacena cada libro de cuentos creado, asociado al usuario que lo armó. Si borras un usuario, sus libros se borran automáticamente en cascada.
3. story_pages: Guarda las páginas de cada libro (el número de página, el texto de la historia, la URL de la imagen y el prompt original). También están vinculadas con borrado en cascada para no dejar basura en la base de datos si eliminas un libro.
