# LLM Integration and Smart Extraction

The platform refrains from archaic OCR algorithms. It fully integrates natively with Generative AI APIs (specifically Vision-based core LLMs) bypassing noise, capturing precise numeric JSON keys, and outputting structured logic effortlessly directly out of uploaded energy bill PDFs.

## Primary Engine (Google Gemini)

The application mandates **Google's Gemini API** internally as its front-man tool. Given pure capability, Google's Cloud endpoint accepts raw `application/pdf` binary payloads alongside their prompts directly, unlike other restrictive models dictating raw texts only.

### Workflow:
1. The backend picks up the `Base64` chunks of the validated incoming PDF.
2. Injects a predefined strict backend **JSON Prompt Ruleset**.
3. Hits the Google SDK Pipeline mapping output into AI response domains.
4. Purges out conversational garbage through safe regex mechanisms and yields standard TypeScript mapped entities, firmly injected into PostgreSQL by Prisma.

## Offline Open-Source Engine (Ollama Environment)
For air-gapped situations, the NestJS pipeline possesses a Factory logic pointing to **Ollama** dynamically on the fly if environmental variables instruct to do so. Since generic Llama Vision limits handling raw multi-page PDF binaries seamlessly as Gemini does, our container seamlessly incorporates lightweight internal triggers invoking ghostscript rendering engines, turning page 1 of the pdf into crisp rasterized JPEGs, and supplying them to Ollama offline to perform the equivalent data-harvesting magic.

## Architectural Contracts
All parsing targets strictly adhere to `backend/src/modules/invoices/domain/contracts/invoice-extraction.contract.ts`. No matter what AI provider governs the node runtime, it forces the data returned onto common interfaces dictating GDI values alongside reference dates effectively.
