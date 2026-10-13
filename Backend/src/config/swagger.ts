import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Analisador de Documentos API",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  paths: {
    "/auth/Cadastro": {
      post: {
        tags: ["Autenticação"],
        summary: "Cadastrar usuário",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nome", "email", "senha_hash"],
                properties: {
                  nome: { type: "string", example: "nome" },
                  email: { type: "string", example: "email@email.com" },
                  senha_hash: { type: "string", example: "Senha123" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Usuário cadastrado" },
          "400": { description: "Dados inválidos" },
          "409": { description: "E-mail já cadastrado" },
          "500": { description: "Erro interno" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Fazer login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "senha_hash"],
                properties: {
                  email: { type: "string", example: "nome@email.com" },
                  senha_hash: { type: "string", example: "Senha123" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Login realizado com sucesso" },
          "401": { description: "Credenciais inválidas" },
          "500": { description: "Erro interno" },
        },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default swaggerDocument;
