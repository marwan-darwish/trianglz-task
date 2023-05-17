import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor (private authService:AuthService,private router:Router,private http:HttpClient){

  }
  ngOnInit(): void {
   this.authService.autoLogin();
    this.authService.isLoggedIn.subscribe((res)=>{
      if(res){
        this.router.navigate(['/dashboard']);
      }
    })
  }




}
