import { Router } from "express";
import authController from "../Controllers/authController.js";

const authRouter = Router();

authRouter.post("/Cadastro", authController.Cadastro);
authRouter.post("/login", authController.login);

export default authRouter;
