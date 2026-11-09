import { TimeService } from "./time.service";
import { Time } from "../entities/time";
import { TimeRepositoryMongo } from "../repository/mongodb/time.repository.mongodb";
import { RevenueRepositoryMongo } from "../repository/mongodb/revenue.repository.mongodb";
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
        private readonly revenueRepository: RevenueRepositoryMongo,
    ) {


    };



    public static build(timeRepository: TimeRepositoryMongo, revenueRepository: RevenueRepositoryMongo) {
        return new TimeServiceIplement(timeRepository, revenueRepository);
    }


    public static getInstance(timeRepository: TimeRepositoryMongo, revenueRepository: RevenueRepositoryMongo): TimeServiceIplement {
        if (!TimeServiceIplement.instance) {
            TimeServiceIplement.instance = new TimeServiceIplement(timeRepository, revenueRepository);
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

        await this.updateRevenueBeforeClear();
        await this.clearDB();

        const todayDate = dayjs().tz('America/Sao_Paulo').startOf('day').toDate();
   
        

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
                        0,
                        "nome modelo do job",
                        "222222222222222222"
                    ))


                console.log(`✅ Horário ${timeStr} salvo para ${todayDate}`);
            } catch (error) {

                console.warn(`⚠️ Horário ${timeStr} pulado: ${(error as Error).message}`);

            }

        }

    }

    private async updateRevenueBeforeClear(): Promise<void> {
        try {
            const unavailableTimes = await this.timeRepository.findByState(false);

            if (!unavailableTimes || unavailableTimes.length === 0) {
                return;
            }

            const grouped = new Map<string, { month: number; year: number; priceTotal: number; quantity: number }>();

            for (const time of unavailableTimes) {
                const date = dayjs(time.date);
                const key = `${date.year()}-${date.month() + 1}`;

                const group = grouped.get(key) ?? { month: date.month() + 1, year: date.year(), priceTotal: 0, quantity: 0 };
                group.priceTotal += time.price ?? 0;
                group.quantity += 1;
                grouped.set(key, group);
            }

            for (const group of grouped.values()) {
                await this.revenueRepository.incrementMonthRevenue(
                    group.month,
                    group.year,
                    group.priceTotal,
                    group.quantity
                );
                console.log(`💰 Revenue ${group.month}/${group.year} atualizada: +${group.priceTotal} (+${group.quantity} serviços)`);
            }
        } catch (error) {
            console.warn('⚠️ Falha ao atualizar revenue antes da limpeza:', (error as Error).message);
        }
    }

    public async marchTime(time: createTimeDto): Promise<Time | undefined> {

        try {

            const timeStr = time.time;

        

            const timeDate = dayjs.tz(time.date, 'America/Sao_Paulo')
                .startOf('day')
                .toDate();

      
                console.log("data que ta vindo para api",time.date )

            if (dayjs.tz(time.date, 'America/Sao_Paulo').isBefore(dayjs().tz('America/Sao_Paulo').startOf('day'))) {
                 throw new Error('A data informada já passou.');
            };


            const Unavailable = await this.timeRepository.validationData(timeDate, timeStr, false);
            console.log("o horario está indiposnivel no banco ?  ", Unavailable)

            if (Unavailable !== null && Unavailable !== undefined) {
              throw new Error("Horário indisponível");
            }

            const TimeAvailable = await this.timeRepository.validationData(
                timeDate,
                timeStr,
                true 
            );

    

            if(TimeAvailable==null) {

             console.log("CRIANDO HORARIO: ",)


            const newTime = await this.timeRepository.create(
                false,
                timeDate,
                timeStr,
                time.price ?? 0,
                time.nameCustumer,
                time.phoneCustumer
            );

                await this.ensureRevenueForDate(timeDate);

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
                    timeDate,
                    timeStr,
                    time.price ?? 0,
                    time.nameCustumer,
                    time.phoneCustumer
                );

                console.log("ultimo logbantes de chamar o repo ")

                const updatedTime = await this.timeRepository.update(updatedTimeData);

                if(!updatedTime){
                    throw new Error(`não encontrado`)
                }

                await this.ensureRevenueForDate(timeDate);

                console.log('dado atualizado do repo  ', updatedTime);
                return updatedTime;
            }

        } catch (error) {

            console.log("erro : ", error);
            throw error;
        }
    }

    private async ensureRevenueForDate(date: Date): Promise<void> {
        try {
            const d = dayjs(date);
            await this.revenueRepository.ensureMonthExists(d.month() + 1, d.year());
        } catch (error) {
            console.warn('⚠️ Falha ao garantir revenue do mês:', (error as Error).message);
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
            0, 
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
                timeFind.price,
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
        const now = dayjs().tz('America/Sao_Paulo').startOf('day').toDate();
        await this.timeRepository.deleteForAll(now);
    }
}