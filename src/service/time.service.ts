import { Time } from "../models/time";

export interface TimeService {
    marchTime(time: Time): Promise<void>;
    uncheckTime(time: Time): Promise<void>;
    listTimes(): Promise<Time[]>;
    finbyDate(date: Date): Promise<Time | null>;
    finbyState(state: boolean): Promise<Time | null>;
}