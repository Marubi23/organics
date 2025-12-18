const Joi = require('joi');

// Validation schemas
const schemas = {
  // Auth
  login: Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^254[0-9]{9}$/)
      .required()
      .messages({
        'string.pattern.base': 'Phone number must be in format 254712345678',
        'any.required': 'Phone number is required'
      }),
    password: Joi.string().min(6).required()
  }),

  signup: Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^254[0-9]{9}$/)
      .required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().min(2).required(),
    email: Joi.string().email().optional(),
    userType: Joi.string().valid('farmer', 'buyer', 'distributor', 'agronomist', 'admin').required(),
    county: Joi.string().required(),
    subCounty: Joi.string().required(),
    ward: Joi.string().required(),
    village: Joi.string().optional(),
    nearestTown: Joi.string().required(),
    landmark: Joi.string().optional(),
    farmSize: Joi.number().optional(),
    mainCrops: Joi.array().items(Joi.string()).optional(),
    livestock: Joi.array().items(Joi.string()).optional(),
    farmingExperience: Joi.string().optional()
  }),

  // Products
  createProduct: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    categoryId: Joi.string().required(),
    stock: Joi.number().min(0).required(),
    units: Joi.string().required(),
    weight: Joi.string().optional(),
    features: Joi.array().items(Joi.string()).optional()
  }),

  // Cart
  addToCart: Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(1).required()
  }),

  // Orders
  createOrder: Joi.object({
    deliveryAddress: Joi.object({
      county: Joi.string().required(),
      subCounty: Joi.string().required(),
      ward: Joi.string().required(),
      village: Joi.string().optional(),
      nearestTown: Joi.string().required(),
      landmark: Joi.string().optional(),
      phone: Joi.string().pattern(/^254[0-9]{9}$/).required(),
      deliveryNotes: Joi.string().optional()
    }).required(),
    deliveryMethod: Joi.string().valid('standard', 'express', 'pickup').required(),
    paymentMethod: Joi.string().valid('mpesa', 'cash', 'card').required(),
    notes: Joi.string().optional()
  }),

  // M-Pesa Payment
  mpesaPayment: Joi.object({
    phoneNumber: Joi.string()
      .pattern(/^254[0-9]{9}$/)
      .required(),
    mpesaCode: Joi.string().required()
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors
      });
    }

    // Replace req.body with validated value
    req.body = value;
    next();
  };
};

module.exports = {
  schemas,
  validate
};