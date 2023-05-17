import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import{ BehaviorSubject,Observable,from,of } from 'rxjs' 
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  APIKEY:string=environment.AcoreAPIKEY;
  // expirationTimeOut!:NodeJS.Timeout;
  isLoggedIn:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  loggedInCopy=this.isLoggedIn.asObservable()
  loginSpinner:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  constructor(private http:HttpClient,private storageService:StorageService,private router:Router, private auth:AngularFireAuth) { }

  // login(email:string,password:string):Observable<any>{
  //  return from( this.auth.signInWithEmailAndPassword(email,password).subscribe({
  //     next:(res:any)=>{
  //       const admin=res;

  //       admin['expirationDate']=this.setExpirationDate(res['expiresIn']);
  //       this.storageService.setKey('admin',admin);
  //       this.isLoggedIn.next(true);
  //       this.router.navigate(['/dashboard/books']);
  //       const now = new Date();
  //       this.autoLogout(now,admin['expirationDate']);
  //       this.loginSpinner.next(false)
  //     },
  //     error:(err:any)=>{
  //       console.log(err)
  //       this.loginSpinner.next(false);
  //       this._snackBar.open(err.error.error.message,'',{
  //         panelClass:'loginFailed',
  //         horizontalPosition:'right',
  //         verticalPosition:'top',
  //         duration:2000
        
  //       })
  //     }
  //   }))
  // }
  changeloginstatus(val:boolean){
    this.isLoggedIn.next(val)
  }
signIn(params:SignInType):Observable<any>{
return from( this.auth.signInWithEmailAndPassword(
  params.email,
  params.password
))
}
  // setExpirationDate(expiresIn:string){
  //   const expirationDate= new Date(new Date().getTime() + +expiresIn*1000); 

  //   return expirationDate
  // }

  logout(){
    this.storageService.removeKey('admin');
    this.isLoggedIn.next(false);
    this.router.navigate(['/login']);
    // clearTimeout(this.expirationTimeOut);
  }

  autoLogin(){
      if(this.storageService.getKey('admin')){
        const expirationDate=new Date(this.storageService.getKey('admin')['expirationDate']);
        const now = new Date();
        if(!((now >= new Date(expirationDate)))){
            this.isLoggedIn.next(true);   
        }}
  }

  // autoLogout(now:Date,expirationDate:Date){
  //   const timeOut=setTimeout(()=>{
      
  //     this.logout();

  //     // or refresh token 

  //     // this.refreshToken();
  //   },
  //   (expirationDate.getTime() - now.getTime()))
  //   this.expirationTimeOut=timeOut; 
  // }

  // refreshToken(){
  //   let refreshToken:string;
  //   if(this.storageService.getKey('admin')['refresh_token']){
  //     refreshToken=this.storageService.getKey('admin')['refresh_token'];
  //   }else{
  //     refreshToken=this.storageService.getKey('admin')['refreshToken'];
  //   }
  //   this.http.post('https://securetoken.googleapis.com/v1/token',{
  //     grant_type:"refresh_token",
  //     refresh_token:refreshToken
  //   },{
  //     params:{
  //       key:this.APIKEY
  //     }
  //   }).subscribe({
  //     next:(res:any)=>{
  //         const admin=res;
  //         admin['expirationDate']=this.setExpirationDate(res['expiresIn']);
  //         this.storageService.setKey('admin',admin);
  //         this.isLoggedIn.next(true);
  //         const now = new Date();
  //         this.autoLogout(now,admin['expirationDate']);    
  //     }
  //   })
  // }


}
type SignInType={
  email:string,
  password:string
}