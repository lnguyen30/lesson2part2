import * as Home from '../viewpage/home_page.js'
import * as User from '../viewpage/user_page.js'
import * as Product from '../viewpage/product_page.js'


export const routePathname = {
    HOME: '/',
    PRODUCTS: '/products',
    USERS: '/users',
}

// route paths
export const routes = [
    {pathname: routePathname.HOME, page: Home.home_page},
    {pathname: routePathname.PRODUCTS, page: Product.product_page},
    {pathname: routePathname.USERS, page: User.users_page},
];

export function routing(pathname, hash){
    //finds the path of the url, if exists navigates to the route
    //else defaults to home page
   const route = routes.find(r=> r.pathname == pathname);
   if(route) route.page();
   else routes[0].page();
}
