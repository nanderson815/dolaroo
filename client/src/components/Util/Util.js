import axios from 'axios';
import Firebase from "../Auth/Firebase/firebase";

// Util is used for various common functions
// It is not a REACT component but rather one thatg can be used
// within out outside react components
// It gives access to firebase context informaton and auth information
// without needing to use react context.  This way we can write more generic
// functions and classes that do not have wrapped in react compnents
class Util  {

  static getUserToken = async () => {
    const firebase = new Firebase();
    const token = await firebase.doRefreshToken(true);
    return token;
  }

  static getCurrentAuthUser = async () => {
    const firebase = new Firebase();
    const currentAuthUser = await firebase.auth.currentUser;
    return currentAuthUser;
  }

  static getUserRole = async () => {
    const firebase = new Firebase();
    const currentUserRole = await firebase.auth.doGetUserRole();
    return currentUserRole;
  }

  static isUserAdmin = async () => {
    const firebase = new Firebase();
    const userIsAdmin = await firebase.auth.doIsUserAdmin();
    return userIsAdmin;
  }

  static isUserBanker = async () => {
    const firebase = new Firebase();
    const userIsBanker = await firebase.auth.doIsUserBanker();
    return userIsBanker;
  }

  static isUserCashier = async () => {
    const firebase = new Firebase();
    const userIsCashier = await firebase.auth.doIsUserCashier();
    return userIsCashier;
  }

  static getFirestoreDB = () => {
    const firebase = new Firebase();
    const db = firebase.db;
    return db;
  }

  static apiGet = async (api) => {
    const firebase = new Firebase();
    const token = await firebase.doRefreshToken(true);
    return(axios.get(api, {headers: {"FIREBASE_AUTH_TOKEN": token}}));
  }

  
  static apiGetNoToken = (api) => {
    return(axios.get(api));
  }

  static apiPost = async (api, param) => {
    const firebase = new Firebase();
    const token = await firebase.doRefreshToken(true);
    return(axios.post(api, param, {headers: {"FIREBASE_AUTH_TOKEN": token}}));
  } 

} // class

export default Util;