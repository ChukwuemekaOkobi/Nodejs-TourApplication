import { Login,Logout } from "./login";
import { updateData } from "./updateSettings";
import '@babel/polyfill';

var loginform = document.querySelector('.form--login');


if(loginform){

    loginform.addEventListener('submit', async e=> {
        e.preventDefault();
   
        let email = document.querySelector('#email').value; 
        
        let password = document.querySelector('#password').value;
   
       await Login(email, password);
   })
}

var logout = document.querySelector('.nav__el--logout');

if(logout)
{
    console.log("dfadfa")
    logout.addEventListener('click', Logout)
}
 

var submitData = document.querySelector('#userdataform');

if(submitData){


    submitData.addEventListener('submit', async e=> {
        e.preventDefault(); 

       
        let email = document.querySelector('#emaildata').value; 
        
        let name = document.querySelector('#namedata').value;

        var data = {
            email, 
            name
        }
        await updateData(data,'data');
    
    })
}

var userPasswordData = document.querySelector('#passwordform')

if(userPasswordData){


    userPasswordData.addEventListener('submit', async e=> {
        e.preventDefault(); 

       
        let passwordCurrent = document.querySelector('#password-current').value; 
        
        let password = document.querySelector('#password').value;

        let passwordConfirm = document.querySelector('#password-confirm').value;

        var data = {
            passwordConfirm,
            password, 
            passwordCurrent
        }
        await updateData(data,'password');
    
    })
}