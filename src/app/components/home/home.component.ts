import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private toastr: ToastrService) { }

    // products = [
    //   { menuID: 0,type:'hot', code: 'HT000', description: 'Brew', rate: 100, qty: 0, image: 'assets/images/aa1.jpg' },
    //   { menuID: 0,type:'hot', code: 'HT000', description: 'Brew', rate: 100, qty: 0, image: 'assets/images/hm-ht-1.jpg' },
    //   { menuID: 0,type:'cold', code: 'HT000', description: 'Coffee', rate: 100, qty: 0, image: 'assets/images/hm-cd-1.jpg' },
    //   { menuID: 0,type:'cold', code: 'HT000', description: 'Shakes', rate: 100, qty: 0, image: 'assets/images/hm-cd-2.jpg' },
    //   { menuID: 1,type:'hot', code: 'HT001', description: 'Americano', rate: 100, qty: 0, image: 'assets/images/americano.jpg' },
    //   { menuID: 2,type:'hot', code: 'HT002', description: 'Cappuccino', rate: 150, qty: 0, image: 'assets/images/cappuccino.jpg' },
    //   { menuID: 3,type:'hot', code: 'HT003', description: 'Macchiato', rate: 180, qty: 0, image: 'assets/images/macchiato.jpg' },
    //   { menuID: 1,type:'cold', code: 'CD001', description: 'Chocolate Shake', rate: 170, qty: 0, image: 'assets/images/chocolate-shake.jpg' },
    //   { menuID: 2,type:'cold', code: 'CD002', description: 'American Mudpie Shake', rate: 220, qty: 0, image: 'assets/images/mudpie2.jpg' },
    //   { menuID: 3,type:'cold', code: 'CD003', description: 'Hazelnut Brownie Shake', rate: 280, qty: 0, image: 'assets/images/hazelnut.jpg' },
    //   { menuID: 1,type:'dessert', code: 'DS001', description: 'Vanilla', rate: 70, qty: 0, image: 'assets/images/vanilla-dsrt.webp' },
    //   { menuID: 2,type:'dessert', code: 'DS002', description: 'Vanilla with Strawberry', rate: 100, qty: 0, image: 'assets/images/strawberry-dsrt.jpg' },
    //   { menuID: 3,type:'dessert', code: 'DS003', description: 'Hot Fudge', rate: 100, qty: 0, image: 'assets/images/hot-fudge-dsrt.webp' },
    //   { menuID: 6,type:'dessert', code: 'DS006', description: 'Vanilla with Oreo', rate: 130, qty: 0, image: 'assets/images/vanillaWithOreo-dsrt.avif' },
    //   { menuID: 4,type:'dessert', code: 'DS004', description: 'Hot Fudge Brownie', rate: 150, qty: 0, image: 'assets/images/hotFudgeBrownie-dsrt.jpg' },
    //   { menuID: 5,type:'dessert', code: 'DS005', description: 'Black Forest', rate: 180, qty: 0, image: 'assets/images/blackForest-dsrt.png' },
    // ];

    products = [
    { menuID: 0, type: 'hot', code: 'HT000', description: 'Brew Your Coffee.', rate: 100, qty: 0, image: 'assets/images/aa1.jpg', 
    details1: 'Freshly brewed coffee to kickstart your day, Our handcrafted coffee is made from freshly roasted premium Arabica beans...', 
    details2 : ' Brewed with precision, blended with care — perfect for your morning spark.', 
    details3 : 'Loved by true coffee lovers !!' },
  { menuID: 0, type: 'cold', code: 'HT000', description: 'Iced Coffee Bliss.', rate: 100, qty: 0, image: 'assets/images/hm-cd-1.jpg', 
    details1: 'Chilled coffee, smooth and refreshing, crafted to keep you cool and energized...', 
    details2 : 'A delightful balance of bold coffee and icy freshness.', 
    details3 : 'Perfect for warm afternoons or post-meal refreshment !!' },
  { menuID: 0, type: 'cold', code: 'HT000', description: 'Delicious cold shakes for sweet cravings.', rate: 100, qty: 0, image: 'assets/images/hm-cd-2.jpg', 
    details1: 'Our milkshakes are a blend of velvety milk, real fruit, and creamy ice cream...', 
    details2 : 'No artificial flavors — only wholesome ingredients...', 
    details3 : 'Rich, thick, and a treat for sweet cravings !!' },
  { menuID: 0, type: 'veg', code: 'VBG001', description: 'Salad Wrap.', rate: 100, qty: 0, image: 'assets/images/veg-salad-wrap.jpg', 
    details1: 'A wholesome wrap filled with crisp veggies and fresh greens...', 
    details2 : 'Served with light dressing for a perfect healthy snack.', 
    details3 : 'Low-calorie, high on taste, and super refreshing !!' },
  { menuID: 0, type: 'non-veg', code: 'NVBG001', description: 'Chicken Wrap', rate: 100, qty: 0, image: 'assets/images/nveg-chicken-wrap.jpg', 
    details1: 'Juicy chicken wrapped with crunchy veggies and tangy sauces...', 
    details2 : 'A protein-packed delight for meat lovers.', 
    details3 : 'Ideal for a filling meal on the go !!' }
];

  currentIndex = 0;
  interval: any;
  ngOnInit(): void {
    this.interval = setInterval(() => this.nextSlide(), 5000); // auto-scroll
  }

    nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.products.length;
  }

  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.products.length) % this.products.length;
  }

  getTransform() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  onClickOrderNow(isFrom:any=""){
    if(isFrom == "hot"){
      let passQueryParam = { isFromHome: "hot" };
      sessionStorage.setItem("queryParams_home", JSON.stringify(passQueryParam));
      this.router.navigate(["order"]);
    }
    else if(isFrom == "cold"){
      let passQueryParam = { isFromHome: "cold" };
      sessionStorage.setItem("queryParams_home", JSON.stringify(passQueryParam));
      this.router.navigate(["order"]);
    }
    else if(isFrom == "dessert"){
      let passQueryParam = { isFromHome: "dessert" };
      sessionStorage.setItem("queryParams_home", JSON.stringify(passQueryParam));
      this.router.navigate(["order"]);
    }
    else if(isFrom == "breakfast"){
      let passQueryParam = { isFromHome: "breakfast" };
      sessionStorage.setItem("queryParams_home", JSON.stringify(passQueryParam));
      this.router.navigate(["order"]);
    }
    else if(isFrom == "burger"){
      let passQueryParam = { isFromHome: "burger" };
      sessionStorage.setItem("queryParams_home", JSON.stringify(passQueryParam));
      this.router.navigate(["order"]);
    }
  }

}
