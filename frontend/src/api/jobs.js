import api from "../utils/axios";

export const getJobs = ({ page = 1, limit = 6, ...params } = {}) =>
  api.get("/jobs", { params: { page, limit, ...params } });
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const getStats = () => api.get("/jobs/stats");
export const addJob = (jobData) => api.post("/jobs", jobData);
export const updateJob = (id, jobData) => api.put(`/jobs/${id}`, jobData);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
