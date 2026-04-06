# Integración LLM y Extracción de Datos

El pilar estructural de "Parseo" o Smart OCR de esta plataforma excluye usar algoritmos matemáticos caóticos para el reconocimiento óptico; entabla charlas lógicas directas a Servidores GenAI mediante Modelos modales Visuales analizando la factura pixel a pixel buscando data determinística.

## Proveedor Principal (Google Gemini)

Escogimos la **API oficial de Gemini**. Más allá de ser rápida y eficiente, es el único ecosistema en la nube con un peso imbatible en aceptar MIME types directos bajo el formato estricto `application/pdf`. Esto remueve al 100% tareas tediosas del lado de Node.JS de alterar bytes. El PDF se empuja puro como es.

### Flujo Completo:
1. NestJS levanta el Buffer del documento resguardado.
2. Encadena la consulta con el **Prompt de Formato JSON estricto**, aislado como variable privada del Backend.
3. Se invoca al SDK oficial Multimodal, la capa de Google absorbe el PDF, analiza la grilla visual, y arroja la respuesta financiera.
4. El backend decodifica con Regex las cadenas, rehidrata los Tipos Mapeados y los deposita vía Prisma.

## Alternativa Desconectada Open-Source (Ollama)
Si el software requiere escalar en un data-center cerrado (offline). Un mecanismo de diseño *Factory* detectará `Ollama` desde el archivo global `.env`. Como LLMs locales basados en Llama no tragan PDF gigantes directamente sin errores visuales, el ecosistema internamente abstrae la página principal de la factura, la mapea a imagen PNG limpia y se las pasa con la orden a la inteligencia local logrando resultados similares con nula conexión web.

## Contratos Blindados
El estándar escrito en `backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts` amarra a cualquier modelo de IA existente a obedecer el estándar. Extraer y colocar los valores bajo llaves obligatorias para alimentar la base de PostgreSQL de forma monolítica, impidiendo corrupción estructural.
