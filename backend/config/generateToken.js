// import jwt from 'jsonwebtoken';
// import { ENV_VARS } from './envVar.js';
const jwt = require('jsonwebtoken');
const { ENV_VARS } = require('./envVar.js');

const genTokenAndSendCookie = (userId, res) => {
    const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: '12d' } );
    // please  dont  use id: userId, use userId, it is the standard
    // it caused a lot of problem and debugging
    // id: userId means id is a key and userId is the value
    // but userId is a key and value both
    // so when you try to access it, you will get undefined
    // and you will spend hours debugging it
        
    return token;
};

module.exports = { genTokenAndSendCookie };