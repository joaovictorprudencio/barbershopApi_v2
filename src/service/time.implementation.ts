import { TimeService } from "./time.service";
import { Time } from "../models/time";
import { Barber } from "../models/barber";
import { TimeRepositoryPrisma } from "../repository/prisma/time.repository.prisma";
import { createTimeDto } from "./time.service";
import cron from 'node-cron';
import { ScheduledTask } from 'node-cron';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';


dayjs.extend(utc);
dayjs.extend(timezone);

export class TimeServiceIplement implements TimeService {

    private cronJob!: ScheduledTask;
    private static instance: TimeServiceIplement;

    public todayTimes: Time[] = [];
    public today = dayjs().tz('America/Sao_Paulo');



    constructor(
        private readonly timeRepository: TimeRepositoryPrisma,
    ) {
        console.log('Configurando agendador cron...');
        this.initializeScheduler();
        console.log('Agendador configurado para  (Brasília)');


    };

    public static build(timeRepository: TimeRepositoryPrisma) {
        return new TimeServiceIplement(timeRepository);
    }


    public static getInstance(timeRepository: TimeRepositoryPrisma): TimeServiceIplement {
        if (!TimeServiceIplement.instance) {
            TimeServiceIplement.instance = new TimeServiceIplement(timeRepository);
        }
        return TimeServiceIplement.instance;
    }

    private initializeScheduler() {
        console.log('⚙️ Inicializando agendador independente...');

        // Mantém a instância ativa
        const keepAlive = setInterval(() => { }, 1000);

        this.cronJob = cron.schedule('0 30 20 * * *', () => {
            console.log('⏰ Executando tarefa agendada independente');
            this.executeDailyTask()
                .then(() => console.log('✅ Tarefa concluída'))
                .catch(err => console.error('❌ Erro:', err));
        }, {
            timezone: 'America/Sao_Paulo',
        });


    }


    private getCurrentBrazilDate() {
        return dayjs().tz('America/Sao_Paulo');
    }



    private async executeDailyTask() {
        console.log(`[${this.getCurrentBrazilDate().format()}] Iniciando rotina diária...`);

        try {
            console.log('Iniciando geração de horários ...');
            await this.generateTime();

            console.log('Iniciando limpeza do banco...');
            await this.clearDB();
            console.log('Limpeza do banco concluída');

            console.log('✅ Rotina diária completa');
        } catch (error) {
            console.error('❌ Erro na rotina diária:', error);
            // Adicione aqui qualquer tratamento adicional de erro
        }
    }



    async generateTime(): Promise<void> {
        try {
            await this.clearDB();
            // Pega apenas a data (sem hora) no timezone de São Paulo
            const todayDate = dayjs().tz('America/Sao_Paulo').startOf('day').toDate();
            const tomorrowDate = dayjs().tz('America/Sao_Paulo').add(1, 'day').startOf('day').toDate();

            const timeSlots = [
                '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00',
                '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
                '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
            ];

            for (const timeStr of timeSlots) {
                await this.marchTime(
                    Time.persistence(
                    0,
                    true,
                    tomorrowDate,  // Data com 00:00:00
                    timeStr,    // Hora como string "HH:mm"
                    "Disponível",
                    "1111111111111111111111"
                    )

                )
                console.log(`✅ Horário ${timeStr} salvo para ${todayDate}`);
            }
        } catch (error) {
            console.error('Erro ao gerar horários:', error);
            throw error;
        }
    }

    // Método corrigido para marcar horário
    public async marchTime(time: createTimeDto): Promise<Time> {
        // Converte a data recebida para o fuso correto
        const appointmentDate = dayjs(time.date).tz('America/Sao_Paulo').startOf('day').toDate();
   
        const timeStr = time.time; // "HH:mm"

        // Verifica se não está agendando no passado
        const now = dayjs().tz('America/Sao_Paulo');
        const appointmentDateTime = dayjs(appointmentDate)
            .hour(parseInt(timeStr.split(':')[0]))
            .minute(parseInt(timeStr.split(':')[1]));

        if (appointmentDateTime.isBefore(now)) {
            throw new Error("Não é possível agendar horários no passado");
        }

        // Verifica disponibilidade
        const timeExists = await this.timeRepository.findByDate(appointmentDate, timeStr);

        if (timeExists && !timeExists.available) {
            throw new Error("Horário indisponível");
        }

        if (timeExists) {
            const updatedTime = await this.timeRepository.update(Time.persistence(
                timeExists.id,
                false,
                appointmentDate,
                timeStr,
                time.nameCustumer,
                time.phoneCustumer
            ));


            return updatedTime;
        }

        const newTime = await this.timeRepository.create(
            false,
            appointmentDate,
            timeStr,
            time.nameCustumer,
            time.phoneCustumer
        );

        return newTime;
    }


    // Métodos de consulta corrigidos
    async listTimesAvailable(): Promise<Time[] | null> {
        const times = await this.timeRepository.findByState(true);
        return this.convertTimesToBRT(times);
    }

    async listTimesUnavailable(): Promise<Time[] | null> {
        const times = await this.timeRepository.findByState(false);
        return this.convertTimesToBRT(times);
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

    // Método auxiliar para conversão
    private convertTimesToBRT(times: Time[] | null): Time[] | null {
        if (!times) return null;

        return times.map(time => Time.persistence(
            time.id,
            time.available,
            dayjs(time.date).tz('America/Sao_Paulo').toDate(),
            time.time,
            time.nameCustumer,
            time.phoneCustumer
        ));
    }



    public async uncheckTime(id: number): Promise<void> {

        const timeUpdate = await this.timeRepository.finbyId(id);

        if (timeUpdate) {
            timeUpdate.available = true;
            await this.timeRepository.update(timeUpdate);
        }

    }



    findByState(state: boolean): Promise<Time[] | null> {
        return this.timeRepository.findByState(state);
    }

    private async clearDB(): Promise<void> {
        this.timeRepository.deleteForAll(this.today.toDate());
    }
}