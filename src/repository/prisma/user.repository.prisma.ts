import { User } from "../../models/user";
import { UserRepository } from "../user.repository";
import { PrismaClient } from "@prisma/client";




export class UserRepositoryPrisma implements UserRepository {

    constructor(private readonly prisma: PrismaClient){}

    async  create(user: User): Promise<void> {

    const createUser = await this.prisma.user.create({
       data: {
        name: user.name,
        numberPhone: user.numberPhone,
       }
    })
       
    }



   async  delete(userId: number): Promise<void> {
        const deleteUser = await this.prisma.user.delete({
            where: {
                id: userId
            }
        })
    }
    
}