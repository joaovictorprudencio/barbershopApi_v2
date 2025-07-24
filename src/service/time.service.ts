

import { Time } from "../models/time";



export type createTimeDto =  {
    available: boolean,
    date: Date,
    time:string,
     nameCustumer: string;
    phoneCustumer: string;
}


export interface TimeService {
    marchTime(time: createTimeDto): Promise<Time>;
    uncheckTime(id: number): Promise<void>;
    listTimesAvailable(): Promise<Time[] | null>;
    listTimesUnavailable(): Promise<Time[] | null>;
    findByDate(date: Date , time:string): Promise<Time | null>;
    findByState(state: boolean): Promise<Time[] | null >;
}