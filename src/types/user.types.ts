import * as mongoose from 'mongoose';

export default interface iUser {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: 'ADMIN' | 'USER';
  isBlocked: boolean;
  cart: Array<any>;
  address: Array<{
    street: string;
    city: string;
    state: string;
    zip: string;
  }>;
  wishlist: Array<any>;
  providerId: string | null;
  provider: string | null;
  avatar: string | null;
  profile_url_id: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}
