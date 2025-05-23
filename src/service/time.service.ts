import { Time } from "../models/time";


export type createTimeDto =  {
    id: number,
    available: boolean,
    date: Date,
    userId: number,
    userName: string,
    userNumberPhone: string,
    userTimes: Time[] 
}


export interface TimeService {
    marchTime(time: createTimeDto): Promise<void>;
    uncheckTime(time: Time): Promise<void>;
    listTimesAvailable(): Promise<Time[] | null>;
    listTimesUnavailable(): Promise<Time[] | null>;
    findByDate(date: Date): Promise<Time | null>;
    findByState(state: boolean): Promise<Time[] | null >;
}