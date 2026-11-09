import { Revenue } from "../entities/revenue";

export interface RevenueService {
    findByMonthYear(month: number, year: number): Promise<Revenue | null>;
    findByYear(year: number): Promise<Revenue[]>;
}
