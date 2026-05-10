import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const apiService = {
  getTasks: (params) => API.get('/tasks', { params }),
  createSummary: (data) => API.post('/summaries', data),
  updateTask: (id, data) => API.patch(`/tasks/${id}`, data),
  deleteTask: (id) => API.delete(`/tasks/${id}`),
};