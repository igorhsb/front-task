import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AxiosError } from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Preencha todos os campos");
      return;
    }
    try {
      const res = await api.post("/auth/generateToken", { email, password });
      const { token } = res.data;
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      const err = error as AxiosError;
      const finalError = err.response?.data;
      console.error(finalError);
      alert("Dados de login invalídas!");
    }
  };

  const goToRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>E-mail:</label>
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Senha:</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit">Logar</button>

      <p>
        Não tem uma conta? <button onClick={goToRegister}>Cadastre-se aqui.</button>
      </p>
    </form>
  );
}
