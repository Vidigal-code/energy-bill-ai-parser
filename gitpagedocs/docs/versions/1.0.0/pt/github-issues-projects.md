# Entrega e evidências

Use **Issues** e **Projects** no GitHub para acompanhar o trabalho em **energy-bill-ai-parser** e anexar evidências para revisores.

## Issues sugeridas

- **Bug**: discrepância na extração para um PDF; anexar PDF (se permitido) e logs redigidos.
- **Feature**: novo provedor ou campo no dashboard; ligar ao contrato ou mudança de API.
- **Chore**: dependências, Docker, CI.

Etiquetas como `backend`, `frontend`, `llm`, `infra` ajudam a filtrar o backlog.

## Projects (Kanban)

Colunas opcionais:

| Coluna | Significado |
|--------|-------------|
| Backlog | Por iniciar |
| Em curso | Atribuído e ativo |
| Revisão | PR aberto |
| Concluído | Merge e verificação feitos |

## Checklist de validação (antes da entrega)

- [ ] `GET /api/health` OK com o stack no ar.
- [ ] Swagger acessível e fluxos de auth testáveis (`/api/docs/pt` ou `/api/docs/en`).
- [ ] Frontend em `http://localhost:3001` (valores por defeito Docker).
- [ ] Upload de PDF → extração concluída e dados na UI ou BD.
- [ ] Rotas admin vs utilizador respeitam RBAC (`ADMIN` / `USER`).
- [ ] Evidência: gravação curta ou capturas + links de Issue/PR.

## Vídeo de execução

A rota **vídeo** deste site aponta para o registo oficial de execução do projeto (YouTube).

> Versão: 1.0.0
