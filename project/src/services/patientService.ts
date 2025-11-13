import api from "./api";

export const getPatients = async () => {
  const response = await api.get("/patients");
  return response.data;
};

export const addPatient = async (data: any) => {
  const response = await api.post("/patients", data);
  return response.data;
};

export const updatePatient = async (id: number, data: any) => {
  const response = await api.put(`/patients/${id}`, data);
  return response.data;
};

export const deletePatient = async (id: number) => {
  await api.delete(`/patients/${id}`);
};
