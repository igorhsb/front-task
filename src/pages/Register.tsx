import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  { AxiosError } from 'axios';
import api from "../api";

export default function Register() {
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
      const res = await api.post("/auth/register", { email, password });
      if (res.status === 201) {
          navigate("/");
      }
    } catch (error) {
      const err = error as AxiosError
      const finalError = err.response?.data;
      console.error(finalError);
      alert("Dados de cadastro invalídas!");
    }
  };

  const goToLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
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

      <button type="submit">Cadastrar</button>
      <p>Já tem conta? <button onClick={goToLogin}>Faça login.</button></p>
    </form>
  );
}
