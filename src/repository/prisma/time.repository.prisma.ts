import { PrismaClient } from "@prisma/client";
import { Time } from "../../models/time";
import { TimeRepository } from "../time.repository";



export class TimeRepositoryPrisma implements TimeRepository {

    constructor(private readonly prisma: PrismaClient) { }


    findByState(state: boolean): Promise<Time[] | null> {
        throw new Error("Method not implemented.");
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
            time.userId
        );

    }


    async findByDate(date: Date): Promise<Time[] | null> {
        
        if (!date) {
            return null;
        }

        const dataTimes = await this.prisma.time.findMany({
            where: {
                date: date
            }
        });

        const times: Time[] = dataTimes.map(time => Time.persistence(
            time.id,
            time.available,
            time.date,
            time.userId
        ));

        return times;
    }

    async create(time: Time): Promise<void> {
        const createTime = await this.prisma.time.create({
            data: {
                id: time.id,
                available: time.available,
                date: time.date,
                userId: time.userId,
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
                userId: time.userId,
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
            getTime.userId,
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
