import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @Input() isOpen = false;

  constructor(public cartService: CartService) { }

  orderWillBe: string = 'dine-in';
  ngOnInit(): void {

  }

  filterBySubCategory(subCategory: string) {
    this.orderWillBe = subCategory;
  }

  get cartItems() {
    return this.cartService.getItems();
  }

  get totalItems() {
    return this.cartService.getCount();
  }

  get totalAmount() {
    return this.cartService.getTotal().toFixed(2);
  }

  increment(item: any) {
    item.qty++;
    this.itemIncrementDecrement.emit({ item: JSON.parse(JSON.stringify(item)), action: 'increment' });
  }

  decrement(item: any) {
    if (item.qty > 1) {
      item.qty--;
    } else {
      item.qty = 0; // Reset to 0 if it goes below 1
      this.cartService.removeFromCart(item);
    }
    this.itemIncrementDecrement.emit({ item: JSON.parse(JSON.stringify(item)), action: 'decrement' });
  }

  clearCart() {
    this.cartService.clearCart();
    this.itemIncrementDecrement.emit({ item: [], action: 'clearall' });
  }

  @Output() close = new EventEmitter<any>();
  @Output() addToProceed = new EventEmitter<any>();
  @Output() itemIncrementDecrement = new EventEmitter<any>();

  closeCart() {
    this.close.emit(); // Parent will set showCart = false
  }
  onClickAddToProceed() {
    this.addToProceed.emit({ item: this.cartItems, flag: true, order:this.orderWillBe }); // Parent will handle the proceed action
    this.closeCart(); // Optionally close the cart after proceeding
  }
  confirmClearAll() {
    const confirmClear = confirm("Are you sure you want to clear all items from the cart?");
    if (confirmClear) {
      this.clearCart(); // Your method to clear the cart
    }
  }

}
