import { Product } from '../model/product.js';
import * as Element from './element.js'
import * as FirebaseController from '../controller/firebase_controller.js'
import * as Constant from '../model/constant.js'
import * as Util from './util.js'
import * as Route from '../controller/route.js'
import * as Edit from '../controller/edit_product.js'

let imageFile2Upload

export function addEventListeners(){
    //event listener when Product button is clicked, function is called in app.js
    Element.menuProducts.addEventListener('click', async ()=>{
        history.pushState(null, null, Route.routePathname.PRODUCTS)
        const button = Element.menuProducts;
        const label = Util.disableButton(button);
        await product_page();
       // await Util.sleep(1000);
        Util.enableButton(button, label);
    });

    Element.formAddProduct.form.addEventListener('submit', async e =>{
        e.preventDefault();
        //disables button after clicked
        const button = e.target.getElementsByTagName('button')[0]
        const label = Util.disableButton(button);
        //passes the form into addNewProduct
       await addNewProduct(e.target);
       //refeshes list of products list
       await product_page();
       //re-enables button after function is finished
       Util.enableButton(button, label)
    })

    Element.formAddProduct.imageButton.addEventListener('change', e=>{
        imageFile2Upload = e.target.files[0]; // form file attribute at index 0
        //if image is null, dont proceed
        if(!imageFile2Upload) {
            //resets image tag after trying to add then cancel 
            Element.formAddProduct.imageTag.src = null;
            return
        };
        //reads the img file uploaded
        const reader = new FileReader();
        //loads image src file to tag and previews the pic
        reader.onload = () => Element.formAddProduct.imageTag.src = reader.result
        reader.readAsDataURL(imageFile2Upload);
    });

}

export async function product_page(){

    //add product button
    let html = `
        <div>
            <button id="button-add-product" class="btn btn-outline-danger">+ Add Product</button>
        <div>
    `;

    //client side to retreive all products
    let products;
    try{
        //calls local firebase function to get list of products
        products = await FirebaseController.getProductList();

    }catch(e){
        if(Constant.DEV) console.log(e);
        Util.info('Cannot get product list', JSON.stringify(e));        
    }

    //render products
    products.forEach(p =>{
        html += buildProductCard(p);
    });

    //inserts add product button in the root tag of index html file
    Element.root.innerHTML = html;

    document.getElementById('button-add-product').addEventListener('click', ()=>{
        //resets add product form
        Element.formAddProduct.form.reset();
        Element.formAddProduct.imageTag.src = '';
        imageFile2Upload = null;
        //triggers the add product modal to page
        Element.modalAddProduct.show();
    })

    //disables button once edit has been submitted, then calls edit_product function
    const editForms = document.getElementsByClassName('form-edit-product')
    for(let i = 0; i < editForms.length; i++){
        editForms[i].addEventListener('submit', async e=>{
            e.preventDefault();
            const button = e.target.getElementsByTagName('button')[0];
            const label = Util.disableButton(button)
            //form's docId is passed to edit_product function from card
            await Edit.edit_product(e.target.docId.value)
            //enables button again
            Util.enableButton(button, label)
        })
    }
}

//addes image and product info to firebase
async function addNewProduct(form){
    //assigns values to variables
    const name = form.name.value;
    const price = form.price.value;
    const summary = form.summary.value;

    //creates new product
    const product = new Product({name, price, summary});
    //validate product form, if errors occurs then messages are returned
    const errors =  product.validate(imageFile2Upload);

    //if there are errors, then assign the tags with the error messages else, give them blank values
    Element.formAddProduct.errorName.innerHTML = errors.name ? errors.name : '';
    Element.formAddProduct.errorPrice.innerHTML = errors.price ? errors.price : '';
    Element.formAddProduct.errorSummary.innerHTML = errors.summary ? errors.summary : '';
    Element.formAddProduct.errorImage.innerHTML = errors.image ? errors.image : '';

    if (Object.keys(errors).length !=0) return; //if errors exists

    try {
        // firebase assigns an image name and url once uploaded
        const {imageName, imageURL} = await FirebaseController.uploadImage(imageFile2Upload);
        product.imageName = imageName;
        product.imageURL = imageURL;
        //uploads the product to firebase
        await FirebaseController.addProduct(product.serialize());
        Util.info('Success', `${product.name} added`, Element.modalAddProduct);
    }catch(e){
        if(Constant.DEV) console.log(e);
        Util.info('Add Product Failed', JSON.stringify(e), Element.modalAddProduct);
    }
}

//displays each product in each row
function buildProductCard(product){
    return `
    <div id="card-${product.docId}" class="card" style="width: 18rem; display: inline-block">
        <img src="${product.imageURL}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">$ ${product.price}<br>${product.summary}</p>
        </div>
        <form class="form-edit-product float-start" method="post">
            <input type="hidden" name="docId" value="${product.docId}">
            <button class="btn btn-outline-primary" type="submit">Edit</button>
        </form>
        <form class="form-delete-product float-end" method="post">
            <input type="hidden" name="docId" value="${product.docId}">
            <input type="hidden" name="imageName" value="${product.imageName}">
            <button class="btn btn-outline-danger" type="submit">Delete</button>
        </form>

    </div>
    `;
}


//save product object in firebase
//1. upload the image into cloud storage => image, name, url
//2. store product info to firestore with image info

