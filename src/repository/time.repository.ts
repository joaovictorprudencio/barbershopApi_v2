import { Time } from "../models/time";

export interface TimeRepository {
    create(available: boolean, date: Date, nameCustumer: string,phoneCustumer:string): Promise<void>;
    update(time: Time): Promise<void>;
    finbyId(timeId: number): Promise<Time | null>;
    findByState(state: boolean): Promise<Time[] | null>;
    findByDate(date: Date): Promise<Time | null>;
    delete(timeId: number): Promise<void>;
}