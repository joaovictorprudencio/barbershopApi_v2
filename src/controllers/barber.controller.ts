import { barberServiceImplement } from "../service/barbeiro.implementation";
import { barberCreateDto, barberLoginDto, barberResDto } from "../service/barbeiro.service";
import { Barber } from "../models/barber";
import prisma from "../repository/prisma/lib/conection";
import { BarberRepositoryPrisma } from "../repository/prisma/barber.repository.prisma";
import { Request, Response, NextFunction } from 'express';


// Inicializa as dependências   
const initializeDependencies = async () => {
  const repository = BarberRepositoryPrisma.build(prisma);
  return await barberServiceImplement.build(repository);
};

let barberService: barberServiceImplement;

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    if (!barberService) barberService = await initializeDependencies();
    
    const { email, password } = req.body;
    const barber = await barberService.login({ email, password });

    if (!barber) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const barberRes: barberResDto = {
      id: barber.id,
      name: barber.name,
      email: barber.email,
      token: barber.token,
    };

    return res.status(200).json(barberRes);
  } catch (error) {
    next(error);
  }
}

export async function createBarber(req: Request, res: Response, next: NextFunction) {
  try {
    if (!barberService) barberService = await initializeDependencies();
    
    const { name, email, password, numberPhone } = req.body;

    const barberNew: barberCreateDto = {
      name,
      email,
      password,
      numberPhone
    };

    const barber = await barberService.create(barberNew);
    return res.status(201).json(barber);
  } catch (error) {
    next(error);
  }
}