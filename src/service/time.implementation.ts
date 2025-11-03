import { TimeService } from "./time.service";
import { Time } from "../entities/time";
import { TimeRepositoryMongo } from "../repository/mongodb/time.repository.mongodb";
import { createTimeDto } from "./time.service";
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';



dayjs.extend(utc);
dayjs.extend(timezone);

export class TimeServiceIplement implements TimeService {


    private static instance: TimeServiceIplement;

    public todayTimes: Time[] = [];
    public today = dayjs().tz('America/Sao_Paulo');



    constructor(
        private readonly timeRepository: TimeRepositoryMongo,
    ) {


    };



    public static build(timeRepository: TimeRepositoryMongo) {
        return new TimeServiceIplement(timeRepository);
    }


    public static getInstance(timeRepository: TimeRepositoryMongo): TimeServiceIplement {
        if (!TimeServiceIplement.instance) {
            TimeServiceIplement.instance = new TimeServiceIplement(timeRepository);
        }
        return TimeServiceIplement.instance;
    }




    private getCurrentBrazilDate() {
        return dayjs().tz('America/Sao_Paulo');
    }



    public async executeDailyTask() {
        console.log(`[${this.getCurrentBrazilDate().format()}] Iniciando rotina diária...`);
        console.log('Iniciando geração de horários ...');
        await this.generateTime();

    }



    public async generateTime(): Promise<void> {

        await this.clearDB();

        const todayDate = dayjs().startOf('day').toDate();
   
        

        const timeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
            '17:30', '18:00', '18:30', '19:00', '19:30'
        ];

        for (const timeStr of timeSlots) {
            try {
                await this.marchTimeForJob(
                    Time.persistence(
                        '',
                        true,
                        todayDate,
                        timeStr,
                        "nome modelo do job",
                        "222222222222222222"
                    ))


                console.log(`✅ Horário ${timeStr} salvo para ${todayDate}`);
            } catch (error) {

                console.warn(`⚠️ Horário ${timeStr} pulado: ${(error as Error).message}`);

            }

        }

    }


    public async marchTime(time: createTimeDto): Promise<Time | undefined> {

        try {

            const timeStr = time.time;

        

            const timeDate = dayjs(time.date)
                .startOf('day')
                .toDate();

      
                console.log("data que ta vindo para api",time.date )

            if (new Date(time.date) < timeDate) {
                 throw new Error('A data informada já passou.');
            };


            const Unavailable = await this.timeRepository.validationData(time.date, time.time, false);
            console.log("o horario está indiposnivel no banco ?  ", Unavailable)

              if (Unavailable !== null && Unavailable !== undefined) {
              throw new Error("Horário indisponível");
             }

            const TimeAvailable = await this.timeRepository.validationData(
                time.date,
                time.time,
                true 
            );

    

            if(TimeAvailable==null) {

             console.log("CRIANDO HORARIO: ",)


            const newTime = await this.timeRepository.create(
                false,
                time.date,
                time.time,
                time.nameCustumer,
                time.phoneCustumer
            );


               return newTime;
            }

             if (TimeAvailable.id == null) {
                throw new Error("Horário disponível não possui ID válido");
             }



            if (TimeAvailable) {
                console.log("atualizando dado")
                const updatedTimeData = Time.persistence(
                    TimeAvailable.id,
                    false,
                    time.date,
                    timeStr,
                    time.nameCustumer,
                    time.phoneCustumer
                );

                console.log("ultimo logbantes de chamar o repo ")

                const updatedTime = await this.timeRepository.update(updatedTimeData);

                if(!updatedTime){
                    throw new Error(`não encontrado`)
                }

                console.log('dado atualizado do repo  ', updatedTime);
                return updatedTime; 
            }


        } catch (error) {

            console.log("erro : ", error);
            throw error;
        }
    }


    async marchTimeForJob(time: createTimeDto): Promise<Time | null> {

        const appointmentDate = dayjs()
            .tz('America/Sao_Paulo')
            .startOf('day')
            .toDate();

        const timeStr = time.time;

        const timeExistsunavailable = await this.timeRepository.validationData(appointmentDate, time.time, false);
        const timeExists = await this.timeRepository.validationData(appointmentDate, time.time, true);

        if (timeExistsunavailable || timeExists ) {
            return null;
        }

        return this.timeRepository.create(
            true,
            appointmentDate,
            timeStr,
            time.nameCustumer,
            time.phoneCustumer
        );
    }





    
    async listTimesAvailable(): Promise<Time[] | null> {
        const times = await this.timeRepository.findByState(true);
        console.log('times aqui: ', times)
        return times;
    }

    async listTimesUnavailable(): Promise<Time[] | null> {
        const times = await this.timeRepository.findByState(false);
        return times;
    }

    async findByDate(date: Date, time: string): Promise<Time | null> {
        const timeFind = await this.timeRepository.findByDate(date, time);

        if (timeFind) {
            return Time.persistence(
                timeFind.id,
                timeFind.available,
                timeFind.date,
                timeFind.time,
                timeFind.nameCustumer,
                timeFind.phoneCustumer
            );
        }

        return null;
    }




    public async uncheckTime(id: string): Promise<void> {

        const timeUpdate = await this.timeRepository.finbyId(id);
      

        if (!timeUpdate) {
            throw new Error(`Registro com ID ${id} não encontrado.`);
        }

        if (timeUpdate) {
            timeUpdate.available = true;
            await this.timeRepository.update(timeUpdate);
        }

    }



    findByState(state: boolean): Promise<Time[] | null> {
        return this.timeRepository.findByState(state);
    }

    private async clearDB(): Promise<void> {
        const now = this.today.toDate()
        now.setHours(0, 0, 0, 0)
        await this.timeRepository.deleteForAll(now);
    }
}