import { Revenue } from "../../entities/revenue";
import { RevenueRepository } from "../revenue.repository";
import { RevenueModel } from "./models/Revenue";

export class RevenueRepositoryMongo implements RevenueRepository {

    constructor() { }

    async ensureMonthExists(month: number, year: number): Promise<Revenue> {
        const result = await RevenueModel.findOneAndUpdate(
            { month, year },
            {
                $setOnInsert: {
                    priceTotal: 0,
                    quantity: 0,
                    createdAt: new Date(),
                },
            },
            { upsert: true, new: true }
        );

        return Revenue.persistence(
            result.id,
            result.priceTotal,
            result.quantity,
            result.month,
            result.year,
            result.createdAt
        );
    }

    async incrementMonthRevenue(month: number, year: number, priceTotal: number, quantity: number): Promise<Revenue> {
        const result = await RevenueModel.findOneAndUpdate(
            { month, year },
            {
                $inc: {
                    priceTotal: priceTotal,
                    quantity: quantity,
                },
                $setOnInsert: {
                    createdAt: new Date(),
                },
            },
            { upsert: true, new: true }
        );

        return Revenue.persistence(
            result.id,
            result.priceTotal,
            result.quantity,
            result.month,
            result.year,
            result.createdAt
        );
    }

    async findByMonthYear(month: number, year: number): Promise<Revenue | null> {
        const revenue = await RevenueModel.findOne({ month, year });

        if (!revenue) {
            return null;
        }

        return Revenue.persistence(
            revenue.id,
            revenue.priceTotal,
            revenue.quantity,
            revenue.month,
            revenue.year,
            revenue.createdAt
        );
    }

    async findByYear(year: number): Promise<Revenue[]> {
        const revenues = await RevenueModel.find({ year }).sort({ month: 1 });

        return revenues.map(r => Revenue.persistence(
            r.id,
            r.priceTotal,
            r.quantity,
            r.month,
            r.year,
            r.createdAt
        ));
    }
}
