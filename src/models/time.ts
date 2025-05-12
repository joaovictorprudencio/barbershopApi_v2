
import { User } from "./user";


export type TimeProps = {
    id: number;
    available: boolean;
    date: Date;
    userId: number;
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
            userId: number,
        ) {
        return new Time({ id, available, date, userId });
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



    public get userId() {
        return this.props.userId;
    }

    public set available(state: boolean) {
        this.props.available = state;
    }

    public set date(value: Date) {
        this.props.date = value;
    }

    public set userId(value: number) {
        this.props.userId = value;
    }

}