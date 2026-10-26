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
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginPaciente = async (email, senha) => {
  const response = await api.post('/auth/login', { email, senha });
  return response.data;
};

export const loginMedico = async (email, senha) => {
  const response = await api.post('/auth/login-medico', { email, senha });
  return response.data;
};

export const loginAdministrador = async (email, senha) => {
  const response = await api.post('/auth/login-admin', { email, senha });
  return response.data;
};

export const agendarConsulta = async (dadosAgendamento) => {
  const response = await api.post('/agendamentos', dadosAgendamento);
  return response.data;
};

export const getMedicos = async (params = {}) => {
  const response = await api.get('/medicos', { params });
  return response.data?.dados ?? [];
};

export const getEspecialidades = async () => {
  const response = await api.get('/especialidades');
  return response.data?.dados ?? [];
};

export const getClinicas = async (busca = '') => {
  const response = await api.get('/clinicas', { params: busca ? { busca } : {} });
  return response.data?.dados ?? [];
};

export const getProfissional = async (id) => {
  const response = await api.get(`/medicos/${id}`);
  return response.data;
};

export const getDisponibilidades = async (params = {}) => {
  const response = await api.get('/disponibilidades', { params });
  return response.data?.dados ?? [];
};

export const getMeusAgendamentos = async () => {
  const response = await api.get('/agendamentos/meus-agendamentos');
  return response.data ?? [];
};

export const cancelarAgendamento = async (id) => {
  const response = await api.put(`/agendamentos/${id}/cancelar`);
  return response.data;
};

export const avaliarAgendamento = async (id, payload) => (await api.post(`/agendamentos/${id}/avaliacao`, payload)).data;

export const reagendarAgendamento = async (id, payload) => {
  const response = await api.put(`/agendamentos/${id}/reagendar`, payload);
  return response.data;
};

export const atualizarPerfil = async (payload) => {
  const response = await api.put('/auth/perfil', payload);
  return response.data;
};

export const getAgendaProfissional = async () => {
  const response = await api.get('/agendamentos/profissional');
  return response.data ?? [];
};

export const cadastrarDisponibilidades = async (profissionalId, horarios) => {
  const response = await api.post(`/disponibilidades/${profissionalId}`, { horarios });
  return response.data;
};
export const removerDisponibilidade = async (id) => (await api.delete(`/disponibilidades/${id}`)).data;
export const getNotificacoes = async () => (await api.get('/notificacoes')).data;
export const marcarTodasNotificacoesComoLidas = async () => (await api.put('/notificacoes/ler-todas')).data;
export const marcarNotificacaoComoLida = async (id) => (await api.put(`/notificacoes/${id}/lida`)).data;

export const getMeuPerfilProfissional = async () => (await api.get('/profissional/me')).data.profissional;
export const atualizarMeuPerfilProfissional = async (payload) => (await api.put('/profissional/me', payload)).data;
export const getDetalheConsultaProfissional = async (id) => (await api.get(`/profissional/consultas/${id}`)).data;
export const atualizarStatusConsulta = async (id, status) => (await api.put(`/profissional/consultas/${id}/status`, { status })).data;
export const salvarProntuario = async (id, payload) => (await api.put(`/profissional/consultas/${id}/prontuario`, payload)).data;
export const getPacienteProfissional = async (id) => (await api.get(`/profissional/pacientes/${id}`)).data;

export const realizarTriagemIa = async (queixa) => {
  const response = await api.post('/ia/triagem', { queixa });
  return response.data;
};

export const adminGetClinicas = async (busca = '') => {
  const response = await api.get('/admin/clinicas', { params: busca ? { busca } : {} });
  return response.data?.dados ?? [];
};

export const adminCreateClinica = async (payload) => {
  const response = await api.post('/admin/clinicas', payload);
  return response.data;
};

export const adminUpdateClinica = async (id, payload) => {
  const response = await api.put(`/admin/clinicas/${id}`, payload);
  return response.data;
};

export const adminGetEspecialidades = async () => {
  const response = await api.get('/admin/especialidades');
  return response.data?.dados ?? [];
};

export const adminCreateEspecialidade = async (payload) => {
  const response = await api.post('/admin/especialidades', payload);
  return response.data;
};

export const adminCreateMedico = async (payload) => {
  const response = await api.post('/admin/medicos', payload);
  return response.data;
};

export const adminUpdateMedico = async (id, payload) => {
  const response = await api.put(`/admin/medicos/${id}`, payload);
  return response.data;
};

export const adminGetLogsAuditoria = async () => {
  const response = await api.get('/admin/logs');
  return response.data?.dados ?? [];
};

export default api;
