# Guia de teste pratico

Fluxo de teste pratico focado neste projeto.

## Objetivo do teste pratico

- Subir e processar PDFs reais de faturas
- Validar campos extraidos e metricas calculadas
- Demonstrar autenticacao, RBAC e auditoria

## Validacao por campo

Validar campos de extracao:

- `numeroCliente`
- `mesReferencia`
- `itensFatura.energiaEletrica`
- `itensFatura.energiaSceeSemIcms`
- `itensFatura.energiaCompensadaGdi`
- `itensFatura.contribIlumPublicaMunicipal`

Validar metricas:

- `consumoEnergiaEletricaKwh`
- `energiaCompensadaKwh`
- `valorTotalSemGdRs`
- `economiaGdRs`

## Checklist de entrega

- Lint/build/test de backend OK
- Lint/build de frontend OK
- Stack Docker saudavel
- Evidencias funcionais do fluxo completo

## Evidencias sugeridas

- Request/response de extracao
- Capturas dos dashboards
- Capturas de admin/auditoria
