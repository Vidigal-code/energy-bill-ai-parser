# Guia de prueba practica

Flujo de prueba practica enfocado en este proyecto.

## Objetivo de la prueba practica

- Subir y procesar PDFs reales de facturas
- Validar campos extraidos y metricas calculadas
- Demostrar autenticacion, RBAC y auditoria

## Validacion por campo

Validar campos de extraccion:

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
- Stack Docker saludable
- Evidencias funcionales del flujo completo

## Evidencias sugeridas

- Request/response de extraccion
- Capturas de dashboards
- Capturas de admin/auditoria
