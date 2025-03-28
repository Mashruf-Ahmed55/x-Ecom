import mongoose from 'mongoose';

const userModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        type: mongoose.Schema.Types.Mixed,
        default: [],
      },
    ],
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        default: null,
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null,
      },
    ],
    providerId: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    profile_url_id: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userModel);
