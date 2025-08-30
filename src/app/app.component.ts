import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'cafe';
 constructor(private router: Router,public progress: NgxSpinnerService) {}

   ngOnInit(): void {    
    //HomeComponent
    //this.router.navigate(["home"]);
    this.showLoading();
      setTimeout(() => {
    this.progress.hide();
  }, 3000); // hide after 3 seconds or when data is loaded
  }
  showLoading() {
  this.progress.show();
  setTimeout(() => this.progress.hide(), 3000);
}

  isHeaderVisible(): boolean {
    return this.router.url !== '/login';
  }
}
