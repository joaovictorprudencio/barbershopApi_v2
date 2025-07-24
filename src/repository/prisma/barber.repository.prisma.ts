import { Prisma, PrismaClient } from '@prisma/client';
import { Barber } from '../../models/barber';
import { BarberRepository } from '../barber.repository';

import { barberCreateDto } from '../../service/barbeiro.service';


export class BarberRepositoryPrisma implements BarberRepository {
   
    constructor(private readonly prisma: PrismaClient) {}



   async  create(barber: barberCreateDto): Promise<Barber> {

   
         

       const barberSave = await this.prisma.barber.create({
           data: {
               name: barber.name,
               email: barber.email,
               password: barber.password,
               numberPhone: barber.numberPhone,
           }
       });

         return Barber.persistence(
            barberSave.id,
            barberSave.name,
            barberSave.email,
            barberSave.password,
            barberSave.numberPhone
        );
    
    }

   async  findByEmail(email: string): Promise<Barber | null> {
        const barber = await this.prisma.barber.findUnique({
            where: {
                email: email
            }
        })

        if (!barber) {
            return null;
        }

        return Barber.persistence(
            barber.id,
            barber.name,
            barber.email,
            barber.password,
            barber.numberPhone
        );
    }

    async findAll(): Promise<Barber[]> {
        const barbers = await this.prisma.barber.findMany();
        return barbers.map(barber => Barber.persistence(
            barber.id,
            barber.name,
            barber.email,
            barber.password,
            barber.numberPhone
        ));
    }

 public static  build(prisma: PrismaClient) {
        return new BarberRepositoryPrisma(prisma);
    }

}