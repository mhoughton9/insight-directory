const mongoose = require('mongoose');

/**
 * Schema for spiritual teachers/authors
 */
const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Teacher name is required'],
      unique: true,
      trim: true
    },
    biography: {
      type: String,
      required: [true, 'Teacher biography is required']
    },
    birthDate: {
      type: Date
    },
    deathDate: {
      type: Date
    },
    country: {
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
    website: {
      type: String,
      trim: true
    },
    traditions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tradition'
    }],
    relatedTeachers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for resources associated with this teacher
teacherSchema.virtual('resources', {
  ref: 'Resource',
  localField: '_id',
  foreignField: 'teachers'
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
