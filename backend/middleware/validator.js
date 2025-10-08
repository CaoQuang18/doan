// middleware/validator.js - Input Validation Middleware

const { body, validationResult } = require('express-validator');

/**
 * Validation result checker
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Get first error message for simple display
    const firstError = errors.array()[0];
    return res.status(400).json({
      message: firstError.msg,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Register validation rules
 */
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username phải từ 3-30 ký tự')
    .matches(/^[\p{L}\p{N}_ ]+$/u)
    .withMessage('Username chỉ chứa chữ, số, dấu cách và dấu gạch dưới'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 3 })
    .withMessage('Mật khẩu phải có ít nhất 3 ký tự'),
  
  validate
];

/**
 * Login validation rules
 */
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống'),
  
  validate
];

/**
 * Admin login validation rules
 */
const adminLoginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username không được để trống'),
  
  body('password')
    .notEmpty()
    .withMessage('Mật khẩu không được để trống'),
  
  validate
];

/**
 * House validation rules
 */
const houseValidation = [
  body('name')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Tên nhà phải từ 5-200 ký tự'),
  
  body('type')
    .isIn(['Apartment', 'House', 'Villa'])
    .withMessage('Loại nhà không hợp lệ'),
  
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Quốc gia không được để trống'),
  
  body('address')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Địa chỉ phải có ít nhất 10 ký tự'),
  
  body('bedrooms')
    .isInt({ min: 1, max: 20 })
    .withMessage('Số phòng ngủ phải từ 1-20'),
  
  body('bathrooms')
    .isInt({ min: 1, max: 20 })
    .withMessage('Số phòng tắm phải từ 1-20'),
  
  body('surface')
    .isInt({ min: 10 })
    .withMessage('Diện tích phải lớn hơn 10m²'),
  
  body('price')
    .isInt({ min: 0 })
    .withMessage('Giá phải là số dương'),
  
  validate
];

/**
 * Booking validation rules
 */
const bookingValidation = [
  body('houseId')
    .notEmpty()
    .withMessage('House ID không được để trống')
    .isMongoId()
    .withMessage('House ID không hợp lệ'),
  
  body('userId')
    .notEmpty()
    .withMessage('User ID không được để trống')
    .isMongoId()
    .withMessage('User ID không hợp lệ'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Ngày bắt đầu không hợp lệ')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Ngày bắt đầu phải sau ngày hiện tại');
      }
      return true;
    }),
  
  body('endDate')
    .isISO8601()
    .withMessage('Ngày kết thúc không hợp lệ')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('Ngày kết thúc phải sau ngày bắt đầu');
      }
      return true;
    }),
  
  validate
];

/**
 * User update validation rules
 */
const userUpdateValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username phải từ 3-30 ký tự'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email không hợp lệ'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Địa chỉ không được quá 200 ký tự'),
  
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Ngày sinh không hợp lệ'),
  
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  adminLoginValidation,
  houseValidation,
  bookingValidation,
  userUpdateValidation
};
