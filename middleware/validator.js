const { body, validationResult } = require('express-validator');
const fs = require('fs');

module.exports ={
  checkRegister : async(req, res, next) => {
    try {
      await body('username').notEmpty().run(req);
      await body('email').notEmpty().isEmail().run(req);
      await body('phonenumber').notEmpty().isLength({max:14, min:12}).withMessage('Length must between 12 - 14').run(req);
      await body('password').notEmpty().isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers : 1,
        minSymbols : 1
      }).run(req);
      const validation = validationResult(req);
      
      if (validation.isEmpty()) {
        next();
      }else{
          res.status(400).send({
          status : false,
          message : 'Validation Invalid',
          error : validation.array()
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  cCPass: async (req, res, next) => {
    try {
      await body('currentPassword').trim().notEmpty().run(req);
      await body('newPassword').trim().notEmpty().run(req);
      await body('confirmPassword').trim().notEmpty().equals(req.body.newPassword).withMessage("password not match").run(req);
      const validation = validationResult(req);
      
      if (validation.isEmpty()) {
        next();
      }else{
          res.status(400).send({
          status : false,
          message : 'Validation Invalid',
          error : validation.array()
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  vnamev : async (req, res, next) =>{
    await body('username').trim().notEmpty().run(req);
    await body('newUsername').trim().notEmpty().run(req);
    const validation = validationResult(req);
      
    if (validation.isEmpty()) {
      next();
    }else{
        res.status(400).send({
        status : false,
        message : 'Validation Invalid',
        error : validation.array()
      });
    }
  },
  vPhonev : async (req, res, next) =>{
    await body('phone').trim().notEmpty().isNumeric().isLength({min:11, max:14}).run(req);
    await body('newPhone').trim().notEmpty().isLength({min:11, max:14}).withMessage('Nomor Telpon min : 12, max : 14').run(req);
    const validation = validationResult(req);
      
    if (validation.isEmpty()) {
      next();
    }else{
        res.status(400).send({
        status : false,
        message : 'Validation Invalid',
        error : validation.array()
      });
    }
  },
  vEmailv: async (req, res, next) =>{
    await body('email').trim().notEmpty().isEmail().withMessage('Format Email Salah').run(req);
    await body('newEmail').trim().notEmpty().isEmail().withMessage('Format Email Salah').run(req);
    const validation = validationResult(req);
      
    if (validation.isEmpty()) {
      next();
    }else{
        res.status(400).send({
        status : false,
        message : 'Validation Invalid',
        error : validation.array()
      });
    }
  },
  vResPassv : async (req, res, next) =>{
    await body('newPassword').trim().notEmpty().isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers : 1,
      minSymbols : 1}).run(req);
    await body('confirmPassword').trim().notEmpty().equals(req.body.newPassword).withMessage("password not match").run(req);

    const validation = validationResult(req);
    if (validation.isEmpty()) {
      next();
    }else{
        res.status(400).send({
        status : false,
        message : 'Validation Invalid',
        error : validation.array()
      });
    }
  },
}