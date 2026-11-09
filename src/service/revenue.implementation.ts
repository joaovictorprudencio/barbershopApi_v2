import { RevenueService } from "./revenue.service";
import { Revenue } from "../entities/revenue";
import { RevenueRepositoryMongo } from "../repository/mongodb/revenue.repository.mongodb";

export class RevenueServiceImplement implements RevenueService {

    constructor(private readonly revenueRepository: RevenueRepositoryMongo) { }

    public static build(revenueRepository: RevenueRepositoryMongo) {
        return new RevenueServiceImplement(revenueRepository);
    }

    async findByMonthYear(month: number, year: number): Promise<Revenue | null> {
        return this.revenueRepository.findByMonthYear(month, year);
    }

    async findByYear(year: number): Promise<Revenue[]> {
        return this.revenueRepository.findByYear(year);
    }
}
