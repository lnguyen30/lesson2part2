import * as Element from '../viewpage/element.js'
import * as FirebaseController from './firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from '../viewpage/util.js'
import * as Route from './route.js'

export let currentUser

export function addEventListeners(){
    //event listener when signin form is submitted
    Element.formSignin.addEventListener('submit', async e=>{
        //prevents the page from reloading, fetches the forms password/email
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        //unathorized log in
        if(!Constant.adminEmails.includes(email)){
            Util.info('Error', 'Only for Admins');
            return;
        }

        try { 
            //calls firebase to sign in, then closes the modal
            await FirebaseController.signIn(email, password)
            Element.modalSignin.hide()
        }catch(e){
            //if there is an error in dev, display error in console
            if(Constant.DEV) console.log(e)
            Util.info('Sign In Error', JSON.stringify(e), Element.modalSignin)
        }
    })

    //event listener when user signs out
    Element.menuSignout.addEventListener('click', async ()=>{
        try{
            await FirebaseController.signOut();
        }catch(e){
            if(Constant.DEV) console.log(e);
            Util.info('Sign Out Error', JSON.stringify(e))

        }
    })


    //event to change navbar state when user signs in/out
    firebase.auth().onAuthStateChanged( user =>{
        if(user && Constant.adminEmails.includes(user.email)){// if a user exist and there is an admin email
            //if user is signed in, show home, product, user, and sign out buttons
            currentUser = user;
            let elements = document.getElementsByClassName('modal-pre-auth')
            for(let i = 0; i<elements.length; i++)
                elements[i].style.display = 'none'
            elements = document.getElementsByClassName('modal-post-auth')
            for(let i = 0; i<elements.length; i++)
                elements[i].style.display = 'block'

            //maintains pathname once signed in
            const pathname = window.location.pathname;
            const hash = window.location.hash;
            Route.routing(pathname, hash);

        }else{
            //if user signs out, just display the sign in button
            currentUser = null
            let elements = document.getElementsByClassName('modal-pre-auth')
            for(let i = 0; i<elements.length; i++)
                elements[i].style.display = 'block'
            elements = document.getElementsByClassName('modal-post-auth')
            for(let i = 0; i<elements.length; i++)
                elements[i].style.display = 'none'
        //defaults home path after signing out
        history.pushState(null, null, Route.routePathname.HOME)
        }
    })
}