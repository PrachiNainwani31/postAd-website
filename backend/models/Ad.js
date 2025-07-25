import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String,
  location: String,
  category: String,
  images: [String],
  status: {
  type: String,
  enum: ['pending', 'approved', 'rejected'],
  default: 'pending'
},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{ timestamps: true });


export default mongoose.model('Ad', adSchema);