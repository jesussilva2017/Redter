import { Request, Response, NextFunction, RequestHandler } from 'express';

// Envuelve handlers async para que un error (ej. falla de conexión a MySQL)
// llegue al middleware de errores en vez de dejar la petición colgada.
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
