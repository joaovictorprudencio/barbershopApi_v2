export class Time {
    constructor(
        public id: string,
        public available: boolean,
        public date: Date,
        public time: string,
        public nameCustumer: string,
        public phoneCustumer: string
    ) {}


    public static create(
        id: string,
        available: boolean,
        date: Date,
        time: string,
        nameCustumer: string,
        phoneCustumer: string
    ): Time {
        return new Time(id, available, date, time, nameCustumer, phoneCustumer);
    }


    public static persistence(
        id: string,
        available: boolean,
        date: Date,
        time: string,
        nameCustumer: string,
        phoneCustumer: string
    ): Time {
        return new Time(id, available, date, time, nameCustumer, phoneCustumer);
    }

  
    public toObject(): Record<string, any> {
        return {
            id: this.id,
            available: this.available,
            date: this.date,
            time: this.time,
            nameCustumer: this.nameCustumer,
            phoneCustumer: this.phoneCustumer
        };
    };

}