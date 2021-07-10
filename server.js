const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const connectDB = require('./db');
const app = require('./app')

//connect database
connectDB(); 

//add port create server
const PORT = process.env.PORT | 5000; 
const env = process.env.NODE_ENV;

const server = app.listen(PORT, () => {
    
    console.log('Server running on port ', PORT); 
});

//handle the rest errors
process.on('unhandledRejection', err => {

    console.log(err.name, err.message);
    server.close(()=>{
        console.log('exiting.....')
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    server.close(()=>{
        console.log('exiting.....')
        process.exit(1);
    });
});
  