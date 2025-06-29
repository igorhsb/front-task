import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api from "../api";
import styles from "./Dashboard.module.css";
import { Dialog } from "./Dialog";

type Task = {
  id: number;
  title: string;
  completed : boolean;
  createdAt : string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDiolog, setOpenCreateDiolog] = useState(false);
  const [openUpdateDiolog, setOpenUpdateDiolog] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<number>();

  const handleUpdateTaskList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const res = await api.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data.tasks);
    } catch (error) {
      const err = error as AxiosError;
      const finalError = err.response?.data;
      console.error("Erro ao buscar tarefas:", finalError);
      alert("Erro ao carregar tarefas");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    if (!newTaskTitle) {
      alert("Preencha o título da tarefa!");
    } else {
      try {
        await api.post(
          "/tasks",
          { title: newTaskTitle },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await handleUpdateTaskList();
        setOpenCreateDiolog(false);
      } catch (error) {
        const err = error as AxiosError;
        const finalError = err.response?.data;
        console.error("Erro ao buscar tarefas:", finalError);
        alert("Erro ao carregar tarefas");
      } finally {
        setLoading(false);
      }
    }
    setNewTaskTitle("");
  };

  const handleDeleteTask = async (taskID: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      await api.delete("/tasks/" + taskID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await handleUpdateTaskList();
      alert("Tarefa deletada com sucesso!");
    } catch (error) {
      const err = error as AxiosError;
      const finalError = err.response?.data;
      console.error("Erro ao deletar tarefa:", finalError);
      alert("Erro ao deletar tarefa");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      await api.patch(
        "/tasks/" + selectedTask,
        { title: newTaskTitle, completed: newTaskStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await handleUpdateTaskList();
      setOpenUpdateDiolog(false);
      alert("Tarefa atualizada com sucesso!");
    } catch (error) {
      const err = error as AxiosError;
      const finalError = err.response?.data;
      console.error("Erro ao atualizar tarefa:", finalError);
      alert("Erro ao atualizar tarefa");
    } finally {
      setLoading(false);
    }
    setNewTaskTitle("");
    setNewTaskStatus(false);
  };

  const handleSelectUpdateTask = async (taskID: number) => {
    setSelectedTask(taskID);
    setOpenUpdateDiolog(true);
  };

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
              <button
                className={styles.createTaskBtn}
                onClick={() => setOpenCreateDiolog(true)}
              >
                Criar nova tarefa
              </button>
              <button
                className={styles.updateTaskListBtn}
                onClick={handleUpdateTaskList}
              >
                Atualizar lista de tarefas
              </button>
            </div>
            {loading ? (
              <p>Carregando tarefas...</p>
            ) : tasks.length > 0 ? (
              <table className={styles.tg}>
                <thead>
                  <tr>
                    <th className={styles.tgBaqh} colSpan="5">
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
                      <td className={styles.tgBaqh}>{task.completed ? "Sim" : "Não"}</td>
                      <td className={styles.tgBaqh}>{task.createdAt}</td>
                      <td className={styles.tgBaqh}>
                        <button
                          className={styles.updateTaskBtn}
                          onClick={() => handleSelectUpdateTask(task.id)}
                        >
                          Atualizar
                        </button>
                        <button
                          className={styles.deleteTaskBtn}
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Você não possui tarefas ainda.</p>
            )}
          </div>
          <Dialog
            open={openCreateDiolog}
            onClose={() => setOpenCreateDiolog(false)}
          >
            <div className={styles.modalContent}>
              <p className={styles.titleModal}>Titulo da tarefa</p>
              <input
                className={styles.inputModal}
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button
                className={styles.createTaskBtnModal}
                onClick={handleCreateTask}
              >
                Criar
              </button>
            </div>
          </Dialog>
          <Dialog
            open={openUpdateDiolog}
            onClose={() => setOpenUpdateDiolog(false)}
          >
            <div className={styles.modalContent}>
              <p className={styles.titleModal}>Atualizar dados da tarefa</p>
              <label>Titulo:</label>
              <input
                className={styles.inputModal}
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <label>Completo:</label>
              <input
                className={styles.inputModal}
                type="checkbox"
                checked={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.checked)}
              />
              <button
                className={styles.createTaskBtnModal}
                onClick={handleUpdateTask}
              >
                Criar
              </button>
            </div>
          </Dialog>
        </div>
      </div>
      <div className={styles.footer}>
        <p> Desenvolvido por: Lucy a rainha da sonequinha</p>
      </div>
    </div>
  );
}
