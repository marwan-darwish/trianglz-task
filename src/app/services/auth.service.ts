import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { firebaseSettings } from 'src/firebaseSettings/firebaseSettings';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import{ BehaviorSubject,Observable,from,of } from 'rxjs' 
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  APIKEY:string=firebaseSettings.AcoreAPIKEY;
  isLoggedIn:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  loggedInCopy=this.isLoggedIn.asObservable()
  loginSpinner:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient,private storageService:StorageService,private router:Router, private auth:AngularFireAuth) { }


  changeloginstatus(val:boolean){
    this.isLoggedIn.next(val)
  }
signIn(params:SignInType):Observable<any>{
return from( this.auth.signInWithEmailAndPassword(
  params.email,
  params.password
))
}
 

  logout(){
    this.storageService.removeKey('admin');
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  autoLogin(){
      if(this.storageService.getKey('admin')){
        const expirationDate=new Date(this.storageService.getKey('admin')['expirationDate']);
        const now = new Date();
        if(!((now >= new Date(expirationDate)))){
            this.isLoggedIn.next(true);   
        }}
  }
}
type SignInType={
  email:string,
  password:string
}