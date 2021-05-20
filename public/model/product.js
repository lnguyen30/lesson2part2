export class Product{
    constructor(data){
        this.name = data.name.toLowerCase().trim();
        //checks if price is numeric or not; else converts it to number type
        this.price = typeof data.price == 'number' ? data.price : Number(data.price);
        this.summary = data.summary.trim();
        this.imageName = data.imageName;
        this.imageURL = data.imageURL;
    }

    serialize(){
        return{
            name: this.name,
            price: this.price,
            summary: this.summary,
            imageName: this.imageName,
            imageURL: this.imageURL,
        }
    }

    validate(imageFile){
        const errors = {};
        // if products name does not exist or is < 2
        if(!this.name || this.name.length < 2)
            errors.name = 'Product name too short; min 3 chars';
        if(!this.price || !Number(this.price))
            errors.price = 'Price is not a number';
        if(!this.summary || this.summary < 5)
            errors.summary = 'Product summary too short; min 5 chars';
        if(!imageFile)
            errors.image = 'Image not selected';
        // returns list of errors
        return errors;
    }
}