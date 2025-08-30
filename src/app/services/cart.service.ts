import { Injectable, OnInit } from '@angular/core';
import { HttpRequestService } from '../common-services/http-request.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit {
  private refreshSource = new BehaviorSubject<boolean>(false);
  isRefresh$ = this.refreshSource.asObservable();
  constructor(private httpService: HttpRequestService, public progress: NgxSpinnerService) { }

  private items: any[] = [];
  public userCartDetails: any;
  queryParamUserDetails: any;
  _queryParamsUserDetails: any;
  public userDetails: any;
  public userID: any = 0;
  ngOnInit(): void {
    if (this.queryParamUserDetails == null) {
      this._queryParamsUserDetails = (sessionStorage.getItem("queryParams_userDetails") || '{}');
      this.queryParamUserDetails = JSON.parse(this._queryParamsUserDetails);
      if (this.queryParamUserDetails != null && this.queryParamUserDetails != undefined && this.queryParamUserDetails.userDetails != null && this.queryParamUserDetails.userDetails != undefined) {
        this.userDetails = this.queryParamUserDetails.userDetails;
        this.userID = this.userDetails.userID;
        console.log("userDetails:-", this.userDetails);
        //sessionStorage.clear();
      }
    }
    this.getCartDetails();
  }
  public isDefault: boolean = false;
  getCartDetails(isRefresh: boolean = false) {
    if (!this.isDefault || isRefresh) {
      if (this.queryParamUserDetails == null) {
        this._queryParamsUserDetails = (sessionStorage.getItem("queryParams_userDetails") || '{}');
        this.queryParamUserDetails = JSON.parse(this._queryParamsUserDetails);
        if (this.queryParamUserDetails != null && this.queryParamUserDetails != undefined && this.queryParamUserDetails.userDetails != null && this.queryParamUserDetails.userDetails != undefined) {
          this.userDetails = this.queryParamUserDetails.userDetails;
          this.userID = this.userDetails.userID;
          console.log("userDetails:-", this.userDetails);
          //sessionStorage.clear();
        }
      }
      this.progress.show();
      this.httpService.request('get', 'user/cart/' + this.userID).subscribe((data) => {
        this.isDefault = true;
        this.userCartDetails = data.data;
        if (this.userCartDetails != null && this.userCartDetails != undefined && this.userCartDetails.length > 0) {
          this.items = [];
          this.userCartDetails.forEach(element => {
            this.items.push(element);
          });
          this.triggerRefresh();
        }
        this.progress.hide();
        console.log('userCartDetails:', this.userCartDetails);
      }, (error) => {
        console.error('Error:', error);
      });
    }
  }

  insertUpdateCartDetails(item: any) {
    if (item != null && item != undefined && item != "") {
      if (this.queryParamUserDetails == null) {
        this._queryParamsUserDetails = (sessionStorage.getItem("queryParams_userDetails") || '{}');
        this.queryParamUserDetails = JSON.parse(this._queryParamsUserDetails);
        if (this.queryParamUserDetails != null && this.queryParamUserDetails != undefined && this.queryParamUserDetails.userDetails != null && this.queryParamUserDetails.userDetails != undefined) {
          this.userDetails = this.queryParamUserDetails.userDetails;
          this.userID = this.userDetails.userID;
          console.log("userDetails:-", this.userDetails);
          //sessionStorage.clear();
        }
      }
      this.progress.show();
      if (item.id == 0 || item.id == null || item.id == undefined) {
        //const maxSeqNo = this.items.length > 0 ? Math.max(...this.items.map(item => item.seqNo)) : 0;
        let body = {
          userID: this.userID,
          menuID: item.menuID,
          type: item.type,
          subType: item.subType,
          code: item.code,
          description: item.description,
          rate: item.rate,
          qty: item.qty,
          image: item.image,
          seqNo: this.items.length,
        }
        this.httpService.request('post', 'users/cart', body).subscribe((data) => {
          //this.userCartDetails = data.data;
          this.progress.hide();
          console.log('insertCartDetails:', data);
          if (data.error == "") {
            if (data.statusCode == 200) {
              //output emit for refresh cart count on order page 
              this.getCartDetails(true);
            }
          }
        }, (error) => {
          console.error('Error:', error);
        });
      }
      else if (item.id > 0) {
        let body = {
          userID: this.userID,
          menuID: item.menuID,
          type: item.type,
          subType: item.subType,
          code: item.code,
          description: item.description,
          rate: item.rate,
          qty: item.qty,
          image: item.image,
          seqNo: item.seqNo,
        }
        this.httpService.request('patch', 'users/cart/' + item.id, body).subscribe((data) => {
          //this.userCartDetails = data.data;
          this.progress.hide();
          console.log('UpdateCartDetails:', data);
          if (data.error == "") {
            if (data.statusCode == 200) {
              //output emit for refresh cart count on order page   
              this.getCartDetails(true);
            }
          }
        }, (error) => {
          console.error('Error:', error);
        });
      }
    }
  }

  deleteCartDetails(id: any = 0, userID: any = 0) {
    if (id > 0 || userID > 0) {
      this.progress.show();
      this.httpService.request('delete', 'users/cart/' + id + "/" + userID).subscribe((data) => {
        //this.userCartDetails = data.data;
        this.progress.hide();
        console.log('insertCartDetails:', data);
        if (data.error == null || data.error == "") {
          if (data.statusCode == 200) {
            //output emit for refresh cart count on order page 
            this.getCartDetails(true);
          }
        }
      }, (error) => {
        console.error('Error:', error);
      });
    }
  }

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
    this.insertUpdateCartDetails(item);
  }

  removeFromCart(item: any) {
    //this.items = this.items.filter(x => x.menuID !== item.menuID && x.code !== item.code);
    this.items = this.items.filter(x => x.menuID !== item.menuID);
  }

  updateqty(menuID: number, qty: number) {
    const item = this.items.find(x => x.menuID === menuID);
    if (item) {
      item.qty = qty;
    }
    this.insertUpdateCartDetails(item);
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

  // Call this whenever you want to trigger refresh
  triggerRefresh() {
    this.refreshSource.next(true);
  }

  // Optional: reset back to false
  resetRefresh() {
    this.refreshSource.next(false);
  }
}
