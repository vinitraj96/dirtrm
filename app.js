/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START app]
const express = require('express');

const app = express();



var bodyParser     =         require("body-parser");
var connect = require('connect');
var mongoose       =         require('mongoose');
var fs = require('fs');


const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: "bac0dc05",
  apiSecret: "849ea4a9f5790a21"
});


var mongodb = require('mongodb');
var ObjectID = require("bson-objectid");
var nodemailer = require("nodemailer");
//mongoose.connect('mongodb://vinitraj:vin@ds127854.mlab.com:27854/pipiride');
mongoose.connect('mongodb://localhost/OfferApp');
// Configuration
app.use(express.static(__dirname + '/uploads'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(connect.cookieParser());
app.use(connect.logger('dev'));
app.use(connect.bodyParser());

app.use(connect.json());  
app.use(connect.urlencoded());

// Routes

//require('./routes/routes.js')(app);

app.use(bodyParser.urlencoded({ extended: false }));

var stripe = require('stripe')('sk_test_1X9mLrQML4Vcq9KlqsDi6Iix'); //paste your test secret here
var cors = require('cors');
app.use(cors());

var ShopUser = new mongoose.Schema({
  business_name: {type: String,default:'no-value'},
  business_type: {type: String,default:'no-value'},
  building_name: {type: String,default:'no-value'},
  sub_area: {type: String,default:'no-value'},
  area: {type: String,default:'no-value'},
  city: {type: String,default:'no-value'},
  state: {type: String,default:'no-value'},
  country: {type: String,default:'no-value'},
  pincode: {type: String,default:'no-value'},
  mobileno: {type: String,default:'no-value'},
  password: {type: String,default:'no-value'},
  email: {type: String,default:'no-value'},
  paymentOptions: { type: Array, default: [] },
  latitude: {type: String,default:'no-value'},
  longitude: {type: String,default:'no-value'}
});

var Offer = new mongoose.Schema({
  business_name: {type: String,default:'no-value'},
  business_type: {type: String,default:'no-value'},
  mobile_no: {type: String,default:'no-value'},
  product_name: {type: String,default:'no-value'},
  offer_name: {type: String,default:'no-value'},
  startdate: {type: String,default:'no-value'},
  enddate: {type: String,default:'no-value'},
  period: {type: String,default:'no-value'},
  amount_paid:{type: String,default:'no-value'},
  latitude: {type: String,default:'no-value'},
  longitude: {type: String,default:'no-value'},
  building_name: {type: String,default:'no-value'},
  sub_area: {type: String,default:'no-value'},
  area: {type: String,default:'no-value'},
  city: {type: String,default:'no-value'},
  state: {type: String,default:'no-value'},
  country: {type: String,default:'no-value'},
  pincode: {type: String,default:'no-value'},
  paymentOptions: { type: Array, default: [] },
  ratingsArray: { type: Array, default: [] },
});

var AddBike = new mongoose.Schema({
  bikeName      : String,
  bikeImageName : String,
  fuelType      : String,
  seat          : String,
  priceSixHour  : String,
  kmLimitSixHour: String,
  areaName      : String,
  location      : String,
  bikeRegNo: String,
  bikeRegYear: String,
  bikeColor: String,
  vechilePriceBooked:String,
  vechleStartDate:String,
  vechileStartTime:String,
  vechileEndDate:String,
  vechileEndTime:String,
  vechileRegNo:String,
  vechileBookedByPhoneNo:String
});

var Venue = new mongoose.Schema({
  areaName: String,
  location: String
});

var Coupon = new mongoose.Schema({
  couponCode: String
});

var Promocode = new mongoose.Schema({
  promocode: String,
  reffered_by: String,
  reffered_to: String
});

var Feedback = new mongoose.Schema({
  feedback: String,
  mobile_no: String
});

var CustomerUser = new mongoose.Schema({
  mobile_no: {type: String,default:'no-value'},
  otp: {type: String,default:'no-value'},
  username: {type: String,default:'no-value'},
  email:{type: String,default:'no-value'},
  password:{type: String,default:'no-value'},
  addressArray: { type: Array, default: [] },
  first_offer: {type: String,default:'not-used'},
  refferal_code: {type: String,default:'no-refferal'},
  credit_first_offer: {type: String,default:'0'},
});

var Lead = new mongoose.Schema({
  mobile_no: {type: String,default:'no-value'},
  username: {type: String,default:'no-value'},
  order_id: {type: String,default:'no-value'},
  order_date: {type: String,default:'no-value'},
  order_time: {type: String,default:'no-value'},
  buildingOrFlat: {type: String,default:'no-value'},
  subArea: {type: String,default:'no-value'},
  area: {type: String,default:'no-value'},
  pinCode: {type: String,default:'no-value'},
  street: {type: String,default:'no-value'},
  landmark: {type: String,default:'no-value'},
  pickup_done: {type: String,default:'no-value'},
  drop_done: {type: String,default:'no-value'},
  clothsArray: { type: Array, default: [] },
  discount: {type: String,default:'no-discount'},
  credit_used:{type: String,default:'false'}
});

var OrderId = new mongoose.Schema({
  order_id: {type: String,default:'0'},
});

var Product = new mongoose.Schema({
  productName: {type: String,default:'no-value'},
  activeWheelPriceWashIron: {type: String,default:'no-value'},
  activeWheelPriceIron: {type: String,default:'no-value'},
  rinPriceWashIron: {type: String,default:'no-value'},
  rinPriceIron: {type: String,default:'no-value'},
  nirmaPriceWashIron: {type: String,default:'no-value'},
  nirmaPriceIron: {type: String,default:'no-value'},
  tidePriceWashIron: {type: String,default:'no-value'},
  tidePriceIron: {type: String,default:'no-value'},
  surfExcelPriceWashIron: {type: String,default:'no-value'},
  surfExcelPriceIron: {type: String,default:'no-value'},
  arielPriceWashIron: {type: String,default:'no-value'},
  arielPriceIron: {type: String,default:'no-value'},
  ezeePriceWashIron: {type: String,default:'no-value'},
  ezeePriceIron: {type: String,default:'no-value'},
  comfortPrice: {type: String,default:'no-value'},
  softTouchPrice: {type: String,default:'no-value'},
  safeWashPrice: {type: String,default:'no-value'},
  ironingPrice: {type: String,default:'no-value'},
  dryCleanPrice: {type: String,default:'no-value'}
});

var Address = new mongoose.Schema({
  area: {type: String,default:'no-value'},
  pincode: {type: String,default:'no-value'}
});

var PickupTime = new mongoose.Schema({
  start_time: {type: String,default:'no-value'},
  end_time: {type: String,default:'no-value'}
});

var Faq = new mongoose.Schema({
  question: {type: String,default:'no-value'},
  answer: {type: String,default:'no-value'}
});

var AboutUs = new mongoose.Schema({
  about_us: {type: String,default:'no-value'}
});

var ContactUs = new mongoose.Schema({
  contact_us: {type: String,default:'no-value'}
});

var ShopUser = mongoose.model('shop_user', ShopUser);

var Offer = mongoose.model('offer', Offer);

var AddBike = mongoose.model('add_bike', AddBike);

var Venue = mongoose.model('venue', Venue);

var Coupon = mongoose.model('coupon', Coupon);

var Promocode = mongoose.model('promocode', Promocode);

var Feedback = mongoose.model('feedback', Feedback);

var Lead = mongoose.model('lead', Lead);

var OrderId = mongoose.model('OrderId', OrderId);

var Product = mongoose.model('Product', Product);

var CustomerUser = mongoose.model('customer_user', CustomerUser);

var Address = mongoose.model('address', Address);

var PickupTime = mongoose.model('pickup_time', PickupTime);

var Faq = mongoose.model('faq', Faq);

var AboutUs = mongoose.model('aboutus', AboutUs);

var ContactUs = mongoose.model('contactus', ContactUs);

app.get('/',function(req,res){
console.log("__dirname");
  
  console.log(__dirname);
  res.sendFile(__dirname +'/index.html');
  //res.sendStatus(404);
});

var smtpTransport = nodemailer.createTransport("SMTP",{
service: "Gmail",
auth: {
user: "vinitraj96@gmail.com",
pass: "sugun.bintu.123&"
}
});

///////////////////////////////////////////////////// Registration and Login Routes Starts /////////////////////////////////////////////

app.post('/upload', function(req, res) {
  var phoneNo=req.body.phoneNo;
  console.log(req.files.image.originalFilename);
  console.log(req.files.image.path);
    fs.readFile(req.files.image.path, function (err, data){
    var dirname = "/home/ubuntu/newproject";
    var newPath = dirname + "/uploads/" +   req.files.image.originalFilename;
    fs.writeFile(newPath, data, function (err) {
    if(err){
    res.json({'response':"Error"});
    }else {
	  user.find({ mobileNo: phoneNo },
	  function(err,doc) {
	      if (err) throw err;

	      else{
	      if(doc.length===0){
		console.log('invalid user');
		res.json({"msg":"not sucess"});
	      }
	      if(doc.length===1){
		user.update({mobileNo:phoneNo},
			{
			  $set: {
			   drivingLicence:"saved"
			  }
			},function(err,doc){
			  if(err){
			    console.log('error');
			  }else{
			      res.json({'response':"Saved"});
			  }
		});
	      }
	    }

	  });     
}
});
});
});

app.post('/processpay',function(req,res){
  console.log("processpay");
  console.log(req.body.amount);
  console.log(req.body.product_name);
  console.log(req.body.offer_name);
  console.log(req.body.start_date);
  console.log(req.body.end_date);

  var mobile_no = req.body.mobile_email;
  var product_name =req.body.product_name;
  var offer_name = req.body.offer_name;
  var startdate = req.body.start_date;
  var enddate = req.body.end_date;
  var period = req.body.period;
  var amount_paid = req.body.amount;

  var business_name = req.body.business_name;
  var business_type = req.body.business_type;
  var building_name = req.body.building_name;
  var sub_area = req.body.sub_area;
  var area = req.body.area;
  var city = req.body.city;
  var state = req.body.state;
  var country = req.body.country;
  var pincode = req.body.pincode;
  var paymentOptionsOpted = req.body.paymentOptionsOpted;
  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  console.log(business_name);
  console.log(business_type);
  console.log(building_name);
  console.log(sub_area);
  console.log(area);
  console.log(city);
  console.log(state);
  console.log(country);
  console.log(pincode);
  console.log(paymentOptionsOpted);
  console.log(latitude);
  console.log(longitude);

 
  // var stripetoken = req.body.stripetoken;
  // var typeObject = stripetoken.type;
  // var cardObject= stripetoken.card;
  
  // cardObject.object = typeObject;
  // console.log("cardObject ");
  // console.log(cardObject);
  
  // var idObject = stripetoken.id;
  // var createdObject = stripetoken.created;
  
  // var stripetokenNew={};
  // stripetokenNew.card=cardObject;
  // stripetokenNew.id=idObject;
  // stripetokenNew.type=typeObject;
  // stripetokenNew.created=createdObject;
  // stripetokenNew.object=typeObject;

  //  console.log("stripetokenNew >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ");
  //  console.log(stripetokenNew);
  //   var amountpayable = req.body.amount;
    // var charge = stripe.charge.create({
    //     amount: amountpayable,
    //     currency: 'usd',
    //     description: 'Sample transaction',
    //     source: stripetoken
    // }, function (err, charge) {
    //     if (err)
    //         console.log(err);
    //     else
    //         res.send({ success: true });
    // });
    // var stripetoken = req.body.stripetoken;
    // var amountpayable = req.body.amount;
    //  var charge = stripe.charge.create({
    //     amount: amountpayable,
    //     currency: 'usd',
    //     description: 'Sample transaction',
    //     source: stripetoken
    // }, function (err, charge) {
    //     if (err)
    //         console.log(err);
    //     else
    //         res.send({ success: true });
    // })
    
    // stripe.customers.create({
    //   email: 'vinitraj96@gmail.com',
    //   card: req.body.stripetoken
    // })
    // .then(customer =>
    //   stripe.charges.create({
    //     amountpayable,
    //     description: "Sample Charge",
    //     currency: "usd",
    //     customer: 'vinitraj96'
    //   }))
    // .catch(err => res.send({ success: false }))
    // .then(charge => res.json({ success: true }));

    // stripe.customers.create({
    //     email: "vinitraj96@gmail.com", // customer email, which user need to enter while making payment
    //     source: stripetokenNew // token for the given card 
    // })
    // .then(customer =>
    //     stripe.charges.create({ // charge the customer
    //     amountpayable,
    //     description: "Sample Charge",
    //         currency: "usd",
    //         customer: "1"
    //     }))
    // .then(charge => res.json({success:true}));


    Offer.find({$and:[{product_name:product_name}]},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        console.log('Adding new user');
        new Offer({
            mobile_no: mobile_no,
            product_name: product_name,
            offer_name: req.body.offer_name_info,
            startdate: startdate,
            enddate: enddate,
            period: period,
            amount_paid: amount_paid,
            business_name: business_name,
            business_type: business_type,
            building_name: building_name,
            sub_area: sub_area,
            area: area,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
            paymentOptionsOpted: paymentOptionsOpted,
            latitude: latitude,
            longitude: longitude

        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
            res.json({"success":true});
          }
        });
      }else{
        res.json({"success":false});
      }
    }
  });
});

app.post('/fetchOffer',function(req,res){
  console.log("fetchOffer >>>>>>>>>>>>>>>> ");
  var mobile_email = req.body.mobile_email;
  console.log(mobile_email);
  Offer.find({"mobile_no":mobile_email},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length==0){
        res.json({"success":false});
      }else{
        console.log("fetch offer doc");
        console.log(doc);
        res.json({"success":true,"doc":doc});
      }
    }
  });
});

app.post('/fetchAllOffer',function(req,res){
  console.log("fetchOffer >>>>>>>>>>>>>>>> ");
  Offer.find({},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length==0){
        res.json({"success":false});
      }else{
        console.log("fetch offer doc");
        console.log(doc);
        res.json({"success":true,"doc":doc});
      }
    }
  });
});

app.post('/login',function(req,res){
  console.log('login')
  console.log(req.body.mobile_email);
  console.log(req.body.password);
  var mobile_email = req.body.mobile_email;
  var password = req.body.password;
  ShopUser.find({$and:[{mobileno:mobile_email},{password:password}]},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length>0){
        console.log("mobile true");
        console.log(doc);
        res.json({"success":true,"doc":doc});
      }else{
        ShopUser.find({$and:[{email:mobile_email},{password:password}]},function(err,doc1){
          if(err){
            console.log('error');
          }else{
            if(doc1.length>0){
              console.log("email true");
              res.json({"success":true,"doc":doc1});
            }else{
              console.log("both false");
              res.json({"success":false});
            }
          }
        });
      }
    }
  });
});

app.post('/register',function(req,res){
  console.log("register");
  var business_name = req.body.business_name;
  var business_type = req.body.business_type;
  var building_name = req.body.building_name;
  var sub_area = req.body.sub_area;
  var area = req.body.area;
  var city = req.body.city;
  var state = req.body.state;
  var country = req.body.country;
  var pincode = req.body.pincode;
  var mobileno = req.body.mobileno;
  var password = req.body.password;
  var email = req.body.email;
  var paymentOptionsOpted = req.body.paymentOptionsOpted;
  var latitude = req.body.lat_long.latitude;
  var longitude = req.body.lat_long.longitude;
 /*nexmo.message.sendSms(
  '919035713685', '917618731317', otp.toString(),
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
 );*/
  ShopUser.find({$and:[{mobileno:mobileno,email:email}]},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        console.log('Adding new user');
        new ShopUser({
          business_name : business_name,
          business_type : business_type,
          building_name : building_name,
          sub_area : sub_area,
          area : area,
          city : city,
          state : state,
          country : country,
          pincode : pincode,
          mobileno : mobileno,
          password : password,
          email : email,
          paymentOptions : paymentOptionsOpted,
          latitude : latitude,
          longitude : longitude
        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
            res.json({"success":true});
          }
        });
      }else{
        res.json({"success":false});
      }
    }
  });

});

app.post('/loginUsingPassword',function(req,res){
  console.log("loginUsingPassword");
  var mobile_no=req.body.mobile_no;
  var password=req.body.password;
/*  nexmo.message.sendSms(
  '919035713685', '917618731317', otp.toString(),
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
 );*/
  CustomerUser.find({'mobile_no': mobile_no },function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        CustomerUser.find({'email': mobile_no },function(err,doc){
          if(err){
            console.log('error');
          }else{
            if(doc.length===0){
              res.json({"doc":"user not found"});
            }else{
              CustomerUser.find({ $and: [ {'email': mobile_no }, { 'password': password } ] },function(err,doc){
                if(err){
                  console.log('error');
                }else{
                  if(doc.length===0){
                    res.json({"doc":"invalid"});
                  }else{
                     res.json({"doc":"valid","data":doc[0]});
                  }
                }
              });
            }
          }
        });
      }else{      
        CustomerUser.find({ $and: [ {'mobile_no': mobile_no }, { 'password': password } ] },function(err,doc){
          if(err){
            console.log('error');
          }else{
            if(doc.length===0){
                res.json({"doc":"invalid"});        
            }else{
               res.json({"doc":"valid","data":doc[0]});
            }
          }
        });
      }
    }
  });
});

app.post('/ChangePasswordAfterLogin',function(req,res){
   console.log("ChangePasswordAfterLogin");
   var mobile_no=req.body.mobile_no;
   var oldPassword=req.body.oldPassword;
   var newPassword=req.body.newPassword;
   CustomerUser.find({ $and: [ {'mobile_no': mobile_no }, { 'password': oldPassword } ] },function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        res.json({"doc":"invalid"}); 
      }else{
        CustomerUser.update({mobile_no:mobile_no},{
          $set: {
            password : newPassword
          }
        },function(err,doc){
          if(err){
            console.log('error');
          }else{
             res.json({"doc":"valid"});
          }
        });  
      }
    }
  });
});

app.post('/ChangePassword',function(req,res){
  console.log("ChangePassword");
  var mobile_no=req.body.mobile_no;
  var password=req.body.newPassword;
   CustomerUser.find({mobile_no:mobile_no},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        CustomerUser.update({email:mobile_no},{
          $set: {
            password : password
          }
        },function(err,doc){
          if(err){
            console.log('error');
          }else{
             res.json({"doc":"valid"});
          }
        });  
      }else{
        CustomerUser.update({mobile_no:mobile_no},{
          $set: {
            password : password
          }
        },function(err,doc){
          if(err){
            console.log('error');
          }else{
             res.json({"doc":"valid"});
          }
        });  
      }
    }
  });
});

app.post('/findCustomerForgotPassword',function(req,res){
  console.log("findCustomerForgotPassword");
  var mobileNo=req.body.mobileNo;
  console.log(mobileNo);
  
/*  nexmo.message.sendSms(
  '919035713685', '917618731317', otp.toString(),
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
 );*/
  CustomerUser.find({mobile_no:mobileNo},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
        CustomerUser.find({email:mobileNo},function(err,doc){
          if(err){
            console.log('error');
          }else{
            if(doc.length===0){
                res.json({"doc":"invalid","password":"not-set"});
            }else{
               res.json({"doc":"password","password":"set","data":doc[0]});
            }
          }
        });
      }else{
         res.json({"doc":"password","password":"set","data":doc[0]});
      }
    }
  });
});

app.post('/findCustomer',function(req,res){
  console.log("findCustomer");
  var mobileNo=req.body.mobileNo;
/*  nexmo.message.sendSms(
  '919035713685', '917618731317', otp.toString(),
    (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        console.dir(responseData);
      }
    }
 );*/
  CustomerUser.find({mobile_no:mobileNo},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
          res.json({"doc":"valid","password":"not-set"});
      }else{
         res.json({"doc":"valid","password":"set","data":doc[0]});
      }
    }
  });
});

app.post('/updateProfileWithinApp',function(req,res){
  console.log("updateProfileWithinApp");
  var mobile_no=req.body.mobile_no;
  var username=req.body.username;
  var email=req.body.email;
 
  console.log(mobile_no);
  console.log(username);
  console.log(email);
  CustomerUser.find({email:email},function(err,doc){
    if(err){
      console.log('error');
    }else{
      if(doc.length===0){
          res.json({"doc":"email already exist"});
      }else{
        CustomerUser.update({mobile_no:mobile_no},
        {
          $set: {
            username : username,
            email : email
          }
        },function(err,doc){
          if(err){
            console.log('error');
          }else{
             res.json({"doc":"valid"});
          }
        });
      }
    }
  });        
});

app.post('/updateProfile',function(req,res){
  var mobile_no=req.body.mobile_no;
  var username=req.body.username;
  var email=req.body.email;
  var password=req.body.password;
  var refferal_code=req.body.refferal_code;
  console.log("updateProfile >> ")
  console.log(mobile_no);
  console.log(username);
  console.log(email);
  console.log(password);
  console.log(refferal_code);
  if(refferal_code=="no-refferal"){
    CustomerUser.find({email:email},function(err,doc){
      if(err){
        console.log('error');
      }else{
        if(doc.length===0){
          new CustomerUser({
            mobile_no : mobile_no,
            username : username,
            email : email,
            password : password
          }).save(function(err, doc){
            if(err) console.log('error');
            else{
              res.json({"doc":"valid"});
            }
          });
        }else{
          res.json({"doc":"email already exist"});
        }
      }
    });
  }else if(refferal_code.length==0){
    CustomerUser.find({email:email},function(err,doc){
      if(err){
        console.log('error');
      }else{
        if(doc.length===0){
          new CustomerUser({
            mobile_no : mobile_no,
            username : username,
            email : email,
            password : password
          }).save(function(err, doc){
            if(err) console.log('error');
            else{
              res.json({"doc":"valid"});
            }
          });
        }else{
          res.json({"doc":"email already exist"});
        }
      }
    });
  }else{
    Promocode.find({ $and: [ {'promocode': refferal_code }, { 'reffered_to': mobile_no } ] },function(err,data){
      if(err){

      }else{
        if(data.length==0){
          Promocode.find({ $and: [ {'promocode': refferal_code }, { 'reffered_to': email } ] },function(err,data){
            if(err){

            }else{
              if(data.length==0){
                res.json({"doc":"invalid refferal_code"});
              }else{
                CustomerUser.find({email:email},function(err,doc){
                  if(err){
                    console.log('error');
                  }else{
                    if(doc.length===0){
                      new CustomerUser({
                        mobile_no : mobile_no,
                        username : username,
                        email : email,
                        password : password,
                        refferal_code : refferal_code
                      }).save(function(err, doc){
                        if(err) console.log('error');
                        else{
                          res.json({"doc":"valid"});
                        }
                      });
                    }else{
                      res.json({"doc":"email already exist"});
                    }
                  }
                });
              }
            }
          });
        }else{
          CustomerUser.find({email:email},function(err,doc){
            if(err){
              console.log('error');
            }else{
              if(doc.length===0){
                new CustomerUser({
                  mobile_no : mobile_no,
                  username : username,
                  email : email,
                  password : password,
                  refferal_code : refferal_code
                }).save(function(err, doc){
                  if(err) console.log('error');
                  else{
                    res.json({"doc":"valid"});
                  }
                });
              }else{
                res.json({"doc":"email already exist"});
              }
            }
          });
        }
      }
    });
  }        
});

function myFunc(arg,res) {
  CustomerUser.update({mobile_no:arg},
    {
      $set: {
       otp : ''
      }
    },function(err,doc){
      if(err){
        console.log('error');
      }else{
      }
    });
}

app.post('/ratingsAndReview',function(req,res){
  console.log("ratingsAndReview");
  var mobile_no=req.body.mobile_no;
  var review=req.body.review;
  var ratings=req.body.ratings;
  var id=req.body.id;
  console.log("id >>>>>>>>> ");
  console.log(id);
  console.log("mobile_no >>>>>>>>> ");
  console.log(mobile_no);
  console.log("review >>>>>>>>> ");
  console.log(review);
  console.log("ratings >>>>>>>>> ");
  console.log(ratings);
  
  CustomerUser.find({'mobile_no': mobile_no } ,function(err,data){
    if(err){

    }else{
        if(data[0].username==undefined||data[0].username==""){
          res.json({"doc":"invalid"});
        }else{
          Offer.update({ '_id': ObjectID(id)},{
            $push:{
                ratingsArray : {mobile_no: mobile_no, ratings: ratings, review: review,username:data[0].username}
              }
            }, { safe: true },
          function(err, result1) {
            if(err){
              console.log(err);
              res.json({success: false});
            }else{
              res.json({"doc":"valid"});
            }
          });
        }
    }
  });
         
});

app.post('/UpdateUsernameAndRatingsAndReview',function(req,res){
  console.log("ratingsAndReview");
  var mobile_no=req.body.mobile_no;
  var review=req.body.review;
  var ratings=req.body.ratings;
  var id=req.body.id;
  var username=req.body.username;
  console.log("id >>>>>>>>> ");
  console.log(id);
  console.log("mobile_no >>>>>>>>> ");
  console.log(mobile_no);
  console.log("review >>>>>>>>> ");
  console.log(review);
  console.log("ratings >>>>>>>>> ");
  console.log(ratings);
  
  CustomerUser.update({mobile_no:mobile_no},
  {
    $set: {
      username:username
    }
  },function(err,doc){
    if(err){
      console.log('error');
    }else{
      
      Offer.update({ '_id': ObjectID(id)},{
        $push:{
            ratingsArray : {mobile_no: mobile_no, ratings: ratings, review: review,username:username}
          }
        }, { safe: true },
      function(err, result1) {
        if(err){
          console.log(err);
          res.json({success: false});
        }else{
          res.json({"doc":"valid"});
        }
      });
    }
  });       
});

app.post('/CompletePayment',function(req,res){
  console.log("add coupon .....................................");
  var mobileNo=req.body.phoneNo;
	var vechileNameBooked=req.body.bikeName;
	var vechileAreaBooked=req.body.areaName;
	var vechilePriceBooked=req.body.bikePrice;
	var vechleStartDate=req.body.startdate;
	var vechileStartTime=req.body.starttime;
	var vechileEndDate=req.body.enddate;
	var vechileEndTime=req.body.endtime;
	var vechileLocationBooked=req.body.location;
	  user.find({'mobileNo': mobileNo } ,function(err,data){
	    if(err){

	    }else{
	      if(data.length==0){
	      }else{
		user.update({mobileNo:mobileNo},
		{
		  $set: {
		   vechileNameBooked : vechileNameBooked,
			  vechileAreaBooked : vechileAreaBooked,
			  vechileLocationBooked : vechileLocationBooked,
			  vechilePriceBooked : vechilePriceBooked,
			  vechleStartDate : vechleStartDate,
			  vechileStartTime : vechileStartTime,
			  vechileEndDate : vechileEndDate,
			  vechileEndTime : vechileEndTime
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
		    //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);

		    //res.json({"doc":"valid","otp":"otp: "+otp.toString()});
		  	AddBike.update( { 'bikeName': vechileNameBooked },
			{
			  $set: {
				  
			   	  vechilePriceBooked : vechilePriceBooked,
				  vechleStartDate : vechleStartDate,
				  vechileStartTime : vechileStartTime,
				  vechileEndDate : vechileEndDate,
				  vechileEndTime : vechileEndTime,
				  vechileBookedByPhoneNo:mobileNo
			  }
			},function(err,doc){
			  if(err){
			    console.log('error');
			  }else{
			    //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);

			    res.json({"doc":"booked"});
			  }
			});
		  }
		});
	      }
	    }
	  });
});

app.post('/AddCoupon',function(req,res){
  console.log("add coupon .....................................");
  var couponCode=req.body.couponCode;
  Coupon.find({'couponCode': couponCode } ,function(err,data){
    if(err){

    }else{
      if(data.length==0){
	new Coupon({
	  couponCode : couponCode
	}).save(function(err, doc){
	  if(err) console.log('error');
	  else{
	    res.json({"doc":"successfully added"});
	  }
	});
      }else{
	res.json({"doc":"already added"});
      }
    }
  });
});

app.post('/SearchCoupon',function(req,res){
  console.log("search coupon .....................................");
  var couponCode=req.body.couponCode;
  Coupon.find({'couponCode': couponCode } ,function(err,data){
    if(err){

    }else{
      if(data.length==0){
	
	res.json({"doc":"no such coupon"});
      }else{
	res.json({"doc":"successfully added"});
      }
    }
  });
});

app.post('/AddVenue',function(req,res){
  console.log("add venue .....................................");
  var areaName=req.body.areaName;
  var location=req.body.location;
  Venue.find({ $and: [ {'areaName': areaName }, { 'location': location } ] },function(err,data){
    if(err){

    }else{
      if(data.length==0){
	new Venue({
	  areaName : areaName,
	  location : location
	}).save(function(err, doc){
	  if(err) console.log('error');
	  else{
	    res.json({"doc":"successfully added"});
	  }
	});
      }else{
	res.json({"doc":"already added"});
      }
    }
  });
});

app.post('/AddBike',function(req,res){
  console.log("add bike.....................................");
  var bikeRegNo=req.body.bikeRegNo;
  var bikeRegYear=req.body.Year;
  var bikeColor=req.body.bikeColor;
  var bikeName=req.body.bikeName;
  var bikeImageName= req.body.bikeImageName;
  var fuelType= req.body.fuelType;
  var seat=req.body.seat;
  var priceSixHour= req.body.priceSixHour;
  var kmLimitSixHour= req.body.kmLimitSixHour;
  var areaName= req.body.areaName;
  var location= req.body.locationName;
  AddBike.find({ $and: [ {'bikeName': bikeName }, { 'bikeRegNo': bikeRegNo } ] },function(err,data){
    if(err){

    }else{
      if(data.length==0){
	new AddBike({
	  bikeName : bikeName,
	  bikeRegNo: bikeRegNo,
	  bikeRegYear: bikeRegYear,
	  bikeColor: bikeColor,
          bikeImageName : bikeImageName,
          fuelType : fuelType,
          seat : seat,
          priceSixHour : priceSixHour,
          kmLimitSixHour : kmLimitSixHour,
          areaName : areaName,
	  location : location,
	  vechilePriceBooked : '',
	  vechleStartDate : '',
	  vechileStartTime : '',
	  vechileEndDate : '',
	  vechileEndTime : '',
          vechileBookedByPhoneNo:''
	}).save(function(err, doc){
	  if(err) console.log('error');
	  else{
	    res.json({"doc":"successfully added"});
	  }
	});
      }else{
	res.json({"doc":"already added"});
      }
    }
  });
});


app.post('/FetchUserAndBike',function(req,res){
  var phoneNo=req.body.phoneNo;
  AddBike.find({ vechileBookedByPhoneNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"invalid"});
      }
      if(doc.length===1){
        console.log(doc);
        res.json({"doc":doc});
        //res.json({"doc":doc})
      }
    }
        
  });

});
app.post('/FetchAccount',function(req,res){
  var phoneNo=req.body.phoneNo;
  user.find({ mobileNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"invalid"});
      }
      if(doc.length===1){
        console.log(doc);
        res.json({"doc":doc});
        //res.json({"doc":doc})
      }
    }
        
  });

});

app.post('/UpdateName',function(req,res){
  var phoneNo=req.body.phoneNo;
  var username=req.body.username;
  user.find({ mobileNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"not sucess"});
      }
      if(doc.length===1){
        user.update({mobileNo:phoneNo},
		{
		  $set: {
		   username : username
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
		    res.json({"doc":"sucess"});
		  }
	});
      }
    }
        
  });

});

app.post('/StartTrip',function(req,res){
  var phoneNo=req.body.phoneNo;
  var bikeName=req.body.bikeName;
  var bikeRegNo=req.body.bikeRegNo;
  var bikeDoc;
  user.find({ mobileNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"not sucess"});
      }
      if(doc.length===1){
        user.update({mobileNo:phoneNo},
		{
		  $set: {
		   vechileRegNo:bikeRegNo
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
		    
			   AddBike.find({ vechileBookedByPhoneNo: phoneNo },
				  function(err,doc) {
				      if (err) throw err;

				      else{
				      if(doc.length===0){
					console.log('invalid user');
					res.json({"msg":"invalid"});
				      }
				      if(doc.length===1){
					      bikeDoc=doc;
					AddBike.update( { vechileBookedByPhoneNo: phoneNo },
						{
						  $set: {

							  vechilePriceBooked : '',
							  vechleStartDate : '',
							  vechileStartTime : '',
							  vechileEndDate : '',
							  vechileEndTime : '',
							  vechileBookedByPhoneNo:''
						  }
						},function(err,doc){
						  if(err){
						    console.log('error');
						  }else{
						    //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
							AddBike.update( {$and:[{bikeName:bikeName,bikeRegNo:bikeRegNo}]},
							{
							  $set: {

								  vechilePriceBooked : bikeDoc[0].vechilePriceBooked,
								  vechleStartDate :  bikeDoc[0].vechleStartDate,
								  vechileStartTime : bikeDoc[0].vechleStartDate,
								  vechileEndDate : bikeDoc[0].vechileEndDate,
								  vechileEndTime : bikeDoc[0].vechileEndTime,
								  vechileBookedByPhoneNo:phoneNo
							  }
							},function(err,doc){
							  if(err){
							    console.log('error');
							  }else{
								   res.json({"doc":"sucess"});
								  //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
							  }
							});

						   
						  }
					});					
					//res.json({"doc":doc})
				      }
				    }

				  });
		  }
	});
      }
    }
        
  });

});

app.post('/EndTrip',function(req,res){
  var phoneNo=req.body.phoneNo;
   AddBike.find({ vechileBookedByPhoneNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
	console.log('invalid user');
	res.json({"msg":"invalid"});
      }
      if(doc.length===1){
	      bikeDoc=doc;
        AddBike.update( { vechileBookedByPhoneNo: phoneNo },
	{
	  $set: {

		  vechilePriceBooked : '',
		  vechleStartDate :  '',
		  vechileStartTime : '',
		  vechileEndDate : '',
		  vechileEndTime : '',
		  vechileBookedByPhoneNo:''
	  }
	},function(err,doc){
	  if(err){
	    console.log('error');
	  }else{
		user.update({mobileNo:phoneNo},
		{
		  $set: {
		     	vechileNameBooked:'',
			vechileAreaBooked:'',
			vechileLocationBooked:'',
			vechilePriceBooked:'',
			vechleStartDate:'',
			vechileStartTime:'',
			vechileEndDate:'',
			vechileEndTime:'',
			vechileRegNo:''
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
			res.json({"doc":"sucess"});
		  }
		 });
		  
		  //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
	  }
	});
      }
    }
        
  });

});

app.post('/UpdateEmail',function(req,res){
  var phoneNo=req.body.phoneNo;
  var email=req.body.email;
  user.find({ mobileNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"not sucess"});
      }
      if(doc.length===1){
        user.update({mobileNo:phoneNo},
		{
		  $set: {
		   email : email
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
		    res.json({"doc":"sucess"});
		  }
	});
      }
    }
        
  });

});

app.post('/UpdateAddress',function(req,res){
  var phoneNo=req.body.phoneNo;
  var address=req.body.address;
  user.find({ mobileNo: phoneNo },
  function(err,doc) {
      if (err) throw err;

      else{
      if(doc.length===0){
        console.log('invalid user');
        res.json({"msg":"not sucess"});
      }
      if(doc.length===1){
        user.update({mobileNo:phoneNo},
		{
		  $set: {
		   address : address
		  }
		},function(err,doc){
		  if(err){
		    console.log('error');
		  }else{
		    res.json({"doc":"sucess"});
		  }
	});
      }
    }
        
  });

});

app.post('/FetchAllAddress',function(req,res){
  console.log("FetchAllAddress");
  var phoneNo=req.body.phoneNo;
  Venue.find({},function(err,data){
    if(err){

    }else{
	    user.find({mobileNo:phoneNo},function(err,doc){
	    	if(err){
		}else{
			console.log("doc >>>>>>>>>>>>>>>>>>>>>>>>> ");
			console.log(doc);
			if(doc[0].vechileNameBooked==''){
				 console.log(data);
        			res.json({"doc":data,"bookedStatus":"not booked"});	
			}else{
				res.json({"doc":data,"bookedStatus":"booked"});
			}
		}
	    });
       
      
    }
  });
});

app.post('/FetchAllBike',function(req,res){
  console.log("FetchAllBike");
  AddBike.find({},function(err,data){
    if(err){

    }else{
        console.log(data);
        res.json({"doc":data});
      
    }
  });
});

app.post('/saveAddress',function(req,res){
  console.log("saveAddress");
  var email=req.body.email;
  var phoneno=req.body.phoneno;
  var address=req.body.address;
  var pincode=req.body.pincode;
  var landmark=req.body.landmark;
  var city=req.body.city;
  var defaultAddress=req.body.defaultAddress;
  saveAddress.find({email:email},function(err, doc) {
      if(err){
        
      }else{
        if(doc.length===0){
            new saveAddress({
              email             : email,
              phoneno           : phoneno,
              address           : address,
              pincode           : pincode,
              landmark          : landmark,
              city              : city,
              defaultAddress    : "true"
            }).save(function(err, doc){
              if(err) console.log('error');
              else    res.json({"doc":doc});
            });
        }else{
          if(defaultAddress==="true"){
            saveAddress.update({email:email},
                {
                  $set: {
                   defaultAddress : "false"
                  }
                },{ multi: true },function(err,doc){
                  if(err){
                    console.log('error');
                  }else{
                    console.log('done');
                    new saveAddress({
                      email             : email,
                      phoneno           : phoneno,
                      address           : address,
                      pincode           : pincode,
                      landmark          : landmark,
                      city              : city,
                      defaultAddress    : defaultAddress
                    }).save(function(err, doc){
                      if(err) console.log('error');
                      else    res.json({"doc":doc});
                    });
                  }
            });
          }else{
            new saveAddress({
              email             : email,
              phoneno           : phoneno,
              address           : address,
              pincode           : pincode,
              landmark          : landmark,
              city              : city,
              defaultAddress    : defaultAddress
            }).save(function(err, doc){
              if(err) console.log('error');
              else    res.json({"doc":doc});
            });
          }
        }
      }
  });
});

app.post('/CompleteOrder',function(req,res){

  var email=req.body.email;
  var address=req.body.address;
  var orderId=req.body.orderId;
  var username=req.body.username;
  var deliverydate=req.body.deliverydate;
  var pickupdate=req.body.pickupdate;
  var datetime = new Date();

  console.log(datetime.getFullYear()+"   "+datetime);
  order.find({order_id:orderId},function(err,doc){
    if(err){

    }else{
      if(doc.length==0){
        new order({
            ordered_by_email      : email,
            address               : address,
            order_id              : orderId,
            ordered_on_date       : datetime.getDate()+"/"+(datetime.getMonth()+1)+"/"+datetime.getFullYear(),
            ordered_on_time       : datetime.getHours()+":"+datetime.getMinutes()+":"+datetime.getSeconds()
        }).save(function(err, doc){
          if(err) console.log('error');
          else    {
              var mailHtml1 = '<div style="border: 10px solid #03A9F4;float:left;padding: 1%;background: #F3F3F3">'+
                                          '<div>'+
                                              '<img style="height: 100px;width: 100px;float:right;" src="https://idealadda-vinitraj.c9users.io/uploads/idealaddalogo.png" alt="Ideal Adda">'+  
                                          '</div>'+            
                                          '<div style="text-align: justify;float:left;">'+
                                              '<p>Hi <b style="color:blue;">'+email+'</b></p>'+
                                              '<p>We have received your order '+orderId+' and it will be delivered to you within '+deliverydate+'.</p>'+
                                              '<p>Order Date:	'+datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear()+',Order Time:'+datetime.getHours()+':'+datetime.getMinutes()+':'+datetime.getSeconds()+'</p>'+
                                              '<p>Address:</p>'+
                                              '<p>'+address+'</p>';                        
                                      
              mailHtml1=mailHtml1+
                        '<p></p>'+
                        '<p>Thanks,</p>'+
                        '<p>Team Washing Adda.</p>'+
                        
                        '</div>'+
                        '</div>';
              var mailOptions={
                to : "vinitraj96@gmail.com,"+email,
                subject : "Your veegi order summary",
                text : "veggi",
                html: mailHtml1
              }
              console.log(mailOptions);
              smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                console.log(error);
                
                }else{
                }
              });
              res.json({"doc":"order completed"});
          }
        });
      }
    }
  });
});

app.post('/FetchLeadPickUp',function(req,res){
  Lead.find({pickup_done:'false'},function(err,data){
    if(err){

    }else{
      if(data.length==0){
         res.json({"doc":"invalid"});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/FetchLeadDrop',function(req,res){
  Lead.find({$and:[{pickup_done:'true'},{drop_done:'false'}]},function(err,data){
    if(err){

    }else{
      if(data.length==0){
         res.json({"doc":"invalid"});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/DropCloths',function(req,res){
  var order_id = req.body.order_id;
  Lead.update({order_id:order_id},{
      $set: {
       drop_done:"true"
      }
    },function(err,doc){
      if(err){
        console.log('error');
      }else{
        res.json({'doc':'valid'});
      }
  });
});

app.post('/FetchLeadPickUpCustomer',function(req,res){
  console.log("FetchLeadPickUpCustomer");
  var mobile_no = req.body.mobile_no;
  Lead.find({$and:[{mobile_no:mobile_no},{drop_done:'true'}]},function(err,data){
    if(err){

    }else{
      if(data.length==0){
         res.json({"doc":"invalid","data":data});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/FetchLeadDropCustomer',function(req,res){
  console.log("FetchLeadDropCustomer");
  var mobile_no = req.body.mobile_no;
  Lead.find({$and:[{mobile_no:mobile_no},{pickup_done:'false'}]},function(err,data){
    if(err){

    }else{
      if(data.length==0){
         res.json({"doc":"invalid","data":data});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/FetchLeadPickupDoneCustomer',function(req,res){
  console.log("FetchLeadPickupDoneCustomer");
  var mobile_no = req.body.mobile_no;
  Lead.find({$and:[{mobile_no:mobile_no},{pickup_done:'true'},{drop_done:'false'}]},function(err,data){
    if(err){

    }else{
      if(data.length==0){
         res.json({"doc":"invalid","data":data});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});


app.post('/FetchLeadPickUpByOrder',function(req,res){
  var order_id = req.body.order_id;
  Lead.find({$and:[{order_id:order_id},{pickup_done:'false'}]},function(err,data){
    if(err){

    }else{
      if(data.length==0){
         res.json({"doc":"invalid"});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/FetchLeadPickUpByOrderForCustomer',function(req,res){
  var order_id = req.body.order_id;
  
  Lead.find({order_id:order_id},function(err,data){
    if(err){

    }else{
      if(data.length==0){
         res.json({"doc":"invalid"});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/addProduct',function(req,res){
  console.log("addProduct");
  var productName= req.body.productName;
  var activeWheelPriceWashIron = req.body.activeWheelPriceWashIron;
  var activeWheelPriceIron = req.body.activeWheelPriceIron;
  var rinPriceWashIron = req.body.rinPriceWashIron;
  var rinPriceIron = req.body.rinPriceIron;
  var nirmaPriceWashIron = req.body.nirmaPriceWashIron;
  var nirmaPriceIron = req.body.nirmaPriceIron;
  var tidePriceWashIron = req.body.tidePriceWashIron;
  var tidePriceIron = req.body.tidePriceIron;
  var surfExcelPriceWashIron = req.body.surfExcelPriceWashIron;
  var surfExcelPriceIron = req.body.surfExcelPriceIron;
  var arielPriceWashIron = req.body.arielPriceWashIron;
  var arielPriceIron = req.body.arielPriceIron;
  var ezeePriceWashIron = req.body.ezeePriceWashIron;
  var ezeePriceIron = req.body.ezeePriceIron;
  var comfortPrice = req.body.comfortPrice;
  var softTouchPrice = req.body.softTouchPrice;
  var safeWashPrice = req.body.safeWashPrice;
  var ironingPrice = req.body.ironingPrice;
  var dryCleanPrice = req.body.dryCleanPrice;
  
  Product.find({productName:productName},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        new Product({
          productName:productName,
          activeWheelPriceWashIron : activeWheelPriceWashIron,
          activeWheelPriceIron : activeWheelPriceIron,
          rinPriceWashIron : rinPriceWashIron,
          rinPriceIron : rinPriceIron,
          nirmaPriceWashIron : nirmaPriceWashIron,
          nirmaPriceIron : nirmaPriceIron,
          tidePriceWashIron : tidePriceWashIron,
          tidePriceIron : tidePriceIron,
          surfExcelPriceWashIron : surfExcelPriceWashIron,
          surfExcelPriceIron : surfExcelPriceIron,
          arielPriceWashIron : arielPriceWashIron,
          arielPriceIron : arielPriceIron,
          ezeePriceWashIron : ezeePriceWashIron,
          ezeePriceIron : ezeePriceIron,
          comfortPrice : comfortPrice,
          softTouchPrice : softTouchPrice,
          safeWashPrice : safeWashPrice,
          ironingPrice : ironingPrice,
          dryCleanPrice : dryCleanPrice
        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            res.json({"doc": "valid"});
          }
        });
      }else{
        res.json({"doc":"invalid"});
      }
    }
  });
});

app.post('/fetchPickupTime',function(req,res){
  console.log("fetchPickupTime");
  PickupTime.find({},function(err,data){
    if(err){
    }else{
      res.json({"doc": "valid","data":data[0]});
    }
  });
});

app.post('/fetchProduct',function(req,res){
  console.log("fetchProduct");
  Product.find({},function(err,data){
    if(err){

    }else{
      res.json({"doc": "valid","data":data});
    }
  });
});

app.post('/fetchCloths',function(req,res){
  console.log("fetchCloths");
  var order_id = req.body.order_id;
  Lead.find({order_id:order_id},function(err,data){
    if(err){

    }else{
      res.json({"doc": "valid","data":data});
    }
  });
});

app.post('/pickUpCompleted',function(req,res){
  console.log("pickUpCompleted");
  var order_id = req.body.order_id;
  Lead.update({order_id:order_id},{
      $set: {
       pickup_done:"true"
      }
    },function(err,doc){
      if(err){
        console.log('error');
      }else{
        res.json({'doc':'valid'});
      }
  });
});

app.post('/addCloths',function(req,res){
  console.log("addCloths");
  var order_id = req.body.order_id;
  var clothType = req.body.clothType;
  var processType = req.body.processType;
  var surfType = req.body.surfType;
  var softnerNeed = req.body.softnerNeed;
  var softnerType = req.body.softnerType;
  var price = req.body.price;
  var discount = req.body.discount;
  var mobile_no = req.body.mobile_no;
  var refferal_code = req.body.refferal_code;
  
  console.log(order_id);
  console.log(clothType);
  console.log(processType);
  console.log(surfType);
  console.log(softnerNeed);
  console.log(softnerType);
  console.log(refferal_code);

  if(discount=="no-discount"){
    Lead.update({ 'order_id': order_id},{
      $push:{
          clothsArray : {clothType: clothType, processType: processType, surfType: surfType,softnerNeed:softnerNeed,softnerType:softnerType,price:price}
        }
      }, { safe: true },
    function(err, result1) {
      if(err){
        console.log(err);
        res.json({success: false});
      }else{
        res.json({"doc":"valid"});
      }
    });
  }else if(discount=="reffer"){
    Lead.update({ 'order_id': order_id},{
      $push:{
          clothsArray : {clothType: clothType, processType: processType, surfType: surfType,softnerNeed:softnerNeed,softnerType:softnerType,price:price}
        }
      }, { safe: true },
    function(err, result1) {
      if(err){
        console.log(err);
        res.json({success: false});
      }else{
        Lead.update({'order_id':order_id},{
          $set: {
           discount:discount,
           credit_used:"true"
          }
        },function(err,doc){
          if(err){
            console.log('error');
          }else{
            CustomerUser.find({'mobile_no':mobile_no},function(err,data){
              if(err){

              }else{
                var credit = data[0].credit_first_offer;
                CustomerUser.update({'mobile_no':mobile_no},{
                  $set: {
                   credit_first_offer:(parseInt(credit)-1).toString()
                  }
                },function(err,doc){
                  if(err){
                    console.log('error');
                  }else{
                    res.json({'doc':'valid'});  
                  }
                });
              }
            });
          }
        });
      }
    });
  }else{
    Lead.update({ 'order_id': order_id},{
      $push:{
          clothsArray : {clothType: clothType, processType: processType, surfType: surfType,softnerNeed:softnerNeed,softnerType:softnerType,price:price}
        }
      }, { safe: true },
    function(err, result1) {
      if(err){
        console.log(err);
        res.json({success: false});
      }else{
        Lead.update({'order_id':order_id},{
          $set: {
           discount:discount
          }
        },function(err,doc){
          if(err){
            console.log('error');
          }else{
            if(refferal_code=="no-refferal"){
              CustomerUser.update({'mobile_no':mobile_no},{
                $set: {
                 first_offer:"used"
                }
              },function(err,doc){
                if(err){
                  console.log('error');
                }else{
                  res.json({'doc':'valid',"offer_type":"none"});  
                }
              });
            }else{
              Promocode.find({"promocode":refferal_code},function(err,data){
                if(err){

                }else{
                  var reffered_by=data[0].reffered_by;
                  console.log("reffered_by >>>>>>>>>>> ");
                  console.log(reffered_by);
                  CustomerUser.find({'mobile_no':reffered_by},function(err,data){
                    if(err){

                    }else{
                      var credit = data[0].credit_first_offer;
                      console.log("credit >>>>>>>>>>> ");
                      console.log(credit);
                      CustomerUser.update({'mobile_no':reffered_by},{
                        $set: {
                         credit_first_offer:(parseInt(credit)+1).toString()
                        }
                      },function(err,doc){
                        if(err){
                          console.log('error');
                        }else{
                          CustomerUser.update({'mobile_no':mobile_no},{
                            $set: {
                             first_offer:"used"
                            }
                          },function(err,doc){
                            if(err){
                              console.log('error');
                            }else{
                              res.json({'doc':'valid',"offer_type":"none"});  
                            }
                          }); 
                        }
                      });
                    }
                  });
                }
              });
            }     
          }
        }); 
      }
    });
  }
});

app.post('/AddLead',function(req,res){
  console.log("AddLead");
  var mobile_email = req.body.mobile_email;
  var order_date= req.body.order_date;
  var order_time = req.body.order_time;
  var buildingOrFlat = req.body.buildingOrFlat;
  var subArea = req.body.subArea;
  var area = req.body.area;
  var pinCode = req.body.pinCode;
  var street = req.body.street;
  var landmark = req.body.landmark;
  
  console.log(mobile_email);
  console.log(subArea);
  console.log(area);
  console.log(pinCode);
  console.log(street);
  console.log(landmark);
  console.log(mobile_email);

  Lead.find({$and:[{mobile_no:mobile_email},{pickup_done:"false"}]},function(err,data){
    if(err){

    }else{
      if(data.length == 0){
        OrderId.find({},function(err,orderId){
          if(err){

          }else{

            if(orderId.length==0){
              var orderId = '1';  
              new Lead({
                  mobile_no: mobile_email,
                  order_id: orderId,
                  order_date: order_date,
                  order_time: order_time,
                  buildingOrFlat: buildingOrFlat,
                  subArea: subArea,
                  area: area,
                  pinCode: pinCode,
                  street: street,
                  landmark: landmark,
                  pickup_done: 'false',
                  drop_done: 'false'
              }).save(function(err, doc){
                if(err) console.log('error');
                else{
                  new OrderId({
                        order_id: orderId
                  }).save(function(err, doc){
                    if(err) console.log('error');
                    else{
                      //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
                      res.json({'doc':'valid',"offer_type":"none"});
                    }
                  });
                  //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
                }
              });
            }else{
              console.log("Order Id");
              console.log(orderId[0].order_id);
              var orderId = parseInt(orderId[0].order_id) +1;
              new Lead({
                  mobile_no: mobile_email,
                  order_id: orderId,
                  order_date: order_date,
                  order_time: order_time,
                  buildingOrFlat: buildingOrFlat,
                  subArea: subArea,
                  area: area,
                  pinCode: pinCode,
                  street: street,
                  landmark: landmark,
                  pickup_done: 'false',
                  drop_done: 'false'
              }).save(function(err, doc){
                if(err) console.log('error');
                else{
                  OrderId.update({},{
                    $set: {
                     order_id:orderId
                    }
                  },function(err,doc){
                    if(err){
                      console.log('error');
                    }else{
                      res.json({'doc':'valid',"offer_type":"none"});
                    }
                  });    
                }
              });
            } 
          }
        });
      }else{
        res.json({"doc":"pickup already schedule"});
      }
    }
  });
});

app.post('/fetchUser',function(req,res){
  var mobile_email = req.body.mobile_no;
  CustomerUser.find({mobile_no:mobile_email},function(err,data){
    if(err){

    }else{
      console.log(data[0]);
      if(data.length==0){
        res.json({"success":"true"});
      }else{
        res.json({"success":"false","doc":data[0]});
      }
    }
  });
});

app.post('/fetchFeedback',function(req,res){
  var mobile_email = req.body.mobile_no;                  
  Feedback.find({mobile_no:mobile_email},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        res.json({"doc":"invalid"});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/sendFeedBack',function(req,res){
  var mobile_email = req.body.mobileNo;
  var feedback = req.body.feedback;
                      
  new Feedback({
    mobile_no : mobile_email,
    feedback : feedback,
  }).save(function(err, doc){
    if(err) console.log('error');
    else{
      //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);

      Feedback.find({mobile_no:mobile_email},function(err,data){
        if(err){

        }else{
          res.json({"doc":"valid","data":data});
        }
      });
    }
  });
});

app.post('/addFaq',function(req,res){
  var question = req.body.question;
  var answer = req.body.answer;

  Faq.find({question:question},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        new Faq({
          question : question,
          answer : answer,
        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
            res.json({"doc":"valid"});
          }
        });
      }else{
        res.json({"doc":"invalid"});  
      }
    }
  });
});

app.post('/addAboutUs',function(req,res){
  console.log("addAboutUs ::::::::::");
  var about_us = req.body.about_us;
  AboutUs.find({},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        new AboutUs({
          about_us : about_us
        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
            res.json({"doc":"valid"});
          }
        });
      }else{
        AboutUs.update({},
          {
            $set: {
             about_us:about_us
            }
          },function(err,doc){
            if(err){
              console.log('error');
            }else{
                res.json({"doc":"valid"});
            }
        });
      }
    }
  });
});

app.post('/AddPickupTime',function(req,res){
  var start_time = req.body.startTime;
  var end_time = req.body.endTime;
  PickupTime.find({},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        new PickupTime({
          start_time : start_time,
          end_time : end_time
        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
            res.json({"doc":"valid"});
          }
        });
      }else{
        PickupTime.update({},
          {
            $set: {
              start_time : start_time,
              end_time : end_time
            }
          },function(err,doc){
            if(err){
              console.log('error');
            }else{
                res.json({"doc":"valid"});
            }
        });
      }
    }
  });
});

app.post('/addContactUs',function(req,res){
  var contact_us = req.body.contact_us;
  ContactUs.find({},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        new ContactUs({
          contact_us : contact_us
        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
            res.json({"doc":"valid"});
          }
        });
      }else{
        ContactUs.update({},
          {
            $set: {
             contact_us:contact_us
            }
          },function(err,doc){
            if(err){
              console.log('error');
            }else{
                res.json({"doc":"valid"});
            }
        });
      }
    }
  });
});

app.post('/fetchAboutUs',function(req,res){
  AboutUs.find({},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        res.json({"doc":"invalid"});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/fetchContactUs',function(req,res){
  ContactUs.find({},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        res.json({"doc":"invalid"});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/fetchFaq',function(req,res){
  Faq.find({},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        res.json({"doc":"invalid"});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/addAreaAndPincode',function(req,res){
  var area = req.body.area;
  var pincode = req.body.pincode;

  Address.find({$and:[{area:area},{pincode:pincode}]},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        new Address({
          area : area,
          pincode : pincode,
        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            //setTimeout(myFunc, 5 * 60 * 1000,mobileNo,otp,res);
            res.json({"doc":"valid"});
          }
        });
      }else{
        res.json({"doc":"invalid"});  
      }
    }
  });
});

app.post('/fetchAreaPincode',function(req,res){
 
  Address.find({},function(err,data){
    if(err){

    }else{
      if(data.length==0){
        res.json({"doc":"invalid"});
      }else{
        res.json({"doc":"valid","data":data});
      }
    }
  });
});

app.post('/addLocation',function(req,res){
  console.log("addLocation >>>>>>>>>>>>>>>> ");
  var mobile_email = req.body.mobile_no;
  var buildingOrFlat = req.body.buildingOrFlat;
  var subArea = req.body.subArea;
  var area = req.body.area;
  var pinCode = req.body.pinCode;
  var street = req.body.street;
  var landmark = req.body.landmark;

  console.log(mobile_email);
  console.log(subArea);
  console.log(area);
  console.log(pinCode);
  console.log(street);
  console.log(landmark);

  CustomerUser.update({ 'mobile_no': mobile_email},{
    $push:{
        addressArray : {buildingOrFlat: buildingOrFlat,street: street,landmark: landmark,subArea: subArea,area: area,pinCode: pinCode}
      }
    }, { safe: true },
  function(err, result1) {
    if(err){
      console.log(err);
      res.json({success: false});
    }else{
      res.json({"doc":"valid"});
    }
  });
});

app.post('/deleteAddress',function(req,res){
  console.log("deleteAddress >>>>>>>>>>>>>>>> ");
  var mobile_email = req.body.mobile_no;
  var buildingOrFlat = req.body.buildingOrFlat;
  var street = req.body.street;
  var landmark = req.body.landmark;
  var subArea = req.body.subArea;
  var area = req.body.area;
  var pinCode = req.body.pinCode;

  console.log(mobile_email);
  console.log(buildingOrFlat);
  console.log(street);
  console.log(landmark);
  console.log(subArea);
  console.log(area);
  console.log(pinCode);
  
  CustomerUser.update(
      {'mobile_no': mobile_email},
      { $pull: { addressArray: { buildingOrFlat: buildingOrFlat , street: street , landmark: landmark, subArea: subArea,area:area,pinCode:pinCode } } },
      { multi: true },
    function(err, result1) {
      if(err){
        console.log(err);
        res.json({success: false});
      }else{
        res.json({"doc":"valid"});
      }
  });
    
});

app.post('/addReferAndEarn',function(req,res){
    var reffered_to = req.body.email;
    var reffered_by = req.body.mobile_no;
    var promocode = req.body.promocode;
    console.log("promocode");
    console.log(promocode);
    Promocode.find({promocode: promocode},function(err,data){
      if(data.length==0){
        new Promocode({
          promocode: promocode,
          reffered_by: reffered_by,
          reffered_to: reffered_to
        }).save(function(err, doc){
          if(err) console.log('error');
          else{
            res.json({"doc":"valid"});
          }
        });
      }else{
        res.json({"doc":"invalid"});
      }
    });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END app]
