# API Tree - Gestión de Nodos

API RESTful para la gestión de nodos en estructura de árbol, desarrollada con Node.js, TypeScript, Express y MongoDB.

## 📋 Descripción

Esta API permite crear y gestionar nodos en una estructura de árbol jerárquica. Implementa arquitectura hexagonal (puertos y adaptadores) para mantener el código limpio, desacoplado y siguiendo las mejores prácticas de desarrollo.

### 🌟 Características principales:

- ✅ **IDs automáticos**: Los IDs se generan automáticamente de forma secuencial (1, 2, 3...)
- ✅ **Traducción i18n**: Títulos generados automáticamente en 4 idiomas (en, es, fr, de)
- ✅ **Conversión de zona horaria**: Fechas ajustadas según zona horaria IANA
- ✅ **Búsqueda recursiva**: Parámetro `depth` para obtener árbol completo
- ✅ **Validación robusta**: Sistema de validaciones en capa de aplicación
- ✅ **Documentación Swagger**: API interactiva con OpenAPI 3.0

## 🏗️ Arquitectura

El proyecto sigue los principios de **arquitectura hexagonal** (Clean Architecture):

```
src/
├── application/           # Casos de uso (lógica de negocio)
│   ├── CreateNode.ts
│   ├── DeleteNode.ts
│   ├── ListChildren.ts
│   ├── ListParents.ts
│   └── validators/
│       └── NodeValidator.ts
├── domain/               # Entidades y contratos
│   ├── Node.ts
│   ├── NodeRepository.ts
│   └── errors/
│       └── AppError.ts
├── infrastructure/       # Implementaciones técnicas
│   ├── db/
│   │   ├── MongoNodeRepository.ts
│   │   └── NodeSchema.ts
│   ├── http/
│   │   ├── routes.ts
│   │   ├── controllers/
│   │   │   └── NodeController.ts
│   │   └── middlewares/
│   │       ├── asyncHandler.ts
│   │       ├── errorHandler.ts
│   │       └── requestLogger.ts
│   ├── swagger/
│   │   └── swagger.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── TranslationService.ts
│   │   └── TimezoneService.ts
│   └── server.ts
└── seed/                # Scripts de inicialización
    └── seed.ts
```

### Principios aplicados:
- ✅ **Separación de responsabilidades**: Domain, Application, Infrastructure
- ✅ **Inversión de dependencias**: Domain no depende de Infrastructure
- ✅ **Single Responsibility**: Cada clase tiene una única responsabilidad
- ✅ **Open/Closed**: Extensible mediante interfaces
- ✅ **Manejo robusto de errores**: Errores personalizados y middleware centralizado
- ✅ **Validaciones**: Validación de entrada en capa de aplicación
- ✅ **Logging estructurado**: Sistema de logs con niveles

## 🚀 Tecnologías

- **Node.js** v18+ - Runtime de JavaScript
- **TypeScript** 5.x - Superset de JavaScript con tipado estático
- **Express** 5.x - Framework web minimalista
- **MongoDB** - Base de datos NoSQL orientada a documentos
- **Mongoose** 9.x - ODM elegante para MongoDB
- **Swagger UI** - Documentación interactiva OpenAPI 3.0
- **dotenv** - Gestión de variables de entorno

## 📋 Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** >= 5.0 (ejecutándose localmente o en la nube)
- **Git** para control de versiones

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/freiman-uribe/tree-backend.git
cd tree-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tree-api
LOG_LEVEL=info
```

#### Variables de entorno disponibles:

- `PORT`: Puerto donde se ejecutará el servidor (default: 3000)
- `NODE_ENV`: Entorno de ejecución (development, production)
- `MONGODB_URI`: URL de conexión a MongoDB
- `LOG_LEVEL`: Nivel de logs (error, warn, info, debug)

### 4. Asegurar MongoDB en ejecución

**Opción A: MongoDB local**
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

**Opción B: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/tree-api
```

## ⚡ Inicio Rápido

### 1. Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### 2. Cargar datos de prueba

```bash
npm run seed
```

Esto creará 12 nodos de ejemplo en 3 árboles diferentes.

### 3. Ver documentación interactiva

Abre tu navegador en:
```
http://localhost:3000/api-docs
```

### 4. Crear tu primer nodo

```bash
curl -X POST http://localhost:3000/api/nodes \
  -H "Content-Type: application/json" \
  -H "Accept-Language: es" \
  -d '{"parent": null}'
```

Respuesta:
```json
{
  "status": "success",
  "data": {
    "id": 13,
    "parent": null,
    "title": "trece",
    "created_at": "2026-02-04 10:30:00"
  }
}
```

## 🎯 Uso Detallado

### Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### Ejecutar el seed de datos (opcional)

Para poblar la base de datos con datos de ejemplo:

```bash
npm run seed
```

### Acceder a la documentación Swagger

Una vez iniciado el servidor, abre tu navegador en:

```
http://localhost:3000/api-docs
```

## 📚 Documentación de la API

Base URL: `http://localhost:3000/api`

### Endpoints disponibles

#### 1. Crear un nodo

**POST** `/api/nodes`

Crea un nuevo nodo en la estructura de árbol.

**⚡ Características automáticas:**
- El **ID** se genera automáticamente de forma secuencial (1, 2, 3...)
- El **title** se genera automáticamente según el ID y el idioma del header

**Headers:**
```
Content-Type: application/json
Accept-Language: es          # Idioma ISO 639-1 (en, es, fr, de)
Timezone: America/New_York   # Zona horaria IANA (opcional)
```

**Body:**
```json
{
  "parent": null
}
```

**Parámetros del body:**
- `parent`: Opcional, número (ID del nodo padre) o null para nodos raíz

**Ejemplo con nodo raíz:**
```json
{}
```

**Ejemplo con nodo hijo:**
```json
{
  "parent": 1
}
```

**Respuestas:**

✅ **201 Created**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "parent": null,
    "title": "uno",
    "created_at": "2026-02-04 10:30:00"
  }
}
```

**Ejemplos de traducción:**
- `Accept-Language: en` → `"title": "one"`
- `Accept-Language: es` → `"title": "uno"`
- `Accept-Language: fr` → `"title": "un"`
- `Accept-Language: de` → `"title": "eins"`

❌ **400 Bad Request**
```json
{
  "status": "error",
  "message": "El campo 'parent' debe ser un número entero positivo o null"
}
```

❌ **404 Not Found**
```json
{
  "status": "error",
  "message": "El nodo padre con ID 1 no existe"
}
```

#### 2. Listar nodos padres

**GET** `/api/nodes/parents`

Obtiene todos los nodos raíz (sin padre).

**Headers opcionales:**
```
Accept-Language: es          # Traduce los títulos al idioma especificado
Timezone: America/New_York   # Convierte las fechas a la zona horaria
```

**Respuestas:**

✅ **200 OK**
```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "id": 1,
      "parent": null,
      "title": "uno",
      "created_at": "2026-02-04 10:30:00"
    },
    {
      "id": 5,
      "parent": null,
      "title": "cinco",
      "created_at": "2026-02-04 10:31:00"
    }
  ]
}
```

#### 3. Listar nodos hijos

**GET** `/api/nodes/children?parentId={id}&depth={nivel}`

Obtiene todos los nodos hijos de un nodo padre específico.

**Query Parameters:**
- `parentId` (requerido): ID numérico del nodo padre
- `depth` (opcional): Profundidad de búsqueda recursiva (default: 1)
  - `depth=1`: Solo hijos directos
  - `depth=2`: Hijos y nietos
  - `depth=3`: Hijos, nietos y bisnietos
  - etc.

**Headers opcionales:**
```
Accept-Language: es          # Traduce los títulos al idioma especificado
Timezone: America/New_York   # Convierte las fechas a la zona horaria
```

**Ejemplo:**
```
GET /api/nodes/children?parentId=1&depth=2
```

**Validaciones:**
- El `parentId` debe ser un número entero positivo
- El nodo padre debe existir en la base de datos
- El `depth` debe ser un número entero positivo

**Respuestas:**

✅ **200 OK**
```json
{
  "status": "success",
  "results": 3,
  "data": [
    {
      "id": 2,
      "parent": 1,
      "title": "dos",
      "created_at": "2026-02-04 10:32:00"
    },
    {
      "id": 3,
      "parent": 1,
      "title": "tres",
      "created_at": "2026-02-04 10:33:00"
    },
    {
      "id": 4,
      "parent": 2,
      "title": "cuatro",
      "created_at": "2026-02-04 10:34:00"
    }
  ]
}
```

❌ **400 Bad Request**
```json
{
  "status": "error",
  "message": "El parámetro 'parentId' es requerido"
}
```

❌ **404 Not Found**
```json
{
  "status": "error",
  "message": "El nodo padre con ID 1 no existe"
}
```

#### 4. Eliminar un nodo

**DELETE** `/api/nodes/:id`

Elimina un nodo específico por su ID.

**Path Parameters:**
- `id` (requerido): ID numérico del nodo a eliminar

**Validaciones:**
- El ID debe ser un número entero positivo
- El nodo debe existir
- El nodo NO debe tener hijos

**Ejemplo:**
```
DELETE /api/nodes/4
```

**Respuestas:**

✅ **200 OK**
```json
{
  "status": "success",
  "message": "Nodo eliminado exitosamente"
}
```

❌ **404 Not Found**
```json
{
  "status": "error",
  "message": "El nodo con ID 4 no existe"
}
```

❌ **409 Conflict**
```json
{
  "status": "error",
  "message": "No se puede eliminar un nodo que tiene nodos hijos"
}
```

## 📝 Modelo de Datos

### Node

```typescript
interface Node {
  id: number;             // ID único numérico (usado como _id en MongoDB)
  parent: number | null;  // ID del nodo padre (null para nodos raíz)
  title: string;          // Título del nodo (1-200 caracteres)
  created_at: Date;       // Fecha de creación (auto-generada)
}
```

**Nota técnica:** 
- El campo `id` numérico se almacena como `_id` en MongoDB (sin UUID por defecto)
- MongoDB no genera `_id` automático, se usa el `id` numérico proporcionado
- Esto garantiza IDs secuenciales y predecibles (1, 2, 3, ...)

**Reglas de negocio:**
- Un nodo puede ser raíz (`parent: null`) o hijo (`parent: número`)
- Un nodo con hijos no puede ser eliminado
- El campo `parent` debe referenciar un nodo existente

## 🌍 Traducción i18n

La API soporta traducción automática de títulos en 4 idiomas mediante el header `Accept-Language`.

### Idiomas soportados:

- **en** - English (Inglés)
- **es** - Español
- **fr** - Français (Francés)
- **de** - Deutsch (Alemán)

### Cómo usar:

Envía el header `Accept-Language` en tus peticiones:

```http
GET /api/nodes/parents
Accept-Language: es
```

### Ejemplos de traducción:

| ID | en (English) | es (Español) | fr (Français) | de (Deutsch) |
|----|--------------|---------------|----------------|---------------|
| 1  | one          | uno           | un             | eins          |
| 2  | two          | dos           | deux           | zwei          |
| 3  | three        | tres          | trois          | drei          |
| 10 | ten          | diez          | dix            | zehn          |
| 20 | twenty       | veinte        | vingt          | zwanzig       |
| 100| one hundred  | cien          | cent           | einhundert    |

### Soporte de números:

La API incluye traducciones para números del 0 al 100, incluyendo:
- Números básicos (0-25)
- Decenas (30, 40, 50, 60, 70, 80, 90)
- Cien (100)

Para números no mapeados, se devuelve el número como string.

## 🕒 Conversión de Zona Horaria

La API puede convertir las fechas `created_at` a cualquier zona horaria IANA mediante el header `Timezone`.

### Cómo usar:

```http
GET /api/nodes/parents
Timezone: America/New_York
```

### Ejemplos de zonas horarias:

- **America/New_York** - Hora del Este (USA)
- **America/Los_Angeles** - Hora del Pacífico (USA)
- **America/Mexico_City** - Hora de México
- **Europe/Madrid** - Hora de España
- **Europe/London** - Hora de Reino Unido
- **Asia/Tokyo** - Hora de Japón
- **Australia/Sydney** - Hora de Australia

### Formato de salida:

Sin timezone (UTC):
```json
"created_at": "2026-02-04 10:30:00"
```

Con timezone:
```json
"created_at": "2026-02-04 05:30:00"  // America/New_York (UTC-5)
```

### Ejemplo completo:

```http
POST /api/nodes
Content-Type: application/json
Accept-Language: es
Timezone: Europe/Madrid

{
  "parent": null
}
```

Respuesta:
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "parent": null,
    "title": "uno",
    "created_at": "2026-02-04 11:30:00"  // Hora de Madrid (UTC+1)
  }
}
```

## 🛡️ Manejo de Errores

La API implementa un sistema robusto de manejo de errores:

### Errores personalizados:
- `ValidationError` (400): Errores de validación de entrada
- `NotFoundError` (404): Recurso no encontrado
- `ConflictError` (409): Conflicto con el estado actual
- `DatabaseError` (500): Errores de base de datos

### Estructura de respuesta de error:
```json
{
  "status": "error",
  "message": "Descripción del error",
  "details": "Información adicional (solo en desarrollo)"
}
```

## 📊 Sistema de Logs

La aplicación incluye un sistema de logging estructurado con niveles:

- **ERROR**: Errores críticos
- **WARN**: Advertencias
- **INFO**: Información general (default)
- **DEBUG**: Información detallada de depuración

**Configurar nivel de logs:**
```env
LOG_LEVEL=debug
```

**Ejemplo de logs:**
```
[2026-02-04T10:30:00.000Z] [INFO] API corriendo en http://localhost:3000
[2026-02-04T10:30:15.123Z] [INFO] Request completed successfully {"method":"POST","path":"/api/nodes","statusCode":201,"duration":"45ms","ip":"::1"}
[2026-02-04T10:31:00.456Z] [WARN] Request completed with client error {"method":"GET","path":"/api/nodes/invalid","statusCode":404,"duration":"12ms","ip":"::1"}
```

## 🧪 Ejemplos de uso con Swagger

La interfaz de Swagger UI proporciona:

- ✅ **Documentación interactiva**: Todos los endpoints con descripciones detalladas
- ✅ **Pruebas en vivo**: Ejecuta peticiones directamente desde la interfaz
- ✅ **Esquemas de datos**: Visualiza la estructura de los objetos JSON
- ✅ **Códigos de respuesta**: Documentación de respuestas exitosas y errores
- ✅ **Ejemplos**: Ejemplos de request/response para cada endpoint
- ✅ **Validaciones**: Documentación de todas las validaciones requeridas

## 🔧 Scripts disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Ejecutar seed de datos
npm run seed

# Compilar TypeScript a JavaScript
npm run build

# Ejecutar pruebas (si están configuradas)
npm test
```

## 🗂️ Control de Versiones

El proyecto usa **Git** para control de versiones. Se incluye un archivo `.gitignore` configurado para excluir:

- `node_modules/`
- Archivos de entorno (`.env`)
- Archivos de logs
- Archivos de build (`dist/`)
- Archivos del IDE

**Comandos Git básicos:**
```bash
# Inicializar repositorio
git init

# Agregar archivos
git add .

# Hacer commit
git commit -m "Mensaje descriptivo"

# Ver estado
git status
```

## 🚀 Mejores Prácticas Implementadas

✅ **Arquitectura hexagonal** - Separación clara de capas  
✅ **TypeScript** - Tipado estático para mayor seguridad  
✅ **IDs automáticos** - Generación secuencial de identificadores  
✅ **Traducción i18n** - Soporte multi-idioma (en, es, fr, de)  
✅ **Zona horaria dinámica** - Conversión a cualquier zona IANA  
✅ **Búsqueda recursiva** - Parámetro depth para árboles complejos  
✅ **Validaciones robustas** - En capa de aplicación  
✅ **Manejo de errores centralizado** - Middleware global  
✅ **Logging estructurado** - Trazabilidad de operaciones  
✅ **Variables de entorno** - Configuración externalizada  
✅ **Documentación Swagger** - API autodocumentada con OpenAPI 3.0  
✅ **Respuestas estandarizadas** - Formato consistente  
✅ **Control de versiones** - Git configurado  
✅ **Código limpio** - Principios SOLID  
✅ **MongoDB optimizado** - Índices y _id numérico personalizado  
✅ **Manejo graceful shutdown** - Cierre ordenado de conexiones  

## 🤝 Autor

**Freiman Uribe**

## 📄 Licencia

ISC
