const mongoose = require('mongoose');
const moment = require('moment')
/*
Mongoose is an object data modelling (ODM) library/ layer
that provides a modelling environment for your collections 
It enforces structure as needed while still keeping
the flexibility and scalability  of MongoDB

Javascript framework
Provides Straight forward, schema based solution 
to model your application data

Includes built-in typecasting, validation, query building
business logic hooks and more out of the box

It uses MongoDB driver to interact with MongoDB storage


*/

var patientSchema = mongoose.Schema(({
    _id: mongoose.Schema.Types.ObjectId,
    fullname: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor'
    },
    age: {
        type: Number,
        validate: {
            validator: function (ageValue) {
                return ageValue >= 0 && ageValue <= 120 && Number.isInteger
            },
            message: 'Age should between 0 to 120.'
        }
    },
    dov: {
        type: Date,
        default: Date.now
    },
    caseDes: {
        type: String,
        // validate: {
        //     validator: function (characters) {
        //         return characters >= 10
        //     },
        //     message: 'case description should at least 10 characters'
        // }
        required: true
    }

}));




//model 
module.exports = mongoose.model('patient', patientSchema) // name of the collection in the database