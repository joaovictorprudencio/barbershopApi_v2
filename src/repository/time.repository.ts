import { Time } from "../models/time";

export interface TimeRepository {
    create(time: Time): Promise<void>;
    update(time: Time): Promise<void>;
    finbyId(timeId: number): Promise<Time | null>;
    finbyDate(date: Date): Promise<Time | null>;
    delete(timeId: number): Promise<void>;
}