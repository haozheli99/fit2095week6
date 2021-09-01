const mongoose = require('mongoose');
const moment = require('moment');
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

var doctorSchema = mongoose.Schema(({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true //value required
        },
        lastName: {
            type: String
        },
    },
    DOB: {
        type: Date,
        get: function (newDate) {
            return moment(newDate).format('DD-MM-YYYY');
        },
        validate: {
            validator: function (age) {
                return getAge(age) > 0 && getAge(age) < 110

            },
            message: 'Age should between 0 and 110!'
        }
        // min: 0,
        // max: 110
    },
    Address: {
        state: {
            type: String,
            validate: {
                validator:
                    function (state) {
                        return state.length >= 2 && state.length <= 3
                    },
                message: 'state length max 3 min 2'
            }

        },
        suburb: String,
        street: String,
        unit: String
    },
    numPatients: {
        type: Number,
        validate: {
            validator: function (count) {
                return count >= 0 && count <= 1000 && Number.isInteger
            },
            message: 'patients number should a interge between 0 to 1000.'
        }

    }


}));
function getAge(birthday) {
    let birthDayTime = new Date(birthday).getTime();
    let nowTime = new Date().getTime();
    return Math.ceil((nowTime - birthDayTime) / 31536000000);
}



//model 
module.exports = mongoose.model('doctor', doctorSchema) // name of the collection in the database