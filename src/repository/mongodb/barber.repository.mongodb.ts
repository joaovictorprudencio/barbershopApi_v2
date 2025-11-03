import { BarberRepository } from "../barber.repository";
import { BarberModel } from "./models/Barber";
import { barberCreateDto } from "../../service/barbeiro.service";
import { Barber } from "../../entities/barber";

export class TimeRepositoryMongo implements BarberRepository {

     

   async create(barber: barberCreateDto): Promise<Barber> {
        const newBarber = await BarberModel.create({
             name: barber.name,
             email: barber.email,
             password: barber.password,
             numberPhone: barber.numberPhone,
        })

        return Barber.persistence(  
            newBarber.id,
            newBarber.name,
            newBarber.email,
            newBarber.password,
            newBarber.numberPhone
        );
    }


    async findByEmail(email: string): Promise<Barber | null> {
        const getBarberEmail = await BarberModel.findOne({
            email: email
        })

        if(!getBarberEmail){
            return null;
        }

        return Barber.persistence(
            getBarberEmail.id,
            getBarberEmail.name,
            getBarberEmail.email,
            getBarberEmail.password,
            getBarberEmail.numberPhone
        );
    }


    
}