import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor() { }

  public queryParam: any;
  public _queryParams: any;
  // @Input() customerName: any;
  // @Input() customerMobile: any;
  @Input() userBill: any=[];
  @Input() isInvoiceVisible: boolean=false;
  @Input() totalAmount: any=0;
  @Input() cgstAmount: any=0;
  @Input() sgstAmount: any=0;
  @Input() order: any="";
  public customerName: string = '';
  public customerMobile: string = '';
  todayDate: Date = new Date();
  billNo: string = 'INV' + Math.floor(1000 + Math.random() * 9000); // Example: INV1234
  ngOnInit(): void {
    console.log("isInvoiceVisible: ", this.isInvoiceVisible);
    console.log("userBill: ", this.userBill);
    if (this.queryParam == null) {
      this._queryParams = (sessionStorage.getItem("queryParams_userDetails") || '{}');
      this.queryParam = JSON.parse(this._queryParams);
       if (this.queryParam != null && this.queryParam != undefined && this.queryParam.userDetails != null && this.queryParam.userDetails != undefined) {
        this.customerName = this.queryParam.userDetails.userName;
        this.customerMobile = this.queryParam.userDetails.userMobileNo;
      }
    }
  }

    printBill() {
    //window.print();
    const printContent = document.getElementById('invoice');
    const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

    if (WindowPrt && printContent) {
      WindowPrt.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            body {
              font-family: Georgia, serif;
              padding: 20px;
            }
            .receipt-container {
              max-width: 700px;
              margin: auto;
              padding: 1.5rem;
              border: 1px dashed #000;
              color: #000;
            }
            .receipt-header, .receipt-footer {
              text-align: center;
            }
            .receipt-details {
              display: flex;
              justify-content: space-between;
              margin: 1rem 0;
            }
            .receipt-table {
              width: 100%;
              text-align: center;
              border-collapse: collapse;
              margin: 1rem 0;
            }
            .receipt-table th, .receipt-table td {
              border: 1px solid #000;
              padding: 0.6rem;
            }
            .receipt-summary {
              text-align: right;
              font-size: 1rem;
              margin-top: 1rem;
            }
            .receipt-summary p, .receipt-footer p {
              margin: 0.3rem 0;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent.innerHTML}
        </body>
      </html>
    `);
      WindowPrt.document.close();
    }
  }

  @Output() customizeOrder = new EventEmitter<any>();
  onClickCustomizeOrder(){
    this.isInvoiceVisible = false; // Hide invoice section
    this.customizeOrder.emit({flag: true }); // Emit an event to notify parent component
    // Optionally, you can also close the checkout view if needed
    // this.closeCheckout.emit(); // Uncomment if you have a closeCheckout event emitter
  }
}
