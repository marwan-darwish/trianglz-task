import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { Book } from '../interfaces/book.model';
@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor(private http:HttpClient,private storageService:StorageService) {

   }

  addBook(book:Book){
    return  this.http.post("https://books-7dee0-default-rtdb.firebaseio.com/books.json",book,{
      params:{
        auth:this.storageService.getKey('admin')['idToken']
      }
    })
  }

  editBook(id:string,book:Book){

    return  this.http.put('https://books-7dee0-default-rtdb.firebaseio.com/books/'+id+'.json',book,{
      params:{
        auth:this.storageService.getKey('admin')['idToken']
      }
    })
  }

  getBookByID(id:string){
    return  this.http.get('https://books-7dee0-default-rtdb.firebaseio.com/books/'+id+'.json',{
      params:{
        auth:this.storageService.getKey('admin')['idToken']
      }
    })
  }

  deleteBookByID(id:string){
    return  this.http.delete('https://books-7dee0-default-rtdb.firebaseio.com/books/'+id+'.json',{
      params:{
        auth:this.storageService.getKey('admin')['idToken']
      }
    })
  }

  getAllBooks(){
    return  this.http.get("https://books-7dee0-default-rtdb.firebaseio.com/books.json",{
      params:{
        auth:this.storageService.getKey('admin')['idToken']
      }
    })
  }

  searchBooks(key:string,value:string){
    return  this.http.get("https://books-7dee0-default-rtdb.firebaseio.com/books.json",{
      params:{
        auth:this.storageService.getKey('admin')['idToken'],
      }
    })
  }


}
