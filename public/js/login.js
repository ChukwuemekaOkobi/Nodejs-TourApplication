
import {showAlert} from './alert';

async function Login(email, password){
    try {


        const res = await fetch('http://localhost:5000/api/v1/users/login', {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
              email,
              password
          }),
        }); 

        
        const response = await res.json();

        if(res.ok){
            showAlert('success',' logged in successfully');

            window.setTimeout(()=>{
                location.assign('/')
            },1000)
        }
        else{

            console.log(response);
            showAlert('error','log in failed')
        }

    }
    catch(error){

        showAlert('error',"incorrect");
    }
}


async function Logout()
{

    try {
        
        let res = await fetch('http://localhost:5000/api/v1/users/logout',
        {
            method:'GET',
        }); 

        let response = await res.json(); 

        if(res.status === 200){
            location.href = '/';

        }
    } catch (error) {
        
        showAlert('error', 'Error logging out')
    }
}



export {Login, Logout}