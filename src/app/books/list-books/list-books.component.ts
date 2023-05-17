import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/interfaces/book.model';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/shared/pop ups/confirmation-modal/confirmation-modal.component';
import { ModalService } from 'src/app/services/modal.service';
import { confirmationModal } from 'src/app/interfaces/confirmation.modal';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: []
})
export class ListBooksComponent implements OnInit {

  constructor(private http:HttpClient,private bookService:BookService,public dialog: MatDialog,private modalService:ModalService,private storage:AngularFireStorage ) { }
  
  books:Book[]=[];
  filteredBook:Book[]=[];
  bookNotFound:boolean=false;
  paginationOptions:{ itemsPerPage:number, currentPage: number,totalItems:number }={
    itemsPerPage:3,currentPage:1,totalItems:0
  }

  searchPaginationOptions:{itemsPerPage:number, currentPage: number,totalItems:number }={
    itemsPerPage:3,currentPage:1,totalItems:0
  }

  loadingSpinner:boolean=false;
  Icons:IconDefinition[]=[faEye,faPen,faTrash];

  searchValue:FormControl=new FormControl('');

  ngOnInit(): void {
      this.getAllBooks();
  const sub1= this.searchValue.valueChanges.subscribe((res)=>{
        if(!res){
            this.filteredBook=[];
            this.loadingSpinner=false;
            this.bookNotFound=false;
            this.searchPaginationOptions.totalItems=0;
        }
      })
  } 

  getAllBooks(){
    this.books=[];
    this.bookService.getAllBooks().pipe(map((res) => {
      this.books=this.mapData(res);
    })).subscribe((res)=>{
        console.log(res);
        
    })
  }


  searchBook(){
    this.loadingSpinner=true;
    this.filteredBook=[];
    this.bookNotFound=false;
    this.searchPaginationOptions.totalItems=0;
    this.bookService.searchBooks('title',this.searchValue.value).pipe(map((res) => {
      const data= this.mapData(res).filter((obj)=>{
        return obj.title===this.searchValue.value||obj.title.includes(this.searchValue.value)
      })
      console.log(data);
      this.filteredBook.push(...data)

      this.searchPaginationOptions.totalItems=this.filteredBook.length      
    }),).subscribe(({
      complete:()=>{
        if(!this.filteredBook.length){
          this.bookService.searchBooks('author',this.searchValue.value).pipe(map((res) => {
            const data= this.mapData(res).filter((obj)=>{
              return obj.author===this.searchValue.value
            })
            
            this.filteredBook.push(...data)
  
          })).subscribe({
            complete:()=>{
              this.searchPaginationOptions.totalItems=this.filteredBook.length
              this.loadingSpinner=false;
      
              if(!this.filteredBook.length){
                this.bookNotFound=true;
              }
            }
          })

        }else{
          this.searchPaginationOptions.totalItems=this.filteredBook.length
          this.loadingSpinner=false;
        }
      }
    }))





  }

  openConfirmDelete(id:string | undefined,photoRef:string){
      const bookID=id;
      const ModalData: confirmationModal = {
        title: {
          value: 'Delete Book',
          class: 'text-gray-900 font-bold',
        },
        subtitle: {
          value: 'Are you sure you want to delete this book?',
          class: '',
        },
        actions: [
          {
            value: 'cancel',
            class: 'border-solid border font-bold text-black p-3',
            onClickFn: () => {
              this.dialog.closeAll();

            },
          },
          {
            value: 'Delete',
            class: 'bg-red-700 text-white p-3',
            onClickFn: () => {
                this.modalService.loadingSpinner.next(true);
                if(bookID){
                  this.bookService.deleteBookByID(bookID).subscribe((res)=>{
                      this.modalService.loadingSpinner.next(false);
                      const storageRef= this.storage.ref(photoRef);
                       storageRef.delete().subscribe()                      
                      this.dialog.closeAll();
                    
                    this.getAllBooks()
                    if(this.paginationOptions.currentPage!==1){
                      this.paginationOptions.currentPage--

                    }
                  })
                }
            },
          },
        ],
      };

        this.dialog.open(ConfirmationModalComponent,{
          data: ModalData,
          panelClass: 'confirmationModal',
        })

     

  }

  onPageChange(e:number){
    this.paginationOptions.currentPage=e;
  }
  
  resetFilter(){
    this.bookNotFound=false;
    this.loadingSpinner=false;
    this.filteredBook=[];
    this.searchPaginationOptions.totalItems=0;
  }

  mapData(res:any){
    const data:any[]=[];
    
    if(res){
      const keys=Object.keys(res);
      const values= Object.values(res);
      values.forEach((ele:any,index)=>{
        data.push({
          id:keys[index],
          ...ele
        })
      })
      
    }

    return  data
  }
}
