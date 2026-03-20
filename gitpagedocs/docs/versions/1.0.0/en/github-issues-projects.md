# Practical Test Guide

Practical test workflow focused on this project.

## Practical test objective

- Upload and process real energy bill PDFs
- Validate extracted fields and computed metrics
- Demonstrate secure auth, RBAC, and audit trace

## Field-level validation

Validate extraction fields:

- `numeroCliente`
- `mesReferencia`
- `itensFatura.energiaEletrica`
- `itensFatura.energiaSceeSemIcms`
- `itensFatura.energiaCompensadaGdi`
- `itensFatura.contribIlumPublicaMunicipal`

Validate metrics:

- `consumoEnergiaEletricaKwh`
- `energiaCompensadaKwh`
- `valorTotalSemGdRs`
- `economiaGdRs`

## Delivery checklist

- Backend lint/build/tests passing
- Frontend lint/build passing
- Docker stack up and healthy
- Functional flow recorded with evidence

## Suggested evidence

- API request/response for extraction
- Dashboard screenshots
- Admin/audit listing screenshots
