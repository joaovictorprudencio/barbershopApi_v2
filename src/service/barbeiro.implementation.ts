import { Barber } from "../models/barber";
import { BarberRepository } from "../repository/barber.repository";
import { barbeiroService, barberCreateDto, barberLoginDto, barberResDto } from "./barbeiro.service";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class barberServiceImplement implements barbeiroService {

    constructor(private readonly barberRepository: BarberRepository) { };



    async create(barber: barberCreateDto): Promise<Barber> {


        console.log(barber)
        const hashPassword = await bcrypt.hash(barber.password, 10)

        const barberWithHashedPassword = {
            ...barber,
            password: hashPassword
        };

        const barberNew = await this.barberRepository.create(barberWithHashedPassword);


        return Barber.persistence(
            barberNew.id,
            barberNew.email,
            barberNew.name,
            barberNew.password,
            barberNew.numberPhone,
        );
    };


    async login(barberDTO: barberLoginDto): Promise<barberResDto | null> {
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error('JWT_SECRET não definida nas variáveis de ambiente');

        const barber = await this.barberRepository.findByEmail(barberDTO.email);

        if (!barber) {
            console.log("Barbeiro não encontrado com email:", barberDTO.email);
            return null;
        }

        console.log("Senha digitada:", barberDTO.password);
        console.log("Senha no banco (hash):", barber.password);

        const isPasswordCorrect = await bcrypt.compare(barberDTO.password, barber.password);

        if (!isPasswordCorrect) {
            console.log("Senha incorreta para o email:", barberDTO.email);
            return null;
        }

        const token = jwt.sign({ sub: barber.id }, JWT_SECRET, { expiresIn: '23h' });

        return {
            id: barber.id,
            name: barber.name,
            email: barber.email,
            token: token,
        };
    }

    public static async build(barberRepository: BarberRepository) {
        return new barberServiceImplement(barberRepository);
    }

}