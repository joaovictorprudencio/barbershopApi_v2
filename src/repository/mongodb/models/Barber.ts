import mongoose, { Schema, Document } from "mongoose";

export interface IBarber extends Document {
  name: string;
  email: string;
  password: string;
  numberPhone: string;
}

const BarberSchema = new Schema<IBarber>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  numberPhone: { type: String },
});

export const BarberModel = mongoose.model<IBarber>("Barber", BarberSchema);