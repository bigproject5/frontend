import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/operation";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('accessToken');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  };
};

export const fetchWorkers = async () => {
  const response = await axios.get(`${API_BASE_URL}/workers`, getAuthHeaders());
  return response.data;
};

export const deleteWorker = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/workers/${id}`, getAuthHeaders());
  return response.data;
};
