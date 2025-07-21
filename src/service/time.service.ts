
import { Barber } from "../models/barber";
import { Time } from "../models/time";
import { User } from "../models/user";


export type createTimeDto =  {
    id: number,
    available: boolean,
    date: Date,
     nameCustumer: string;
    phoneCustumer: string;
}


export interface TimeService {
    marchTime(time: createTimeDto): Promise<void>;
   
    uncheckTime(id: number): Promise<void>;
    listTimesAvailable(): Promise<Time[] | null>;
    listTimesUnavailable(): Promise<Time[] | null>;
    findByDate(date: Date): Promise<Time | null>;
    findByState(state: boolean): Promise<Time[] | null >;
}