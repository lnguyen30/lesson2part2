import * as FirebaseController from './firebase_controller.js'
import * as Util from '../viewpage/util.js'
import * as Constant from '../model/constant.js'
import * as Element from '../viewpage/element.js'
import { Product } from '../model/product.js'

let imageFile2Upload

export function addEventListeners(){
    //even listener to change image
    Element.formEditProduct.imageButton.addEventListener('change', e=>{
        imageFile2Upload = e.target.files[0]; //grabs the image of the form
        if(!imageFile2Upload){
            Element.formEditProduct.imageTag.src = null;
            Element.formEditProduct.errorImage.innerHTML = 'Image Change Cancelled. Original image will be used';
            return;
        }
             //takes image error mssage away
             Element.formEditProduct.errorImage.innerHTML = '';
             //reads the img file uploaded
             const reader = new FileReader();
             //loads image src file to tag and previews the pic
             reader.readAsDataURL(imageFile2Upload);
             reader.onload = () => Element.formEditProduct.imageTag.src = reader.result
             
    })

    //event listener to read in new values from edit form
    Element.formEditProduct.form.addEventListener('submit', e=>{
        e.preventDefault();
        //disables button after clicked
        const button = e.target.getElementsByTagName('button')[0]
        const label = Util.disableButton(button);

        //over writes new product over older one
        const p = new Product({
            name: e.target.name.value,
            price: e.target.price.value,
            summary: e.target.summary.value,
        });
        p.docId = e.target.docId.value;
    })

    
}

export async function edit_product(docId){
    let product;
    try{
        //calls firebase controller function to edit the product by id
        product = await FirebaseController.getProductById(docId)
        if(!product){
            Util.info('getProductById error', 'No product found by id');
            return;
        }
    }catch(e){
        if (Constant.DEV) console.log(e);
        Util.info('getProductById Error', JSON.stringify(e));
        return;
    }

    //show product on edit form
    Element.formEditProduct.form.docId.value = product.docId;  
    Element.formEditProduct.form.imageName.value = product.imageName;
    Element.formEditProduct.form.name.value = product.name;
    Element.formEditProduct.form.price.value = product.price;
    Element.formEditProduct.form.summary.value = product.summary;
    Element.formEditProduct.imageTag.src = product.imageURL;
    Element.formEditProduct.errorImage.innerHTML = ''

    Element.modalEditProduct.show();


}