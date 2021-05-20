import * as FirebaseController from './firebase_controller.js'
import * as Util from '../viewpage/util.js'
import * as Constant from '../model/constant.js'
import * as Element from '../viewpage/element.js'


export async function edit_product(docId){
    let product;
    try{
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

    Element.modalEditProduct.show();


}