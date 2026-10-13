import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/database.js";

const AuthService = {
  async Cadastro(nome: string, email: string, senha_hash: string) {
    if (
      typeof nome !== "string" ||
      typeof email !== "string" ||
      typeof senha_hash !== "string" ||
      !nome ||
      !email.trim() ||
      !senha_hash.trim()
    ) {
      throw new Error("Email e senha não podem ser vazios");
    }

    const emailNormalizado = email.toLowerCase();

    if (senha_hash.length < 8) {
      throw new Error("A senha deve ter pelo menos 8 caracteres");
    }

    const usuarioExistente = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [emailNormalizado],
    );

    if (usuarioExistente.rowCount && usuarioExistente.rowCount > 0) {
      throw new Error("Email já cadastrado");
    }

    const senhahash = await bcrypt.hash(senha_hash, 10);

    const resultado = await pool.query(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome,email",
      [nome, emailNormalizado, senhahash],
    );

    return resultado.rows[0];
  },

  async login(email: string, senha: string) {
    if (
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !email.trim() ||
      !senha.trim()
    ) {
      throw new Error("Email e Senha são obrigatórios");
    }

    const emailNormalizado = email.trim().toLowerCase();

    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE LOWER(email) = $1",
      [emailNormalizado],
    );

    const usuario = resultado.rows[0];

    if (!usuario) {
      throw new Error("Email ou senha inválidos");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET || "segredo",
      {
        expiresIn: "1h",
      },
    );

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      token,
    };
  },
};

export default AuthService;
