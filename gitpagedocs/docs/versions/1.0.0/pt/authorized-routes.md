# Rotas autorizadas

Duas camadas: **este site de documentação** (Git Page Docs) e a **API** do **energy-bill-ai-parser**.

## API da aplicação (NestJS)

- A maioria das rotas exige **JWT** após login.
- **RBAC** restringe endpoints administrativos a papéis como `ADMIN`.
- Rotas públicas incluem **auth** (registo/login) e **health** conforme configuração.

Consulte o Swagger (`/api/docs/pt`) para a lista exata de rotas e guards.

## Git Page Docs (este site)

O ficheiro `gitpagedocs/docs/versions/1.0.0/config.json` pode definir:

- **`auth.accessKeys`** – chaves nomeadas para desbloquear rotas protegidas da doc.
- **`authorization`** por rota – `accessKeyId`, `requiredRoles`, `requireExternalAuth`, `allowedProviders`.

Provedores podem incluir **Auth.js**, **Clerk**, **Firebase**, **JWT** (ver `auth.providers` no mesmo ficheiro).

### Exemplo

```json
"authorization": {
  "accessKeyId": "docs-key",
  "requiredRoles": ["maintainer"],
  "requireExternalAuth": true,
  "allowedProviders": ["authjs", "jwt"]
}
```

Use quando precisar de esconder documentação interna ou o **source viewer** atrás de chave ou SSO. Para documentação pública do projeto, deixe rotas sem `authorization` ou distribua chaves só de leitura.

> Versão: 1.0.0
