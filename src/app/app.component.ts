import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'cafe';
 constructor(private router: Router) {}

   ngOnInit(): void {    
    //HomeComponent
    //this.router.navigate(["home"]);
  }
  isHeaderVisible(): boolean {
    return this.router.url !== '/login';
  }
}
