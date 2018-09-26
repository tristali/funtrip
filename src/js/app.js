import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom"; 
import LandingPage from "./components/landingpage";
import Plan from "./components/plan";
import Profile from "./components/profile";
import app from "./lib";
import * as firebase from "firebase";

/*initialize firebase*/
firebase.initializeApp(app.firebase.config);

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            user:{
                name:"",
                email:"",
                password:"",
                uid:"",
                photoURL:"", 
            },
            loginOrSignup:{
                login:"current",
                signup:"",
            },
            menu:"",
        };
        this.handleLoginOrSignupState = this.handleLoginOrSignupState.bind(this);
        this.handleLoginAndSignupInputChange = this.handleLoginAndSignupInputChange.bind(this);
        this.handleMenuState = this.handleMenuState.bind(this);
        this.handleSignout = this.handleSignout.bind(this);

        /* Log in and Sign up */
        this.handleLoginOrSignupEnter = this.handleLoginOrSignupEnter.bind(this);
        this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    }

    render(){
        console.log(this.state);
        return(
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={LandingPage} exact/>
                    <Route
                        path='/plan'
                        render={
                            () => <Plan 
                                state={this.state}
                                handleLoginOrSignupState={this.handleLoginOrSignupState}
                                handleLoginOrSignupEnter={this.handleLoginOrSignupEnter}
                                handleLoginAndSignupInputChange={this.handleLoginAndSignupInputChange}
                                handleMenuState={this.handleMenuState} 
                                menu={this.state.menu}
                                handleSignout={this.handleSignout}
                                handleFacebookLogin={this.handleFacebookLogin}
                                handleGoogleLogin={this.handleGoogleLogin}
                            />}
                    />
                    <Route
                        path='/profile'
                        render={
                            () => <Profile 
                                state={this.state}
                                handleLoginOrSignupState={this.handleLoginOrSignupState}
                                handleLoginOrSignupEnter={this.handleLoginOrSignupEnter}
                                handleLoginAndSignupInputChange={this.handleLoginAndSignupInputChange}
                                handleMenuState={this.handleMenuState} 
                                menu={this.state.menu}
                                handleSignout={this.handleSignout}
                                handleFacebookLogin={this.handleFacebookLogin}
                                handleGoogleLogin={this.handleGoogleLogin}
                            />}
                    />
                </Switch>
            </BrowserRouter>
        );
    }

    
    /* Determine if the user chooses to Login or Signup */
    handleLoginOrSignupState(e){
        const LoginAndSignupDOMsArray = [...app.getAll(".tab>li")];
        const LoginAndSignupInboxDOM = app.get(".login_and_signup>div");

        LoginAndSignupDOMsArray.forEach(e => {
            e.classList.remove("current");
        });
        let loginOrSignup = Object.assign({},this.state.loginOrSignup,{login:"",signup:""});
        loginOrSignup[e.currentTarget.className] = "current";
        this.setState({loginOrSignup:loginOrSignup});

        LoginAndSignupInboxDOM.className=e.currentTarget.className;
    }

    /* Login and Signup data input change this.state.user  */
    handleLoginAndSignupInputChange(e){
        const userDetailKey = Object.keys(this.state.user);
        const userDetailState ={};
        userDetailKey.forEach(i => {
            userDetailState[i]=this.state.user[i];
            if(i == e.currentTarget.id){
                userDetailState[i]=e.currentTarget.value;
            }
        });
        this.setState({user:userDetailState});
    }

    /* check the Login and Signup information before sending the information */
    handleLoginOrSignupEnter(){
        const thisStateUser = this.state.user;

        if(!thisStateUser.email || !thisStateUser.password){
            alert("OOOpps! 有欄位忘記填囉!");
        } else if(!thisStateUser.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)){
            alert("OOOpps! E-Mail 格式有誤!");
        } else if(!thisStateUser.password.match(/.{6,}/)){
            alert("OOOpps! 密碼至少需要六碼歐!");
        } else {
            if(this.state.loginOrSignup.login === "current"){
                /* Login */
                const promise = firebase.auth().signInWithEmailAndPassword(thisStateUser.email,thisStateUser.password);
                promise.catch(e=>alert(e.message));

            }else if(this.state.loginOrSignup.signup === "current"){
                /* Signup */
                if(!thisStateUser.name){
                    alert("OOOpps! 有欄位忘記填囉!");
                } else {
                    const promise = firebase.auth().createUserWithEmailAndPassword(thisStateUser.email,thisStateUser.password);
                    promise
                        .then(function(){
                            firebase.database().ref("/users/" + firebase.auth().currentUser.uid).set({
                                name:thisStateUser.name,
                                email:thisStateUser.email,
                                uid:firebase.auth().currentUser.uid,
                            });              
                        })
                        .catch(e=>alert(e.message));
                }
            }
        }
    }

    /* Facebook Login */
    handleFacebookLogin(){
        console.log("handleFacebookLogin");
    }

    /* Google Login */
    handleGoogleLogin(){
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
        firebase.auth().signInWithPopup(provider).then(function(result) {
            firebase.auth().onAuthStateChanged(firebaseUser=>{
                firebase.database().ref("/users/" + firebaseUser.uid).on("value", function (snapshot) {
                    if(!snapshot.val()){
                        firebase.database().ref("/users/" + firebaseUser.uid).set({
                            name:result.user.displayName,
                            email:result.user.email,
                            uid:firebaseUser.uid,
                            photoURL:result.user.photoURL,
                            provider:"Google",
                        });  
                    }
                });
            });
        });
    }

    /* Determine if the click menu change this.state.menu. */
    handleMenuState(){
        if(!this.state.menu){
            this.setState({menu:"open"});
        }else{
            this.setState({menu:""});
        }
    }

    /* Signout */
    handleSignout(){
        firebase.auth().signOut();
    }

    /* Determine the login status when all components are rendered. */
    componentDidMount(){
        let thisStateUser;
        firebase.auth().onAuthStateChanged(firebaseUser=>{
            const loginAndSignupDOM = app.get(".login_and_signup");
            if(firebaseUser){
                thisStateUser = Object.assign({},this.state.user,{
                    email:firebaseUser.email, 
                    uid:firebaseUser.uid,
                    password:"",
                });
                firebase.database().ref("/users/" + firebaseUser.uid).on("value", function(snapshot) {
                    thisStateUser.name = snapshot.val().name;
                    if(snapshot.val().photoURL){
                        thisStateUser.photoURL = snapshot.val().photoURL;
                    }
                });
                this.setState({user:thisStateUser});
                loginAndSignupDOM.classList.add("hide");
            } else {
                loginAndSignupDOM.classList.remove("hide");
                thisStateUser = Object.assign({},this.state.user,{name:"",email:"",password:"", uid:"",photoURL:""});
                this.setState({user:thisStateUser,
                    menu:"",});
            }
        });
    }
}

ReactDOM.render(<App />, document.getElementById("app"));