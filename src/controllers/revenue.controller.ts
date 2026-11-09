import { Request, Response } from 'express';
import { RevenueService } from "../service/revenue.service";
import { RevenueServiceImplement } from "../service/revenue.implementation";
import { RevenueRepositoryMongo } from "../repository/mongodb/revenue.repository.mongodb";

const initializeDependencies = async () => {
  const repository = new RevenueRepositoryMongo();
  return await RevenueServiceImplement.build(repository);
};

let revenueService: RevenueService;

export async function findByMonthYear(req: Request, res: Response): Promise<Response> {
  try {
    if (!revenueService) revenueService = await initializeDependencies();

    const { year, month } = req.params;
    const revenue = await revenueService.findByMonthYear(Number(month), Number(year));

    return res.status(200).json({
      revenue: revenue ? revenue.toObject() : null,
      totals: {
        priceTotal: revenue ? revenue.priceTotal : 0,
        quantity: revenue ? revenue.quantity : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar receitas' });
  }
}

export async function findByYear(req: Request, res: Response): Promise<Response> {
  try {
    if (!revenueService) revenueService = await initializeDependencies();

    const { year } = req.params;
    const revenues = await revenueService.findByYear(Number(year));

    const totals = revenues.reduce(
      (acc, r) => {
        acc.priceTotal += r.priceTotal;
        acc.quantity += r.quantity;
        return acc;
      },
      { priceTotal: 0, quantity: 0 }
    );

    return res.status(200).json({
      revenues: revenues.map(r => r.toObject()),
      totals,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar receitas do ano' });
  }
}
