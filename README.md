# Procesos de Ingeniería del Software 2526
Proyecto del curso 2025-2026

## Descripción del proyecto
El proyecto de la asignatura tiene una parte común que se explone públicamente y que se desarrolla durante el curso (de septiembre 2025 a diciembre 2025) y una parte privada en la que cada alumno proporciona el contenido de su elección a la aplicación.

La parte pública tiene como objetivo preparar la estructura de una aplicación SaaS en la que la parte del backend sigue una arquitectura en capas (presentación, lógica y datos), mientras que el cliente sigue el patrón MVC.

Para la gestión del proyecto utilizamos Jira Scrum con historias de usuario estimadas con SP y contabilizando las horas dedicadas en cada sprint.

Para el desarrollo del proyecto utilizamos NodeJS-Express y MongoDB en el servidor, y en el cliente HTML, CSS y Javascript. La idea es que cada alumno explore, si lo desea, el uso de algún framework de cliente. 

## Instalacion
Descarga el repositorio.
Para que funcione OAuth de Goole hay que definir unas credenciales en la consola de GCP (API y Servicios | Credenciales) usando las url "http://localhost:3000" y "http://localhost:3000/google/callback".
Para que funcione la capa de acceso a datos se debe definir una cadena de conexión (a Monto Atlas o local).
Esas cadenas se pueden incluir en un archivo .env con las siguientes variables de entorno: clientID, secretID, url y connectionString.
Una vez realizado esas operaciones, ejecutar los siguientes comandos:
```
npm i
npm run dev
```

Con ese mismo código se puede implementar integración continúa definiendo esas variables de entorno en el despliegue correspondiente. En el curso utilizamos integración continúa basada en GitHub conectado a un servicio de Cloud Run de GCP.


## Sprint 1. Implementar la arquitectura base del proyecto
El sprint 1 tiene por objetivo construir todos los componentes de la arquitectura de la solución, por eso la denominamos arquitectura base.

El sprint implementa una pequeña funcionalidad de forma vertical, con idea de mostrar todos los componentes, tanto del servidor como del cliente. El único componente que no se incluye es el de la capa de acceso a datos.

El sprint finaliza desplegando este prototipo básico en el servicio de Cloud Run de Google Cloud Platform. El despliegue se puede hacer en línea de comandos o conectando el repositorio de GitHub.

Este primer sprint se estructura en 7 bloques:
1. Puesta en marcha del proyecto
2. Implementar la capa lógica y las pruebas
3. Implementar el backend
4. Implementar la capa Rest
5. Implementar el componente de comunicación Rest
6. Implementar el componente de visualización
7. Desplegar el prototipo

Datos del sprint:
- Duración del sprint: 4 semanas
- Estimación en SP: 35

## Sprint 2. Gestión de usuarios y autenticación
El sprint 2 tiene por objetivo la gestión de usuarios locales y con OAuth. Antes de abordar esas cuestiones, se plantea la problemática de la gestión del estado (LocalStorage y Cookies).

Los bloques del sprint 2 son los siguientes:
1. Gestionar el estado de la aplicación
2. Implementar autorización de terceros con Google
3. Implementar la capa de acceso a datos
4. Implementar Google One Tap
5. Implementar registro de usuarios locales
6. Implementar inicio de sesión de usuarios locales

Datos del sprint:
- Duración del sprint: 4 semanas
- Estimación en SP: 33
