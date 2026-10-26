export const unidadesDeSaude = [
  {
    id: 1,
    nome: 'UBS Engenho do Meio',
    endereco: 'Rua Doutor José Maria, 120 - Engenho do Meio',
    telefone: '(81) 3355-7801',
    horarioFuncionamento: 'Seg a Sex: 07h - 17h',
    latitude: -8.0476,
    longitude: -34.9477,
    servicosDisponiveis: ['Clínica Geral', 'Pediatria', 'Vacinação'],
  },
  {
    id: 2,
    nome: 'UBS Alto José do Pinho',
    endereco: 'Rua Vasco da Gama, 45 - Alto José do Pinho',
    telefone: '(81) 3355-7802',
    horarioFuncionamento: 'Seg a Sex: 07h - 17h',
    latitude: -8.0234,
    longitude: -34.8912,
    servicosDisponiveis: ['Clínica Geral', 'Odontologia', 'Vacinação'],
  },
  {
    id: 3,
    nome: 'Policlínica Lessa de Andrade',
    endereco: 'Rua Cônego Barata, 668 - Tamarineira',
    telefone: '(81) 3355-7803',
    horarioFuncionamento: 'Seg a Sex: 07h - 19h',
    latitude: -8.0312,
    longitude: -34.9056,
    servicosDisponiveis: ['Clínica Geral', 'Cardiologia', 'Dermatologia', 'Vacinação'],
  },
]

export const especialidades = [
  { id: 1, nome: 'Clínica Geral' },
  { id: 2, nome: 'Pediatria' },
  { id: 3, nome: 'Cardiologia' },
  { id: 4, nome: 'Dermatologia' },
  { id: 5, nome: 'Odontologia' },
  { id: 6, nome: 'Ginecologia' },
]

export const horariosDisponiveis = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '13:00', '13:30', '14:00',
  '14:30', '15:00', '15:30', '16:00', '16:30',
]

export const profissionais = [
  {
    id: '65f1a2b3c4d5e6f7a8b9c0d1',
    nome: 'Dra. Ana Beatriz Silva',
    crm: 'CRM-PE 14258',
    especialidade: 'Clínica Geral',
    clinicaId: '65f1a2b3c4d5e6f7a8b9c001',
    clinicaNome: 'UBS Engenho do Meio',
    endereco: 'Rua Doutor José Maria, 120 - Engenho do Meio',
  },
  {
    id: '65f1a2b3c4d5e6f7a8b9c0d2',
    nome: 'Dr. Carlos Eduardo Ramos',
    crm: 'CRM-PE 19832',
    especialidade: 'Cardiologia',
    clinicaId: '65f1a2b3c4d5e6f7a8b9c003',
    clinicaNome: 'Policlínica Lessa de Andrade',
    endereco: 'Rua Cônego Barata, 668 - Tamarineira',
  },
  {
    id: '65f1a2b3c4d5e6f7a8b9c0d3',
    nome: 'Dra. Mariana Vasconcelos',
    crm: 'CRM-PE 22104',
    especialidade: 'Geriatria',
    clinicaId: '65f1a2b3c4d5e6f7a8b9c002',
    clinicaNome: 'UBS Alto José do Pinho',
    endereco: 'Rua Vasco da Gama, 45 - Alto José do Pinho',
  },
]

