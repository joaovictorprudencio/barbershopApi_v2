export type BarberProps = {
    id: number;
    name: string;
    email: string;
    password: string;
    numberPhone: string;
}

export class Barber {
    
    constructor(readonly props: BarberProps) {};
    

    public static create(props: BarberProps) {
        return new Barber(props);
    } 
    
    
     public static persistence
     (
        id: number,
        name: string,
        email: string,
        password: string,
        numberPhone: string,
     ){
        return new Barber({id, name, email, password, numberPhone});
     }
    
    
    public get id() {
        return this.props.id;
    }


    public get name() {
        return this.props.name;
    }

    public get email() {
        return this.props.email;
    }

    public get password() {
        return this.props.password;
    }

    public get numberPhone() {
        return this.props.numberPhone;
    }

    public set name(name: string) {
        this.props.name = name;
    }

    public set email(email: string) {
        this.props.email = email;
    }

    public set password(password: string) {
        this.props.password = password;
    }

   public set numberPhone(numerPhone: string) {
        this.props.numberPhone = numerPhone;
    }





}