# System Architecture and Flow

The **Energy Bill AI Parser** Platform is built using a logical microservices-style architecture, clearly split between a **Frontend** and a **Backend**, connected via RESTful APIs.

## Main Components

1. **Frontend (Next.js + FSD):**
   - Handles the user interface, administrative panels, and dashboards.
   - Connects to the Backend through Axios.
   - Built with the *Feature-Sliced Design* (FSD) architecture paradigm.

2. **Backend (NestJS):**
   - The heart of the business logic.
   - Manages file uploads, AI-driven extraction, and orchestration.
   - Handles strict RBAC management and Auditing.

3. **Relational Database (PostgreSQL):**
   - Orchestrated via Prisma ORM to save Users, Invoices, Metrics, Audit Logs, and system mappings.

4. **AI Engine (LLMs):**
   - Core mechanism that reads PDFs or binary images and outputs structured JSON containing keys and metrics. Google Gemini is the multimodal primary provider; Ollama serves as a local, offline fallback.

5. **S3 File Storage (AWS S3 / LocalStack):**
   - Invoices are securely pushed to a bucket, shielded with JWE (JSON Web Encryption) before leaving the application boundaries.

## Flow Diagram (Invoice Upload Example)

1. User (`ADMIN` or `USER`) accesses the Frontend and uploads the energy bill PDF.
2. The file reaches the NestJS Backend. It is JWE-encrypted and forwarded to an **S3 Bucket** for safekeeping.
3. Simultaneously, the raw PDF is pushed to the **Gemini API** where multimodal vision capabilities process its visual structure.
4. The LLM extracts the nested metrics. The Backend intercepts the JSON result, performs deterministic calculations, and persists the data using **Prisma/PostgreSQL**.
5. Audit events are recorded permanently, logging who uploaded it, timestamps, and log IDs.
