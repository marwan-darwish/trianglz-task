import { Component, OnInit } from '@angular/core';
import { FormControl} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponet implements OnInit {

  constructor() { }
  
  search = new FormControl('');

  ngOnInit(): void {

  }

 



}
