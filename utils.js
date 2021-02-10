const fs = require('fs'); 



function writeDataToFile(filename, content)
{
    fs.writeFile(filename, JSON.stringify(content), err=>{
        if(err)
        {
            console.log(err);
        }
    })

}


//use when get data from request when not using express
function getPostData(request)
{
   return new Promise((resolve, reject)=>{
    try {
        let body = ""; 
        request.on('data', c => {
            body += c.toString(); 
        })
    
        request.on('end', () => {
            resolve(JSON.parse(body)); 
        })
    } catch (error) {
        reject(error);
    }
   
   })
  
}

function readFile(filename){

    return new Promise((resolve, reject) => {

        fs.readFile(filename, 'utf-8', (err,data) => {
            if(err) 
            {
                reject(err); 
            }
          
            resolve(JSON.parse(data)); 
        })
    });
}
module.exports = {writeDataToFile, getPostData, readFile}