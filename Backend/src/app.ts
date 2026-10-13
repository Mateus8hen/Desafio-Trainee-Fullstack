import express from "express";
import authRouter from "./Routes/authRouter.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

app.use(express.json());

setupSwagger(app);

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "API Funcionando" });
});

export default app;
