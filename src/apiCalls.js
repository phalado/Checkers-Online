// import express from 'express';
const express = require('express');

let id = 'a';

function makeId(length) {
  // let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i += 1) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  // return result;
}

const api = express();
api.use((req, res, next) => {
  console.log(id);
  next();
});

api.listen(3000, () => {
  console.log('API runnign');
});

api.get('/home', (req, res) => {
  // console.log(req);
  makeId(5);
  res.send(id);
});

api.get(`/${id}`, (req, res) => {
  console.log(req);
  res.send('Hello World');
});
