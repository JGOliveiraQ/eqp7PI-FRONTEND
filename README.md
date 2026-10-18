# Saúde Recife — PWA Frontend

Interface de usuário progressiva (PWA - Progressive Web App) da plataforma municipal **Saúde Recife**, desenvolvida em React com Vite e Tailwind CSS. A aplicação foi projetada com arquitetura centrada na inclusão digital e acessibilidade especializada, tendo como foco principal o público da terceira idade para acesso simplificado a agendamentos, unidades básicas de saúde e histórico médico do SUS.

---

## 📋 Pré-requisitos

Antes de iniciar a configuração local, certifique-se de possuir em seu sistema operacional:

- **Node.js**: Versão `18.0.0` ou superior (recomendado `20.x LTS`). Verifique com:
  ```bash
  node -v
  ```
- **Git**: Sistema de controle de versão. Verifique com:
  ```bash
  git --version
  ```
- **Backend Saúde Recife**: Recomenda-se ter a API REST do Saúde Recife em execução local (`http://localhost:5000/api`) ou ter acesso a um ambiente de homologação ativo.

---

## 🚀 Passo a Passo de Setup (Checklist de Onboarding)

Siga este checklist passo a passo para colocar o frontend em funcionamento do zero:

- [ ] **1. Clonar o repositório**
  ```bash
  git clone https://github.com/seu-usuario/saude-recife-frontend.git
  cd saude-recife-frontend
  ```

- [ ] **2. Instalar dependências**
  ```bash
  npm install
  ```

- [ ] **3. Configurar variáveis de ambiente**
  Crie o seu arquivo `.env` a partir do modelo `.env.example`:
  - **Linux / macOS:**
    ```bash
    cp .env.example .env
    ```
  - **Windows (PowerShell):**
    ```powershell
    Copy-Item .env.example .env
    ```
  Por padrão, o arquivo estará configurado para conectar-se ao backend local em `http://localhost:5000/api`.

- [ ] **4. Iniciar o aplicativo localmente**
  ```bash
  npm run dev
  ```
  O Vite iniciará o servidor local de desenvolvimento e fornecerá o endereço de acesso no terminal:
  ```text
  VITE v6.0.5  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ```
  Abra `http://localhost:5173/` em seu navegador para utilizar o Saúde Recife.

---

## 🔐 Variáveis de Ambiente

O Vite utiliza o prefixo `VITE_` para expor variáveis ao código cliente do navegador. O arquivo `.env` deve conter a seguinte definição:

| Variável | Tipo | Obrigatória | Descrição | Exemplo de Valor |
| :--- | :--- | :---: | :--- | :--- |
| `VITE_API_URL` | String | Sim | URL base completa para consumo dos endpoints da API REST do Saúde Recife pelo cliente Axios. | `http://localhost:5000/api` |

---

## 🛠️ Scripts Disponíveis

Os comandos abaixo estão configurados no `package.json` para o ciclo de vida do desenvolvimento:

| Script | Comando | Descrição |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Inicia o servidor local de desenvolvimento com Hot Module Replacement (HMR) extremamente veloz. |
| `npm run build` | `vite build` | Compila os arquivos da aplicação, otimizando assets e gerando os pacotes estáticos prontos para produção na pasta `/dist`. |
| `npm run preview` | `vite preview` | Executa um servidor HTTP local estático servindo a pasta `/dist` para validar o comportamento do build de produção antes do deploy. |
| `npm run lint` | `eslint .` | Analisa todos os arquivos do projeto com ESLint 9 para detectar problemas de sintaxe, regras de React Hooks e padrões de formatação. |

---

## ♿ Modo Terceira Idade & Acessibilidade

O Saúde Recife adota um design inclusivo e adaptativo, garantindo que cidadãos idosos ou com baixa acuidade visual e motora tenham facilidade de navegação e leitura:

### 1. Gerenciamento Global de Estado (`AcessibilidadeContext`)
- O estado de acessibilidade é centralizado através do contexto React em `src/context/AcessibilidadeContext.jsx`, expondo a flag booleana `modoIdoso` e o método de alternância `alternarModoIdoso`.
- Qualquer componente da aplicação consome essas informações diretamente por meio do hook customizado `useAcessibilidade()`:
  ```jsx
  import { useAcessibilidade } from '../context/AcessibilidadeContext'

  function MeuComponente() {
    const { modoIdoso, alternarModoIdoso } = useAcessibilidade()
    // ...
  }
  ```

### 2. Escala Tipográfica e Contraste Adaptativo
Quando o **Modo Idoso** é ativado:
- **Tamanho das Fontes:** Os componentes aplicam classes utilitárias personalizadas no Tailwind (`text-idoso-base`, `text-idoso-lg`, `text-idoso-xl`, `text-idoso-2xl`), elevando a escala base de texto de `1rem` para até `2.25rem`.
- **Áreas de Toque e Espaçamento:** Botões e cartões interativos expandem seus paddings internos (por exemplo, de `p-4` para `p-6`) e ícones de biblioteca (`lucide-react`) são ampliados para facilitar o clique em dispositivos móveis e telas sensíveis ao toque.
- **Paleta de Alto Contraste:** O Tailwind está customizado com tons contrastantes e legíveis baseados na paleta do SUS Recife (`recife-primary: #1B5E20`, `recife-light: #E8F5E9`, `recife-dark: #0D3B12`), assegurando legibilidade em diferentes condições de iluminação.

---

## 📂 Estrutura de Pastas

```text
saude-recife-frontend/
├── .env.example          # Modelo da variável de ambiente VITE_API_URL
├── eslint.config.js      # Configuração do ESLint 9
├── index.html            # Ponto de entrada HTML do Vite
├── package.json          # Manifesto do projeto, dependências e scripts
├── postcss.config.js     # Configuração do PostCSS para compilação Tailwind
├── README.md             # Esta documentação
├── tailwind.config.js    # Tokens de cores, escala tipográfica para idosos e tema
├── vite.config.js        # Configurações do Vite e plugins React
└── src/
    ├── main.jsx          # Renderização do DOM e importação de estilos globais
    ├── App.jsx           # Roteamento central com React Router e Provider
    ├── index.css         # Diretivas Tailwind e estilização base global
    ├── components/       # Componentes reaproveitáveis da interface
    ├── context/          # Contextos de estado global (ex: AcessibilidadeContext.jsx)
    ├── data/             # Mocks estáticos de apoio ao desenvolvimento
    ├── pages/            # Telas da aplicação (Home, Agendamento, Unidades, Perfil)
    └── services/         # Configuração de clientes HTTP e integrações (Axios)
```

---

## 🌿 Convenções do Git & Workflow

O desenvolvimento do frontend segue exatamente os mesmos padrões do backend para manter a consistência em todo o ecossistema do Saúde Recife:

### 1. Estrutura de Branches
- **`main`**: Branch de produção. Contém a versão estável publicada para os cidadãos.
- **`dev`**: Branch de integração contínua. Ponto de convergência para todas as novas implementações.
- **`feat/nome-da-feature`**: Branches de desenvolvimento criadas a partir de `dev` (ex: `feat/ajuste-tamanho-fonte`, `feat/tela-agendamento`).
- **`fix/nome-do-bug`**: Branches de resolução de defeitos criadas a partir de `dev` (ex: `fix/alinhamento-botao-acessibilidade`).

### 2. Padrão de Commits (Conventional Commits)
Todas as mensagens devem seguir a especificação [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Inclusão de funcionalidade ou tela. Exemplo: `feat: implementar alternador de contraste no cabecalho`
- `fix:` Correção de bug de interface ou lógica. Exemplo: `fix: corrigir quebra de texto no modo idoso`
- `docs:` Alterações na documentação do repositório. Exemplo: `docs: atualizar instrucoes de setup do vite`
- `chore:` Ajustes em dependências, configurações ou pacotes. Exemplo: `chore: atualizar tailwindcss para 3.4.17`
- `refactor:` Melhorias internas no código sem alteração visual ou de comportamento. Exemplo: `refactor: simplificar consumo do hook useAcessibilidade`

### 3. Política de Pull Requests (PR)
- Todo PR deve ter como branch de destino a **`dev`**.
- **Revisão Obrigatória:** Nenhuma alteração pode ser mesclada sem a aprovação prévia de ao menos **1 membro da equipe (peer review)**.
- **Validação de Build e Lint:** O código deve passar com sucesso nos comandos `npm run lint` e `npm run build` antes de qualquer merge.
