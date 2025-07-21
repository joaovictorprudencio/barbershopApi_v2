import { Request, Response, NextFunction, RequestHandler } from 'express';

export function asyncHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
  return (req, res, next) => {
    return handler(req, res, next).catch(next);
  };
}