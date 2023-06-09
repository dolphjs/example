/**
 * @author Utibeabasi Ekong <https://github.com/Xlaez>
 */

const { Schema, model } = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const { compare, hash } = require('bcryptjs');

const schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate(value) {
        if (value !== 'none') {
          if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
            throw new Error('Password must contain at least one letter and one number');
          }
        }
      },
    },
    role: {
      type: String,
      enum: ['author', 'reader', 'admin'],
      required: true,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    about: {
      type: String,
      minlength: 20,
      required: false,
    },
    avatar: {
      type: String,
    },
    social: {
      phone: String,
      facebook: String,
      twitter: String,
      github: String,
      linkedIn: String,
      instagram: String,
      medium: String,
    },
    sentRequests: {
      type: Number,
      default: 0,
    },
    receivedRequests: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    followings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(paginate);

schema.methods.doesPasswordMatch = async function (password) {
  const user = this;
  return compare(password, user.password);
};

schema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await hash(user.password, 11);
  }
  next();
});

/**
 * @typedef User
 */

const User = model('users', schema);
module.exports = User;
