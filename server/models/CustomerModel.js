import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  visits : {
    type: Number,
    default : 0
  },
  totalSpend: { type: Number, default: 0 },            
  orderCount: { type: Number, default: 0 },            
  lastOrderDate: { type: Date },                       
  category: { type: String },                          
  loyaltyMember: { type: Boolean, default: false },    
  abandonedCart: { type: Boolean, default: false },    
  cartValue: { type: Number, default: 0 },             

  createdAt: { type: Date, default: Date.now }
});
const CustomerModel = mongoose.model('Customer', customerSchema);
export default CustomerModel