
import express from "express";
import router from './routes/time.route';
import barberRoutes from './routes/barber.route';
import { TimeServiceIplement } from "./service/time.implementation";
import { TimeRepositoryPrisma } from "./repository/prisma/time.repository.prisma";
import  prisma  from "./repository/prisma/lib/conection";
import cors from 'cors';

const timeRepository = new TimeRepositoryPrisma(prisma);

const app = express();

app.use(cors()); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 app.use('/api', router)
 app.use('/api', barberRoutes)

 app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


 app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


const timeService = TimeServiceIplement.getInstance(timeRepository);



setInterval(() => {
    console.log('🔄 Mantendo servidor ativo', new Date().toISOString());
}, 300000);




app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
