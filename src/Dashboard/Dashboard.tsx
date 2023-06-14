import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import {
  Container,
  Form,
  Button,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import "./Dashboard.css";

interface Task {
  id: number;
  Task: string;
  complete: boolean;
  subtasks?: Task[];
}

const Dashboard: React.FC = () => {
  const [task, setTask] = useState<string>("");
  const [subTask, setSubTask] = useState<string>(""); // New state for subtask input
  const [store, setStore] = useState<Task[]>([]);
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const toggleComplete = (taskId: number, parentId?: number) => {
    setStore((prev) =>
      prev.map((task) => {
        if (task.id === parentId) {
          return {
            ...task,
            subtasks: task.subtasks?.map((subtask) =>
              subtask.id === taskId
                ? { ...subtask, complete: !subtask.complete }
                : subtask
            ),
            complete:
              task.subtasks?.every((subtask) =>
                subtask.id === taskId ? !subtask.complete : subtask.complete
              ) || false,
          };
        }
        if (task.id === taskId) {
          if (task.subtasks?.some((subtask) => !subtask.complete)) {
            alert(
              "All subtasks must be completed before completing the main task."
            );
            return task;
          } else {
            return { ...task, complete: !task.complete };
          }
        }
        return task;
      })
    );
  };

  const addTodo = (parentId?: number): void => {
    const todoText = parentId !== undefined ? subTask : task; // Choose based on subtask or main task
    if (todoText === "") return;
    const newTask: Task = {
      id: new Date().getTime(),
      Task: todoText,
      complete: false,
    };

    if (parentId !== undefined) {
      setStore((prev) =>
        prev.map((task) =>
          task.id === parentId
            ? { ...task, subtasks: [...(task.subtasks || []), newTask] }
            : task
        )
      );
      setSubTask(""); // Reset subTask state
    } else {
      setStore((prev) => [...prev, newTask]);
      setTask(""); // Reset task state
    }
  };

  const editTodo = (id: number, newTask: string, parentId?: number) => {
    setStore((prev) =>
      prev.map((task) => {
        if (task.id === parentId) {
          return {
            ...task,
            subtasks: task.subtasks?.map((subtask) =>
              subtask.id === id ? { ...subtask, Task: newTask } : subtask
            ),
          };
        }
        return task.id === id ? { ...task, Task: newTask } : task;
      })
    );
  };

  const deleteTodo = (id: number, parentId?: number) => {
    setStore((prev) =>
      parentId
        ? prev.map((task) =>
            task.id === parentId
              ? {
                  ...task,
                  subtasks: task.subtasks?.filter(
                    (subtask) => subtask.id !== id
                  ),
                }
              : task
          )
        : prev.filter((task) => task.id !== id)
    );
  };

  const renderTasks = (
    tasks: Task[],
    isSubtask: boolean = false,
    parentId?: number
  ) => {
    return (
      <ListGroup>
        {tasks.map((todo, index) => (
          <div key={todo.id}>
            <ListGroup.Item
              action
              style={{
                textDecoration: todo.complete ? "line-through" : "none",
                display: "flex",
              }}
            >
              <div className="dashboard">
                <input
                  className="mx-2 my-2"
                  type="checkbox"
                  checked={todo.complete}
                  onChange={() => toggleComplete(todo.id, parentId)}
                />

                <h4 style={{ marginLeft: isSubtask ? "20px" : "0px" }}>
                  {index + 1}. {todo.Task}
                </h4>
                <h6 className="mx-2 my-2">
                  {todo.subtasks &&
                    ` (Total Sub-Tasks:  ${
                      todo.subtasks.length
                    } | Completed Sub-Tasks: ${
                      todo.subtasks.filter((st) => st.complete).length
                    } | Pending Sub-Tasks:${
                      todo.subtasks.filter((st) => !st.complete).length
                    } )`}
                </h6>
              </div>
              {tasks?.length > 0 && (
                <div
                  className="d-flex justify-content-end"
                  style={{ right: 0, position: "absolute" }}
                >
                  <Button
                    className="mx-2"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop event propagation
                      const newTask = window.prompt("Edit task", todo.Task);
                      if (newTask) editTodo(todo.id, newTask, parentId);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    className="mx-2"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop event propagation
                      deleteTodo(todo.id, parentId);
                    }}
                  >
                    Delete
                  </Button>

                  {!isSubtask && (
                    <Button
                      className="mx-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event propagation
                        setOpenTaskId(todo.id === openTaskId ? null : todo.id);
                      }}
                    >
                      Subtasks
                    </Button>
                  )}
                  {/* {todo.subtasks && <span style={{ float: "right" }}>▼</span>} */}
                </div>
              )}
            </ListGroup.Item>
            <Modal
              show={openTaskId === todo.id}
              onHide={() => setOpenTaskId(null)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Subtasks</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {todo.subtasks && renderTasks(todo.subtasks, true, todo.id)}
                <Form
                  onSubmit={(e: FormEvent) => {
                    e.preventDefault();
                    addTodo(todo.id);
                  }}
                  style={{ marginLeft: "20px" }}
                >
                  <Form.Group>
                    <Form.Control
                      placeholder="Add Subtask"
                      type="text"
                      value={subTask} // Use subTask state here
                      onChange={
                        (e: ChangeEvent<HTMLInputElement>) =>
                          setSubTask(e.target.value) // Update subTask state here
                      }
                    />
                    <Button type="submit" className="my-2 mx-2">
                      Add Subtask
                    </Button>
                  </Form.Group>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        ))}
      </ListGroup>
    );
  };

  return (
    <>
      <Container>
        <h3 className="text-center">Marquee Dashboard - To Do List</h3>
        <div className="d-flex justify-content-between">
          <h2>Welcome, {user?.username}</h2>
          <Button onClick={logout} className="mx-2">
            Logout
          </Button>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <b>Total Tasks:</b> {store.length} | <b>Completed:</b>{" "}
          {store.filter((task) => task.complete).length} | <b>Pending:</b>{" "}
          {store.filter((task) => !task.complete).length}
        </div>
        <div ref={wrapperRef}>
          <Form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              addTodo();
            }}
          >
            <Form.Group>
              <Form.Control
                type="text"
                value={task}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setTask(e.target.value)
                }
                placeholder="Add Task..."
              />
              <Button type="submit" className="my-2">
                Add Task
              </Button>
            </Form.Group>
          </Form>
          {renderTasks(store)}
        </div>
      </Container>
    </>
  );
};

export default Dashboard;
