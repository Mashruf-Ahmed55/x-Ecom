import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    brand: {
      type: String,
      enum: [
        'Apple',
        'Samsung',
        'Xiaomi',
        'Huawei',
        'Oppo',
        'Vivo',
        'OnePlus',
        'Google',
        'LG',
        'Sony',
        'Nokia',
        'Asus',
        'Lenovo',
        'Motorola',
      ],
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: {
      type: [String],
    },
    color: {
      type: String,
      enum: [
        'Black',
        'White',
        'Red',
        'Blue',
        'Green',
        'Yellow',
        'Purple',
        'Orange',
        'Pink',
        'Brown',
        'Gray',
        'Silver',
        'Gold',
        'Multicolor',
      ],
    },
    rating: [
      {
        star: { type: Number, min: 1, max: 5 },
        postedby: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Product', productSchema);
