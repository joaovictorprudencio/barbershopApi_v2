import { TimeService } from "./time.service";
import { Time } from "../models/time";
import { Barber } from "../models/barber";
import { TimeRepositoryPrisma } from "../repository/prisma/time.repository.prisma";
import { createTimeDto } from "./time.service";
import { UserRepositoryPrisma } from "../repository/prisma/user.repository.prisma";
import { User } from "../models/user";
import { BarberRepositoryPrisma } from "../repository/prisma/barber.repository.prisma";
import cron from 'node-cron';
import dayjs from "dayjs";
export class TimeServiceIplement implements TimeService {


    public todayTimes: Time[] = [];
    public today = dayjs().tz('America/Sao_Paulo');
    public inicio = dayjs(this.today).hour(9).minute(0).second(0).toDate();
    public fim = dayjs(this.today).hour(12).minute(0).second(0).toDate();

    constructor(
        private readonly timeRepository: TimeRepositoryPrisma,
        private readonly userRepository: UserRepositoryPrisma,
        private readonly barberRepository: BarberRepositoryPrisma
    ) {

        cron.schedule('0 0 11 * * *', () => {
            this.generateTime(this.inicio, this.fim);
        }, {
            timezone: 'America/Sao_Paulo'
        });

    };



   

    async generateTime(inicio: Date, final: Date): Promise<void> {
        // Combina a data com a hora do 'inicio' e 'final'
        const startDateTime = dayjs(inicio)
            .hour(inicio.getHours())
            .minute(inicio.getMinutes())
            .second(0);

        const endDateTime = dayjs(final)
            .hour(final.getHours())
            .minute(final.getMinutes())
            .second(0)
            .add(30, 'minute');

        let current = startDateTime;

        while (current.isBefore(endDateTime)) {
            const horario = current.toDate();

            const timeExist = await this.timeRepository.validationData(horario, false);

            if (!timeExist) {
                await this.timeRepository.create(false, horario, "mock-name", "xx-xxxx-xxxx");
            }

            current = current.add(30, 'minute');
        }

    };
    





    // async generateTimeOfDay(): Promise<void> {

    //     const barbers = await this.barberRepository.findAll();

    //     barbers.forEach(barber => {
    //         await  
    //     });
    // };  



    async marchTime(time: createTimeDto): Promise<void> {


        const date: Date = new Date(Date.now() - 3 * 60 * 60 * 1000);

        const timeExists = await this.timeRepository.validationData(date, true);

        if (timeExists) {
            timeExists.available = false;

            await this.timeRepository.update(Time.persistence(
                time.id,
                time.available,
                time.date,
                time.nameCustumer,
                time.phoneCustumer
            ));


        }



    }
    async uncheckTime(time: Time): Promise<void> {

        const timeUpdate = await this.timeRepository.finbyId(time.id);

        if (timeUpdate) {
            timeUpdate.available = false;
            await this.timeRepository.update(timeUpdate);
        }

    }


    async listTimesAvailable(): Promise<Time[] | null> {

        return await this.timeRepository.findByState(true);

    }


    async listTimesUnavailable(): Promise<Time[] | null> {
        return await this.timeRepository.findByState(false);
    }


    async findByDate(date: Date): Promise<Time | null> {

        return await this.timeRepository.findByDate(date);

    }

    findByState(state: boolean): Promise<Time[] | null> {
        throw new Error("Method not implemented.");
    }
}