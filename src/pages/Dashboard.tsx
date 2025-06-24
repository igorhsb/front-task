import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  { AxiosError } from 'axios';
import api from "../api";

type Task = {
  id: number;
  title: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(res.data.tasks); // <- Aqui salvamos as tarefas no state
      } catch (error) {
		const err = error as AxiosError
      	const finalError = err.response?.data;
        console.error("Erro ao buscar tarefas:", finalError);
        alert("Erro ao carregar tarefas");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      {loading ? (
        <p>Carregando tarefas...</p>
      ) : tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      ) : (
        <p>Você não possui tarefas ainda.</p>
      )}
    </div>
  );
}
