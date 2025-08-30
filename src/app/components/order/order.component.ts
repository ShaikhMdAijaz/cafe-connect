import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HttpRequestService } from 'src/app/common-services/http-request.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  private subscription!: Subscription;
  constructor(private toastr: ToastrService, private cartService: CartService,
    private router: Router, private httpService: HttpRequestService, public progress: NgxSpinnerService) { }

  queryParamUserDetails: any;
  _queryParamsUserDetails: any;
  queryParam: any;
  _queryParams: any;
  public userDetails: any;
  ngOnInit(): void {
    if (this.queryParamUserDetails == null) {
      this._queryParamsUserDetails = (sessionStorage.getItem("queryParams_userDetails") || '{}');
      this.queryParamUserDetails = JSON.parse(this._queryParamsUserDetails);
      if (this.queryParamUserDetails != null && this.queryParamUserDetails != undefined && this.queryParamUserDetails.userDetails != null && this.queryParamUserDetails.userDetails != undefined) {
        this.userDetails = this.queryParamUserDetails.userDetails;
        console.log("userDetails:-", this.userDetails);
        //sessionStorage.clear();
      }
    }
    this.subscription = this.cartService.isRefresh$.subscribe(() => {
      this.getCartDetails();
    });
    this.getMenuDetails();
    //this.getCartDetails();
    this.selectedBeverage = "hot";
    this.filteredMenuItems = this.allMenu;
    this.filterByCategory('All');
    this.isBreakfastFlag = false;
    this.isBreakfastFlag = this.isBreakfastTime();
    // if (this.queryParam == null) {
    //   this._queryParams = (sessionStorage.getItem("queryParams_home") || '{}');
    //   this.queryParam = JSON.parse(this._queryParams);
    //   if (this.queryParam != null && this.queryParam != undefined && this.queryParam.isFromHome != null && this.queryParam.isFromHome != undefined) {
    //     if (this.queryParam.isFromHome == "hot") {
    //       this.selectedBeverage = this.queryParam.isFromHome;
    //       this.filterByCategory('Hot Beverages');
    //       //this.currentMenu();
    //     }
    //     else if (this.queryParam.isFromHome == "cold") {
    //       this.selectedBeverage = this.queryParam.isFromHome;
    //       this.filterByCategory('Cold Beverages');
    //       //this.currentMenu();
    //     }
    //     else if (this.queryParam.isFromHome == "dessert") {
    //       this.selectedBeverage = this.queryParam.isFromHome;
    //       this.filterByCategory('Dessert');
    //       //this.currentMenu();
    //     }
    //     else if (this.queryParam.isFromHome == "breakfast") {
    //       this.selectedBeverage = this.queryParam.isFromHome;
    //       this.filterByCategory('Breakfast');
    //     }
    //     else if (this.queryParam.isFromHome == "burger") {
    //       this.selectedBeverage = this.queryParam.isFromHome;
    //       this.filterByCategory('Burger');
    //     }
    //     sessionStorage.clear();
    //   }
    //   // else{
    //   //   this.getMenuDetails();
    //   // }
    //   // else if (this.queryParam != null && this.queryParam != undefined && this.queryParam.userDetails != null && this.queryParam.userDetails != undefined) {
    //   //   this.customerName = this.queryParam.userDetails.userName;
    //   //   this.customerMobile = this.queryParam.userDetails.userMobileNo;
    //   // }
    // }
    //this.getMenuDetails();
  }

  public menuList: any = [];
  getMenuDetails() {
    this.progress.show();
    this.httpService.request('get', 'menu').subscribe((data) => {
      this.menuList = data;
      // this.menuList.forEach(x => {
      //   x.menuID = x.ID;
      // });
      this.hotMenu = this.menuList.data.filter(x => x.type == 'hot');
      this.coldMenu = this.menuList.data.filter(x => x.type == 'cold');
      this.dessertMenu = this.menuList.data.filter(x => x.type == 'dessert');
      this.breakfastMenu = this.menuList.data.filter(x => x.type == 'breakfast');
      this.burgerMenu = this.menuList.data.filter(x => x.type == 'burger');
      this.toppingMenu = this.menuList.data.filter(x => x.type == 'topping');
      this.allMenu = [
        ...this.burgerMenu,
        ...this.hotMenu,
        ...this.coldMenu,
        ...this.dessertMenu,
        ...this.breakfastMenu,
        ...this.toppingMenu,
      ];
      this.categories = [
        { name: 'All', count: this.breakfastMenu.length + this.burgerMenu.length + this.hotMenu.length + this.coldMenu.length + this.dessertMenu.length },
        { name: 'Breakfast', count: this.breakfastMenu.length },
        { name: 'Burger', count: this.burgerMenu.length },
        { name: 'Hot Beverages', count: this.hotMenu.length },
        { name: 'Cold Beverages', count: this.coldMenu.length },
        { name: 'Dessert', count: this.dessertMenu.length },
        { name: 'Topping', count: this.toppingMenu.length },
      ];
      this.filterByCategory('All');

      if (this.queryParam == null) {
        this._queryParams = (sessionStorage.getItem("queryParams_home") || '{}');
        this.queryParam = JSON.parse(this._queryParams);
        if (this.queryParam != null && this.queryParam != undefined && this.queryParam.isFromHome != null && this.queryParam.isFromHome != undefined) {
          if (this.queryParam.isFromHome == "hot") {
            this.selectedBeverage = this.queryParam.isFromHome;
            this.filterByCategory('Hot Beverages');
            //this.currentMenu();
          }
          else if (this.queryParam.isFromHome == "cold") {
            this.selectedBeverage = this.queryParam.isFromHome;
            this.filterByCategory('Cold Beverages');
            //this.currentMenu();
          }
          else if (this.queryParam.isFromHome == "dessert") {
            this.selectedBeverage = this.queryParam.isFromHome;
            this.filterByCategory('Dessert');
            //this.currentMenu();
          }
          else if (this.queryParam.isFromHome == "breakfast") {
            this.selectedBeverage = this.queryParam.isFromHome;
            this.filterByCategory('Breakfast');
          }
          else if (this.queryParam.isFromHome == "burger") {
            this.selectedBeverage = this.queryParam.isFromHome;
            this.filterByCategory('Burger');
          }
          sessionStorage.clear();
        }
      }
      this.progress.hide();
      console.log('allMenu:', this.allMenu);
      console.log('Menu fetched:', data);
    }, (error) => {
      console.error('Error:', error);
    });
  }

  public userCartDetails: any = [];
  getCartDetails() {
    this.progress.show();
    this.httpService.request('get', 'user/cart/' + this.userDetails?.userID).subscribe((data) => {
      this.userCartDetails = data.data;
      this.progress.hide();
      console.log('userCartDetails:', this.userCartDetails);
    }, (error) => {
      console.error('Error:', error);
    });
  }

  selectedBeverage: 'hot';
  selectedSize = 'S';
  userQty = 1;
  totalAmount = 0;
  userBill: Bill[] = [];
  userChoice = 0;
  showCart = false;
  hotMenu: MenuItem[] = []
  coldMenu: MenuItem[] = []
  dessertMenu: MenuItem[] = []
  breakfastMenu: MenuItem[] = []
  burgerMenu: MenuItem[] = []
  toppingMenu: MenuItem[] = []
  // hotMenu: MenuItem[] = [
  //   { menuID: 1, type: 'hot', subType: 'veg',code: 'HT001', description: 'Americano', rate: 100, qty: 0, image: 'assets/images/americano.jpg' },
  //   { menuID: 2, type: 'hot', subType: 'veg',code: 'HT002', description: 'Cappuccino', rate: 150, qty: 0, image: 'assets/images/cappuccino.jpg' },
  //   { menuID: 3, type: 'hot', subType: 'veg',code: 'HT003', description: 'Macchiato', rate: 160, qty: 0, image: 'assets/images/macchiato.jpg' },
  //   { menuID: 44, type: 'hot', subType: 'veg',code: 'HT004', description: 'Latte', rate: 180, qty: 0, image: 'assets/images/latte.jpg' },
  //   { menuID: 45, type: 'hot', subType: 'veg',code: 'HT005', description: 'Tea', rate: 70, qty: 0, image: 'assets/images/tea1.jpg' },
  //   { menuID: 46, type: 'hot', subType: 'veg',code: 'HT006', description: 'Black Tea', rate: 60, qty: 0, image: 'assets/images/black-tea.jpg' },
  //   { menuID: 47, type: 'hot', subType: 'veg',code: 'HT007', description: 'Lemon Tea', rate: 70, qty: 0, image: 'assets/images/lemon-tea.jpg' },
  //   { menuID: 48, type: 'hot', subType: 'veg',code: 'HT008', description: 'Espresso Shot', rate: 80, qty: 0, image: 'assets/images/espresso.webp' },
  // ];

  // coldMenu: MenuItem[] = [
  //   { menuID: 4, type: 'cold',subType: 'veg', code: 'CD001', description: 'Chocolate Shake', rate: 170, qty: 0, image: 'assets/images/chocolate-shake.jpg' },
  //   { menuID: 5, type: 'cold',subType: 'veg', code: 'CD002', description: 'American Mudpie Shake', rate: 220, qty: 0, image: 'assets/images/mudpie3.png' },
  //   { menuID: 6, type: 'cold',subType: 'veg', code: 'CD003', description: 'Hazelnut Brownie Shake', rate: 280, qty: 0, image: 'assets/images/hazelnut.jpg' },
  //   { menuID: 49, type: 'cold',subType: 'veg', code: 'CD004', description: 'Cold Coffee Frappe', rate: 200, qty: 0, image: 'assets/images/cold-coffee.jpg' },
  //   { menuID: 50, type: 'cold',subType: 'veg', code: 'CD005', description: 'Iced Coffee', rate: 180, qty: 0, image: 'assets/images/iced-coffee.avif' },
  // ];

  // dessertMenu: MenuItem[] = [
  //   { menuID: 7, type: 'dessert', subType: 'veg',code: 'DS001', description: 'Vanilla', rate: 70, qty: 0, image: 'assets/images/vanilla-dsrt_3_512x400.webp' },
  //   { menuID: 8, type: 'dessert', subType: 'veg',code: 'DS002', description: 'Vanilla with Strawberry', rate: 100, qty: 0, image: 'assets/images/strawberry-dsrt_3_312x200.jpg' },
  //   { menuID: 9, type: 'dessert', subType: 'veg',code: 'DS003', description: 'Hot Fudge', rate: 100, qty: 0, image: 'assets/images/hot-fudge1.webp' },
  //   { menuID: 10, type: 'dessert',subType: 'veg', code: 'DS006', description: 'Vanilla with Oreo', rate: 130, qty: 0, image: 'assets/images/vanillaWithOreo-dsrt.avif' },
  //   { menuID: 11, type: 'dessert',subType: 'veg', code: 'DS004', description: 'Hot Fudge Brownie', rate: 150, qty: 0, image: 'assets/images/hotFudgeBrownie-dsrt.jpg' },
  //   { menuID: 12, type: 'dessert',subType: 'veg', code: 'DS005', description: 'Black Forest', rate: 180, qty: 0, image: 'assets/images/blackForest-dsrt.png' },
  // ];

  // breakfastMenu: MenuItem[] = [
  //   { menuID: 13, type: 'breakfast',subType: 'veg', code: 'BF001', description: 'Waffle', rate: 60, qty: 0, image: 'assets/images/waffle-bf.jpg' },
  //   { menuID: 14, type: 'breakfast',subType: 'non-veg', code: 'BF002', description: 'Scrambled-Egg', rate: 70, qty: 0, image: 'assets/images/scrambled-egg-bf.jpg' },
  //   { menuID: 15, type: 'breakfast',subType: 'non-veg', code: 'BF003', description: 'Scrambled-Masala-Egg', rate: 90, qty: 0, image: 'assets/images/scrambled-masala-egg-bf.jpg.webp' },
  //   { menuID: 16, type: 'breakfast',subType: 'non-veg', code: 'BF004', description: 'Egg & Cheese', rate: 100, qty: 0, image: 'assets/images/egg&cheese-bf.jpg' },
  //   { menuID: 17, type: 'breakfast',subType: 'veg', code: 'BF005', description: 'Hashbrown', rate: 75, qty: 0, image: 'assets/images/hashbrown-bf.jpg' },
  //   { menuID: 18, type: 'breakfast',subType: 'veg', code: 'BF006', description: 'Grilled Sandwich', rate: 90, qty: 0, image: 'assets/images/grilled-sandwich-bf.jpg' },
  // ];

  // burgerMenu: MenuItem[] = [
  //   { menuID: 19, type: 'burger', subType: 'veg', code: 'VBG001', description: 'Veggie Burger', rate: 100, qty: 0, image: 'assets/images/veg-bg.webp' },
  //   { menuID: 20, type: 'burger', subType: 'veg', code: 'VBG002', description: 'Cheese & Corn Burger', rate: 120, qty: 0, image: 'assets/images/cheese-corn-bg.jpg' },
  //   { menuID: 21, type: 'burger', subType: 'veg', code: 'VBG003', description: 'Crispy Paneer Burger', rate: 150, qty: 0, image: 'assets/images/paneer-bg.png' },
  //   { menuID: 22, type: 'burger', subType: 'veg', code: 'VBG004', description: 'Veg Maharaja Loaded Burger', rate: 200, qty: 0, image: 'assets/images/maharaja-veg1.jpg' },
  //   { menuID: 23, type: 'burger', subType: 'veg', code: 'VBG005', description: 'Veg Cheese Burger With Fries', rate: 190, qty: 0, image: 'assets/images/veg-cheese-bg-fries.webp' },
  //   { menuID: 24, type: 'burger', subType: 'veg', code: 'FS001', description: 'Fries', rate: 100, qty: 0, image: 'assets/images/fries.jpg' },
  //   //{ menuID: 25, type: 'burger', code: 'FS002', description: 'Fries With Peri-Peri', rate: 120, qty: 0, image: 'assets/images/peri-peri-fries.jpg' },
  //   { menuID: 25, type: 'burger',subType : 'veg', code: 'FS002', description: 'Fries With Peri-Peri', rate: 120, qty: 0, image: 'assets/images/peri-peri-fries1.png' },
  //   { menuID: 26, type: 'burger',subType : 'veg', code: 'FS003', description: 'Cheese Fries', rate: 150, qty: 0, image: 'assets/images/cheese-fries.webp' },
  //   { menuID: 31, type: 'burger', subType: 'non-veg', code: 'NVBG005', description: 'Classic Chicken Burger', rate: 150, qty: 0, image: 'assets/images/chicken-bg.jpg' },
  //   // { menuID: 29, type: 'burger', subType: 'non-veg', code: 'NVBG003', description: 'Garlic Cheese Chicken Burger', rate: 170, qty: 0, image: 'assets/images/garlic-grilled-chicken-bg.jpg' },
  //   { menuID: 28, type: 'burger', subType: 'non-veg', code: 'NVBG002', description: 'Grilled Cheese Chicken Burger', rate: 170, qty: 0, image: 'assets/images/grilled-chicken-bg.webp' },
  //   { menuID: 30, type: 'burger', subType: 'non-veg', code: 'NVBG004', description: 'Spicy Chicken Burger', rate: 200, qty: 0, image: 'assets/images/spicy-chicken-bg.jpg' },
  //   { menuID: 27, type: 'burger', subType: 'non-veg', code: 'NVBG001', description: 'Zinger Chicken Lava Burger', rate: 220, qty: 0, image: 'assets/images/zinger-cheese-chicken-bg.png' },
  //   //{ menuID: 44, type: 'burger', subType: 'non-veg', code: 'NVBG007', description: 'Cream Barra Chicken Tandori', rate: 420, qty: 0, image: 'assets/images/cream-barra.jpg' },
  //   { menuID: 32, type: 'burger', subType: 'non-veg', code: 'NVBG006', description: 'Chicken Maharaja Loaded Burger', rate: 220, qty: 0, image: 'assets/images/maharaja-chicken-bg.jpg' },
  // ];

  // toppingMenu: MenuItem[] = [
  //   { menuID: 33, type: 'topping', subType: 'veg', code: 'TP001', description: 'Veg Mayo Dip', rate: 20, qty: 0, image: 'assets/images/veg-mayo_optimized.png' },
  //   { menuID: 34, type: 'topping', subType: 'veg', code: 'TP002', description: 'Habenaro Dip', rate: 20, qty: 0, image: 'assets/images/habenaro-mayo_optimized.png' },
  //   { menuID: 35, type: 'topping', subType: 'veg', code: 'TP003', description: 'Mustard Dip', rate: 20, qty: 0, image: 'assets/images/mustard-mayo.png' },
  //   { menuID: 36, type: 'topping', subType: 'veg', code: 'TP004', description: 'Cheese slice', rate: 25, qty: 0, image: 'assets/images/cheese-slice.jpg' },
  //   { menuID: 37, type: 'topping', subType: 'veg', code: 'TP005', description: 'Cheese Dip', rate: 25, qty: 0, image: 'assets/images/cheese-dip.webp' },
  //   { menuID: 38, type: 'topping', subType: 'veg', code: 'TP006', description: 'Caramel Shot', rate: 35, qty: 0, image: 'assets/images/caramel-shot.jpg' },
  //   { menuID: 39, type: 'topping', subType: 'veg', code: 'TP007', description: 'Chocolate Shot', rate: 35, qty: 0, image: 'assets/images/chocolate-shot.webp' },
  //   { menuID: 40, type: 'topping', subType: 'veg', code: 'TP008', description: 'Hazelnut Shot', rate: 35, qty: 0, image: 'assets/images/hazelnut-shot_optimized.webp' },
  //   { menuID: 41, type: 'topping', subType: 'veg', code: 'TP009', description: 'Extra Oreo Topping', rate: 25, qty: 0, image: 'assets/images/oreo-topping.jpg' },
  //   { menuID: 42, type: 'topping', subType: 'veg', code: 'TP010', description: 'Extra Strawberry Topping', rate: 25, qty: 0, image: 'assets/images/strawberry-topping_optimized.jpg' },
  //   { menuID: 43, type: 'topping', subType: 'veg', code: 'TP011', description: 'Extra Hotfudge Topping', rate: 25, qty: 0, image: 'assets/images/hotfudge-topping_optimized.webp' },
  // ];

  get currentMenu(): MenuItem[] {
    return this.selectedBeverage == 'hot' ? this.hotMenu : this.selectedBeverage == 'cold' ? this.coldMenu : this.selectedBeverage == 'dessert' ? this.dessertMenu : this.selectedBeverage == 'breakfast' ? this.breakfastMenu : this.selectedBeverage == 'cold' ? this.burgerMenu : this.toppingMenu;
  }

  // selectItem(item: MenuItem): void {
  //   const amount = item.rate * this.userQty;
  //   this.totalAmount += amount;
  //   this.userBill.push({ item: item.description, qty: this.userQty, mrp: item.rate });
  // }
  getCalculate(item: MenuItem) {
    const quantity = item.qty;
    const amount = item.rate * quantity;
    this.totalAmount += amount;
    let isExistItem: any = [];
    if (this.userBill != null && this.userBill != undefined && this.userBill.length > 0) {
      isExistItem = this.userBill.filter(x => x.menuID == item.menuID);
    }
    if (isExistItem != null && isExistItem != undefined && isExistItem.length > 0) {
      this.userBill.forEach(x => {
        if (x.menuID == item.menuID) {
          x.qty = item.qty;
          x.mrp = item.rate;
        }
      });
    }
    else {
      this.userBill.push({
        menuID: item.menuID,
        type: item.type,
        code: item.code,
        description: item.description,
        qty: quantity,
        mrp: item.rate
      });
    }
    this.userBill = this.userBill.filter(x => x.qty > 0);
  }
  selectItem(item: MenuItem): void {
    //  debugger;
    //if (item.qty > 0) {
    item.qty = 1;
    this.cartService.addToCart(item);
    this.showCart = true;
    // Reset quantity to 1 after adding
    //item.qty = 1;
    //}
    // else {
    //   //this.toastr.error("Please Select Quantity");
    //   alert("Please Select Quantity");
    // }
  }

  incrementQty(item: any) {
    item.qty++;
    this.cartService.addToCart(item);
    this.getCalculate(item);
  }

  decrementQty(item: any) {
    if (item.qty > 1) {
      item.qty--;
      this.cartService.updateqty(item.menuID, item.qty);
    }
    else {
      item.qty = 0; // hide controls again
      this.cartService.removeFromCart(item);
    }
    this.getCalculate(item);
  }

  removeItem(item: any) {
    item.qty = 0;
    this.getCalculate(item);
  }

  resetOrder(): void {
    this.filteredMenuItems = this.allMenu;
    this.filterByCategory('All');
    this.isBreakfastFlag = false;
    this.isBreakfastFlag = this.isBreakfastTime();
    this.totalAmount = 0;
    this.userBill = [];
  }

  customerName = '';
  customerMobile = '';

  todayDate: Date = new Date();
  billNo: string = 'INV' + Math.floor(1000 + Math.random() * 9000); // Example: INV1234

  get totalBillAmount(): number {
    return this.userBill.reduce((sum, item) => sum + item.qty * item.mrp, 0);
  }

  get cgstAmount(): number {
    return +(this.totalBillAmount * 0.025).toFixed(2);
  }

  get sgstAmount(): number {
    return +(this.totalBillAmount * 0.025).toFixed(2);
  }



  closeCartPop(event) {
    this.showCart = false;
    //this.cartService.clearCart(); // Clear cart when closing
  }

  public isInvoiceVisible: boolean = false;
  public order: any = "";
  addToProceed(event) {
    if (event != null && event != undefined) {
      this.totalAmount = 0;
      if (event.item != null && event.item != undefined && event.item.length > 0) {
        event.item.forEach(x => {
          const quantity = x.qty;
          const amount = x.rate * quantity;
          this.totalAmount += amount;
          // this.userBill.forEach(y => {
          //   if (y.menuID == x.menuID) {
          //     y.qty = x.qty;
          //     y.mrp = x.rate;
          //   }
          // });
          let isExistItem: any = [];
          if (this.userBill != null && this.userBill != undefined && this.userBill.length > 0) {
            isExistItem = this.userBill.filter(y => y.menuID == x.menuID);
          }
          if (isExistItem != null && isExistItem != undefined && isExistItem.length > 0) {
            this.userBill.forEach(z => {
              if (z.menuID == x.menuID) {
                z.qty = x.qty;
                z.mrp = x.rate;
              }
            });
          }
          else {
            this.userBill.push({
              menuID: x.menuID,
              type: x.type,
              code: x.code,
              description: x.description,
              qty: quantity,
              mrp: x.rate
            });
          }
        });
        this.userBill = this.userBill.filter(bill => bill.qty > 0);
      }
      this.isInvoiceVisible = event.flag; // Show invoice section
      this.order = event.order == 'take-away' ? 'Take-away' : 'Dine-in';
      //this.router.navigate(["checkout"]);
    }
  }

  onClickViewCart() {
    this.cartService.getCartDetails();
    this.showCart = !this.showCart; // Toggle cart visibility
    // if (this.showCart) {
    //   this.cartService.getCartItems().subscribe(items => {
    //     this.userBill = items;
    //     this.totalAmount = this.userBill.reduce((sum, item) => sum + item.qty * item.mrp, 0);
    //   });
    // } else {
    //   this.userBill = [];
    //   this.totalAmount = 0;
    // }
  }

  itemIncrementDecrement(event) {
    if (event.action == 'increment') {
      if (event.item != null && event.item != undefined) {
        //this.incrementQty(event.item);
        if (event.item.qty == null || event.item.qty == undefined || event.item.qty == "") {
          event.item.qty = 0; // Initialize qty if not set
          this.cartService.deleteCartDetails(event.item.id);
        }
        if (event.item.qty > 0) {
          if (event.item.type == 'hot') {
            this.hotMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the hotMenu
                this.getCalculate(item);
              }
            });
          }
          else if (event.item.type == 'cold') {
            this.coldMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the coldMenu
                this.getCalculate(item);
              }
            });
          }
          else if (event.item.type == 'dessert') {
            this.dessertMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the dessertMenu
                this.getCalculate(item);
              }
            });
          }
          else if (event.item.type == 'breakfast') {
            this.breakfastMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the breakfastMenu
                this.getCalculate(item);
              }
            });
          }
          else if (event.item.type == 'burger') {
            this.burgerMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the burgerMenu
                this.getCalculate(item);
              }
            });
          }
          else if (event.item.type == 'topping') {
            this.toppingMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the toppingMenu
                this.getCalculate(item);
              }
            });
          }
          this.cartService.insertUpdateCartDetails(event.item);
        }
      }
    }
    else if (event.action == 'decrement') {
      if (event.item != null && event.item != undefined) {
        if (event.item.qty == null || event.item.qty == undefined || event.item.qty == "") {
          event.item.qty = 0; // Initialize qty if not set
          this.cartService.deleteCartDetails(event.item.id);
        }
        if (event.item.qty > 0) {
          if (event.item.type == 'hot') {
            this.hotMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the hotMenu
                this.getCalculate(item);
              }
            });
          }
          else if (event.item.type == 'cold') {
            this.coldMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the coldMenu
                this.getCalculate(item);
              }
            });
          }
          else if (event.item.type == 'dessert') {
            this.dessertMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the dessertMenu
                this.getCalculate(item);
              }
            });
          }
          else if (event.item.type == 'breakfast') {
            this.breakfastMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the breakfastMenu
                this.getCalculate(item);
              }
            });
          }
          else if (event.item.type == 'burger') {
            this.burgerMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the burgerMenu
                this.getCalculate(item);
              }
            });
          }
          else if (event.item.type == 'topping') {
            this.toppingMenu.forEach(item => {
              if (item.menuID == event.item.menuID) {
                item.qty = event.item.qty; // Update the qty in the toppingMenu
                this.getCalculate(item);
              }
            });
          }
          this.cartService.insertUpdateCartDetails(event.item);
        }
      }
    }
    else if (event.action == 'clearall') {
      this.hotMenu.forEach(item => item.qty = 0);
      this.coldMenu.forEach(item => item.qty = 0);
      this.dessertMenu.forEach(item => item.qty = 0);
      this.breakfastMenu.forEach(item => item.qty = 0);
      this.burgerMenu.forEach(item => item.qty = 0);
      this.userBill = [];
      this.totalAmount = 0;
      this.cartService.deleteCartDetails(0, this.userDetails?.userID);
    }
    this.showCart = true; // Ensure cart is visible after any item increment/decrement
    this.isInvoiceVisible = false; // Hide invoice section when cart is updated
  }

  customizeOrder(event) {
    if (event != null && event != undefined) {
      this.isInvoiceVisible = false; // Show invoice section
      this.showCart = event.flag; // Show cart for customization
    }
  }

  //search bar and type selection start
  searchText: string = '';
  selectedCategory: string = 'All';
  selectedSubCategory: string = '';

  categories = [
    { name: 'All', count: this.breakfastMenu.length + this.burgerMenu.length + this.hotMenu.length + this.coldMenu.length + this.dessertMenu.length },
    { name: 'Breakfast', count: this.breakfastMenu.length },
    { name: 'Burger', count: this.burgerMenu.length },
    { name: 'Hot Beverages', count: this.hotMenu.length },
    { name: 'Cold Beverages', count: this.coldMenu.length },
    { name: 'Dessert', count: this.dessertMenu.length },
    { name: 'Topping', count: this.toppingMenu.length },
  ];

  public isBreakfastFlag: boolean = false;
  filterByCategory(category: string) {
    this.selectedCategory = category;
    // apply filter logic here
    if (category === 'All') {
      this.filteredMenuItems = this.allMenu;
    }
    else if (category === 'Hot Beverages') {
      this.filteredMenuItems = this.allMenu.filter(item => item.type === 'hot');
    }
    else if (category === 'Cold Beverages') {
      this.filteredMenuItems = this.allMenu.filter(item => item.type === 'cold');
    }
    else if (category === 'Dessert') {
      this.filteredMenuItems = this.allMenu.filter(item => item.type === 'dessert');
    }
    else if (category === 'Topping') {
      this.filteredMenuItems = this.allMenu.filter(item => item.type === 'topping');
    }
    else if (category === 'Breakfast') {
      this.selectedSubCategory = 'veg'; // reset on main category click
      this.isBreakfastFlag = this.isBreakfastTime();
      this.filteredMenuItems = this.allMenu.filter(item => item.type === 'breakfast');
      this.filterBySubCategory(this.selectedSubCategory); // filter by default sub-category
      if (!this.isBreakfastFlag) {
        //this.toastr.error("Breakfast is available only between 7:00 AM to 11:59 AM");
        alert("Breakfast is available only between 7:00 AM to 11:59 AM");
        return;
      }

    }
    else if (category === 'Burger') {
      this.selectedSubCategory = 'veg'; // reset on main category click
      this.filteredMenuItems = this.allMenu.filter(item => item.type === 'burger');
      this.filterBySubCategory(this.selectedSubCategory); // filter by default sub-category
    }
    else {
      this.filteredMenuItems = [];
    }
  }

  filterBySubCategory(subCategory: string) {
    this.selectedSubCategory = subCategory;

    if (this.selectedCategory === 'Burger') {
      this.filteredMenuItems = this.allMenu.filter(item =>
        item.type === 'burger' && item.subType?.toLowerCase() === subCategory.toLowerCase()
      );
    }
    else if (this.selectedCategory === 'Breakfast') {
      this.filteredMenuItems = this.allMenu.filter(item =>
        item.type === 'breakfast' && item.subType?.toLowerCase() === subCategory.toLowerCase()
      );
    }
  }

  isBreakfastTime(): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    //const currentHour = 12;
    return currentHour >= 7 && currentHour < 12; // 7:00 AM to 11:59 AM
  }

  allMenu: MenuItem[] = [
    ...this.burgerMenu,
    ...this.hotMenu,
    ...this.coldMenu,
    ...this.dessertMenu,
    ...this.breakfastMenu,
    ...this.toppingMenu,
  ];
  filteredMenuItems: MenuItem[] = [];

  get filteredAndSearchedMenu(): MenuItem[] {
    return this.filteredMenuItems.filter(item =>
      item.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  //search bar and type selection end

}

export interface MenuItem {
  id: number;
  userID: number;
  menuID: number;
  seqNo: number;
  type: string;
  subType: string;
  code: string;
  description: string;
  rate: number;
  image: string; // optional
  qty?: number; // Track quantity per item
}

export interface Bill {
  menuID: number;
  type: string;
  code: string;
  description: string;
  qty: number;
  mrp: number;
}