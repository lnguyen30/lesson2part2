import * as Constant from '../model/constant.js'
import { Product } from '../model/product.js';
export async function signIn (email, password){
    await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut(){
    await firebase.auth().signOut();
}

//imports cloud function from to client side
const cf_addProduct = firebase.functions().httpsCallable('cf_addProduct')
export async function addProduct(product){
    await cf_addProduct(product);

}

//upload image to firestore
export async function uploadImage(imageFile, imageName){
    //if image name does not exist, then assign one to imageName
    if(!imageName)
        imageName = Date.now() + imageFile.name;
    
    const ref = firebase.storage().ref()
                        .child(Constant.storageFolderNames.PRODUCT_IMAGES + imageName);//where the image will be stored

    const taskSnapShot = await ref.put(imageFile); //uploads file with the path name
    const imageURL = await taskSnapShot.ref.getDownloadURL(); // gets url of uploaded image 
    return {imageName, imageURL};
}
//calls cloud function to retrieve products
const cf_getProductList = firebase.functions().httpsCallable('cf_getProductList')
export async function getProductList(){
    const products = []; // array of products
    const result = await cf_getProductList(); //result.data
    //iterates through result array and creates new product object then pushes new object into array
    result.data.forEach(data => {
        const p = new Product(data)
        p.docId = data.docId;
        products.push(p)
    });
    //returns array of products
    return products;
}

//calls cloud function to retrieve product by id
const cf_getProductById = firebase.functions().httpsCallable('cf_getProductById')
export async function getProductById(docId){
    const result = await cf_getProductById(docId);
    //if data exists, create product object
    if(result.data){
        const product = new Product(result.data);
        product.docId = result.data.docId;
        return product;
    }else{
        return null;
    }
}

//calls updateProduct to update the product
const cf_updateProduct = firebase.functions().httpsCallable('cf_updateProduct');
export async function updateProduct(product){
    const docId = product.docId;
    //passes in updated values
    const data = product.serializeForUpdate();
    //cloud function
    await cf_updateProduct({docId, data});
}

//calls deleteProduct to delete product
//delete the product first, then image; else, the ref to image will be lost if deleted first
const cf_deleteProduct = firebase.functions().httpsCallable('cf_deleteProduct');
export async function deleteProduct(docId, imageName){
    await cf_deleteProduct(docId);
    //passes the image name to firestore to delete
    const ref = firebase.storage().ref()
                .child(Constant.storageFolderNames.PRODUCT_IMAGES + imageName)
    await ref.delete();
}

//calls getUserList to retrieve users
const cf_getUserList = firebase.functions().httpsCallable('cf_getUserList')
export async function getUserList(){
    const result = await cf_getUserList();
    return result.data;
}

//calls updateUser to updateUser in index.js which updates firestore
const cf_updateUser = firebase.functions().httpsCallable('cf_updateUser')
export async function updateUser(uid, update){
    await cf_updateUser({uid, update});
}

const cf_deleteUser = firebase.functions().httpsCallable('cf_deleteUser')
export async function deleteUser(uid){
    await cf_deleteUser(uid);
}