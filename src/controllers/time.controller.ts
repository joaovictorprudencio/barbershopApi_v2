import { time } from "console";
import prisma from "../repository/prisma/lib/conection";
import { TimeRepositoryPrisma } from "../repository/prisma/time.repository.prisma";
import { TimeServiceIplement } from "../service/time.implementation";
import { createTimeDto } from "../service/time.service";
import { Request, Response, NextFunction } from 'express';


// Inicializa as dependências uma única vez
const initializeDependencies = async () => {
  const repository = await TimeRepositoryPrisma.build(prisma);
  return await TimeServiceIplement.build(repository);
};


let timeService: TimeServiceIplement;

export async function marchTime(req: Request, res: Response): Promise<Response> {
  try {
    if (!timeService) timeService = await initializeDependencies();
    
    const {  available, date, time, nameCustumer, phoneCustumer } = req.body;
    
    const createTime: createTimeDto = {
      available,
      date,
      time,
      nameCustumer,
      phoneCustumer
    };

    console.log(createTime)

    const timeMarch = await timeService.marchTime(createTime);

    return res.status(200).json(timeMarch);
  } catch (error) {
    return res.status(500).json({ error: `erro ao marcar ${time} ` });
  }
}

export async function timesUnavailable(req: Request, res: Response): Promise<Response> {
  try {
    if (!timeService) timeService = await initializeDependencies();
    
    const timesUnavailable = await timeService.listTimesUnavailable();
    return res.status(200).json(timesUnavailable || []);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar horários indisponíveis" });
  }
}

export async function listTimesAvailable(req: Request, res: Response): Promise<Response> {
  try {
    if (!timeService) timeService = await initializeDependencies();
    
    const timesAvailable = await timeService.listTimesAvailable();
    return res.status(200).json(timesAvailable || []);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar horários disponíveis" });
  }
}

export async function uncheckTime(req: Request, res: Response): Promise<Response> {
  try {
    if (!timeService) timeService = await initializeDependencies();
    
    const { id } = req.params;
    await timeService.uncheckTime(Number(id));
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao desmarcar horário" });
  }

}



  export async function generateTimeController(req: Request, res: Response): Promise<Response> {
    try {
      if (!timeService) timeService = await initializeDependencies();
      
      await timeService.generateTime();

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao gerar horários" });
    }
  }

