const mongoose = require('mongoose');

/**
 * Schema for users of the Awakening Resources Directory
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    // We'll use Clerk for auth, so we don't need to store passwords
    // This is just to store the Clerk user ID
    clerkId: {
      type: String,
      required: true,
      unique: true
    },
    bio: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['user', 'contributor', 'admin'],
      default: 'user'
    },
    favoriteResources: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource'
    }],
    favoriteTeachers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    }],
    favoriteTraditions: [{
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

// Virtual for comments made by this user
userSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'user'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
