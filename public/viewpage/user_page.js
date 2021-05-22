import * as Element from './element.js'
import * as Route from '../controller/route.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import * as FirebaseController from '../controller/firebase_controller.js'

// User page button clicked -> calls user page to render table and user page
export function addEventListeners(){
    Element.menuUsers.addEventListener('click', async ()=>{
        history.pushState(null, null, Route.routePathname.USERS)
        const label = Util.disableButton(Element.menuUsers);
        users_page();

    })
}

export async function users_page(){
    let html  = `
         <h1>Welcome to User Management Page</h1>
    `;

    let userList;
    try{
        userList = await FirebaseController.getUserList();
        //table header
        html += `
        <table class="table">
  <thead>
    <tr>
      <th scope="col">Email</th>
      <th scope="col">Status</th>
      <th scope="col">Action</th>
    </tr>
  </thead>
  <tbody>
        `;
    userList.forEach(user=>{
        html += builderUserRow(user);
    });

    html+= '</tbody></table>'
    }catch(e){
        if(Constant.DEV) console.log(e);
        Util.info('Error getUserList', JSON.stringify(e));
    }
    //renders user list
    Element.root.innerHTML = html;

    // event lister when toggle button is pressed    
    const toggleForms = document.getElementsByClassName('form-toggle-user');
    for(let i = 0; i < toggleForms.length; i++){
        toggleForms[i].addEventListener('submit', async e =>{
            e.preventDefault();
            // assigns the toggle button to button variable
            const button = e.target.getElementsByTagName('button')[0];
            //disables button temporarily
            const label = Util.disableButton(button);

            //fetches the uid from forms-toggle-users
            const uid = e.target.uid.value;
            const disabled = e.target.disabled.value;

            //update object, if the string value is true ->toggle to false else if it's false ->true
            const update = {
                disabled: disabled === 'true'? false : true, 
            }

            try{
                //passes user uid and toggle state to updateUser
                await FirebaseController.updateUser(uid, update);
                //updates user's state value
                e.target.disabled.value = `${update.disabled}`;
                //switches the tag element to Active or Disabled
                document.getElementById(`user-status-${uid}`).innerHTML = `${update.disabled ? 'Disabled' : 'Active'}`
                Util.info('Status toggled', `Disabled: ${update.disabled}`);
            }catch(e){
                if(Constant.DEV) console.log(e);
                Util.info('Toggle user status in error', JSON.stringify(e))
            }

            Util.enableButton(button, label);
        })
    }
 }

//renders each row of user, user-status-user.uid will id which user to toggle off/on
 function builderUserRow(user){
     return `
        <tr>
            <td>${user.email}</td>
            <td id="user-status-${user.uid}">${user.disabled ? 'Disabled' : 'Active'}</td>
            <td>
                <form class="form-toggle-user" method="post" style="display: inline-block;">
                   <input type="hidden" name="uid" value="${user.uid}">
                   <input type="hidden" name="disabled" value="${user.disabled}">
                   <button type="submit" class="btn btn-outline-primary">Toggle Acitve</button>
                </form>
                <form class="form-delete-user" method="post" style="display: inline-block;">
                    <input type="hidden" name="uid" value="${user.uid}">
                    <button type="submit" class="btn btn-outline-danger">Delete</button>
                </form
            <td>
        <tr>
     `;
 }