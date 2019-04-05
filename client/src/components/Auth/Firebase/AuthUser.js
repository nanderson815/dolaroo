import { withFirebase } from "./FirebaseContext";

class AuthUser  {
    constructor() {
        this.user = null;
        this.userRole = null;
        this.token = null;

        this.listenForAuth();
    }

    refreshToken = async () => {
        try {
            let token = await this.user.getIdToken(true);
            console.log(`AuthUser refreshed token: ${token}`);
            this.token =  token;
        } catch {
            console.error("Error refreshng token");
            this.token =  null;
        }
    }

    // NOTE:  This is where the AuthUserContext gets SET
    // I set it here it can be accessed anywhere below since context shared at top
    // Also the the the firebase app object is passed from the index.js component
    // above the app component so it can be used here.  
    listenForAuth() {
        this.listener = this.props.firebase.auth.onAuthStateChanged(
            authUser => {
                if (authUser) {
                    this.user = authUser;
                    this.refreshToken();
                } else {
                    this.user = null;
                    this.userRole = null;
                    this.token = null;
                }
            }
        );
    }

    // This deletes listener to clean things up and prevent mem leaks
    // componentWillUnmount() {
    //     this.listener();
    // }

}

export default withFirebase(AuthUser);