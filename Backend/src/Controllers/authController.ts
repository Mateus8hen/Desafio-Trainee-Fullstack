import type { Request, Response } from "express";
import authService from "../Services/authService.js";

const authController = {
  async Cadastro(req: Request, res: Response) {
    try {
      const { nome, email, senha_hash } = req.body;
      const result = await authService.Cadastro(nome, email, senha_hash);
      res.status(201).json(result);
      
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return res.status(500).json({ error: "Erro ao cadastrar usuário" });
    }
  },
  async login(req: Request, res: Response) {
    try {
      const { email, senha_hash } = req.body;
      const result = await authService.login(email, senha_hash);
      res.status(200).json(result);

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ error: "Erro ao fazer login" });
    }
  },
};

export default authController;
