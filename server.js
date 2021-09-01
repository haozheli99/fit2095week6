// Import Packages
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const randStr = require('randomstring');
const doctor = require('./models/doctorSchema');
const patient = require('./models/patientSchema');
// Configure express and MongoDB server 
const app = express();
const url = 'mongodb://localhost:27017/Libweek6';
const print = console.log;
const url1 = require('url')


// set port number 8082
app.set('port', 8082);
app.listen(app.get('port'));

// use middleware to using local files
app.use(express.static('images'));


// bodyparser configure set, extended false then only url querystring will decoded
app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(morgan('common'));


// apply ejs module for html rendering <%= %>
app.engine("html", require("ejs").renderFile);
app.set('view engine', 'html');



// local database/ array 
let db;


// Routes 
app.get('/', (req, res) => {

    res.render('home');
});

app.get('/addpatient', (req, res) => {
    res.render('addpatient');
});

app.get('/adddoctor', (req, res) => {
    res.render('adddoctor');
});

app.get('/getdoctor', (req, res) => {
    let query = url1.parse(req.url, true).query;


    if (query.numPatients > 0) {
        doctor.find({ numPatients: query.numPatients }, function (err, docs) {

            print(query);
            res.render('getdoctor', {
                data: docs
            })
        })

    } else {
        doctor.find({}, function (err, docs) {
            print(docs);
            res.render('doctorlist', {
                data: docs
            })
        })
    }
    print(query.num);
});

app.get('/updatedoctor', (req, res) => {
    res.render('updatedoctor');
})

app.get('/getpatients', (req, res) => {
    patient.find({}).populate('doctor').exec(function (err, data) {
        res.render('list', {
            data: data

        })
    })


});

app.get('/updatepatient', (req, res) => {
    res.render('update');
});

app.get('/deletepatient', (req, res) => {
    res.render('delete');
});

app.get('/404', (req, res) => {
    res.send('iput error, try again!!!');
});





//Post to receive data from client 
mongoose.connect(url, {
    useNewUrlParser: true,
    /**
     * Determines whether or not to use the new url parser. Enables the new, spec-compliant
     * url parser shipped in the core driver. This url parser fixes a number of problems with
     * the original parser, and aims to outright replace that parser in the near future.
     */
    useUnifiedTopology: true
    // * Enables the new unified topology layer

}, (err, client) => {
    if (err) {
        throw err;
    } else {
        console.log('connect successfully');
    }
});

app.post('/adddoctor', (req, res) => {
    let detail = req.body;
    // let query = url1.parse(req.url, true).query;
    let doctorInfo = new doctor({
        _id: new mongoose.Types.ObjectId(),
        'name.firstName': detail.firstname,
        'name.lastName': detail.lastname,
        DOB: detail.dob,
        'Address.state': detail.state,
        'Address.suburb': detail.suburb,
        'Address.street': detail.street,
        'Address.unit': detail.unit,
        numPatients: detail.nop
    });

    doctorInfo.save(function (err) {
        if (err) {
            res.redirect('/404');
        } else {
            print('Doctor Successfully added to DB');
            res.redirect('/getdoctor');
        }
    })
});

app.post('/getpatients', (req, res) => {
    let detail = req.body;
    let patientInfo = new patient({
        _id: new mongoose.Types.ObjectId(),
        fullname: detail.fullname,
        doctor: detail.doctor,
        age: detail.age,
        dov: detail.dov,
        caseDes: detail.caseDes
    });

    patientInfo.save(function (err) {
        if (err) {
            res.redirect('/404');
            console.log(err.message);
        } else {
            print('patient Successfully added to DB');
            res.redirect('/getpatients');
        }
    })
});


app.post('/updatedoctor', (req, res) => {
    let detail = req.body;
    doctor.findByIdAndUpdate({
        _id: detail.doctor
    }, {
        numPatients: detail.nop
    }, function (err, data) {
        if (err)
            throw err;
        else res.redirect('/getdoctor');
    })
})



app.post('/patientdelete', (req, res) => {
    let detail = req.body;
    patient.deleteOne({
        fullname: detail.fullname
    }, function (err, doc) {
        console.log(doc);
        res.redirect('/getpatients');
    });

});


//function for Random ISBN number 

// function generateISBN() {
//     return (randStr.generate({
//         length: 13,
//         charset: 'numeric'
//     }))
// };


print('https://localhost:8082');