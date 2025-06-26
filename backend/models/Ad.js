import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: String,
  location: String,
  category: String, // <-- Added
  images: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


export default mongoose.model('Ad', adSchema);