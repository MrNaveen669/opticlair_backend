const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  query: {
    type: String,
    required: [true, 'Query is required'],
    trim: true,
    maxlength: [1000, 'Query cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
enquirySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1 });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;