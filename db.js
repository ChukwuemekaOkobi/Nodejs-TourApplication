const mongoose = require('mongoose');


//connect to the local mongoDB using mongoose ORM 
const connectDB = async ()=> {

    try {
     const connection = await   mongoose.connect(process.env.CONNECTION_STRING,{
            useNewUrlParser: true,
            useCreateIndex: true, 
            useFindAndModify: false,
            useUnifiedTopology:true
        }); 

        console.log('database connection successful');
    } catch (error) {
        console.log(error); 
    }
}


module.exports = connectDB; 