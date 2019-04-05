import axios from 'axios';

class Util  {

  apiGet = (api, token) => {
    return(axios.get(api, {headers: {"FIREBASE_AUTH_TOKEN": token}}));
  } // apiGet

  apiGetOld = (api, token) => {
    return new Promise((resolve, reject) => {
      axios.get(api, {headers: {"FIREBASE_AUTH_TOKEN": token}})
        .then(data => {
          resolve(data);
        }).catch (err => {
          console.error(`error getting token: ${err}`);
          reject(err);
        });
      }); // Promise
  } // apiGet


  APIAysncGet = async (api, token) => {
    try {
      console.log(`got token: ${token}`);
      return(axios.get(api, {headers: {"FIREBASE_AUTH_TOKEN": token}}))
    }
    catch (err) {
      console.error(`error getting auth token ${err}`);
    }
  } // APIget

} // class

export default Util;