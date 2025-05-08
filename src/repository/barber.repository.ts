import { Barber } from "../models/barber";

export interface BarberRepository {
    create(barber: Barber): Promise<void>;
    findByEmail(email: string): Promise<Barber | null>; 
}