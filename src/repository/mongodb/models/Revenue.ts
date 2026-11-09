import mongoose, { Schema, Document } from "mongoose";

export interface IRevenue extends Document {
  priceTotal: number;
  quantity: number;
  month: number;
  year: number;
  createdAt: Date;
}

const RevenueSchema = new Schema<IRevenue>({
  priceTotal: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true, default: 0 },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

RevenueSchema.index({ month: 1, year: 1 }, { unique: true });

export const RevenueModel = mongoose.model<IRevenue>("Revenue", RevenueSchema);
