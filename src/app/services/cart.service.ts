import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private items: any[] = [];

  getItems() {
    return this.items;
  }

  addToCart(item: any) {
    const existing = this.items.find(x => x.menuID === item.menuID && x.code === item.code);
    if (existing) {
      existing.qty += 1;
    } 
    else {
      this.items.push({ ...item, qty: 1 });
    }
  }

  removeFromCart(item: any) {
    //this.items = this.items.filter(x => x.menuID !== item.menuID && x.code !== item.code);
    this.items = this.items.filter(x => x.menuID !== item.menuID);
  }

  updateqty(menuID: number, qty: number) {
    const item = this.items.find(x => x.menuID === menuID);
    if (item){
     item.qty = qty;
    }      
  }

  clearCart() {
    this.items = [];
  }

  getTotal() {
    return this.items.reduce((sum, i) => sum + i.rate * i.qty, 0);
  }

  getCount() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  }
}
