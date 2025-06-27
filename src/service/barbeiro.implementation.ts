import { Barber } from "../models/barber";
import { BarberRepository } from "../repository/barber.repository";
import { barbeiroService, barberLoginDto, barberResDto } from "./barbeiro.service";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class barberServiceImplement implements barbeiroService {

    constructor(private readonly barberRepository: BarberRepository) { };



    async create(barber: Barber): Promise<Barber> {

        await this.barberRepository.create(barber);

        return Barber.persistence(
            barber.id,
            barber.email,
            barber.name,
            barber.numberPhone,
            barber.password,
        );
    };


    async login(barberDTO: barberLoginDto): Promise<barberResDto | null> {

        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET não definida nas variáveis de ambiente');
        }


        const barber = await this.barberRepository.findByEmail(barberDTO.email);

        if (!barber) {
            throw new Error("barbeiro não encontrato");
            return null;
        }

        const loginIsValid = await bcrypt.compare(barberDTO.password, barber.password);

        if (!loginIsValid) {
            return null;
        }

        const token = jwt.sign(
            { sub: barber.id },
            JWT_SECRET,
            { expiresIn: '23h' }
        );


        const res: barberResDto = {
            id: barber.id,
            name: barber.name,
            email: barber.email,
            token: token,
        }

        return res;

    }

}