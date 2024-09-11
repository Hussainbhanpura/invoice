const express = require("express");
const htmlToPdf = require("../helpers/html-to-pdf.js");
const numWords = require('num-words')

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log(`Request body : `, req.body);
    const {
      currency,
      invoiceNo,
      buyerPO,
      date,
      description,
      color,
      packaging,
      hsnCode,
      quantity,
      rate,
      amount,
      exchangeRate,
    } = req.body;
    console.log(exchangeRate);
    if (!description || !quantity || !rate) {
      res.status(400).send("Required fields are missing");
      return;
    }
    if(currency === "UAE Dirham"){
      sym = "AED"
    }
    else{
      sym = "USD"
    }
    let tableRows = "";
    for (let i = 0; i < description.length; i++) {
      tableRows += `
            <tr>
              <td
                style="
                  border: 1px solid black;
                  text-align: center;
                  padding: 3px;
                "
                rowspan="2"
              >
                ${i + 1}
              </td>
              <td style="border: 1px solid black; text-align: center" colSpan="4">
                ${description[i]}
              </td>
              <td
                style="
                  border: 1px solid black;
                  text-align: center;
                  padding: 3px;
                "
                rowspan="2"
              >
                ${hsnCode[i]}
              </td>
              <td
                style="
                  border: 1px solid black;
                  text-align: center;
                  padding: 3px;
                "
                rowspan="2"
              >
                ${quantity[i]}
              </td>
              <td
                style="
                  border: 1px solid black;
                  text-align: center;
                  padding: 3px;
                "
                rowspan="2"
              >
                ${rate[i]}
              </td>
              <td
                style="
                  border: 1px solid black;
                  text-align: center;
                  padding: 3px;
                "
                rowspan="2"
              >
                ${amount[i]}
              </td>
            </tr>
            <tr>
              <td style="border: 1px solid black" colspan="2">
                    MADE IN INDIA(WITH STANDARD ACCESSORIES)
                 <td style="border: 1px solid black;text-align : center" colspan="1"> ${
                   color[i]
                 } </td>
                 <td style="border: 1px solid black; text-align : center" colspan="1">  ${
                   packaging[i]
                 }
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
      if(sym === "AED"){
      words += " and " + numWords(parseInt(decimalPart, 10)) + " fils";
      }
      else{
        words += " point " + numWords(parseInt(decimalPart, 10)) + " cents";
      }
    }
    const taxAmount = (totalAmount * exchangeRate * 0.18).toFixed(2);
    let [integer2Part, decimal2Part] = parseFloat(taxAmount)
      .toFixed(2)
      .split(".");
    let taxWords = numWords(parseInt(integer2Part, 10));
    if (decimalPart && parseInt(decimal2Part, 10) !== 0) {
      taxWords += " point " + numWords(parseInt(decimal2Part, 10)) + " paisa";
    }
    const html = `<!DOCTYPE html>
 <html lang="en">
   <head>
     <meta charset="utf-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
     <title>Invoice PDF</title>
     <link
       href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
       rel="stylesheet"
       integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
       crossorigin="anonymous"
     />
     <style>
     @page {
       size: Letter;
       padding: 0px 10px;
       }
       
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
  }
  th, td {
    padding: 2px;
  }
     </style>
   </head>
   <body
     style="
       margin: 0;
       padding: 0;
       font-family: Calibri, sans-serif;
       font-size: 9pt;
       max-width: 400mm;
       max-height: 500mm;
       box-sizing: border-box;
     "
   >
     <div style="width: 95%; height : 100% ;margin: 0 auto; align-items:center">
       <div style="margin: 0; padding: 0">
         <div
           style="
             text-align: center;
             font-weight: bold;
             font-size: 28px;
             margin-bottom: 3px;
           "
         >
           I Trade Bharat
         </div>
       </div>
       <div style="margin: 0; padding: 0">
         <div
           style="
             text-align: center;
             font-weight: bold;
             font-size: 12px;
             margin-bottom: 3px;
           "
         >
           EXPORT INVOICE (SUPPLY MEANT FOR EXPORT ON PAYMENT OF IGST)
         </div>
       </div>
 
       <div style="display: flex; justify-content: center">
         <div
           style="
             width: 50%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h5 style="font-size: 9px">EXPORTER:</h5>
           <h5 style="font-size: 9px">I TRADE BHARAT</h5>
           <p style="font-size: 8px">
             GR FLOOR UNDERSTAIR, SHAIKH BHAI BUILDING BHANDARI STREET,<br />
             CARNAC BRIDGE MASJID BANDAR WEST, <br />
             Mumbai-400003 State Name: Maharashtra, Code: 27 <br />
             Email: info@itradebharat.com
           </p>
         </div>
         <div
           style="
             width: 25%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h5 style="font-weight: bold; font-size: 9px">Invoice No:-</h5>
           <h2 style="font-weight: bold; font-size: 14px">${invoiceNo}</h2>
         </div>
         <div
           style="
             width: 25%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h5 style="font-weight: bold; font-size: 9px">Date:-</h5>
           <h3 style="font-weight: bold; font-size: 14px">${date}</h3>
         </div>
       </div>
 
       <!-- Buyer's Row -->
       <div style="display: flex; justify-content: center">
         <div
           style="
             width: 50%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h3 style="font-size: 8px">BILL TO :-</h3>
           <h3 style="font-size: 8px">DIGITONE INTERNATIONAL LLC</h3>
           <h5 style="font-size: 8px">
             10i THE PLAZA BUILDING , RADISSON BLU HOTEL, AL MAKTOUM ROAD, <br />
             AL RIQQA, DEIRA, DUBAI, U.A.E
           </h5>
         </div>
         <div
           style="
             width: 25%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h5 style="font-weight: bold; font-size: 9px">Buyer's PO Number</h5>
           <h3 style="font-weight: bold; font-size: 14px">${buyerPO}</h3>
         </div>
         <div
           style="
             width: 25%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h5 style="font-weight: bold; font-size: 9px">Date:-</h5>
           <h3 style="font-weight: bold; font-size: 14px">${date}</h3>
         </div>
       </div>
 
       <!-- Consignee Row -->
       <div style="display: flex; justify-content: center">
         <div
           style="
             width: 25%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h3 style="font-size: 8px">CONSIGNEE :-</h3>
           <h3 style="font-size: 8px">UNIVERSAL LOGISTICS FZE</h3>
           <h5 style="font-size: 8px">
             K-04, DUBAI AIRPORT FREE ZONE, P.O.BOX <br />
             -54518 DUBAI U.A.E
           </h5>
         </div>
         <div
           style="
             width: 25%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h5 style="font-weight: bold; font-size: 9px">IEC No -AHRPB0669A</h5>
           <h3 style="font-weight: bold; font-size: 12px">
             GSTIN-
             <span style="font-weight: bold; font-size: 10px">
               27AHRPB0669A1ZK
             </span>
           </h3>
         </div>
         <div
           style="
             width: 25%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h5 style="font-weight: bold; font-size: 9px">Port of Discharge</h5>
           <h3 style="font-weight: bold; font-size: 14px">Dubai,U.A.E</h3>
           <h3 style="font-weight: bold; font-size: 12px">
             Port of Loading: MUMBAI
           </h3>
         </div>
         <div
           style="
             width: 25%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h5 style="font-weight: bold; font-size: 9px">Final Destination</h5>
           <h3 style="font-weight: bold; font-size: 14px">Dubai,U.A.E</h3>
         </div>
       </div>
 
       <!-- Terms & Conditions -->
       <div style="display: flex; align-items: center; justify-content: center">
         <div
           style="
             width: 25%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h3 style="font-size: 8px">Pre-Carriage by Tempo</h3>
         </div>
         <div
           style="
             width: 30%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h5 style="font-weight: bold; font-size: 9px">
             Place of Receipt by Pre-carrier MUMBAI
           </h5>
         </div>
         <div
           style="
             width: 45%;
             border: 1px solid black;
             text-align: center;
             padding: 3px;
           "
         >
           <h5 style="font-weight: bold; font-size: 9px">
             Terms of Delivery and payment: CIF BY Air. 100% ADVANCE PAYMENT
           </h5>
         </div>
       </div>
 
       <!-- Table Header -->
       <div style="margin-top: 3px">
         <table
           style="
             width: 100%;
             border: 1px solid black;
             border-collapse: collapse;
           "
         >
           <thead>
             <tr>
               <th
                 style="
                   border: 1px solid black;
                   text-align: center;
                   padding: 3px;
                 "
               >
                 Sr No.
               </th>
               <th
                 style="
                   border: 1px solid black;
                   text-align: center;
                   padding: 3px;
                 "
                 colSpan="4"
               >
                 Description
               </th>
               <th
                 style="
                   border: 1px solid black;
                   text-align: center;
                   padding: 3px;
                   
                 "
               >
                 HSN Code
               </th>
               <th
                 style="
                   border: 1px solid black;
                   text-align: center;
                   padding: 3px;
                 "
               >
                 QTY
               </th>
               <th
                 style="
                   border: 1px solid black;
                   text-align: center;
                   padding: 3px;
                 "
               >
                 Rate <br/> ${sym}
               </th>
               <th
                 style="
                   border: 1px solid black;
                   text-align: center;
                   padding: 3px;
                 "
               >
                 Amount <br/> ${sym}
               </th>
             </tr>
           </thead>
           <tbody>
            ${tableRows}
             <tr>
               <td
                 colspan="6"
                 style="border: 1px solid black; text-align: right; padding: 3px"
               >
                 Total Amount
               </td>
                <td
                 colspan="1"
                 style="border: 1px solid black; text-align: center; padding: 3px"
               >
                ${(Array.isArray(quantity) ? quantity : [quantity]).reduce((acc, curr) => acc + parseFloat(curr), 0)}
               </td>
               <td
                 style="
                   border: 1px solid black;
                   text-align: right;
                   padding: 3px;
                 "
                 colspan="2"
               >
               ${totalAmount}
               </td>
             </tr>
             <tr style="border: 1px solid black; text-align : center;">
                <td colSpan="8">
                    Total: ${currency} - ${words.toUpperCase()} ONLY
                </td>
             </tr>
             <tr>
            <td colSpan = "2">

            </td>
            <td colspan ="2" style="border: 1px solid black; text-align : center">
              TAXABLE <br />
              ${(totalAmount * exchangeRate).toFixed(2)}
            </td>
              <td></td>
              <td style="border: 1px solid black; text-align : center">
                TAX RATE <br/> 18%
              </td>
              <td style="border: 1px solid black; text-align : center">
                TAX <br/> ${(totalAmount * exchangeRate * 0.18).toFixed(2)}
              </td>
              <td colSpan="2" style="border: 1px solid black; text-align : center">
                TOTAL AMOUNT <br /> ${(
                  totalAmount * exchangeRate +
                  totalAmount * exchangeRate * 0.18
                ).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colspan="4" style="text-align: right; border : 0px solid">
                EXCHANGE RATE 1 ${sym} =
              </td>
              <td colspan="8" style="text-align: left; border: 0px solid black; margin-left : 10px">
                ${exchangeRate}
              </td>
            </tr>
             <tr>
              <td colspan="2" style = "border:1px solid black;">
                TAX AMOUNT <br /> [in words]
              </td>
              <td colspan="10" style = "border:1px solid black;">
                RUPEES - ${taxWords.toUpperCase()} ONLY
              </td>
            </tr>
            <tr>
              <td rowspan="7" colspan = "5" style = "border:1px solid black;">
                ALL MOBILE PHONES ARE SEALED INTACT & NON ACTIVATED
              </td>
              <td colspan="2" style="white-space: nowrap;text-align:center">
               Name:
              </td>
              <td colspan="2" style="white-space: nowrap;text-align:center" colspan=3>
               iTrade Bharat
               </td>
            </tr>
            <tr>
              <td colspan="2" style="white-space: nowrap;text-align:center">Bank: 
              </td>
              <td colspan="2" style="white-space: nowrap;text-align:center">
              Bank of Baroda</td>
            </tr>
            <tr>
            <td colspan="2" style="white-space: nowrap; text-align:center">
              Account: </td> 
              <td colspan="2" style="white-space: nowrap;text-align:center">3980200001888</td> 
            </tr>
            <tr>
            <td colspan="2" style="white-space: nowrap;text-align:center">
              IFSC NO:</td> 
              <td colspan="2" style="white-space: nowrap;text-align:center"> BARB0KHANDB 
              </td>
            </tr>
            <tr>
            <td colspan="2" style="white-space: nowrap;text-align:center">
              Branch:</td> 
              <td colspan="2" style="white-space: nowrap;text-align:center"> KHAND BAZAR
              </td>
            </tr>
            <tr>
            <td colspan="2" style="white-space: nowrap;text-align:center">
              Swift code: </td> 
              <td colspan="2" style="white-space: nowrap;text-align:center"> BARBINBBKBB </td>
            </tr>
            <tr>
            <td colspan="2" style="white-space: nowrap;text-align:center">
              AD CODE: </td> 
              <td colspan="2" style="white-space: nowrap;text-align:center"> 0200398-6000009 </td>
              </tr>
              <tr style="height:80px">
              <td colspan="7" style = "border:1px solid black; text-align:centre">
                We declare that this invoice shows the actual price of the goods described  and that all particulars are true and correct
              </td>
          <td colspan="7" style="border: 1px solid black; text-align: center; height: 80px;">
  <div style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; height: 100%;">
    <span style="align-self: center; text-align: center; white-space: nowrap;">iTrade Bharat</span>
    <span style="align-self: center; text-align: center; white-space: nowrap;">Authorised Signatory</span>
  </div>
</td>

              </tr>
           </tbody>
         </table>
       </div>
     </div>
   </body>
 </html>`;

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

