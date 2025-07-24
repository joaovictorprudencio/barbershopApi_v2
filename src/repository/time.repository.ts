import { Time } from "../models/time";

export interface TimeRepository {
    create(available: boolean, date: Date, time:string, nameCustumer: string,phoneCustumer:string): Promise<Time>;
    update(time: Time): Promise<Time>;
    finbyId(timeId: number): Promise<Time | null>;
    findByState(state: boolean): Promise<Time[] | null>;
    findByDate(date: Date, time:string): Promise<Time | null>;
    delete(timeId: number): Promise<void>;
    deleteForAll(date:Date): Promise<void>;
}