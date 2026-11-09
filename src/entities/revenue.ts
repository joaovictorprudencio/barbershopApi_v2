export type RevenueProps = {
    id: string;
    priceTotal: number;
    quantity: number;
    month: number;
    year: number;
    createdAt: Date;
};

export class Revenue {
    constructor(readonly props: RevenueProps) {}

    public static create(props: RevenueProps) {
        return new Revenue(props);
    }

    public static persistence(
        id: string,
        priceTotal: number,
        quantity: number,
        month: number,
        year: number,
        createdAt?: Date
    ) {
        return new Revenue({
            id,
            priceTotal,
            quantity,
            month,
            year,
            createdAt: createdAt ?? new Date(),
        });
    }

    public get id(): string {
        return this.props.id;
    }

    public get priceTotal(): number {
        return this.props.priceTotal;
    }

    public get quantity(): number {
        return this.props.quantity;
    }

    public get month(): number {
        return this.props.month;
    }

    public get year(): number {
        return this.props.year;
    }

    public get createdAt(): Date {
        return this.props.createdAt;
    }

    public toObject(): Record<string, any> {
        return {
            id: this.id,
            priceTotal: this.priceTotal,
            quantity: this.quantity,
            month: this.month,
            year: this.year,
            createdAt: this.createdAt,
        };
    }
}
