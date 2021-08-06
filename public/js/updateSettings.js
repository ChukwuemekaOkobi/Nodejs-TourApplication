import {showAlert} from './alert';


async function updateData(data, type){
    try {

        let url = 'http://localhost:5000/api/v1/users/'
         url = type ==='data' ? url+'profile' : url+'updatePassword';


        const res = await fetch(url, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }); 

        const response = await res.json();

        if(res.ok){
            showAlert('success',' update Successful' );
        }
        else{

            showAlert('error','update failed')
        }

    }
    catch(error){

        showAlert('error',error.message);
    }
}


export {updateData}