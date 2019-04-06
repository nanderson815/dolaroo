import axios from 'axios';

class Util  {

  static apiGet = (api, token) => {
    return(axios.get(api, {headers: {"FIREBASE_AUTH_TOKEN": token}}));
  }
  
  static apiPost = (api, param, token) => {
    return(axios.post(api, param, {headers: {"FIREBASE_AUTH_TOKEN": token}}));
  } 

  static apiGetOld = (api, token) => {
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


  static APIAysncGet = async (api, token) => {
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