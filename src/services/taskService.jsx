
import api from "../api/axios";

export const getTasks = async (params = {}) =>
  (await api.get("/tasks", { params })).data;

export const createTask = async (taskData) =>
  (await api.post("/tasks", taskData)).data;

export const updateTask = async (id, taskData) =>
  (await api.put(`/tasks/${id}`, taskData)).data;

export const deleteTask = async (id) =>
  (await api.delete(`/tasks/${id}`)).data;
