
export class Product{
    _id:string;
    name:string;
    imagePath:string;
    price:number;
    description:string;
    category:string;
    constructor(_id:string,name:string , imagePath:string , price:number ,description:string,category:string){
        this._id  =_id;
        this.name = name;
        this.imagePath = imagePath;
        this.price = price;
        this.description = description;
        this.category = category;


    }
}   