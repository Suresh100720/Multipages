import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

// 🔐 attach token (optional auth support)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ EXPORT ALL FUNCTIONS

export const fetchCandidates = () => API.get("/candidates");

export const addCandidate = (data) =>
  API.post("/candidates", data);

export const updateCandidate = (id, data) =>
  API.put(`/candidates/${id}`, data);

export const deleteCandidate = (id) =>
  API.delete(`/candidates/${id}`);

export const bulkDelete = (ids) =>
  API.post("/candidates/bulk-delete", { ids });

export const fetchJobs = () => API.get("/jobs");

export const addJob = (data) =>
  API.post("/jobs", data);

export default API;