import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  category?: mongoose.Schema.Types.ObjectId;
  brand?: string;
  quantity: number;
  sold: number;
  images?: string[];
  color?: string;
  rating: {
    star: number;
    postedby: mongoose.Schema.Types.ObjectId;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
