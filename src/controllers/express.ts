import { Api } from "./api.express";
import express, { Express } from "express";

import { Request, Response, NextFunction } from 'express';


export class ApiExpress implements Api {

  private constructor(readonly app: Express) { }


  public static build() {
    const app = express();
    app.use(express.json());
    return new ApiExpress(app);
  }


  public addGetRoute(
    path: string,
    handler: (req: Request, res: Response) => Promise<void | Response>
  ): void {
    this.app.get(path, this.wrapAsync(handler));
  }

  public addPostRoute(
    path: string,
    handler: (req: Request, res: Response) => Promise<void | Response>
  ): void {
    this.app.post(path, this.wrapAsync(handler));
  }


  public addPutRoute(
    path: string,
    handler: (req: Request, res: Response) => Promise<void | Response>
  ): void {
    this.app.put(path, this.wrapAsync(handler));
  }




  private wrapAsync(
    handler: (req: Request, res: Response) => Promise<void | Response>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      handler(req, res).catch(next); // agora o TS entende o tipo de next corretamente
    };
  }


  public async start(port: number) {
    this.app.listen(port, () => {
      console.log("Servidor rodando na porta " + port);

      try {
        this.printRoutes();
      } catch (e: any) {
        console.error("Erro ao imprimir as rotas:", e?.stack || e?.message || e);
      }
    });
  };

  public printRoutes() {
    const router = this.app._router;

    if (!router || !router.stack) {
      console.warn("Rotas não estão disponíveis para impressão.");
      console.log(router)
      return;
    }

    console.log("Rotas registradas:");
    router.stack.forEach((middleware: any) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods)
          .map(m => m.toUpperCase())
          .join(", ");
        console.log(`${methods} ${middleware.route.path}`);
      }
    });
  };

}


