import mongoose, { model, Schema } from 'mongoose';


const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId : {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    photo: { type: String },
  },
  {
    timestamps: true,
    // versionKey: false,
  },
);

export const ContactCollection = model('Contact', contactSchema);
//Contact => to lower case => contact => other => contacts