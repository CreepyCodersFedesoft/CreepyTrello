const User = require('../models/user');

const createUser = async ( req, res) => {}; 
const createAdmin = async ( req, res) => {}; 
const login = async ( req, res) => {}; 
const listUser = async ( req, res) => {};
const listUserAll = async ( req, res) => {}; 
const getRole = async ( req, res) => {}; 
const updateUser = async ( req, res) => {}; 
const deleteUser = async ( req, res) => {}; //se actualiza el estado a false

module.exports = { createAdmin, createUser, login, listUser, updateUser, deleteUser, listUserAll, getRole };