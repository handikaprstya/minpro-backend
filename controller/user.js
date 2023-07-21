const db = require('../models');
const user = db.akun;
const jwt = require('jsonwebtoken');
const enkrip = require('bcrypt');
const { Op } = require('sequelize');
const { response } = require('express');
const transporter = require('../middleware/transporter');


const userController = {
  register : async (req, res) => {
    try {
      const { username, email, phonenumber,  password } = req.body;
      const d = await user.findOne({
        where : {
          [Op.or] : [
            {username},
            {email},
            {phonenumber}
          ]
        }
      });
      if (d == null) {
        const salt = await enkrip.genSalt(10);
        const hashPassword = await enkrip.hash(password, salt);
        const result = await user.create({ username, email,phonenumber, password : hashPassword });
        const token = jwt.sign({ username, email, phonenumber, password }, 'handika123', {expiresIn :'1h'});
      
        await transporter.sendMail({
          from: 'handikaprasetya.wisnu@gmail.com',
          to: email,
          subject :'test',
          html : '<h1>Sukses</h1>'
        });

        res.status(200).send({
          status : true,
          message : 'success',
          data : result,
          token
        });
      }else{
        if (d.username == username) {throw({message:`Username must be unique`})}
        if (d.email == email) {throw({message:`Email must be unique`})}
        if (d.phonenumer == phonenumer) {throw({message:`Phone must be unique`})}
        res.send('failed')
      }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  },
  verification : async (req, res) => {
    try {
      const {newEmail} = req.user;
      if (newEmail == undefined) {
        const result = await user.update(
          {isVerified : true},
          {where :{
            username : req.user.username
          }});
        
      }else{
        const result = await user.update(
          {isVerified : true,
           email : newEmail 
          },
          {where :{
            username : req.user.username
          }});
      }
      res.status(200).send({
        status : 'Success',
        message : 'Sukses'
      });
    } catch (error) {
        res.status(400).send(error);
    } 
  },
  login : async (req, res)=> {
    try {
      const {username, email, phonenumber, password } = req.body;
      if (!username && !email && !phonenumber) {throw({message:' Error'})}
      if (!password)  {throw({message:'Error'})}
      const data = await user.findOne({
        where : {
          [Op.or] : [
            {username},
            {email},
            {phonenumber}
          ]
        }
      });
      if (data == null) {throw({message : 'tidak ada akun'})}
      if (!data.isVerified) {throw({message : 'cerification'})}
      const isValid = await enkrip.compare(password, data.password);
      if (!isValid) {throw({message:"wrong pass!"})}
      const payLoad = {
        id: data.id,
        username:data.username,
        phonenumber:data.phonenumber,
        email:data.email,
        imgURL: data.imgURL
      }
      const token = jwt.sign(payLoad, 'handika123');
      res.status(200).send({
        message : 'Success',
        data,
        token : token
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  editPass : async (req, res) =>{
    try {
      const {currentPassword, newPassword, confirmPassword} = req.body;
      const getData = await user.findOne({where : {id : req.user.id}})
      const checkPass = await enkrip.compare(currentPassword ,getData.password);
      if (checkPass == false) {
        throw({message : "Wrong Password"})
      }
      if (newPassword !== confirmPassword) {
        throw({message : "Password doesnt match!!"})
      }
      const salt = await enkrip.genSalt(10);
      const hashPassword = await enkrip.hash(newPassword, salt);
      const setData = await user.update(
        {password : hashPassword},
        {where :{
          id : req.user.id
        }});
      res.status(200).send({
        message : 'Password berhasil dirubah, silahkan login kembali'
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  editUsername : async (req, res)=>{
    try {
      const {username, newUsername} = req.body;
      if (username !== req.user.username) {
        {throw({message:`Username wrong`})}
      }
      const isUserExist = await user.findOne({
        where : {
          id : req.user.id
        }
      });

      const updt = await user.update(
        {username : newUsername},
        {where : {id : req.user.id}}
        );
      res.status(200).send({
        message : 'sukses',
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  editPhone : async (req, res)=>{
    try {
      const {phone, newPhone} = req.body;
      console.log(phone,req.user);
      if (phone !== req.user.phonenumber) {
        {throw({message:`wrong phone`})}
      }
      const isUserExist = await user.findOne({
        where : {
          id : req.user.id
        }
      });
      const updt = await user.update(
        {phone : newPhone},
        {where : {id : req.user.id}}
        );
      res.status(200).send({
        message : 'nomor telfon berhasil diubah'
      });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  },
  editEmail : async (req, res)=>{
    try {
      const {email, newEmail} = req.body;
      console.log(req.user.email);
      // if (email!== req.user.email) {
      //   {throw({message:`wrong email`})}
      // }
      const isEmailExist = await user.findOne({
        where : {
          email : newEmail
        }
      });
      const {username, phone} = req.user;
      if (isEmailExist == null) {

        const result = await user.update(
          {isVerified : false},
          {where : {id : req.user.id}}
          );

        const token = jwt.sign({username, email, newEmail, phone }, 'handika123', {expiresIn :'1h'});
        await transporter.sendMail({
          from : "handikaprasetya.wisnu@gmail.com",
          to : email,
          subject : 'test',
          html :'<h1> Success </h1>'
        })

        res.status(200).send({
          message : 'check your mail',
          token
        });
      }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
  },
  forgotPassword : async (req,res)=>{
    try {
      const {email} = req.body;
      const isEmailExist = await user.findOne({
        where : {
          email : email
        }
      });
      if (isEmailExist !== null) {
        const {id, username, email} = isEmailExist;
        const token = jwt.sign({id, username, email}, 'handika123');
        await transporter.sendMail({
          from : 'handikaprasetya.wisnu@gmail.com',
          to : email,
          subject : 'test',
          html :'<h1> Success </h1>'
        })
        res.status(200).send({
          message : 'check your mail',
          token
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
  resetPassword : async(req, res) =>{
    try {
      const salt = await enkrip.genSalt(10);
      const hashPassword = await enkrip.hash(req.body.newPassword, salt);
      const setData = await user.update(
        {password : hashPassword},
        {where :{
          id : req.user.id
        }});
      res.status(200).send({
        message : 'sukses silahkan login kembali'
      });
    } catch (error) {
      console.log(error);
      res.status(200).send(error);
    }
  },
  upProfile : async (req, res)=>{
    try {
      if (req.file == undefined) {
        throw({message : 'file kosong'});
      }
      // console.log(req.user.id);
      const setData = await user.update(
        {imageUrl : req.file.filename},
        {where :{
          id : req.user.id
      }});
      // console.log(setData);
      res.status(200).send({
        message : 'sukses'
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

module.exports = userController;