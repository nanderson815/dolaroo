import axios from 'axios';
import Firebase from "../Auth/Firebase/firebase"

class Util  {

  apiGet = (api) => {
    const firebase = new Firebase();

    return new Promise((resolve, reject) => {
      firebase.doRefreshToken().then(token => {
        resolve(axios.get(api, {headers: {"FIREBASE_AUTH_TOKEN": token}}))  
      }).catch (err => {
        console.error(`error getting token: ${err}`);
        reject(err);
      });
    });
  } // apiGet

  APIAysncGet = async (api) => {
    try {
      let token = await this.props.firebase.doRefreshToken();
      console.log(`got token: ${token}`);
      return(axios.get(api, {headers: {"FIREBASE_AUTH_TOKEN": token}}))
    }
    catch (err) {
      console.error(`error getting auth token ${err}`);
    }
  } // APIget


} // class

export default Util;