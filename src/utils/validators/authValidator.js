import { check, body } from 'express-validator';
import { validatiorMiddleware } from '../../middlewares/validatorMiddleware.js';
import slugify from 'slugify';
import { User } from '../../models/userModel.js';
import bcrypt from 'bcrypt';

const createUserValidator = [
  check('userName')
    .notEmpty()
    .withMessage('userName is required')
    .isLength({ min: 3 })
    .withMessage('userName must be at least 3 characters long')
    .custom(async (val, { req }) => {
      const user = await User.findOne({ userName: val });
      if (user) {
        return Promise.reject(new Error('UserName is already exists'));
      }
      req.body.slug = slugify(val);
      return true;
    }),

  check('firstName')
    .notEmpty()
    .withMessage('First Name is required')
    .isLength({ min: 3 })
    .withMessage('firstName must be at least 3 characters long'),

  check('lastName')
    .notEmpty()
    .withMessage('Last Name is required')
    .isLength({ min: 3 })
    .withMessage('lastName must be at least 3 characters long'),

  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return Promise.reject(new Error('E-mail already in user'));
      }
    }),

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Invalid password confirmation');
      }
      return true;
    }),

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

  check('age').notEmpty().withMessage('Age is required'),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImage').optional(),

  check('coverImage').optional(),

  validatiorMiddleware,
];

const updateUserValidator = [
  body('userName')
    .optional()
    .custom(async (val, { req }) => {
      const user = await User.findOne({ userName: val });
      if (user) {
        return Promise.reject(new Error('UserName is already taken'));
      }

      req.body.slug = slugify(val);
      return true;
    }),

  body('firstName').optional(),

  body('lastName').optional(),

  check('email')
    .notEmpty()
    .optional()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) {
        return new Error('E-mail already in user');
      }
    }),

  check('phone')
    .optional()
    .isMobilePhone(['ar-EG', 'ar-SA'])
    .withMessage('Invalid phone number only accepted Egy and SA Phone numbers'),

  check('profileImage').optional(),

  check('coverImage').optional(),

  check('age').optional(),

  validatiorMiddleware,
];

const changeUserPasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),

  body('newPassword')
    .notEmpty()
    .withMessage('You must enter your new password')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user);

      if (!user) {
        throw new Error('There is no user for this id');
      }

      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );

      if (!isCorrectPassword) {
        throw new Error('Incorrect current password');
      }

      let isTheSamePassword = await bcrypt.compare(val, user.password);

      if (isTheSamePassword) {
        throw new Error('Can not change password with the previous one');
      }

      if (val !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }

      return true;
    }),

  body('passwordConfirm')
    .notEmpty()
    .withMessage('You must enter the password confirm'),

  validatiorMiddleware,
];

const getUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatiorMiddleware,
];

const deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatiorMiddleware,
];

export {
  createUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  getUserValidator,
  deleteUserValidator,
};
