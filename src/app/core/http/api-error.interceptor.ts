import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { aApiError } from './api-error';

/** Convierte cualquier error HTTP en un `ApiError` con el mensaje del backend. */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(catchError((error: unknown) => throwError(() => aApiError(error))));
