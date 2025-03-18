const mongoose = require('mongoose');

/**
 * Schema for spiritual traditions or paths
 */
const traditionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tradition name is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Tradition description is required']
    },
    origin: {
      type: String,
      trim: true
    },
    foundingPeriod: {
      type: String,
      trim: true
    },
    keyTeachings: [{
      type: String,
      trim: true
    }],
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
    },
    relatedTraditions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tradition'
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for teachers associated with this tradition
traditionSchema.virtual('teachers', {
  ref: 'Teacher',
  localField: '_id',
  foreignField: 'traditions'
});

// Virtual for resources associated with this tradition
traditionSchema.virtual('resources', {
  ref: 'Resource',
  localField: '_id',
  foreignField: 'traditions'
});

const Tradition = mongoose.model('Tradition', traditionSchema);

module.exports = Tradition;
