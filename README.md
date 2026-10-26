# Saúde Recife — Frontend

Aplicação web responsiva e PWA do Saúde Recife. Pacientes pesquisam clínicas e profissionais, consultam disponibilidades, agendam atendimentos e acompanham consultas. Há também painéis para profissionais e administradores.

## Tecnologias

- React 19 e React Router
- Vite
- Tailwind CSS
- Axios
- Lucide React

## Execução local

Requer Node.js 18+ e a API em execução.

```powershell
cd eqp7PI-FRONTEND-main
npm install
Copy-Item .env.example .env
npm run dev
```

Abra `http://localhost:5173`. A porta é fixa: se estiver ocupada, o processo falha em vez de iniciar outra cópia em uma porta diferente.

```powershell
npm run lint
npm run build
```

## Ambiente

Crie `.env` a partir de `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Estrutura

```text
src/
├── components/       # Componentes reutilizáveis
├── contexts/         # Sessão e autenticação
├── pages/            # Telas de paciente, profissional e administração
├── services/         # Cliente HTTP e contratos da API
├── App.jsx           # Rotas e proteção de acesso
└── main.jsx          # Inicialização da aplicação
public/
├── manifest.webmanifest
└── sw.js
```

As telas consomem a API REST. Não há dados estáticos de profissionais, clínicas, consultas ou avaliações no frontend.
