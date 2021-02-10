const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const connectDB = require('./db');
const app = require('./app')

//connect database
connectDB(); 

//add port create server
const PORT = process.env.PORT | 5000; 

app.listen(PORT, () => {
    console.log('Server running on port ', PORT); 
});
  