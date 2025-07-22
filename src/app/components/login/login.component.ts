import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { ToastrService } from "ngx-toastr";
//import type { AuthService, LoginCredentials } from "../../services/auth.service"

@Component({
  selector: "app-login",
  //standalone: true,
  //imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  constructor(private router: Router, private toastr: ToastrService) { }
  user = {
    name: '',
    mobile: '',
    otp: ''
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
      if (this.user.name.trim() && /^[6-9]\d{9}$/.test(this.user.mobile)) {
        // Simulate OTP request
        this.showOtpField = true;
        
        setTimeout(() => {
          this.validOTP = this.generateOtp();
          this.user.otp = this.validOTP;
          this.toastr.success("Your OTP has generated " + this.validOTP);
        }, 1000);
      }
      else {
        //alert('Please enter a valid name and 10-digit mobile number');
        this.toastr.error("Please enter a name and mobile number");
      }
    } else {
      if (this.user.otp.trim().length === 6) {
        if (this.user.otp == this.validOTP) {
          //alert('OTP Verified ✅');
          this.toastr.success("OTP Verified ✅");
          let userDetails = { userName: this.user.name, userMobileNo: this.user.mobile }
          let passQueryParam = { userDetails: userDetails };
          sessionStorage.setItem("queryParams_userDetails", JSON.stringify(passQueryParam));
          this.router.navigate(["home"])
          // Navigate or process login
        }
        else {
          //alert('invalid OTP');
          this.toastr.error("Invalid OTP");
          this.showOtpField = false; // Reset OTP field
          this.user.otp = ''; // Clear OTP input
          this.validOTP = ''; // Clear valid OTP
        }
      } 
      else {
        //alert('Enter valid 6-digit OTP');
          this.toastr.error("Enter valid 6-digit OTP");
        this.showOtpField = false; // Reset OTP field
        this.user.otp = ''; // Clear OTP input
        this.validOTP = ''; // Clear valid OTP            
      }
    }
  }
}

