
import { User } from "./user";


export type TimeProps = {
    id: number;
    available: boolean;
    date: Date;
    nameCustumer: string;
    phoneCustumer: string;
}

export class Time {

    constructor(readonly props: TimeProps) { };


    public static create(props: TimeProps) {
        return new Time(props);
    }


    public static persistence
        (
            id: number,
            available: boolean,
            date: Date,
            nameCustumer: string,
            phoneCustumer: string,
        ) {
        return new Time({ id, available, date, nameCustumer, phoneCustumer });
    }


    public get id() {
        return this.props.id;
    }


    public get available() {
        return this.props.available;
    }

    public get date() {
        return this.props.date;
    }

    public get nameCustumer() {
        return this.props.nameCustumer;
    }



    public get phoneCustumer() {
        return this.props.phoneCustumer;
    }

    public set phoneCustumer(phone: string) {
        this.props.phoneCustumer = phone;
    }

    public set nameCustumer(name: string) {
        this.props.nameCustumer = name;
    }

    public set available(state: boolean) {
        this.props.available = state;
    }

    public set date(value: Date) {
        this.props.date = value;
    }



}