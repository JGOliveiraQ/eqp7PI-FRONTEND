# Primeira entrega — MVP Web

O MVP integra PWA, API REST e MongoDB para o fluxo de agendamento em saúde.

## Escopo implementado

- Cadastro e autenticação de pacientes, profissionais e administradores.
- Cadastro e consulta de clínicas, especialidades e profissionais.
- Disponibilidade persistida por profissional.
- Agendamento, consulta, reagendamento e cancelamento.
- Painéis de paciente, profissional e administrador.
- Triagem orientativa por IA quando `GEMINI_API_KEY` estiver configurada.
- Documento OpenAPI disponível em `GET /api/openapi.json`.

## Execução local

1. Inicie o backend conforme o [README do backend](../../eqp7PI-BACKEND-main/README.md).
2. Inicie o frontend conforme o [README principal](../README.md).
3. Acesse `http://localhost:5173`.

Não há credenciais, profissionais, clínicas ou consultas pré-cadastradas no repositório. O administrador deve cadastrar os dados de desenvolvimento pela API antes da demonstração.
