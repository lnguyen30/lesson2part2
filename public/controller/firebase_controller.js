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

