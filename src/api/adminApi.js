import axios from "axios";

const API_BASE_URL = `${window.API_CONFIG.VITE_API_BASE_URL}/api/vehicleaudit`;

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('accessToken');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  };
};

export const fetchAudits = async (page, size) => {
  const response = await axios.get(`${API_BASE_URL}/audits`, {
    params: {
      page: page - 1, // API는 0-based, UI는 1-based
      size,
    },
    ...getAuthHeaders(),
  });
  return response.data;
};

export const createTestAudit = async () => {
  const response = await axios.post(
    `${API_BASE_URL}/audits`,
    {
      model: "SONATA",
      lineCode: "A" + Math.floor(Math.random() * 5 + 1),
    },
    getAuthHeaders()
  );
  return response.data;
};

export const fetchInspectionDetail = async (inspectionId) => {
  const response = await axios.get(
    `${API_BASE_URL}/inspections/${inspectionId}`,
    getAuthHeaders()
  );
  return response.data;
};
