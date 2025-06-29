import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../api";
import styles from "./Dashboard.module.css";

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
        const err = error as AxiosError;
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
      <div className={styles.main}>
        <div className={styles.header}>
          <h1> Projeto de gerenciamento de task </h1>
        </div>
        <div className={styles.content}>
          <div className={styles.container}>
            <p className={styles.title}>Dashboard</p>
            <div className={styles.buttonsDiv}>
              <button className={styles.createTaskBtn}>Criar nova tarefa</button>
              <button className={styles.updateTaskBtn}>Atualizar lista de tarefas</button>
            </div>
            {loading ? (
              <p>Carregando tarefas...</p>
            ) : tasks.length > 0 ? (
              <table className={styles.tg}>
                <thead>
                  <tr>
                    <th className={styles.tgBaqh} colspan="5">
                      Tarefas registradas&nbsp;&nbsp;
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.tgBaqh}>Id</td>
                    <td className={styles.tgBaqh}>Titulo</td>
                    <td className={styles.tgBaqh}>Finalizada?</td>
                    <td className={styles.tgBaqh}>Data da criação</td>
                    <td className={styles.tgBaqh}>Ações</td>
                  </tr>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className={styles.tgBaqh}>{task.id}</td>
                      <td className={styles.tgBaqh}>{task.title}</td>
                      <td className={styles.tgBaqh}>{task.title}</td>
                      <td className={styles.tgBaqh}>{task.title}</td>
                      <td className={styles.tgBaqh}><button className={styles.deleteTaskBtn}>Deletar tarefa</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Você não possui tarefas ainda.</p>
            )}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <p> Desenvolvido por: Lucy a rainha da sonequinha</p>
      </div>
    </div>
  );
}
