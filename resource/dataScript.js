const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const connectDB = require('../db');
const Tour = require('../model/tourModel'); 
const Review = require('../model/reviewModel');
const User = require("../model/userModel");
const utils = require('../utility/utils'); 
const path = require('path')


connectDB(); 


//read json file 
async function importFile()
{
  let filename =   path.join(__dirname, './data/tours.json'); 
  let user = path.join(__dirname,'./data/users.json');
  let review = path.join(__dirname,"./data/reviews.json");

  try {

    const tours = await utils.readFile(filename); 
    const users = await utils.readFile(user); 
    const reviews = await utils.readFile(review); 

    const newTours = await Tour.create(tours); 

    const newTfours = await User.create(users,{validateBeforeSave:false}); 
    const newTogurs = await Review.create(reviews); 

    console.log("data imported successfully");
      
  } catch (error) {
      
    console.log(error);
  }
  process.exit();
}

async function deleteAll()
{
    try {
        await Tour.deleteMany(); 
        await User.deleteMany(); 
        await Review.deleteMany();

        console.log('data deleted');

    } catch (error) {
        console.log(error)
    }

    process.exit();
}

let command = process.argv[2];


if(command === 'import')
{
    importFile(); 
}else if(command === 'delete')
{
    deleteAll();
}
else 
{
    console.log("error in file");
    process.exit();
}