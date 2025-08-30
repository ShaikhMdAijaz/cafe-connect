import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpRequestService } from 'src/app/common-services/http-request.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @Input() isOpen = false;
  @Input() userID: any = 0;
  @Input() userDetails: any;

  constructor(public cartService: CartService, private toastr: ToastrService, private httpService: HttpRequestService,
    public progress: NgxSpinnerService) { }

  orderWillBe: string = 'dine-in';
  ngOnInit(): void {
    //this.getCartDetails();
    this.getStateFilllist();
    this.getAddressDetails();
    if (this.userDetails != null && this.userDetails != undefined) {
      this.address.fullName = this.userDetails.userName;
      this.address.mobile = this.userDetails.userMobileNo;
    }
  }

  public addressList: any = [];
  public isAddressSectionFlag: boolean = false;
  onClickHeaderBtn(subCategory: string) {
    this.orderWillBe = subCategory;
    //get api call to retrieve address list 
    //if exist then set isAddressExists = true
    if (this.addressList.length > 0) {
      this.isAddressSectionFlag = true;
      this.isDeliverFlag = false;
    }
    else {
      this.isAddressSectionFlag = false;
      this.isAddressExists = false;
    }
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
  public isAddressExists: boolean = false;
  onClickAddToProceed() {
    console.log("isAddressExists :-", this.isAddressExists);
    console.log("orderWillBe :-", this.orderWillBe);
    if ((this.address.fullName === '' || this.address.mobile === '' || this.address.pincode === '' || this.address.flat === '' || this.address.area === '' || this.address.city === '' || this.address.state === '') && this.orderWillBe == 'take-away') {
      this.toastr.error("Please fill all the required fields");
      return;
    }
    else {
      this.isAddressExists = true;
    }
    this.addToProceed.emit({ item: this.cartItems, flag: true, order: this.orderWillBe }); // Parent will handle the proceed action
    this.closeCart(); // Optionally close the cart after proceeding
  }
  confirmClearAll() {
    if (this.cartItems.length > 0) {
      const confirmClear = confirm("Are you sure you want to clear all items from the cart?");
      if (confirmClear) {
        this.clearCart(); // Your method to clear the cart
      }
    }
    else {
      this.toastr.error("There is no item to clear");
    }
  }

  address = {
    id: 0,
    userID: 0,
    fullName: '',
    mobile: '',
    pincode: '',
    flat: '',
    area: '',
    landmark: '',
    city: '',
    stateID: 0,
    state: '',
    addressType: '',
    isDefault: false,
    isDelete: false,
    instructions: ''
  };

  states = ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Gujarat', 'West Bengal'];
  addressTypeList = ['Home', 'Work'];

  onSubmit() {
    console.log('Submitted Address:', this.address);
    // You can send this to API
  }

  public isFormValid: boolean = true;
  saveAddress() {
    console.log('Submitted Address:', this.address);
    // this.addressList = [{
    //   name: 'Shaikh Aijaz',
    //   type: 'WORK',
    //   details: 'Unit # 2, 2nd floor, Jyoti wire house, plot no 23 A, Shah industrial estate, Veera Desai road, Andheri west, Honda service center, Mumbai, Maharashtra - 400053',
    //   phone: '9892467361'
    // }]
    let flag: boolean = true;
    this.isFormValid = true;
    if (this.inValidMobileNo) {
      if ((this.address.fullName === '' || this.address.mobile === '' || this.address.pincode === '' || this.address.flat === '' || this.address.area === '' || this.address.city === '' || this.address.state === '' || this.address.addressType === '') && this.orderWillBe == 'take-away') {
        this.toastr.error("Please fill all the required fields");
        flag = false;
        this.isFormValid = false;
        return;
      }
      // else {
      //   this.isAddressExists = true;
      //   this.isAddressSectionFlag = true;
      // }
      //call address save Api
      //after responce call get 
      if (flag) {
        if (this.address.id == 0) {
          let body = {
            userID: this.userID,
            addressType: this.address.addressType,
            fullName: this.address.fullName,
            mobileNo: this.address.mobile,
            pincode: this.address.pincode,
            houseNo: this.address.flat,
            area: this.address.area,
            landmark: this.address.landmark,
            city: this.address.city,
            //stateID: this.address.stateID,
            state: this.address.state,
            isDefaultAddress: this.address.isDefault
          }
          this.progress.show();
          this.httpService.request('post', 'users/address', body).subscribe((data) => {
            console.log("saveAddress :-", data);
            if (data.error == "" || data.error == null) {
              if (data.data.errorMsg == null && data.data.usersAddressDtlID > 0) {
                this.toastr.success("Address added successfully");
                this.getAddressDetails();
              }
              else {
                this.toastr.error(data.data.errorMsg);
              }
            }
            else {
              this.toastr.error(data.error);
            }
            this.progress.hide();
          }, (error) => {
            console.error('Error:', error);
          });
        }
        else if (this.address.id > 0) {
          this.address.isDelete = false;
          this.UpdateAddress();
        }
      }
    }
  }

  public inValidMobileNo: boolean = true;
  onChangeMobileNo() {
    if (/^[6-9]\d{9}$/.test(this.address.mobile)) {
      this.inValidMobileNo = true;
    }
    else {
      this.inValidMobileNo = false;
      //this.toastr.error("Please enter a valid 10-digit mobile number");
    }
  }



  public userAddressDetails: any;
  getAddressDetails() {
    this.progress.show();
    this.httpService.request('get', 'user/address/' + this.userID).subscribe((data) => {
      this.userAddressDetails = data.data;
      if (data.error == "" || data.error == null) {
        if (this.userAddressDetails != null && this.userAddressDetails != undefined && this.userAddressDetails.length > 0) {
          // Step 1: Find index of default address
          let defaultIndex = this.userAddressDetails.findIndex(addr => addr.isDefaultAddress == "1");

          if (defaultIndex !== -1) {
            // Step 2: If found, move it to first position
            const [defaultAddress] = this.userAddressDetails.splice(defaultIndex, 1);
            this.userAddressDetails.unshift(defaultAddress);
          } 
          else {
            // Step 3: If not found, set first one as default
            this.userAddressDetails[0].isDefaultAddress = true;
          }
          this.addressList = [];
          this.isAddressExists = true;
          this.isAddressSectionFlag = true;
          this.isDeliverFlag = false;
          this.userAddressDetails.forEach(element => {
            this.addressList.push({
              id: element.id,
              name: element.fullName,
              type: element.addressType,
              details: element.houseNo + ", " + element.area + ", " + element.landmark + ", " + element.city + ", " + element.state + "- " + element.pincode,
              //'Unit # 2, 2nd floor, Jyoti wire house, plot no 23 A, Shah industrial estate, Veera Desai road, Andheri west, Honda service center, Mumbai, Maharashtra - 400053',
              phone: element.mobileNo,
              isDefaultAddress: element.isDefaultAddress == "0" ? false : true
            });
          });
        }
      }
      this.progress.hide();
      console.log('userAddressDetails:', this.userAddressDetails);
    }, (error) => {
      console.error('Error:', error);
    });
  }

  public stateList: any;
  getStateFilllist() {
    this.httpService.request('get', 'state/filllist').subscribe((data) => {
      this.stateList = data.data;
      this.stateList = this.stateList.filter(x => x.id != 31 && x.id != 29);
      console.log('stateList:', this.stateList);
    }, (error) => {
      console.error('Error:', error);
    });
  }

  onClickNewAddress() {
    this.isAddressExists = false;
    this.isDeliverFlag = false;
    this.isAddressSectionFlag = false;
    this.address.fullName = "";
    this.address.addressType = "";
    this.address.area = "";
    this.address.city = "";
    this.address.flat = "";
    this.address.id = 0;
    this.address.userID = 0;
    this.address.isDefault = false;
    this.address.isDelete = false;
    this.address.landmark = "";
    this.address.instructions = "";
    this.address.mobile = "";
    this.address.pincode = "";
    this.address.state = "";
    this.address.stateID = 0;
    if (this.userDetails != null && this.userDetails != undefined) {
      this.address.fullName = this.userDetails.userName;
      this.address.mobile = this.userDetails.userMobileNo;
    }
  }

  onClickEditAddress(id: any = 0) {
    if (id > 0) {
      this.userAddressDetails.forEach(element => {
        if (element.id == id) {
          this.address.id = element.id;
          this.address.userID = element.userID;
          this.address.addressType = element.addressType;
          this.address.area = element.area;
          this.address.city = element.city;
          this.address.fullName = element.fullName;
          this.address.flat = element.houseNo;
          this.address.isDefault = element.isDefaultAddress == "0" ? false : true;
          this.address.isDelete = element.isDelete;
          this.address.landmark = element.landmark;
          this.address.mobile = element.mobileNo;
          this.address.pincode = element.pincode;
          this.address.state = element.state;
          this.isDeliverFlag = false;
          this.isAddressExists = false;
          this.isAddressSectionFlag = false;
        }
      });
    }
  }

  UpdateAddress() {
    let body = {
      userID: this.userID,
      addressType: this.address.addressType,
      fullName: this.address.fullName,
      mobileNo: this.address.mobile,
      pincode: this.address.pincode,
      houseNo: this.address.flat,
      area: this.address.area,
      landmark: this.address.landmark,
      city: this.address.city,
      //stateID: this.address.stateID,
      state: this.address.state,
      isDefaultAddress: this.address.isDefault,
      isDelete: this.address.isDelete
    }
    this.progress.show();
    this.httpService.request('patch', 'users/address/' + this.address.id, body).subscribe((data) => {
      console.log("updateAddress :-", data);
      if (data.error == "" || data.error == null) {
        if (data.statusCode == 200) {
          if (this.address.isDelete) {
            this.toastr.success("Address deleted successfully");
          }
          else {
            this.toastr.success("Address updated successfully");
          }
          this.getAddressDetails();
        }
        else {
          this.toastr.error(data.error);
        }
      }
      else {
        this.toastr.error(data.error);
      }
      this.progress.hide();
    }, (error) => {
      console.error('Error:', error);
    });
  }

  onClickDeleteAddress(id: any = 0) {
    if (id > 0) {
      this.address.isDelete = true;
      this.UpdateAddress();
    }
  }

  onClickBack() {
    this.isAddressSectionFlag = true;
    this.isDeliverFlag = false;
    this.isAddressExists = true;
    if (this.addressList == null || this.addressList == undefined || this.addressList.length == 0) {
      this.onClickHeaderBtn("dine-in");
    }
  }

  public isDeliverFlag: boolean = false;
  onClickDeliver() {
    this.isDeliverFlag = true;
  }

  selectedAddressIndex = 0;

  // addressList = [
  // {
  //   name: 'Shaikh Aijaz',
  //   type: 'WORK',
  //   details: 'Unit # 2, 2nd floor, Jyoti wire house, plot no 23 A, Shah industrial estate, Veera Desai road, Andheri west, Honda service center, Mumbai, Maharashtra - 400053',
  //   phone: '9892467361'
  // },
  // {
  //   name: 'Shaikh Aijaz',
  //   type: 'HOME',
  //   details: 'Room no 91/3, Janta colony Andheri plot, Jogeshwari east near St. Mary school, Mumbai, Maharashtra - 400060',
  //   phone: '9892467361'
  // }
  //];

}
