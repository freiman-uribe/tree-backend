export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API Tree - Gestión de Nodos",
    version: "1.0.0",
    description: "API para la gestión de nodos en estructura de árbol. Permite crear, listar y eliminar nodos con relaciones padre-hijo. Soporta traducción de títulos y conversión de zonas horarias.",
    contact: {
      name: "Freiman Uribe",
    },
    license: {
      name: "ISC",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Servidor de desarrollo",
    },
  ],
  tags: [
    {
      name: "Nodes",
      description: "Operaciones relacionadas con nodos",
    },
  ],
  paths: {
    "/nodes": {
      post: {
        tags: ["Nodes"],
        summary: "Crear un nuevo nodo",
        description: "Crea un nodo en la estructura de árbol. El ID se genera automáticamente de forma secuencial. El título se genera automáticamente como la representación textual del ID en el idioma especificado.",
        parameters: [
          {
            name: "Accept-Language",
            in: "header",
            description: "Idioma ISO 639-1 para el título (en, es, fr, de)",
            schema: {
              type: "string",
              default: "en",
            },
            example: "es",
          },
          {
            name: "Timezone",
            in: "header",
            description: "Zona horaria IANA para created_at (ej: America/New_York, Europe/Madrid)",
            schema: {
              type: "string",
            },
            example: "America/New_York",
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  parent: {
                    type: "integer",
                    nullable: true,
                    description: "ID del nodo padre (null para nodos raíz)",
                    example: null,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Nodo creado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    data: {
                      $ref: "#/components/schemas/Node",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Error en la solicitud",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/nodes/parents": {
      get: {
        tags: ["Nodes"],
        summary: "Listar nodos padres",
        description: "Obtiene todos los nodos que no tienen padre (nodos raíz)",
        parameters: [
          {
            name: "Accept-Language",
            in: "header",
            description: "Idioma ISO 639-1 para los títulos (en, es, fr, de)",
            schema: {
              type: "string",
              default: "en",
            },
            example: "es",
          },
          {
            name: "Timezone",
            in: "header",
            description: "Zona horaria IANA para created_at",
            schema: {
              type: "string",
            },
            example: "Europe/Madrid",
          },
        ],
        responses: {
          200: {
            description: "Lista de nodos padres",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    results: {
                      type: "integer",
                      example: 2,
                    },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Node",
                      },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Error del servidor",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/nodes/children": {
      get: {
        tags: ["Nodes"],
        summary: "Listar nodos hijos",
        description: "Obtiene todos los nodos hijos de un nodo padre específico. Permite especificar la profundidad de búsqueda.",
        parameters: [
          {
            name: "parentId",
            in: "query",
            required: true,
            description: "ID del nodo padre",
            schema: {
              type: "integer",
            },
            example: 1,
          },
          {
            name: "depth",
            in: "query",
            required: false,
            description: "Profundidad de búsqueda (1 = solo hijos directos, 2+ = incluye nietos). Default: 1",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
            example: 2,
          },
          {
            name: "Accept-Language",
            in: "header",
            description: "Idioma ISO 639-1 para los títulos (en, es, fr, de)",
            schema: {
              type: "string",
              default: "en",
            },
            example: "fr",
          },
          {
            name: "Timezone",
            in: "header",
            description: "Zona horaria IANA para created_at",
            schema: {
              type: "string",
            },
            example: "Asia/Tokyo",
          },
        ],
        responses: {
          200: {
            description: "Lista de nodos hijos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    results: {
                      type: "integer",
                      example: 3,
                    },
                    data: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Node",
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Error en la solicitud - parentId es requerido o depth inválido",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/nodes/{id}": {
      delete: {
        tags: ["Nodes"],
        summary: "Eliminar un nodo",
        description: "Elimina un nodo específico por su ID. No se puede eliminar un nodo que tenga hijos.",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            description: "ID del nodo a eliminar",
            schema: {
              type: "integer",
            },
            example: 4,
          },
        ],
        responses: {
          200: {
            description: "Nodo eliminado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "success",
                    },
                    message: {
                      type: "string",
                      example: "Nodo eliminado exitosamente",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Error en la solicitud",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          409: {
            description: "Conflicto - El nodo tiene hijos y no puede ser eliminado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Node: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            description: "ID único del nodo (número entero)",
            example: 1,
          },
          parent: {
            type: "integer",
            nullable: true,
            description: "ID del nodo padre (null si es nodo raíz)",
            example: null,
          },
          title: {
            type: "string",
            description: "Título del nodo (representación textual del ID en el idioma solicitado)",
            example: "one",
          },
          created_at: {
            type: "string",
            description: "Fecha de creación del nodo en UTC o zona horaria solicitada",
            example: "2022-10-21 00:00:00",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          status: {
            type: "string",
            example: "error",
          },
          message: {
            type: "string",
            description: "Mensaje de error",
            example: "Error al procesar la solicitud",
          },
        },
      },
    },
  },
};
