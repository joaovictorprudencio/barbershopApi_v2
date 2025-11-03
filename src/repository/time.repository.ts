import { Time } from "../entities/time";

export interface TimeRepository {
    create(available: boolean, date: Date, time:string, nameCustumer: string,phoneCustumer:string): Promise<Time>;
    update(time: Time): Promise<Time | null>;
    finbyId(timeId: number | string): Promise<Time | null>;
    findByState(state: boolean): Promise<Time[] | null>;
    findByDate(date: Date, time:string): Promise<Time | null>;
    delete(timeId: string): Promise<void>;
    deleteForAll(date:Date): Promise<void>;
    validationData(date:Date, time:string, available:boolean):Promise <Time|null>;
}