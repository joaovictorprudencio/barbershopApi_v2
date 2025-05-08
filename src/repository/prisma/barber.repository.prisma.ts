import { PrismaClient } from '@prisma/client';
import { Barber } from '../../models/barber';
import { BarberRepository } from '../barber.repository';
import bcrypt from 'bcryptjs';

export class BarberRepositoryPrisma implements BarberRepository {

    constructor(private readonly prisma: PrismaClient) {}


   async  create(barber: Barber): Promise<void> {

    const hashPassword = await bcrypt.hash(barber.password, 10);
         barber.password = hashPassword;

       const barberSave = this.prisma.barber.create({
           data: {
               name: barber.name,
               email: barber.email,
               password: barber.password,
               numberPhone: barber.numberPhone,
           }
       });
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

}