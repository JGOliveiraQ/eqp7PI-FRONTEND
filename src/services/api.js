import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const mensagemPadrao = 'Erro inesperado ao conectar com o servidor';
    const mensagem = erro.response?.data?.message || mensagemPadrao;

    console.error(`[API] ${erro.config?.method?.toUpperCase()} ${erro.config?.url}: ${mensagem}`);

    return Promise.reject(erro);
  }
);

export const agendarConsulta = async (dadosAgendamento) => {
  const response = await api.post('/agendamentos', dadosAgendamento);
  return response.data;
};

export default api;
