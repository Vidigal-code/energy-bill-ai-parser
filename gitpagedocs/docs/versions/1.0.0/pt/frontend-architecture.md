# Arquitetura do Frontend (Next.js + FSD)

A camada client-side do **Energy Bill AI Parser** repousa sobre **Next.js (App Router)** impulsionado fortemente por React v18 e componentes fluídos de carregamento.

## Metodologia FSD (Feature-Sliced Design)
A organização das pastas obedece o **Feature-Sliced Design**, dividindo o site do mais genérico ao mais acoplado ao domínio.

1. **`app/`**: Inicialização rotacional. Lida com Layouts estáticos, Not Found Routes predefinidas, Páginas raiz e Provedores globais (`ReduxProvider`, `QueryProvider`).
2. **`pages/`**: Agrupa páginas roteáveis no contexto da lógica FSD em diretórios coesos.
3. **`widgets/`**: Blocos independentes maciços construídos combinando entities e features. Como as barras de cabeçalhos complexos, ou as Tabelas mestres compostas com paginação e busca integrados.
4. **`features/`**: Funções do usuário agregadas. Aqui vive a ação de "Fazer Login", "Enviar arquivo PDF", "Trocar Idioma", contendo seus hooks, ui e APIs locais.
5. **`entities/`**: Modelos de negócio sem lógicas atreladas. O Componente `UserCard` ou o modelo cru TypeScript de como é uma Fatura (Invoice).
6. **`shared/`**: Bibliotecas, tokens de estilização Tailwind, config de UI e funções utilitárias isoladas que todos podem utilizar. É o coração reuso.

## Tailwind CSS e Acessibilidade
O motor preferido de customização estética é o **Tailwind CSS**. A maioria dos componentes compartilha a infraestrutura padronizada em `@apply` layers e classes unitárias dinâmicas integrando Lucide Icons, garantindo responsividade mobile-first e temas claros/escuros configurados nativamente na estilização global.
