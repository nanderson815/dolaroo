import axios from 'axios';
import Firebase from "../Auth/Firebase/firebase"

class Util  {

  apiGet = (api) => {
    return new Promise((resolve, reject) => {
      const firebase = new Firebase();

      axios.get("/api/userStatic")
      .then(data => {
        console.log(`data from util: ${data}`);
        resolve(data);
      });

      // firebase.doRefreshToken().then(token => {
      //   axios.get(api, {headers: {"FIREBASE_AUTH_TOKEN": token}})
      //   .then(data => {
      //     console.log(`data from util: ${data}`);
      //     resolve(data);
      //   });
      // }).catch (err => {
      //   console.error(`error getting token: ${err}`);
      //   reject(err);
      // });
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