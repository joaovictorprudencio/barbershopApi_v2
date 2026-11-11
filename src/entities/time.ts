import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export class Time {
    constructor(
        public id: string,
        public available: boolean,
        public date: Date,
        public time: string,
        public price: number,
        public nameCustumer: string,
        public phoneCustumer: string,
        public counted: boolean = false
    ) {}

    public static create(
        id: string,
        available: boolean,
        date: Date,
        time: string,
        price: number,
        nameCustumer: string,
        phoneCustumer: string,
        counted: boolean = false
    ): Time {
        return new Time(id, available, date, time, price, nameCustumer, phoneCustumer, counted);
    }

    public static persistence(
        id: string,
        available: boolean,
        date: Date,
        time: string,
        price: number,
        nameCustumer: string,
        phoneCustumer: string,
        counted: boolean = false
    ): Time {
        return new Time(id, available, date, time, price, nameCustumer, phoneCustumer, counted);
    }

    public toObject(): Record<string, any> {
        return {
            id: this.id,
            available: this.available,
            date: dayjs(this.date).tz('America/Sao_Paulo').format('YYYY-MM-DD'),
            time: this.time,
            price: this.price,
            nameCustumer: this.nameCustumer,
            phoneCustumer: this.phoneCustumer,
            counted: this.counted
        };
    };

}