import { ApiLogger } from './src/shared/logging/api-logger';

try {
    throw new Error("DUMMY_ERROR_FOR_TESTS");
} catch (e) {
    ApiLogger.logError({ path: "/test", statusCode: 500, message: "Erro", error: e });
}
