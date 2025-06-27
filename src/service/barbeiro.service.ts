import { Barber } from "../models/barber";
import jwt from 'jsonwebtoken';

export type barberLoginDto = {
  email : string,
  password : string
};

export type barberResDto = {
  id: number,
  name: string,
  email: string,
  token: string

}

export interface barbeiroService {
    create( barber: Barber) : Promise<Barber>
    login( barber: barberLoginDto) : Promise<barberResDto| null>;
};