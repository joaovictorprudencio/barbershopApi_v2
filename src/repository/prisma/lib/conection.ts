
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$connect()
  .then(() => {
    console.log('Conexão realizada com sucesso');
  })
  .catch((error: Error) => {  
    console.error('Erro ao se conectar ao banco de dados:', error);
  });

export default prisma;