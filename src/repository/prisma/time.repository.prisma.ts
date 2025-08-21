import { Prisma, PrismaClient } from "@prisma/client";
import { Time } from "../../models/time";
import { TimeRepository } from "../time.repository";




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
            time.time,
            time.nameCustumer,
            time.phoneCustumer
        ));
    }

    async validationData(dateTime: Date, timeP: string, state: boolean): Promise<Time | null> {

        console.log("v1 vinha: ", new Date(timeP))
         console.log("v2 vinha: ", dateTime)
        try {
       
            const time = await this.prisma.time.findFirst({
                where: {
                    date: dateTime,
                    time: timeP,
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
                time.time,
                time.nameCustumer,
                time.phoneCustumer
            );

        } catch (error) {
            console.error("❌ Erro ao validação horário:", error);
            throw error;
        };
    }



    async findByDate(date: Date, time: string): Promise < Time | null > {

    if(!date) {
        return null;
    }

        const dataTimes = await this.prisma.time.findFirst({
        where: {
            date: date,
            time: time
        }
    });


    if(!dataTimes) {
        return null;
    }



        return Time.persistence(
        dataTimes.id,
        dataTimes.available,
        dataTimes.date,
        dataTimes.time,
        dataTimes.nameCustumer,
        dataTimes.phoneCustumer
    )
}

    async create(available: boolean, date: Date, time: string, nameCustumer: string, phoneCustumer: string): Promise < Time > {

    const createTime = await this.prisma.time.create({
        data: {
            available,
            date,
            time,
            nameCustumer,
            phoneCustumer
        }
    })

        return Time.persistence(
        createTime.id,
        createTime.available,
        createTime.date,
        createTime.time,
        createTime.nameCustumer,
        createTime.phoneCustumer
    )
};


    async update(time: Time): Promise < Time > {
    try {
        console.log("📥 Recebido para atualizar: ", time);

        const updateTime = await this.prisma.time.update({
            where: {
                id: time.id,
            },
            data: {
                available: time.available,
                nameCustumer: time.nameCustumer,
                phoneCustumer: time.phoneCustumer
            }
        });

        console.log("✅ Retorno do Prisma: ", updateTime);

        return Time.persistence(
            updateTime.id,
            updateTime.available,
            updateTime.date,
            updateTime.time,
            updateTime.nameCustumer,
            updateTime.phoneCustumer
        );
    } catch(error) {
        console.error("❌ Erro ao atualizar horário:", error);
        throw error; // deixa o erro subir para ser tratado
    }
};

    async finbyId(timeId: number): Promise < Time | null > {
    const getTime = await this.prisma.time.findUnique({
        where: {
            id: timeId,
        }
    })

        if(!getTime) {
        return null;
    }
        return Time.persistence(
        getTime.id,
        getTime.available,
        getTime.date,
        getTime.time,
        getTime.nameCustumer,
        getTime.phoneCustumer
    )
};

    async delete (timeId: number): Promise < void> {
    const deleteTime = await this.prisma.time.delete({
        where: {
            id: timeId
        }
    })
};
}   
