//modal objects
export const modalInfobox = new bootstrap.Modal(document.getElementById('modal-info'), {backdrop: 'static'})
export const modalInfoboxTitleElement = document.getElementById('modal-info-title')
export const modalInfoboxBodyElement = document.getElementById('modal-info-body')

export const modalSignin = new bootstrap.Modal(document.getElementById('modal-signin'))
export const modalAddProduct = new bootstrap.Modal(document.getElementById('modal-add-product'), {backdrop: 'static'})

//forms
export const formSignin = document.getElementById('form-signin');
export const formAddProduct = {
    form: document.getElementById('form-add-product'),
    errorName: document.getElementById('form-add-product-error-name'),
    errorPrice: document.getElementById('form-add-product-error-price'), 
    errorSummary: document.getElementById('form-add-product-error-summary'),
    imageTag: document.getElementById('form-add-product-image-tag'),
    imageButton: document.getElementById('form-add-product-image-button'),
    errorImage: document.getElementById('form-add-product-error-image'),
}


//root
export const root = document.getElementById('root');
//menu
export const menuSignout = document.getElementById('menu-signout')
export const menuProducts = document.getElementById('menu-products')
export const menuUsers = document.getElementById('menu-users')
export const menuHome = document.getElementById('menu-home')