import { Prisma, PrismaClient } from "@prisma/client";
import { Time } from "../../models/time";
import { TimeRepository } from "../time.repository";
import { UserRepository } from "../user.repository";
import { DefaultArgs } from "@prisma/client/runtime/library";



export class TimeRepositoryPrisma implements TimeRepository {
    static build(prisma: PrismaClient) {
       return new TimeRepositoryPrisma(prisma);
    }

    constructor(
        private readonly prisma: PrismaClient,
    ) { }
   async deleteForAll(date: Date): Promise<void> {
    await this.prisma.time.deleteMany({
        where: {
            date: {
                lt: date // lt = less than (menor que)
            }
        }
    });
}


    async findByState(state: boolean): Promise<Time[] | null> {
        const timesAvaliable = await this.prisma.time.findMany({
            where: {
                available: state
            }
        });

        if (!timesAvaliable) {
            return null;
        }

        return timesAvaliable.map(time => Time.persistence(
            time.id,
            time.available,
            time.date,
            time.nameCustumer,
            time.phoneCustumer
        ));
    }

    async validationData(dateTime: Date, state: boolean): Promise<Time | null> {
        const time = await this.prisma.time.findFirst({
            where: {
                date: dateTime,
                available: state
            }
        }); 

        if (!time) {
            return null;
        }


        return Time.persistence(
            time.id,
            time.available,
            time.date,
            time.nameCustumer,
            time.phoneCustumer
        );

    }


    async findByDate(date: Date): Promise<Time | null> {

        if (!date) {
            return null;
        }

        const dataTimes = await this.prisma.time.findFirst({
            where: {
                date: date
            }
        });


        if (!dataTimes) {
            return null;
        }



        return Time.persistence(
            dataTimes.id,
            dataTimes.available,
            dataTimes.date,
            dataTimes.nameCustumer,
            dataTimes.phoneCustumer
        )
    }

    async create(available: boolean, date: Date, nameCustumer: string, phoneCustumer: string): Promise<void> {

        const createTime = await this.prisma.time.create({
            data: {
                available,
                date,
                nameCustumer,
                phoneCustumer
            }
        })
    };


    async update(time: Time): Promise<void> {
        const updateTime = await this.prisma.time.update({
            where: {
                id: time.id,
            },
            data: {
                id: time.id,
                available: time.available,
                date: time.date,
                nameCustumer: time.nameCustumer,
                phoneCustumer: time.phoneCustumer
            }
        })
    };

    async finbyId(timeId: number): Promise<Time | null> {
        const getTime = await this.prisma.time.findUnique({
            where: {
                id: timeId,
            }
        })

        if (!getTime) {
            return null;
        }
        return Time.persistence(
            getTime.id,
            getTime.available,
            getTime.date,
            getTime.nameCustumer,
            getTime.phoneCustumer
        )
    };

    async delete(timeId: number): Promise<void> {
        const deleteTime = await this.prisma.time.delete({
            where: {
                id: timeId
            }
        })
    };
}   
