import * as Element from './element.js'
import * as Route from '../controller/route.js'

export function addEventListeners(){
    Element.menuHome.addEventListener('click', e=>{
        //url route
        history.pushState(null, null, Route.routePathname.HOME)
        //call home page function
        home_page();
    })
}

export function home_page(){
   Element.root.innerHTML = `
        <h1>Welcome to Admin's Page</h1>
   `
}