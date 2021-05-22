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
    Element.root.innerHTML = html;
 }

//renders each row of user
 function builderUserRow(user){
     return `
        <tr>
            <td>${user.email}</td>
            <td>${user.disabled ? 'Disabled' : 'Active'}</td>
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