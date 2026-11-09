import { Revenue } from "../entities/revenue";

export interface RevenueRepository {
    ensureMonthExists(month: number, year: number): Promise<Revenue>;
    incrementMonthRevenue(month: number, year: number, priceTotal: number, quantity: number): Promise<Revenue>;
    findByMonthYear(month: number, year: number): Promise<Revenue | null>;
    findByYear(year: number): Promise<Revenue[]>;
}
