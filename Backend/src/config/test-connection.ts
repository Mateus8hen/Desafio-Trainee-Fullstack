import {pool} from "./Database.js";

try {
  const result = await pool.query("SELECT NOW() AS Horario");
  console.log("Conexão com o banco de dados bem-sucedida!", result.rows[0]);
} catch (error) {
  console.error("Erro ao conectar ao banco de dados:", error);
}
finally {
  await pool.end();
} 
