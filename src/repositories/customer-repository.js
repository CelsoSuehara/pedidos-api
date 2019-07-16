'use strict';

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');

exports.create = async(data) =>  {
    var customer = new Customer(data);
    await customer.save();
}

exports.get = async() => {
    const res = await Customer
        .find({}, 'name email password roles'); 
    
    return res; 
}

exports.authenticate = async (data) => {
    const res = await Customer.findOne({ email: data.email, password: data.password });      
    return res; 
}

exports.getById = async(id) => {
    const res = await Customer.findById(id);
    return res;
}

exports.update = async(id, data) => {
    await Customer
        .findByIdAndUpdate(id, {
            $set: {
                name: data.name,
                email: data.email,
                password: data.password,
                roles: data.roles
            }
        });
}

exports.delete = async(id) => {
    await Customer
        .findByIdAndDelete(id);
}