import {showAlert} from './alert';


async function updateData(data, type){
    try {

        let url = 'http://localhost:5000/api/v1/users/'
        let header = {}
        let payload = data; 

        if(type !=='data')
        {
            url = url+'updatePassword';
            header = {"Content-Type":'application/json'};
            payload = JSON.stringify(data);
        }
        else{
           url = url+'profile';
        }


        const res = await fetch(url, {
          method: "PATCH",
          headers: header,
          body: payload,
        }); 

        const response = await res.json();

        if(res.ok){
            showAlert('success',' update Successful' );
        }
        else{
            console.log(response)

            showAlert('error','update failed')

        }

    }
    catch(error){

        showAlert('error',error.message, " dsfa");
    }
}


export {updateData}