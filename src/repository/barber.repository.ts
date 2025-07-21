import { PrismaClient } from "@prisma/client";
import { Barber } from "../models/barber";
import { barberCreateDto } from "../service/barbeiro.service";

export interface BarberRepository {
    create(barber: barberCreateDto): Promise<Barber>;
    findByEmail(email: string): Promise<Barber | null>; 
}