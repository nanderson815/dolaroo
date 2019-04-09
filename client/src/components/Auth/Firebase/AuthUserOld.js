import Firebase from "./firebase";

// "Static" properties
let _user = null;
let _userRole = null;
let _token = null;
class AuthUser  {
    constructor() {
        this.firebase = new Firebase();
    }

    static get user () { return _user }
    static set user (pUser) {  _user = pUser }
    static get userRole () { return _userRole }
    static set userRole (pRole) {  _userRole = pRole }
    static get token () { return _token }
    static set token (pToken) {  _token = pToken }

    refreshToken = async () => {
        try {
            let token = await this.props.firebase.doRefreshToken();
            console.log(`AuthUser refreshed token: ${token}`);
            this.token =  token;
        } catch {
            console.error("Error refreshng token");
            this.token =  null;
        }
    }
}

export default AuthUser;