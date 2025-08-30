import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { ToastrService } from "ngx-toastr";
import { HttpRequestService } from "src/app/common-services/http-request.service";
import { NgxSpinnerService } from "ngx-spinner";
//import type { AuthService, LoginCredentials } from "../../services/auth.service"

@Component({
  selector: "app-login",
  //standalone: true,
  //imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  constructor(private router: Router, private toastr: ToastrService, private httpService: HttpRequestService, public progress: NgxSpinnerService) { }
  user = {
    id: 0,
    name: '',
    email: '',
    mobile: '',
    otp: '',
    token: '',
  };

  showOtpField = false;
  showOtp = false;
  validOTP: any = "";
  toggleOtpVisibility() {
    this.showOtp = !this.showOtp;
  }
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  onSubmit() {
    if (!this.showOtpField) {
      this.progress.show();
      if (this.user.name.trim()) {
        if (this.user.mobile != null && this.user.mobile != undefined && this.user.mobile != "") {
          if (/^[6-9]\d{9}$/.test(this.user.mobile)) {
            this.httpService.request('get', 'user/' + this.user.mobile).subscribe((data) => {
              this.userData = data;
              console.log('userData:', this.userData);
              if (this.userData.error == "") {
                if (this.userData.data != null && this.userData.data != undefined && this.userData.data != "") {
                  this.progress.hide();
                  // Simulate OTP request
                  this.showOtpField = true;
                  this.user.id = this.userData.data.id;
                  this.user.name = this.userData.data.userName;
                  this.user.mobile = this.userData.data.mobileNo;
                  this.user.email = this.userData.data.email;
                  this.user.token = this.userData.data.token;
                  this.validOTP = this.userData.data.otp;
                  this.user.otp = this.validOTP;
                  this.toastr.success("Your OTP has generated " + this.validOTP);
                }
                else {
                  // Simulate OTP request
                  this.showOtpField = true;
                  setTimeout(() => {
                    this.progress.hide();
                    this.validOTP = this.generateOtp();
                    this.user.otp = this.validOTP;
                    this.toastr.success("Your OTP has generated " + this.validOTP);
                  }, 1000);
                }
              }
              else if (this.userData.error == "User not found") {
                this.validOTP = this.generateOtp();
                this.user.otp = this.validOTP;
                this.toastr.success("Your OTP has generated " + this.validOTP);
                let email: any = "";
                if (this.user.email == '' || this.user.email == null || this.user.email == undefined) {
                  email = this.user.name + this.user.otp + "@gmail.com";
                }
                else {
                  email = this.user.email;
                }
                let body = {
                  userName: this.user.name,
                  userMobileNo: this.user.mobile,
                  otp: this.user.otp,
                  token: email + this.user.otp,
                  email: email
                }
                this.httpService.request('post', 'login', body).subscribe((data) => {
                  console.log("data :-", data);
                  if (data.data.errorMsg == null && data.data.id > 0) {
                    this.user.id = data.data.id;
                    let userDetails = { userID:this.user.id, userName: this.user.name, userMobileNo: this.user.mobile, userEmail: this.user.email}
                    let passQueryParam = { userDetails: userDetails };
                    sessionStorage.setItem("queryParams_userDetails", JSON.stringify(passQueryParam));
                    this.router.navigate(["home"])
                  }
                  else {
                    this.toastr.error(data.data.errorMsg);
                  }
                  this.progress.hide();
                }, (error) => {
                  console.error('Error:', error);
                  this.toastr.error(error.error.error);
                  this.progress.hide();
                });
              }
            }, (error) => {
              console.error('Error:', error);
              this.toastr.error(error.error.error);
              this.progress.hide();
              // this.showOtpField = true;
              //   setTimeout(() => {
              //     this.progress.hide();
              //     this.validOTP = this.generateOtp();
              //     this.user.otp = this.validOTP;
              //     this.toastr.success("Your OTP has generated " + this.validOTP);
              //   }, 1000);
            });
          }
          else {
            this.progress.hide();
            this.toastr.error("Please enter a valid 10-digit mobile number");
          }
        }
        else {
          this.progress.hide();
          this.toastr.error("Please enter mobile number");
        }
      }
      else {
        this.progress.hide();
        //alert('Please enter a valid name and 10-digit mobile number');
        this.toastr.error("Please enter name");
      }
    }
    else {
      this.progress.show();
      if (this.user.otp.trim().length === 6) {
        if (this.user.otp == this.validOTP) {
          //alert('OTP Verified ✅');
          this.toastr.success("OTP Verified ✅");
          let userDetails = { userID:this.user.id, userName: this.user.name, userMobileNo: this.user.mobile, userEmail: this.user.email}
          //let userDetails = { userName: this.user.name, userMobileNo: this.user.mobile }
          let passQueryParam = { userDetails: userDetails };
          sessionStorage.setItem("queryParams_userDetails", JSON.stringify(passQueryParam));
          this.progress.hide();
          this.router.navigate(["home"])
          // Navigate or process login
          // let body = {
          //   userName: this.user.name,
          //   userMobileNo: this.user.mobile,
          //   otp: this.user.otp,
          //   token: this.user.email + this.user.otp,
          //   email: this.user.email
          // }
          // this.httpService.request('post', 'login', body).subscribe((data) => {
          //   this.progress.hide();

          // }, (error) => {
          //   console.error('Error:', error);
          // });

        }
        else {
          //alert('invalid OTP');
          this.progress.hide();
          this.toastr.error("Invalid OTP");
          this.showOtpField = false; // Reset OTP field
          this.user.otp = ''; // Clear OTP input
          this.validOTP = ''; // Clear valid OTP
        }
      }
      else {
        //alert('Enter valid 6-digit OTP');
        this.progress.hide();
        this.toastr.error("Enter valid 6-digit OTP");
        this.showOtpField = false; // Reset OTP field
        this.user.otp = ''; // Clear OTP input
        this.validOTP = ''; // Clear valid OTP            
      }
    }
  }

  postUser() {

  }

  public userData: any = {};
  getUserData() {

  }
}

