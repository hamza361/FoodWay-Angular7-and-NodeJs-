import { Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Service} from '../../service/service.module';
import { Product } from '../../model/Product.model';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit {
  categories: string []= ["exclusive-discounted-deals","pizza","snacks"];
  public ProductForm:FormGroup;
  imagePreview:string;
  edit_mode:boolean = false;
  _id:string;
  category:string;
  product:Product;
  old_image_path;
  constructor(private service:Service,private router:Router,private route:ActivatedRoute) { }

  ngOnInit() {

    
    
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
        if(paramMap.has('_id')){
          this.edit_mode=true;
          this._id = paramMap.get('_id');  
          this.category = paramMap.get('category');
          this.service.getProduct({_id:this._id,category:this.category});
          
        }else{
        
          this.createForm();
        }
    })
    this.service.product_fetched.subscribe((product:Product)=>{
      console.log(product.name+product._id+product.category,product.description,product.price+product.imagePath)
      this.product = product;
      this.createForm();
    })
    this.service.prevent_reset.subscribe((data:{name:string,price:string,description:string,category:string})=>{
      if(this._id){
        this.edit_mode = true;
      }
      this.ProductForm.patchValue({
        name:data.name,
        price:+data.price,
        description:data.description,
        category:data.category
      })
    })
   
    
  }

  createForm(){
    var name = null;
    var imagePath = null;
    var price = null;
    var description  =null;
    var category = null;

    if(this.edit_mode){
      name = this.product.name;
      price = this.product.price;
      description = this.product.description;
      category = this.product.category;
      imagePath = this.product.imagePath;
      this.old_image_path = this.product.imagePath;
      
    }
    this.ProductForm = new FormGroup({
      'name': new FormControl(name,Validators.required),
      'imagePath':new FormControl(imagePath,Validators.required),
      'price': new FormControl(price,[Validators.required,Validators.min(1)]),
      'description': new FormControl(description,[Validators.required,Validators.minLength(3)]),
      "category": new FormControl(category,Validators.required)


    })
  }
  onSubmit(){
    const name = this.ProductForm.value.name;
    const imagePath = this.ProductForm.value.imagePath;
    const price = this.ProductForm.value.price;
    const description = this.ProductForm.value.description;
    const category = this.ProductForm.value.category;
    var _id = '';
    if(this.edit_mode){
        _id = this._id;
    }
    const product = new Product(_id,name,imagePath,price,description,category);
    if(!this.edit_mode){
      this.service.addProducts({product:product,category:category});
    }else{
      
      this.service.editProduct({product:product,old:this.old_image_path});
    }
   this.edit_mode = false;
    this.resetForm();
  }

  onImagePicked(event){
    const file = (event.target as HTMLInputElement).files[0];
    this.ProductForm.patchValue({
      imagePath:file
    });
    this.ProductForm.get('imagePath').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = ()=>{
      this.imagePreview = reader.result as string;
    
      
    }
    reader.readAsDataURL(file);
  }

  resetForm(){
    this.imagePreview='';
    this.ProductForm.reset();
  }

  onCancel(){
    this.router.navigate(['/deals/exclusive-discounted-deals']);
  }




}
