const functions = require("firebase-functions");


const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//imports js file
const Constant = require('./constant.js')

//cf_addProduct will reference addProduct, client will call on cf_addProduct 
exports.cf_addProduct = functions.https.onCall(addProduct);
exports.cf_getProductList = functions.https.onCall(getProductList);

//returns true or false if the email passed in is an admin account
function isAdmin(email){
    return Constant.adminEmails.includes(email);
}

//returns entire list of products
async function getProductList(data, context){
    
    //displays error message if function is invoked by non-admin
    if(!isAdmin(context.auth.token.email)){
        if(Constant.DEV) console.log('not admin', context.auth.token.email);
        throw new functions.https.HttpsError('unauthenticated', 'Only admins may invoke this function');
    }

    try{
        let products = [];
        const snapShot = await admin.firestore().collection(Constant.collectionNames.PRODUCT)
                            .orderBy('name')
                            .get();
        snapShot.forEach( doc=>{
            //destructuring assignment from doc data
            const {name, price, summary, imageName, imageURL} = doc.data();
            // creates product object from doc data
            const p = {name, price, summary, imageName, imageURL};
            p.docId = doc.id; 
            products.push(p);
        });
        //return array of products from getproducts functions
        return products;
    }catch (e){
        if(Constant.DEV) console.log(e);
        throw new functions.https.HttpsError('internal', 'addProduct Failed');
    }
}

//context is implicitly provided, gives context on who is calling function
async function addProduct(data, context){

    //displays error message if function is invoked by non-admin
    if(!isAdmin(context.auth.token.email)){
        if(Constant.DEV) console.log('not admin', context.auth.token.email);
        throw new functions.https.HttpsError('unauthenticated', 'Only admins may invoke this function');
    }


    // data: serialized product object
    try{
        await admin.firestore().collection(Constant.collectionNames.PRODUCT)
                    .add(data);
    }catch (e){
        if(Constant.DEV) console.log(e);
        throw new functions.https.HttpsError('internal', 'addProduct Failed');
    }
    
}



