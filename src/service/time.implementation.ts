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
    public inicio = dayjs(this.today).hour(8).minute(0).second(0).toDate();
    public fim = dayjs(this.today).hour(12).minute(0).second(0).toDate();
    public tardeInicio = dayjs(this.today).hour(14).minute(0).second(0).toDate();
    public tardeFim = dayjs(this.today).hour(20).minute(0).second(0).toDate();


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

        this.cronJob = cron.schedule('0 22  14 * * *', () => {
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


    private getTimeRange() {
        const today = this.getCurrentBrazilDate();
        return {
            inicioManha: today.hour(8).minute(0).utc(),
            fimManha: today.hour(12).minute(0).utc(),
            inicioTarde: today.hour(14).minute(0).utc(),
            fimTarde: today.hour(20).minute(30).utc(),
        };
    }


    private setupDailyJob(): ScheduledTask {

        const job = cron.schedule('0 36 16 * * *', () => {
            console.log('⏰ Disparando tarefa agendada');
            this.executeDailyTask().catch(error => {
                console.error('Erro na execução agendada:', error);
            });
        }, {
            timezone: 'America/Sao_Paulo'
        });


      
        return job;
    }


    private async executeDailyTask() {
        console.log(`[${this.getCurrentBrazilDate().format()}] Iniciando rotina diária...`);

        const { inicioManha, fimManha, inicioTarde, fimTarde } = this.getTimeRange();

        // Logs formatados para melhor visualização
        console.log('Período manhã:', {
            inicio: inicioManha.format('HH:mm'),
            fim: fimManha.format('HH:mm')
        });

        console.log('Período tarde:', {
            inicio: inicioTarde.format('HH:mm'),
            fim: fimTarde.format('HH:mm')
        });

        try {
            console.log('Iniciando geração de horários matutinos...');
            await this.generateTime(inicioManha, fimManha);
            console.log('Geração de horários matutinos concluída');

            console.log('Iniciando geração de horários vespertinos...');
            await this.generateTime(inicioTarde, fimTarde);
            console.log('Geração de horários vespertinos concluída');

            console.log('Iniciando limpeza do banco...');
            await this.clearDB();
            console.log('Limpeza do banco concluída');

            console.log('✅ Rotina diária completa');
        } catch (error) {
            console.error('❌ Erro na rotina diária:', error);
            // Adicione aqui qualquer tratamento adicional de erro
        }
    }



    async generateTime(inicio: dayjs.Dayjs, final: dayjs.Dayjs): Promise<void> {

        // let current = inicio.clone();

        // while (current.isBefore(final.add(1, 'millisecond'))) {
            
        //     const horarioDate = current.utc().toDate();

        //     console.log(`Processando: ${current.format('YYYY-MM-DD HH:mm:ss')}`);
        //     console.log(`Será gravado como: ${horarioDate.toISOString()}`);

        //     try {
        //         const timeExist = await this.timeRepository.validationData(horarioDate, false);

        //         if (!timeExist) {
        //             await this.timeRepository.create(true, horarioDate, "mock-name", "xx-xxxx-xxxx");
        //             console.log(`✅ Criado: ${current.format('HH:mm')} (UTC: ${horarioDate.toISOString()})`);
        //         }
        //     } catch (error) {
        //         console.error(`❌ Erro em ${current.format('HH:mm')}:`, error);
        //     }

        //     current = current.add(30, 'minute');
        // }
    };






    public async marchTime(time: createTimeDto): Promise<void> {


        const date: Date = new Date(Date.now() - 3 * 60 * 60 * 1000);

        const timeExists = await this.timeRepository.validationData(time.date, true);
        const timeIndisponivel = await this.timeRepository.validationData(time.date, false);

        if (timeIndisponivel) {
            throw new Error("Time indisponivel");
        }

        if (timeExists) {
            timeExists.available = false;

            await this.timeRepository.update(Time.persistence(
                timeExists.id,
                time.available,
                time.date,
                time.nameCustumer,
                time.phoneCustumer
            ));






        }
        await this.timeRepository.create(
            false,
            time.date,
            time.nameCustumer,
            time.phoneCustumer
        )
    }


    public async uncheckTime(id: number): Promise<void> {

        const timeUpdate = await this.timeRepository.finbyId(id);

        if (timeUpdate) {
            timeUpdate.available = true;
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
        return this.timeRepository.findByState(state);
    }

    private async clearDB(): Promise<void> {
        this.timeRepository.deleteForAll(this.today.toDate());
    }
}