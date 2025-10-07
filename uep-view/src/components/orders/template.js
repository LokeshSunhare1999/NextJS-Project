module.exports = `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;" />
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700,800,900" rel="stylesheet" type="text/css">
        <title>UEP Viewer | Order Invoice</title>
        <style type="text/css">
            body {
                width: 100%;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
                font-family: "Open Sans", sans-serif;
            }
            .floatLeft{
                float: left;
            }
            .floatRight{
                float: right;
            }
            html {
                width: 100%;
            }
            .d-flex {
                display: flex;
            }
            .flex-column {
                flex-direction: column;
            }
            .table-column{
                display: block;
            }
            .text-right {
                text-align: right;
            }
            .text-center {
                text-align: center;
            }
            .text-left {
                text-align: left;
            }
            .mb-4 {
                margin-bottom: 1.5rem;
            }
            table {
                font-size: 14px;
                border: 0;
            }
            .container-box {
                margin-top: 75px;
            }
            .modal {
                box-shadow: 0px 2px 4px #0000001a;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 5px;
            }
            .content-modal {
                margin: -50px 50px 20px;
            }
            .order-invoice-content{
                margin: 25px 50px 25px;
            }
            .order-padding{
                padding-top: 40px;
            }
            .footer-modal {
                margin: 0px 50px 20px;
                text-align: center;
            }
            .section-img {
                background-color: #292828;
                height: 150px;
                display: flex;
                justify-content: space-around;
                align-items: center;
            }
            .order-invoice{
                justify-content: space-around;
                height: 95px;
                padding-top: 45px;
                display: block;
            }
            .receipt-label {
                font-weight: 600;
                font-size: 18px;
                letter-spacing: 0px;
                color: #FFFFFF;
                text-transform: uppercase;
                opacity: 1;
                text-align: center;
            }
            .bg-gray {
                background-color: #EEEEEE;
            }
            .billing-wrapper{
                display: flex;
            }
            .user-info {
                color: #121212;
                font-weight: 600;
                font-size: 12px;
                letter-spacing: 0px;
                margin-bottom: 5px;
                text-align: left;
            }
            .billing-address {
                color: #121212;
                font-weight: 600;
                font-size: 14px;
                letter-spacing: 0px;
                margin-bottom: 2px;
            }
            .billing-info {
                color: #121212;
                font-size: 12px;
                letter-spacing: 0px;
            }

            .inv-table {
                border-collapse: collapse;
            }

            .inv-table th {
                background-color: #EEEEEE;
                color: #121212;
                font-size: 10px;
                font-weight: 600;
            }

            .inv-table td {
                border: 1px solid #CCCCCC;
                padding: 4px;
            }

            .inv-table th {
                border: 1px solid #CCCCCC;
                padding: 6px;
            }
            .inv-table .tbl-desc {
                font-size: 10px;
                color: #121212;
            }
            .inv-table .tbl-img {
                height: 40px;
                width: 40px;
                border: 1px solid #CCCCCC;
            }
            .inv-table .bold-text {
                color: #121212;
                font-size: 11px;
                font-weight: 600;
            }
            .inv-table .bold-content td {
                padding: 8px;
            }
            .ft-content-modal {
                margin: 0px 50px 25px;
            }
            .ft-content-heading {
                color: #121212;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 4px;
            }
            .ft-content {
                color: #121212;
                font-size: 12px;
            }
            .amt-field {
                width: 260px;
            }
            .bortop-none {
                border-top: none !important;
            }
            .semiBold-text {
                letter-spacing: 0px;
                color: #121212;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 25px;
            }
            .content {
                color: #121212;
                margin-bottom: 25px;
                font-size: 16px;
                font-weight: 500;
                letter-spacing: 0px;
            }
            .content a, .theme-color {
                color: #EA377C;
            }
            .copy-rights {
                text-align: center;
                letter-spacing: 0px;
                color: #121212;
                font-size: 13px;
                opacity: 0.45;
                font-weight: 500;
                margin: 0 50px 25px;
            }
            /* ----------- responsivity ----------- */
            @media only screen and (max-width: 768px) {
                .container-box {
                    width: 80%;
                }
            }

            @media only screen and (max-width: 576px) {
                .container-box {
                    width: 90%;
                }
                .floatLeft{
                    text-align: center;
                    float:none
                }
                .receipt-label{
                    padding-top: 25px;
                    text-align: center;
                }
                .content-modal, .footer-modal, .ft-content-modal {
                    margin-left: 20px;
                    margin-right: 20px;
                }
                .modal {
                    padding: 25px;
                }
                .mobi-view {
                    overflow-x: auto;
                    margin: auto;
                    scroll-behavior: smooth;
                }
                .inv-table {
                    width: 525px;
                }
                .section-img {
                    flex-flow: column;
                    justify-content: space-evenly;
                    height: 200px
                }
            }

            @media only screen and (max-width: 476px) {
                .mobi-view {
                    scroll-behavior: smooth;
                }
                .receipt-label {
                    padding-top: 25px;
                    text-align: center;
                }
                .floatLeft{
                    text-align: center;
                    float:none
                }
                .floatRight{
                    float: none;
                }
                .billing-wrapper{
                    flex-flow: column;
                }
            }

            @media only screen and (max-width: 320px) {
                .mobi-view {
                    scroll-behavior: smooth;
                }
                .receipt-label {
                    padding-top: 25px;
                    text-align: center;
                }
                .floatLeft{
                    text-align: center;
                    float:none
                }
                .floatRight{
                    float: none;
                }
            }
        </style>
    </head>
    <body class="respond" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">
        <table border="0" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">
            <tr>
                <td align="center">
                    <table border="0" align="center" width="660px" cellpadding="0" cellspacing="0" class="container-box">
                    <tr>
                    <td class="section-img order-invoice" >
                    <div style="margin: 0px 50px 0px;">
                    <div class= "floatLeft"><img style="" src="https://storage.googleapis.com/syn-uep-viewer-176-bucket-dev/users/UEPLogo.png" width="220" border="0" alt="" /></div>
                    <div class="receipt-label floatRight">CUSTOMER RECEIPTS</div>
                    </div>
                    </td>
                    </tr>
                        <tr class="bg-gray">
                            <td>
                                <div class="content-modal modal order-invoice-content">
                                    <div class="billing-wrapper mb-4">
                                        <div class="d-flex flex-column table-column">
                                            <span class="user-info">{{{full_name}}}</span><br>
                                            <span class="user-info">{{{account_number}}}</span>

                                        </div>
                                        <div class="d-flex flex-column text-right table-column" style="margin-left: auto;">
                                                <span class="billing-address">Billing Address:</span><br />
                                                <span class="billing-info">{{{billing_user_name}}}</span><br />
                                                <span class="billing-info">{{{billing_street_address}}},{{{billing_apartment}}}</span><br />
                                                <span class="billing-info">{{{billing_city}}},{{{billing_state}}},{{{billing_zip_code}}}</span>
                                            </div>

                                  </div>
                                    <div class="billing-wrapper mb-4">
                                        <div class="d-flex flex-column table-column order-padding">
                                            <span class="mb-4"></span>
                                            <div class="user-info">Order No.: {{{order_number}}}</div>
                                            <div class="user-info">Date of Purchase: {{{purchase_datetime}}}</div>

                                        </div>
                                        <div class="d-flex flex-column text-right table-column" style="margin-left: auto;">
                                            <b class="shipping-address">Shipping Address:</b><br />
                                            <span class="shipping-info">{{{shipping_user_name}}}</span><br />
                                            <span class="shipping-info">{{{shipping_street_address}}},{{{shipping_apartment}}}</span><br />
                                            <span class="shipping-info">{{{shipping_city}}},{{{shipping_state}}},{{{shipping_zip_code}}}</span>

                                         </div>
                                    </div>
                                    <div class="mobi-view">
                                        <table class="inv-table">
                                            <tr>
                                              <th>S/No.</th>
                                              <th style="width: 270px;" class="text-left">Description</th>
                                              <th style="width: 100px;" class="text-center" >Event Name</th>
                                              <th class="text-center">Unit Price</th>
                                              <th class="text-center">Qty</th>
                                              <th class="text-center">Net Amount</th>
                                              <th class="text-center">Total</th>
                                            </tr>
                                           {{{content}}}
                                           <tr class="bold-content">
                                                <td colspan="8">
                                                    <div class="billing-wrapper">
                                                        <span class="bold-text">Sub Total:</span>
                                                        <span class="bold-text" style="margin-left: auto;">{{{sub_total}}}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr class="bold-content">
                                                <td colspan="8">
                                                    <div class="billing-wrapper">
                                                        <span class="bold-text">Shipping Fee:</span>
                                                        <span class="bold-text" style="margin-left: auto;">{{{shipping_fee}}}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr class="bold-content">
                                                <td colspan="8">
                                                    <div class="billing-wrapper">
                                                        <span class="bold-text">Total Amount:</span>
                                                        <span class="bold-text" style="margin-left: auto;">{{{total_amount}}}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr class="bold-content">
                                                <td colspan="8">
                                                    <span class="bold-text">Amount In Words:</span>
                                                    <span class="bold-text">{{{amount_in_words}}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                        <table class="inv-table">
                                            <tr class="bold-content">
                                                <td class="amt-field bortop-none">
                                                    <span class="bold-text">Amount Due:</span>
                                                    <span class="bold-text">Nil</span>
                                                </td>
                                                <td class="amt-field bortop-none">
                                                    <span class="bold-text">Amount Paid:</span>
                                                    <span class="bold-text">{{{amount_paid}}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                        <br />
                                        <table class="inv-table" >
                                            <tr class="bold-content">
                                                <td class="amt-field">
                                                    <span class="bold-text">Delivery Method:</span>
                                                    <span class="tbl-desc">{{{delivery_method}}}</span>
                                                </td>
                                                <td class="amt-field">
                                                    <span class="bold-text">Payment Method:</span>
                                                    <span class="tbl-desc">{{{payment_method}}}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <br />
                                </div>
                            </td>
                        </tr>
                        <tr class="bg-gray">
                            <td>
                                <div class="modal footer-modal">
                                    <div class="semiBold-text theme-color" style="margin-bottom: 5px;">
                                        Need more help?
                                    </div>
                                    <div class="content" style="margin-bottom: 0px;">
                                        Visit the <a href="#">UEP Support</a> for more info or <a href="#">Contact us</a>.
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr class="bg-gray">
                            <td>
                                <div class="modal ft-content-modal">
                                    <div class="mb-4">
                                        <div class="ft-content-heading"> Uploading & Delivery Instruction</div>
                                        <div class="ft-content">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem.</div>
                                    </div>
                                    <div class="ft-content-heading"> Thank you note:</div>
                                    <div class="ft-content">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna a.</div>
                                </div>
                            </td>
                        </tr>
                        <tr class="bg-gray">
                            <td>
                                <div class="copy-rights">
                                    Universal Event Photography • 5852 S. Semoran Blvd Orlando, FL 32826
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td height="40" style="font-size: 40px; line-height: 40px;">&nbsp;</td>
            </tr>
        </table>
    </body>
    </html>`