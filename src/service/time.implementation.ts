import { TimeService } from "./time.service";
import { Time } from "../models/time";
import { Barber } from "../models/barber";
import { TimeRepositoryPrisma } from "../repository/prisma/time.repository.prisma";
import { createTimeDto } from "./time.service";
import { UserRepositoryPrisma } from "../repository/prisma/user.repository.prisma";
import { User } from "../models/user";

export class TimeServiceIplement implements TimeService   {

    constructor(
        private readonly timeRepository: TimeRepositoryPrisma,
        private readonly userRepository: UserRepositoryPrisma
    ) { };
    
  async  marchTime(time: createTimeDto): Promise<void> {


      const date: Date = new Date(Date.now() - 3 * 60 * 60 * 1000);

      const  timeExists = await this.timeRepository.validationData(date, true);

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
    uncheckTime(time: Time): Promise<void> {
        throw new Error("Method not implemented.");
    }
    listTimes(): Promise<Time[]> {
        throw new Error("Method not implemented.");
    }
    findByDate(date: Date): Promise<Time | null> {
        throw new Error("Method not implemented.");
    }
    findByState(state: boolean): Promise<Time | null> {
        throw new Error("Method not implemented.");
    }
}