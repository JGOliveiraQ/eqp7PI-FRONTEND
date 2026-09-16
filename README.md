# 🏥 Saúde Recife

Plataforma digital de saúde pública para a cidade do Recife, desenvolvida como PWA (Progressive Web App) com React + Vite.

## Pré-requisitos

- **Node.js** ≥ 18
- **npm** ≥ 9

## Inicialização em Ambiente Limpo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/saude-recife-frontend.git
cd saude-recife-frontend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Scripts Disponíveis

| Script           | Comando            | Descrição                                   |
| ---------------- | ------------------ | ------------------------------------------- |
| Desenvolvimento  | `npm run dev`      | Inicia o servidor Vite em modo dev          |
| Build            | `npm run build`    | Gera o build de produção em `/dist`         |
| Preview          | `npm run preview`  | Visualiza o build de produção localmente    |
| Lint             | `npm run lint`     | Executa o ESLint em todos os arquivos       |

## Rotas Principais

| Rota            | Página              | Descrição                                                |
| --------------- | ------------------- | -------------------------------------------------------- |
| `/`             | Home                | Tela inicial com ações rápidas e toggle de acessibilidade |
| `/agendamento`  | Agendamento         | Formulário para agendar consultas em unidades de saúde   |
| `/unidades`     | Unidades de Saúde   | Lista e busca de unidades de saúde com informações       |
| `/perfil`       | Perfil              | Dados do usuário, cartão SUS e menu de opções            |

## Acessibilidade — Modo Idoso

A aplicação possui um **Modo Idoso** que pode ser ativado pelo botão na tela inicial. Ao ativar:

- Todos os textos aumentam de tamanho
- Botões e elementos interativos ficam maiores
- Ícones são ampliados para melhor visibilidade

O estado é gerenciado globalmente pelo `AcessibilidadeContext`.

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── context/          # Contextos React (AcessibilidadeContext)
├── data/             # Dados mock para desenvolvimento
├── pages/            # Páginas da aplicação
├── services/         # Configuração de API (axios)
├── App.jsx           # Componente raiz com rotas
├── index.css         # Estilos globais + Tailwind
└── main.jsx          # Ponto de entrada
```

## Tecnologias

- **React 19** — Biblioteca de UI
- **Vite 6** — Bundler e dev server
- **React Router 7** — Roteamento SPA
- **Tailwind CSS 3** — Estilização utilitária
- **Axios** — Cliente HTTP
- **Lucide React** — Ícones
- **ESLint 9** — Linting

## Licença

Este projeto é de uso público, desenvolvido para a Prefeitura do Recife.

