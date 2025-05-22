
import { Time } from "./time";

export type UserProps = {
    name: string;
    numberPhone: string;
    times: Time[];
}

export class User {
    
    constructor(readonly props: UserProps) {};
    

    public static create(props: UserProps) {
        return new User(props);
    } 
    
    
     public static persistence
     (
        name: string,
        numberPhone: string,
        times: Time[]
     ){
        return new User({ name, numberPhone, times});
     }
    
    
   


    public get name() {
        return this.props.name;
    }

    public get numberPhone() {
        return this.props.numberPhone;
    }

    public get times(){
        return this.props.times;
    }

    public set name(name: string) {
        this.props.name = name;
    }


   public set numberPhone(numerPhone: string) {
        this.props.numberPhone = numerPhone;
    }

    public set addTimes(time: Time){
        this.props.times.push(time);
    }





}