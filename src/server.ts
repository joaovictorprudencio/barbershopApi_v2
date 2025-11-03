
import express from "express";
import router from './routes/time.route';
import barberRoutes from './routes/barber.route';
import cors from 'cors';
import { mongooseDB } from "./repository/mongodb/lib/conection";
import dotenv from 'dotenv';



dotenv.config();
const app = express();
mongooseDB();



app.use(cors({
  origin: '*',                         
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*'],              
  credentials: false                 
}));

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


setInterval(()  =>  {
    console.log('🔄 Mantendo servidor ativo', new Date().toISOString());
}, 300000);



app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
