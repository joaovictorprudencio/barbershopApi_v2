import { TimeService } from "./time.service";
import { Time } from "../models/time";
import { Barber } from "../models/barber";
import { TimeRepositoryPrisma } from "../repository/prisma/time.repository.prisma";
import { createTimeDto } from "./time.service";
import { UserRepositoryPrisma } from "../repository/prisma/user.repository.prisma";
import { User } from "../models/user";
import { BarberRepositoryPrisma } from "../repository/prisma/barber.repository.prisma";

export class TimeServiceIplement implements TimeService {

    constructor(
        private readonly timeRepository: TimeRepositoryPrisma,
        private readonly userRepository: UserRepositoryPrisma,
        private readonly barberRepository: BarberRepositoryPrisma
    ) { };


    

    async marchTime(time: createTimeDto): Promise<void> {


        const date: Date = new Date(Date.now() - 3 * 60 * 60 * 1000);

        const timeExists = await this.timeRepository.validationData(date, true );

        if (timeExists) {
            timeExists.available = false;

            await this.timeRepository.update(Time.persistence(
                time.id,
                time.available,
                time.date,
                time.userId
            ));


            await this.userRepository.create(User.persistence(
                time.userName,
                time.userNumberPhone,
                []
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