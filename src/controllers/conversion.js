const express = require("express");
const htmlToPdf = require("../helpers/html-to-pdf.js");
const numWords = require('num-words')

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(`Request body : `, req.body);
    let {
      invoiceNo,
      date,
      itemName,
      description,
      packaging,
      quantity,
      rate,
      amount,
      distributor,
      logistic
    } = req.body;
    if (!description || !quantity || !rate || !amount || !distributor || !logistic) {
      res.status(400).send("Required fields are missing");
      return;
    }
    if(date){
        let [year,month,day] = date.split("-")
        let monthText = ""
        switch (month) {
            case "01":
                monthText = "Jan";
                break;
            case "02":
                monthText = "Feb";
                break;
            case "03":
                monthText = "March";
                break;
            case "04":
                monthText = "April";
                break;
            case "05":
                monthText = "May";
                break;
            case "06":
                monthText = "June";
                break;
            case "07":
                monthText = "July";
                break;
            case "08":
                monthText = "Aug";
                break;
            case "09":
                monthText = "Sept";
                break;
            case "10":
                monthText = "Oct";
                break;
            case "11":
                monthText = "Nov";
                break;
            case "12":
                monthText = "Dec";
                break;
            default:
                break;
        }
    year = year.substring(2);
    date = (day+ "-" + monthText + "-" + year);
    console.log(date);
    }
    let tableRows = "";
    for (let i = 0; i < itemName.length; i++) {
      tableRows += `
              <tr>
            <td rowspan="2">${i+1}</td>
            <td class="text-center">${itemName[i]}</td>
            <td rowspan="2" style = "white-space : nowrap">${date}</td>
            <td rowspan="2">${quantity[i]} pcs</td>
            <td rowspan="2">${rate[i]}</td>
            <td rowspan="2">pcs</td>
            <td rowspan="2">${amount[i]}</td>
          </tr>
          <tr>
            <td style="padding: 0; text-align: center">
              <span style="font-size: 10px">${description[i]} <br /></span>
              <span style="font-size: 10px"> MASTER CARTOON </span>
            </td>
          </tr>
            `;
    }
    let totalAmount = (Array.isArray(amount) ? amount : [amount])
      .reduce((acc, curr) => acc + parseFloat(curr), 0)
      .toFixed(2);
    let [integerPart, decimalPart] = parseFloat(totalAmount)
      .toFixed(2)
      .split(".");
    let words = numWords(parseInt(integerPart, 10));
    if (decimalPart && parseInt(decimalPart, 10) !== 0) {
      words += " point " + numWords(parseInt(decimalPart, 10)) + " paisa";
    }
    let totalQuantity = quantity.reduce((acc, curr) => acc + parseInt(curr), 0);

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Bootstrap CSS -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
      crossorigin="anonymous"
    />
    <style>
      /* Style adjustments */
      .main-container {
       max-width: 500mm;
        max-height: 500mm;
        margin: 0 50px; /* Center the content horizontally */
        padding: 5px 50px; /* Add some padding */
      }
      .main-row {
        font-size: 8px; /* Small font size for compact text */
        line-height: 1; /* Minimize vertical spacing */
      }
      .main-row p,
      .main-row h4,
      .main-row h5,
      .main-row h2 {
        margin: 0; /* Remove default margins */
        padding: 0; /* Remove padding for compactness */
      }
      .main-row h2 {
        font-size: 14px; /* Consistent smaller size for headings */
      }
      .main-row h4 {
        font-size: 12px; /* Smaller size for sub-headings */
      }
      .main-row h5 {
        font-size: 10px; /* Slightly smaller size for less important headings */
        font-weight: 600;
      }
      .main-row p {
        font-size: 10px;
      }
      .bordered {
        border: 1px solid #000; /* Border around each section */
        padding: 5px; /* Padding inside each section */
      }
      .row {
        margin-bottom: 0 !important;
      }
    td{
    font-size: 13px;
    }
    </style>
    <title>PO</title>
  </head>
  <body>
    <div class="w-100 text-center">
      <h1>PURCHASE ORDER</h1>
    </div>
    <div class="main-container">
      <div class="row main-row">
        <!-- Main Row -->
        <div class="col-6 bordered">
          <h5>Invoice To</h5>
          <h4>I Trade Bharat</h4>
          <p>
            GR.FLOOR, UNDERSTAIR, SHAIKH BHAI BUILDING <br />
            BHANDARI STREET, CARNAC BRIDGE MASJID BANDAR WEST MUMBAI <br />
            GSTIN/UIN: 27AHRPB0669A1ZK <br />
            State Name: Maharashtra, Code: 27 <br />
            E-Mail: info@itradebharat.com
          </p>
        </div>
        <div class="col-6">
          <!-- Sub Row 1 -->
          <div class="row mb-1">
            <div class="col-6 bordered">
              <h5>Voucher No.</h5>
              <h2>${invoiceNo}</h2>
            </div>
            <div class="col-6 bordered">
              <h5>Dated</h5>
              <h2>${date}</h2>
            </div>
          </div>
          <!-- Sub Row 2 -->
          <div class="row mb-1">
            <div class="col-6 bordered"></div>
            <div class="col-6 bordered">
              <h5>Mode/Terms of Payment</h5>
              <h2>RTGS</h2>
            </div>
          </div>
          <!-- Sub Row 3 -->
          <div class="row">
            <div class="col-6 bordered">
              <h5>Reference No. & Date</h5>
              <h2>${invoiceNo}</h2>
            </div>
            <div class="col-6 bordered">
              <h5>Other References</h5>
              <h2></h2>
            </div>
          </div>
        </div>
      </div>
      <div class="row main-row">
        <div class="col-6 bordered">
          <h5>Consignee (Ship To)</h5>
          <h4>${logistic.name}</h4>
          <p>
            ${logistic.address} <br />
            GSTIN/UIN : ${logistic.gstin} <br />
            State Name : ${logistic.stateName}, Code : ${logistic.code}
          </p>
        </div>
        <div class="col-6">
          <div class="row" style="height: 50px">
            <div class="col-6 bordered">
              <h5>Dispatched through</h5>
              <h4></h4>
            </div>
            <div class="col-6 bordered">
              <h5>Destination</h5>
              <h4></h4>
            </div>
          </div>
          <div class="row">
            <div class="col-12 bordered" style="border-bottom: 0px">
              <h5>Terms of Delivery</h5>
              <h2>100% PAYMENT AFTER QC</h2>
            </div>
          </div>
        </div>
        <div class="col-6 bordered">
          <h5>Supplier (Bill from)</h5>
          <h4>${distributor.name}</h4>
          <p>
            ${distributor.address} <br/>
            GSTIN/UIN: ${distributor.gstin} <br />
            State Name : ${distributor.stateName}, Code : ${distributor.code}
          </p>
        </div>
        <div class="col-6 bordered" style="border-top: 0px"></div>
      </div>
      <table class="table table-bordered" style="margin: 0 -12px; border: 1px solid #000;">
        <thead>
          <tr>
            <th style="white-space: nowrap">Sr.No</th>
            <th style="white-space: nowrap">Description of Goods</th>
            <th style="white-space: nowrap">Due on</th>
            <th style="white-space: nowrap">Quantity</th>
            <th style="white-space: nowrap">Rate</th>
            <th style="white-space: nowrap">Per</th>
            <th style="white-space: nowrap">Amount</th>
          </tr>
        </thead>
        <tbody>
        ${tableRows}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="text-align: right">Total:</td>
            <td colspan="2" class="text-end">${totalQuantity} pcs</td>
            <th></th>
            <th></th>
            <td>${totalAmount}</td>
          </tr>
        </tfoot>
      </table>
      <div class="main-row">
        <div class="row" style="height: 200px">
          <div class="col-12 bordered" style="border-bottom: 0px">
            <h5>Amount Chargeable (in words)</h5>
            <h2>INR ${words} Only</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-6 bordered" style="border-top: 0px">
            <h5
              style="
                text-decoration: underline;
                margin-bottom: 10px;
                font-size: 13px;
              "
            >
              Declaration
            </h5>
            <p style="font-size: 15px">
              We declare that this invoice shows the actual price of the goods
              described and that all particulars are true and correct.
            </p>
          </div>
          <div class="col-6 bordered" style="height: 90px">
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                height: 100%;
              "
            >
              <h5
                style="
                  align-self: center;
                  text-align: center;
                  white-space: nowrap;
                "
              >
                iTrade Bharat
              </h5>
              <h5
                style="
                  align-self: center;
                  text-align: center;
                  white-space: nowrap;
                "
              >
                Authorised Signatory
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bootstrap JS -->
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
      crossorigin="anonymous"
    ></script>
  </body>
</html>

`;

    const pdfBuffer = await htmlToPdf(html);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;

