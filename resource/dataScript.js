const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const connectDB = require('../db');
const Tour = require('../model/tourModel'); 
const utils = require('../utils'); 
const path = require('path')


connectDB(); 

const t = require('../')
//read json file 
async function importFile()
{
  let filename =   path.join(__dirname, './data/tours-simple.json'); 

  try {

    const tours = await utils.readFile(filename); 

    const newTours = await Tour.create(tours); 


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