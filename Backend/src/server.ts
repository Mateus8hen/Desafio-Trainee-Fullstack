import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "API Funcionando" });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
