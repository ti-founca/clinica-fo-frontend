import { HttpErrorResponse } from '@angular/common/http';

/** Error de la API normalizado a partir de un ProblemDetail (RFC 9457). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Errores de validación por campo (solo en respuestas 400). */
    readonly errores: Record<string, string> = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ProblemDetail {
  title?: string;
  status?: number;
  detail?: string;
  errores?: Record<string, string>;
}

export function aApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (!(error instanceof HttpErrorResponse)) {
    return new ApiError(0, error instanceof Error ? error.message : 'Error inesperado');
  }
  if (error.status === 0) {
    return new ApiError(0, 'No se pudo conectar con el servidor');
  }
  const problema = (typeof error.error === 'object' ? error.error : null) as ProblemDetail | null;
  return new ApiError(
    error.status,
    problema?.detail ?? problema?.title ?? `Error ${error.status}`,
    problema?.errores ?? {},
  );
}
