import mongoose, { Schema, Document } from "mongoose";

export interface ITime extends Document {
  available: boolean;
  date: Date;
  time: string;
  nameCustumer: string;
  phoneCustumer: string;
}

const TimeSchema = new Schema<ITime>({
  available: { type: Boolean, required: true },
  date: { type: Date, required: true, unique: true },
  time: { type: String, required: true },
  nameCustumer: { type: String, required: true },
  phoneCustumer: { type: String, required: true },
});

export const TimeModel = mongoose.model<ITime>("Time", TimeSchema);
