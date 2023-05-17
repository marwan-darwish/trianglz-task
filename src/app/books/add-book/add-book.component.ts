import { Component, Input, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import { BookService } from 'src/app/services/book.service';
import { UploadFileService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {
  coverImage:string='';
  photoIsRequired:boolean=false;
notificationforSuccessfulUpload:boolean=false
  bookID:string='';
  fileRef:string='';
  startCategoryData:string[]=[];

  @Input()headerTitle:string='Add Book';
  @Input()edit:boolean=false;

  Icons:IconDefinition[]=[faBookmark]
  booksVersions:string[]=[
    'V1.2',
    'V2.4',
    'V3.4',
    'V5.6'
  ]

  constructor( private uploadFile:UploadFileService,private bookService:BookService,private router:Router,private activeRoute:ActivatedRoute) { }
 
  
  BookForm= new FormGroup({
    'title':new FormControl('',[Validators.required]),
    'author':new FormControl('',[Validators.required]),
    'category':new FormControl([],[Validators.required]),
    'price':new FormControl('',[Validators.required,Validators.pattern(/^[0-9]+$/),Validators.maxLength(3)]),
    'version':new FormControl('',[Validators.required]),
    'ISBN':new FormControl('',[Validators.required,Validators.pattern(/^[\d-]{10,13}$/)]),
    'photo':new FormControl('',Validators.required),
    'brief':new FormControl('',[Validators.required,Validators.maxLength(800)]),
    'olderVersions':new FormControl([]),
    'releaseDate':new FormControl(''),
    'edition':new FormControl('')
  })

  categories:string[]=[
    'Action and Adventure',
    'Classics',
    'Comic Book or Graphic Novel',
    'Detective and Mystery',
    'Fantasy',
    'Historical Fiction',
    'Horror',
    'Literary Fiction',
 ]

  ngOnInit(): void {
    const ID=this.activeRoute.snapshot.params['id'] 
    if(this.activeRoute.snapshot.params['id']){
        this.edit=true;
        this.bookID=ID;
        this.getBookdetails();
    }

  }

  onUploadFile(e:any){
    this.uploadFile.uploadFile(e.target.files[0]).then((res)=>{
        this.coverImage=res.downloadUrl;
        this.fileRef=res.filePath;
        this.BookForm.controls['photo'].setValue(this.coverImage);
        this.notificationforSuccessfulUpload=true

        setTimeout(() => {
          this.notificationforSuccessfulUpload=false

        }, 2000);
    }).catch((err)=>{
console.log(err);

    })
    
  }

  createBook(){
    if(this.BookForm.controls['photo'].invalid){
      this.photoIsRequired=true;
    }

    if(this.BookForm.valid){
      // define add or edit 
      let  formValue:{[key:string]:any}={...this.BookForm.value};
      formValue={
        'photoRef':this.fileRef,
        ...formValue
      }
      if(this.edit){
          this.editBook(formValue)
     
      }else{
          this.addBook(formValue)
      }

    }
  }
  
  browsefile(ele:HTMLElement){
    ele.click();
  }


  storeCategory(e:any){
    this.BookForm.controls['category'].setValue(e)   
  }

  getBookdetails(){
    this.bookService.getBookByID(this.bookID).subscribe((res:any)=>{
      const keys= Object.keys(res);
      const controls = this.BookForm.controls as any
      keys.forEach((ele:any)=>{
        if(ele==='photoRef'){
          this.fileRef=res[ele];
        }
        if(ele==='category'){
          this.startCategoryData=res[ele]
        }
         controls[ele]?.setValue(res[ele]);
      })
      console.log(this.BookForm.value)
    })  
  }

  editBook(formValue:{[key:string]:any}){
    this.bookService.editBook(this.bookID,formValue as any).subscribe((res)=>{
  
      this.router.navigate(['/dashboard/books',this.bookID]);
   })
  }

  addBook(formValue:{[key:string]:any}){
    this.bookService.addBook(formValue as any).subscribe((res)=>{
      console.log(res);
      
      this.router.navigate(['/dashboard/books']);
    })
  }
  
}
