const express = require('express');
const parser = require('xml-js');
const JsonFind = require('json-find');
const request = require('request');
const bodyParser = require('body-parser');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const { Console } = require('console');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var loginCred = [];

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unauthorized Request not null');
    }
    let payload = jwt.verify(token, 'SeCrEtKeY');
    if (!payload) {
        return res.status(401).send('Unauthorized Request no payload');
    }
    req.username = payload.subject;
    next();
}

// ---------------Headers---------------
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', '*');
    next();
});

app.get('/', (req, res) => {
    res.send('Server Status : Running');
});

app.post('/login', function(req, res) {
    username = req.body.username;
    password = req.body.password;

    console.log('Login Set Username : ' + loginCred);

    hashedPassword = md5(password);
    hashedPassword = hashedPassword.toUpperCase();

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	<urn:ZSD_FM_LOGIN_AJ>
		<!--You may enter the following 2 items in any order-->
		<I_PASSWORD>` +
        hashedPassword +
        `</I_PASSWORD>
		<I_USERNAME>` +
        username +
        `</I_USERNAME>
	</urn:ZSD_FM_LOGIN_AJ>
	</soapenv:Body>
	</soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSTOMER_SENDER_AJ&receiverParty=&receiverService=&interface=SI_LOGIN_SERVICE_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var response = parser.xml2json(body, { compact: true, spaces: 4 });
            response = JSON.parse(response);
            const result = JsonFind(response);
            const resultVal = result.checkKey('_text');
            console.log(resultVal);
            if (resultVal !== 'NULL') {
				loginCred.push(username);
                let payload = { subject: username };
                let token = jwt.sign(payload, 'SeCrEtKeY');
                let result = token + ':::::' + resultVal;
                res.send(JSON.stringify(result));
            } else {
                console.log('Error', resultVal);
                res.send(JSON.stringify(resultVal));
            }
        }
    });
});

// app.get('/viewprofile' ,verifyToken, function(res) {
app.get('/viewprofile', function(req, res) {
    username = loginCred[loginCred.length - 1];
    console.log('View Profile: ' + username);
    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
		<urn:ZSD_CUSTOMER_DETAILS_AJ>
			<I_CUSTOMER_ID>` +
        username +
        `</I_CUSTOMER_ID>
		</urn:ZSD_CUSTOMER_DETAILS_AJ>
	</soapenv:Body>
	</soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BS_CUSTDET_AJ&receiverParty=&receiverService=&interface=SI_CUSTDET_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            var resp = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZSD_CUSTOMER_DETAILS_AJ.Response']['E_IT_CUST_DET'];
            res.send(resp);
        }
    });
});

// app.post('/editprofile',verifyToken,(res,req)=>
app.post('/editprofile', (req, res) => {
    username = loginCred[loginCred.length - 1];
    // username = '0000007006'

    const loginData =
        `
	<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZSD_UPDATE_PROFILE_AJ>
         <!--You may enter the following 9 items in any order-->
         <I_CITY>` +
        req.body.c_city +
        `</I_CITY>
         <I_COUNTRY>` +
        req.body.c_country +
        `</I_COUNTRY>
         <I_CUSTOMER_ID>` +
        username +
        `</I_CUSTOMER_ID>
         <I_MOBILE>` +
        req.body.c_mobile +
        `</I_MOBILE>
         <I_NAME1>` +
        req.body.cf_name +
        `</I_NAME1>
         <I_NAME2>` +
        req.body.cl_name +
        `</I_NAME2>
         <I_PINCODE>` +
        req.body.c_pin +
        `</I_PINCODE>
         <I_STATE>` +
        req.body.c_state +
        `</I_STATE>
         <I_STREET>` +
        req.body.c_street +
        `</I_STREET>
      </urn:ZSD_UPDATE_PROFILE_AJ>
   </soapenv:Body>
</soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_UPDATE_PROFILE_AJ&receiverParty=&receiverService=&interface=SI_PROFILE_UPDATE_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            console.log('Edit Profile: Success' + result2);
            res.send(JSON.stringify('Success'));
        } else {
            res.send(JSON.stringify('Error'));
        }
    });
});

app.get('/salesorder', function(req, res) {
    username = loginCred[loginCred.length - 1];
    console.log('SalesOrder: ' + username);

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZSD_GET_SALESORDER_AJ>
		  <!--You may enter the following 9 items in any order-->
		  <I_CUSTOMER_ID>` +
        username +
        `</I_CUSTOMER_ID>
		  <!--Optional:-->
		  <I_DOCDATE></I_DOCDATE>
		  <!--Optional:-->
		  <I_DOCDATE_TO></I_DOCDATE_TO>
		  <!--Optional:-->
		  <I_MATERIAL></I_MATERIAL>
		  <!--Optional:-->
		  <I_MATERIAL_EVG>
			 <!--Optional:-->
			 <MATERIAL_EXT></MATERIAL_EXT>
			 <!--Optional:-->
			 <MATERIAL_VERS></MATERIAL_VERS>
			 <!--Optional:-->
			 <MATERIAL_GUID></MATERIAL_GUID>
		  </I_MATERIAL_EVG>
		  <!--Optional:-->
		  <I_PURCHASE_ORDER></I_PURCHASE_ORDER>
		  <!--Optional:-->
		  <I_PURCHASE_ORDER_NO></I_PURCHASE_ORDER_NO>
		  <I_SALESORG>` +
        'SA01' +
        `</I_SALESORG>
		  <!--Optional:-->
		  <I_TRANSACTION_GRP></I_TRANSACTION_GRP>
	   </urn:ZSD_GET_SALESORDER_AJ>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_GET_SALESORDER_AJ&receiverParty=&receiverService=&interface=SI_SALES_ORDER_DETAILS_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            var resp = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZSD_GET_SALESORDER_AJ.Response']['E_SALESORDERS'];
            res.send(resp);
        }
    });
});

app.get('/memo', function(req, res) {
    username = loginCred[loginCred.length - 1];
    console.log('Memo: ' + username);

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZFI_CREDIT_DEBIT_MEMO_AJ>
		  <!--You may enter the following 4 items in any order-->
		  <I_COMPANY_CODE>SA01</I_COMPANY_CODE>
		  <I_CUSTOMER_ID>` +
        username +
        `</I_CUSTOMER_ID>
		  <!--Optional:-->
		  <I_DOCUMENT_DATE></I_DOCUMENT_DATE>
		  <IT_DETAILS>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<COMP_CODE></COMP_CODE>
				<!--Optional:-->
				<CUSTOMER></CUSTOMER>
				<!--Optional:-->
				<SP_GL_IND></SP_GL_IND>
				<!--Optional:-->
				<CLEAR_DATE></CLEAR_DATE>
				<!--Optional:-->
				<CLR_DOC_NO></CLR_DOC_NO>
				<!--Optional:-->
				<ALLOC_NMBR></ALLOC_NMBR>
				<!--Optional:-->
				<FISC_YEAR></FISC_YEAR>
				<!--Optional:-->
				<DOC_NO></DOC_NO>
				<!--Optional:-->
				<ITEM_NUM></ITEM_NUM>
				<!--Optional:-->
				<PSTNG_DATE></PSTNG_DATE>
				<!--Optional:-->
				<DOC_DATE></DOC_DATE>
				<!--Optional:-->
				<ENTRY_DATE></ENTRY_DATE>
				<!--Optional:-->
				<CURRENCY></CURRENCY>
				<!--Optional:-->
				<LOC_CURRCY></LOC_CURRCY>
				<!--Optional:-->
				<REF_DOC_NO></REF_DOC_NO>
				<!--Optional:-->
				<DOC_TYPE></DOC_TYPE>
				<!--Optional:-->
				<FIS_PERIOD></FIS_PERIOD>
				<!--Optional:-->
				<POST_KEY></POST_KEY>
				<!--Optional:-->
				<DB_CR_IND></DB_CR_IND>
				<!--Optional:-->
				<BUS_AREA></BUS_AREA>
				<!--Optional:-->
				<TAX_CODE></TAX_CODE>
				<!--Optional:-->
				<LC_AMOUNT></LC_AMOUNT>
				<!--Optional:-->
				<AMT_DOCCUR></AMT_DOCCUR>
				<!--Optional:-->
				<LC_TAX></LC_TAX>
				<!--Optional:-->
				<TX_DOC_CUR></TX_DOC_CUR>
				<!--Optional:-->
				<ITEM_TEXT></ITEM_TEXT>
				<!--Optional:-->
				<BRANCH></BRANCH>
				<!--Optional:-->
				<BLINE_DATE></BLINE_DATE>
				<!--Optional:-->
				<PMNTTRMS></PMNTTRMS>
				<!--Optional:-->
				<DSCT_DAYS1></DSCT_DAYS1>
				<!--Optional:-->
				<DSCT_DAYS2></DSCT_DAYS2>
				<!--Optional:-->
				<NETTERMS></NETTERMS>
				<!--Optional:-->
				<DSCT_PCT1></DSCT_PCT1>
				<!--Optional:-->
				<DSCT_PCT2></DSCT_PCT2>
				<!--Optional:-->
				<DISC_BASE></DISC_BASE>
				<!--Optional:-->
				<DSC_AMT_LC></DSC_AMT_LC>
				<!--Optional:-->
				<DSC_AMT_DC></DSC_AMT_DC>
				<!--Optional:-->
				<PYMT_METH></PYMT_METH>
				<!--Optional:-->
				<PMNT_BLOCK></PMNT_BLOCK>
				<!--Optional:-->
				<FIXEDTERMS></FIXEDTERMS>
				<!--Optional:-->
				<INV_REF></INV_REF>
				<!--Optional:-->
				<INV_YEAR></INV_YEAR>
				<!--Optional:-->
				<INV_ITEM></INV_ITEM>
				<!--Optional:-->
				<DUNN_BLOCK></DUNN_BLOCK>
				<!--Optional:-->
				<DUNN_KEY></DUNN_KEY>
				<!--Optional:-->
				<LAST_DUNN></LAST_DUNN>
				<!--Optional:-->
				<DUNN_LEVEL></DUNN_LEVEL>
				<!--Optional:-->
				<DUNN_AREA></DUNN_AREA>
				<!--Optional:-->
				<DOC_STATUS></DOC_STATUS>
				<!--Optional:-->
				<NXT_DOCTYP></NXT_DOCTYP>
				<!--Optional:-->
				<VAT_REG_NO></VAT_REG_NO>
				<!--Optional:-->
				<REASON_CDE></REASON_CDE>
				<!--Optional:-->
				<PMTMTHSUPL></PMTMTHSUPL>
				<!--Optional:-->
				<REF_KEY_1></REF_KEY_1>
				<!--Optional:-->
				<REF_KEY_2></REF_KEY_2>
				<!--Optional:-->
				<T_CURRENCY></T_CURRENCY>
				<!--Optional:-->
				<AMOUNT></AMOUNT>
				<!--Optional:-->
				<NET_AMOUNT></NET_AMOUNT>
				<!--Optional:-->
				<NAME></NAME>
				<!--Optional:-->
				<NAME_2></NAME_2>
				<!--Optional:-->
				<NAME_3></NAME_3>
				<!--Optional:-->
				<NAME_4></NAME_4>
				<!--Optional:-->
				<POSTL_CODE></POSTL_CODE>
				<!--Optional:-->
				<CITY></CITY>
				<!--Optional:-->
				<COUNTRY></COUNTRY>
				<!--Optional:-->
				<STREET></STREET>
				<!--Optional:-->
				<PO_BOX></PO_BOX>
				<!--Optional:-->
				<POBX_PCD></POBX_PCD>
				<!--Optional:-->
				<POBK_CURAC></POBK_CURAC>
				<!--Optional:-->
				<BANK_ACCT></BANK_ACCT>
				<!--Optional:-->
				<BANK_KEY></BANK_KEY>
				<!--Optional:-->
				<BANK_CTRY></BANK_CTRY>
				<!--Optional:-->
				<TAX_NO_1></TAX_NO_1>
				<!--Optional:-->
				<TAX_NO_2></TAX_NO_2>
				<!--Optional:-->
				<TAX></TAX>
				<!--Optional:-->
				<EQUAL_TAX></EQUAL_TAX>
				<!--Optional:-->
				<REGION></REGION>
				<!--Optional:-->
				<CTRL_KEY></CTRL_KEY>
				<!--Optional:-->
				<INSTR_KEY></INSTR_KEY>
				<!--Optional:-->
				<PAYEE_CODE></PAYEE_CODE>
				<!--Optional:-->
				<LANGU></LANGU>
				<!--Optional:-->
				<BILL_LIFE></BILL_LIFE>
				<!--Optional:-->
				<BE_TAXCODE></BE_TAXCODE>
				<!--Optional:-->
				<BILLTAX_LC></BILLTAX_LC>
				<!--Optional:-->
				<BILLTAX_FC></BILLTAX_FC>
				<!--Optional:-->
				<LC_COL_CHG></LC_COL_CHG>
				<!--Optional:-->
				<COLL_CHARG></COLL_CHARG>
				<!--Optional:-->
				<CHGS_TX_CD></CHGS_TX_CD>
				<!--Optional:-->
				<ISSUE_DATE></ISSUE_DATE>
				<!--Optional:-->
				<USAGEDATE></USAGEDATE>
				<!--Optional:-->
				<BILL_USAGE></BILL_USAGE>
				<!--Optional:-->
				<DOMICILE></DOMICILE>
				<!--Optional:-->
				<DRAWER></DRAWER>
				<!--Optional:-->
				<CTRBNK_LOC></CTRBNK_LOC>
				<!--Optional:-->
				<DRAW_CITY1></DRAW_CITY1>
				<!--Optional:-->
				<DRAWEE></DRAWEE>
				<!--Optional:-->
				<DRAW_CITY2></DRAW_CITY2>
				<!--Optional:-->
				<DISCT_DAYS></DISCT_DAYS>
				<!--Optional:-->
				<DISCT_RATE></DISCT_RATE>
				<!--Optional:-->
				<ACCEPTED></ACCEPTED>
				<!--Optional:-->
				<BILLSTATUS></BILLSTATUS>
				<!--Optional:-->
				<PRTEST_IND></PRTEST_IND>
				<!--Optional:-->
				<BE_DEMAND></BE_DEMAND>
				<!--Optional:-->
				<OBJ_TYPE></OBJ_TYPE>
				<!--Optional:-->
				<REF_DOC></REF_DOC>
				<!--Optional:-->
				<REF_ORG_UN></REF_ORG_UN>
				<!--Optional:-->
				<REVERSAL_DOC></REVERSAL_DOC>
				<!--Optional:-->
				<SP_GL_TYPE></SP_GL_TYPE>
				<!--Optional:-->
				<NEG_POSTNG></NEG_POSTNG>
				<!--Optional:-->
				<REF_DOC_NO_LONG></REF_DOC_NO_LONG>
				<!--Optional:-->
				<BILL_DOC></BILL_DOC>
			 </item>
		  </IT_DETAILS>
	   </urn:ZFI_CREDIT_DEBIT_MEMO_AJ>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BS_CB_AJ&receiverParty=&receiverService=&interface=SI_CB_MEMO_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result1 = JSON.parse(result1);
            res.send(result1);
        }
    });
});

app.get('/delivery', function(req, res) {
    username = loginCred[loginCred.length - 1];
    console.log('Delivery: ' + username);

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZSD_DELIVERY_DETAILS>
		  <!--You may enter the following 2 items in any order-->
		  <I_CUSTOMER_ID>` +
        username +
        `</I_CUSTOMER_ID>
		  <!--Optional:-->
		  <IT_DELIVERY_T>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<KUNNR></KUNNR>
				<!--Optional:-->
				<KUNAG></KUNAG>
				<!--Optional:-->
				<VBELN></VBELN>
				<!--Optional:-->
				<ERZET></ERZET>
				<!--Optional:-->
				<ERDAT></ERDAT>
				<!--Optional:-->
				<VKORG></VKORG>
				<!--Optional:-->
				<LFART></LFART>
				<!--Optional:-->
				<LFDAT_V></LFDAT_V>
				<!--Optioal:-->
				<INCO2></INCO2>
				<!--Optional:-->
				<LFUHR></LFUHR>
				<!--Optional:-->
				<MATNR></MATNR>
				<!--Optional:-->
				<POSNR></POSNR>
				<!--Optional:-->
				<ARKTX></ARKTX>
			 </item>
		  </IT_DELIVERY_T>
	   </urn:ZSD_DELIVERY_DETAILS>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_DELIVERY_DETAILS_AJ&receiverParty=&receiverService=&interface=SI_DELDET_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result1 = JSON.parse(result1);
            res.send(result1);
        }
    });
});

app.get('/payage', function(req, res) {
    username = loginCred[loginCred.length - 1];
    console.log('Payage: ' + username);

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZFI_PAYMENT_AGING_AJ>
		  <!--You may enter the following 4 items in any order-->
		  <I_COMPNAY_CODE>SA01</I_COMPNAY_CODE>
		  <I_CUSTOMER_ID>` +
        username +
        `</I_CUSTOMER_ID>
		  <!--Optional:-->
		  <I_DOCUMENT_DATE></I_DOCUMENT_DATE>
		  <IT_DETAILS>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<COMP_CODE></COMP_CODE>
				<!--Optional:-->
				<CUSTOMER></CUSTOMER>
				<!--Optional:-->
				<SP_GL_IND></SP_GL_IND>
				<!--Optional:-->
				<CLEAR_DATE></CLEAR_DATE>
				<!--Optional:-->
				<CLR_DOC_NO></CLR_DOC_NO>
				<!--Optional:-->
				<ALLOC_NMBR></ALLOC_NMBR>
				<!--Optional:-->
				<FISC_YEAR></FISC_YEAR>
				<!--Optional:-->
				<DOC_NO></DOC_NO>
				<!--Optional:-->
				<ITEM_NUM></ITEM_NUM>
				<!--Optional:-->
				<PSTNG_DATE></PSTNG_DATE>
				<!--Optional:-->
				<DOC_DATE></DOC_DATE>
				<!--Optional:-->
				<ENTRY_DATE></ENTRY_DATE>
				<!--Optional:-->
				<CURRENCY></CURRENCY>
				<!--Optional:-->
				<LOC_CURRCY></LOC_CURRCY>
				<!--Optional:-->
				<REF_DOC_NO></REF_DOC_NO>
				<!--Optional:-->
				<DOC_TYPE></DOC_TYPE>
				<!--Optional:-->
				<FIS_PERIOD></FIS_PERIOD>
				<!--Optional:-->
				<POST_KEY></POST_KEY>
				<!--Optional:-->
				<DB_CR_IND></DB_CR_IND>
				<!--Optional:-->
				<BUS_AREA></BUS_AREA>
				<!--Optional:-->
				<TAX_CODE></TAX_CODE>
				<!--Optional:-->
				<LC_AMOUNT></LC_AMOUNT>
				<!--Optional:-->
				<AMT_DOCCUR></AMT_DOCCUR>
				<!--Optional:-->
				<LC_TAX></LC_TAX>
				<!--Optional:-->
				<TX_DOC_CUR></TX_DOC_CUR>
				<!--Optional:-->
				<ITEM_TEXT></ITEM_TEXT>
				<!--Optional:-->
				<BRANCH></BRANCH>
				<!--Optional:-->
				<BLINE_DATE></BLINE_DATE>
				<!--Optional:-->
				<PMNTTRMS></PMNTTRMS>
				<!--Optional:-->
				<DSCT_DAYS1></DSCT_DAYS1>
				<!--Optional:-->
				<DSCT_DAYS2></DSCT_DAYS2>
				<!--Optional:-->
				<NETTERMS></NETTERMS>
				<!--Optional:-->
				<DSCT_PCT1></DSCT_PCT1>
				<!--Optional:-->
				<DSCT_PCT2></DSCT_PCT2>
				<!--Optional:-->
				<DISC_BASE></DISC_BASE>
				<!--Optional:-->
				<DSC_AMT_LC></DSC_AMT_LC>
				<!--Optional:-->
				<DSC_AMT_DC></DSC_AMT_DC>
				<!--Optional:-->
				<PYMT_METH></PYMT_METH>
				<!--Optional:-->
				<PMNT_BLOCK></PMNT_BLOCK>
				<!--Optional:-->
				<FIXEDTERMS></FIXEDTERMS>
				<!--Optional:-->
				<INV_REF></INV_REF>
				<!--Optional:-->
				<INV_YEAR></INV_YEAR>
				<!--Optional:-->
				<INV_ITEM></INV_ITEM>
				<!--Optional:-->
				<DUNN_BLOCK></DUNN_BLOCK>
				<!--Optional:-->
				<DUNN_KEY></DUNN_KEY>
				<!--Optional:-->
				<LAST_DUNN></LAST_DUNN>
				<!--Optional:-->
				<DUNN_LEVEL></DUNN_LEVEL>
				<!--Optional:-->
				<DUNN_AREA></DUNN_AREA>
				<!--Optional:-->
				<DOC_STATUS></DOC_STATUS>
				<!--Optional:-->
				<NXT_DOCTYP></NXT_DOCTYP>
				<!--Optional:-->
				<VAT_REG_NO></VAT_REG_NO>
				<!--Optional:-->
				<REASON_CDE></REASON_CDE>
				<!--Optional:-->
				<PMTMTHSUPL></PMTMTHSUPL>
				<!--Optional:-->
				<REF_KEY_1></REF_KEY_1>
				<!--Optional:-->
				<REF_KEY_2></REF_KEY_2>
				<!--Optional:-->
				<T_CURRENCY></T_CURRENCY>
				<!--Optional:-->
				<AMOUNT></AMOUNT>
				<!--Optional:-->
				<NET_AMOUNT></NET_AMOUNT>
				<!--Optional:-->
				<NAME></NAME>
				<!--Optional:-->
				<NAME_2></NAME_2>
				<!--Optional:-->
				<NAME_3></NAME_3>
				<!--Optional:-->
				<NAME_4></NAME_4>
				<!--Optional:-->
				<POSTL_CODE></POSTL_CODE>
				<!--Optional:-->
				<CITY></CITY>
				<!--Optional:-->
				<COUNTRY></COUNTRY>
				<!--Optional:-->
				<STREET></STREET>
				<!--Optional:-->
				<PO_BOX></PO_BOX>
				<!--Optional:-->
				<POBX_PCD></POBX_PCD>
				<!--Optional:-->
				<POBK_CURAC></POBK_CURAC>
				<!--Optional:-->
				<BANK_ACCT></BANK_ACCT>
				<!--Optional:-->
				<BANK_KEY></BANK_KEY>
				<!--Optional:-->
				<BANK_CTRY></BANK_CTRY>
				<!--Optional:-->
				<TAX_NO_1></TAX_NO_1>
				<!--Optional:-->
				<TAX_NO_2></TAX_NO_2>
				<!--Optional:-->
				<TAX></TAX>
				<!--Optional:-->
				<EQUAL_TAX></EQUAL_TAX>
				<!--Optional:-->
				<REGION></REGION>
				<!--Optional:-->
				<CTRL_KEY></CTRL_KEY>
				<!--Optional:-->
				<INSTR_KEY></INSTR_KEY>
				<!--Optional:-->
				<PAYEE_CODE></PAYEE_CODE>
				<!--Optional:-->
				<LANGU></LANGU>
				<!--Optional:-->
				<BILL_LIFE></BILL_LIFE>
				<!--Optional:-->
				<BE_TAXCODE></BE_TAXCODE>
				<!--Optional:-->
				<BILLTAX_LC></BILLTAX_LC>
				<!--Optional:-->
				<BILLTAX_FC></BILLTAX_FC>
				<!--Optional:-->
				<LC_COL_CHG></LC_COL_CHG>
				<!--Optional:-->
				<COLL_CHARG></COLL_CHARG>
				<!--Optional:-->
				<CHGS_TX_CD></CHGS_TX_CD>
				<!--Optional:-->
				<ISSUE_DATE></ISSUE_DATE>
				<!--Optional:-->
				<USAGEDATE></USAGEDATE>
				<!--Optional:-->
				<BILL_USAGE></BILL_USAGE>
				<!--Optional:-->
				<DOMICILE></DOMICILE>
				<!--Optional:-->
				<DRAWER></DRAWER>
				<!--Optional:-->
				<CTRBNK_LOC></CTRBNK_LOC>
				<!--Optional:-->
				<DRAW_CITY1></DRAW_CITY1>
				<!--Optional:-->
				<DRAWEE></DRAWEE>
				<!--Optional:-->
				<DRAW_CITY2></DRAW_CITY2>
				<!--Optional:-->
				<DISCT_DAYS></DISCT_DAYS>
				<!--Optional:-->
				<DISCT_RATE></DISCT_RATE>
				<!--Optional:-->
				<ACCEPTED></ACCEPTED>
				<!--Optional:-->
				<BILLSTATUS></BILLSTATUS>
				<!--Optional:-->
				<PRTEST_IND></PRTEST_IND>
				<!--Optional:-->
				<BE_DEMAND></BE_DEMAND>
				<!--Optional:-->
				<OBJ_TYPE></OBJ_TYPE>
				<!--Optional:-->
				<REF_DOC></REF_DOC>
				<!--Optional:-->
				<REF_ORG_UN></REF_ORG_UN>
				<!--Optional:-->
				<REVERSAL_DOC></REVERSAL_DOC>
				<!--Optional:-->
				<SP_GL_TYPE></SP_GL_TYPE>
				<!--Optional:-->
				<NEG_POSTNG></NEG_POSTNG>
				<!--Optional:-->
				<REF_DOC_NO_LONG></REF_DOC_NO_LONG>
				<!--Optional:-->
				<BILL_DOC></BILL_DOC>
			 </item>
		  </IT_DETAILS>
	   </urn:ZFI_PAYMENT_AGING_AJ>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BS_PAYAGE_AJ&receiverParty=&receiverService=&interface=SI_PAYAGE_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result1 = JSON.parse(result1);
            res.send(result1);
        }
    });
});

app.get('/inquiry', function(req, res) {
    username = loginCred[loginCred.length - 1];
    console.log('inquiry: ' + username);

    const loginData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZSD_CUSTOMER_INQUIRY_AJ>
		  <!--You may enter the following 2 items in any order-->
		  <I_CUSTOMER_ID>0000000018</I_CUSTOMER_ID>
		  <!--Optional:-->
		  <ZSD_INQUIRYDETAILS_AJ_T>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<OPERATION></OPERATION>
				<!--Optional:-->
				<DOC_NUMBER></DOC_NUMBER>
				<!--Optional:-->
				<ITM_NUMBER></ITM_NUMBER>
				<!--Optional:-->
				<MATERIAL></MATERIAL>
				<!--Optional:-->
				<MAT_ENTRD></MAT_ENTRD>
				<!--Optional:-->
				<PR_REF_MAT></PR_REF_MAT>
				<!--Optional:-->
				<BATCH></BATCH>
				<!--Optional:-->
				<MATL_GROUP></MATL_GROUP>
				<!--Optional:-->
				<SHORT_TEXT></SHORT_TEXT>
				<!--Optional:-->
				<ITEM_CATEG></ITEM_CATEG>
				<!--Optional:-->
				<ITEM_TYPE></ITEM_TYPE>
				<!--Optional:-->
				<REL_FOR_DE></REL_FOR_DE>
				<!--Optional:-->
				<REL_FOR_BI></REL_FOR_BI>
				<!--Optional:-->
				<HG_LV_ITEM></HG_LV_ITEM>
				<!--Optional:-->
				<ALTERN_ITM></ALTERN_ITM>
				<!--Optional:-->
				<REA_FOR_RE></REA_FOR_RE>
				<!--Optional:-->
				<PROD_HIER></PROD_HIER>
				<!--Optional:-->
				<OUT_AGR_TA></OUT_AGR_TA>
				<!--Optional:-->
				<TARGET_QTY></TARGET_QTY>
				<!--Optional:-->
				<TARGET_QU></TARGET_QU>
				<!--Optional:-->
				<T_UNIT_ISO></T_UNIT_ISO>
				<!--Optional:-->
				<TARG_QTY_N></TARG_QTY_N>
				<!--Optional:-->
				<TARG_QTY_D></TARG_QTY_D>
				<!--Optional:-->
				<BASE_UOM></BASE_UOM>
				<!--Optional:-->
				<T_BAS_UNIT></T_BAS_UNIT>
				<!--Optional:-->
				<SCALE_QUAN></SCALE_QUAN>
				<!--Optional:-->
				<ROUND_DLV></ROUND_DLV>
				<!--Optional:-->
				<RECON_DATE></RECON_DATE>
				<!--Optional:-->
				<MAX_DEVIAT></MAX_DEVIAT>
				<!--Optional:-->
				<PO_ITM_NO></PO_ITM_NO>
				<!--Optional:-->
				<CUST_MAT22></CUST_MAT22>
				<!--Optional:-->
				<MAX_DEV_PE></MAX_DEV_PE>
				<!--Optional:-->
				<MAX_DEV_DA></MAX_DEV_DA>
				<!--Optional:-->
				<REPAIR_PRO></REPAIR_PRO>
				<!--Optional:-->
				<DLVSCHEDUS></DLVSCHEDUS>
				<!--Optional:-->
				<DLV_GROUP></DLV_GROUP>
				<!--Optional:-->
				<FIXED_QUAN></FIXED_QUAN>
				<!--Optional:-->
				<DELI_UNLIM></DELI_UNLIM>
				<!--Optional:-->
				<OVER_DLV_T></OVER_DLV_T>
				<!--Optional:-->
				<UNDER_DLV></UNDER_DLV>
				<!--Optional:-->
				<BILL_BLOCK></BILL_BLOCK>
				<!--Optional:-->
				<REPLACE_PT></REPLACE_PT>
				<!--Optional:-->
				<METH_BILL></METH_BILL>
				<!--Optional:-->
				<DIVISION></DIVISION>
				<!--Optional:-->
				<BUS_AREA></BUS_AREA>
				<!--Optional:-->
				<NET_VALUE></NET_VALUE>
				<!--Optional:-->
				<CURRENCY></CURRENCY>
				<!--Optional:-->
				<CURREN_ISO></CURREN_ISO>
				<!--Optional:-->
				<MAX_PL_DLV></MAX_PL_DLV>
				<!--Optional:-->
				<PART_DLV></PART_DLV>
				<!--Optional:-->
				<BTCH_SPLIT></BTCH_SPLIT>
				<!--Optional:-->
				<REQ_QTY></REQ_QTY>
				<!--Optional:-->
				<CUM_REQ_DE></CUM_REQ_DE>
				<!--Optional:-->
				<CUM_CF_QTY></CUM_CF_QTY>
				<!--Optional:-->
				<CUM_CON_QU></CUM_CON_QU>
				<!--Optional:-->
				<SALES_UNIT></SALES_UNIT>
				<!--Optional:-->
				<ISOCODUNIT></ISOCODUNIT>
				<!--Optional:-->
				<SALES_QTY1></SALES_QTY1>
				<!--Optional:-->
				<SALES_QTY2></SALES_QTY2>
				<!--Optional:-->
				<GROSS_WEIG></GROSS_WEIG>
				<!--Optional:-->
				<NET_WEIGHT></NET_WEIGHT>
				<!--Optional:-->
				<UNIT_OF_WT></UNIT_OF_WT>
				<!--Optional:-->
				<UNIT_WTISO></UNIT_WTISO>
				<!--Optional:-->
				<VOLUME></VOLUME>
				<!--Optional:-->
				<VOLUMEUNIT></VOLUMEUNIT>
				<!--Optional:-->
				<VOLUNITISO></VOLUNITISO>
				<!--Optional:-->
				<CAU_VBELN></CAU_VBELN>
				<!--Optional:-->
				<CAU_POSNR></CAU_POSNR>
				<!--Optional:-->
				<REF_DOC></REF_DOC>
				<!--Optional:-->
				<POSNR_VOR></POSNR_VOR>
				<!--Optional:-->
				<OBJ_COPY></OBJ_COPY>
				<!--Optional:-->
				<UPDAT_FLAG></UPDAT_FLAG>
				<!--Optional:-->
				<END_RULE></END_RULE>
				<!--Optional:-->
				<DLV_PRIO></DLV_PRIO>
				<!--Optional:-->
				<PLANT></PLANT>
				<!--Optional:-->
				<STGE_LOC></STGE_LOC>
				<!--Optional:-->
				<SHIP_POINT></SHIP_POINT>
				<!--Optional:-->
				<ROUTE></ROUTE>
				<!--Optional:-->
				<KEY_ST></KEY_ST>
				<!--Optional:-->
				<DATE_ST></DATE_ST>
				<!--Optional:-->
				<NBR_ST></NBR_ST>
				<!--Optional:-->
				<STPOS_VBAP></STPOS_VBAP>
				<!--Optional:-->
				<ORDER_PROB></ORDER_PROB>
				<!--Optional:-->
				<CREAT_DATE></CREAT_DATE>
				<!--Optional:-->
				<CREATED_BY></CREATED_BY>
				<!--Optional:-->
				<REC_TIME></REC_TIME>
				<!--Optional:-->
				<TAX_CLASS1></TAX_CLASS1>
				<!--Optional:-->
				<TAX_CLASS2></TAX_CLASS2>
				<!--Optional:-->
				<TAX_CLASS3></TAX_CLASS3>
				<!--Optional:-->
				<TAX_CLASS4></TAX_CLASS4>
				<!--Optional:-->
				<TAX_CLASS5></TAX_CLASS5>
				<!--Optional:-->
				<TAX_CLASS6></TAX_CLASS6>
				<!--Optional:-->
				<TAX_CLASS7></TAX_CLASS7>
				<!--Optional:-->
				<TAX_CLASS8></TAX_CLASS8>
				<!--Optional:-->
				<TAX_CLASS9></TAX_CLASS9>
				<!--Optional:-->
				<FIX_SP_DAY></FIX_SP_DAY>
				<!--Optional:-->
				<VAR_SP_DAY></VAR_SP_DAY>
				<!--Optional:-->
				<PREC_DOC></PREC_DOC>
				<!--Optional:-->
				<NET_PRICE></NET_PRICE>
				<!--Optional:-->
				<COND_P_UNT></COND_P_UNT>
				<!--Optional:-->
				<COND_UNIT></COND_UNIT>
				<!--Optional:-->
				<CONISOUNIT></CONISOUNIT>
				<!--Optional:-->
				<RETOURE></RETOURE>
				<!--Optional:-->
				<CASH_DISC></CASH_DISC>
				<!--Optional:-->
				<AVAILCHECK></AVAILCHECK>
				<!--Optional:-->
				<SUM_REQUIR></SUM_REQUIR>
				<!--Optional:-->
				<MAT_PR_GRP></MAT_PR_GRP>
				<!--Optional:-->
				<ACCT_ASSGT></ACCT_ASSGT>
				<!--Optional:-->
				<REBATE_GRP></REBATE_GRP>
				<!--Optional:-->
				<COMM_GROUP></COMM_GROUP>
				<!--Optional:-->
				<EUR_ART_NR></EUR_ART_NR>
				<!--Optional:-->
				<PRICE_OK></PRICE_OK>
				<!--Optional:-->
				<VAL_TYPE></VAL_TYPE>
				<!--Optional:-->
				<SEP_VALUAT></SEP_VALUAT>
				<!--Optional:-->
				<BATCH_MGMT></BATCH_MGMT>
				<!--Optional:-->
				<IND_BTCH></IND_BTCH>
				<!--Optional:-->
				<MIN_DELY></MIN_DELY>
				<!--Optional:-->
				<UPDATE_GRP></UPDATE_GRP>
				<!--Optional:-->
				<COST_DOC_C></COST_DOC_C>
				<!--Optional:-->
				<SUBTOT_PP1></SUBTOT_PP1>
				<!--Optional:-->
				<SUBTOT_PP2></SUBTOT_PP2>
				<!--Optional:-->
				<SUBTOT_PP3></SUBTOT_PP3>
				<!--Optional:-->
				<SUBTOT_PP4></SUBTOT_PP4>
				<!--Optional:-->
				<SUBTOT_PP5></SUBTOT_PP5>
				<!--Optional:-->
				<SUBTOT_PP6></SUBTOT_PP6>
				<!--Optional:-->
				<EXCH_RATE></EXCH_RATE>
				<!--Optional:-->
				<CH_ON></CH_ON>
				<!--Optional:-->
				<EAN_UPC></EAN_UPC>
				<!--Optional:-->
				<FIX_DATE></FIX_DATE>
				<!--Optional:-->
				<PROFIT_CTR></PROFIT_CTR>
				<!--Optional:-->
				<PRC_GROUP1></PRC_GROUP1>
				<!--Optional:-->
				<PRC_GROUP2></PRC_GROUP2>
				<!--Optional:-->
				<PRC_GROUP3></PRC_GROUP3>
				<!--Optional:-->
				<PRC_GROUP4></PRC_GROUP4>
				<!--Optional:-->
				<PRC_GROUP5></PRC_GROUP5>
				<!--Optional:-->
				<COMPON_QTY></COMPON_QTY>
				<!--Optional:-->
				<SUBSTREASO></SUBSTREASO>
				<!--Optional:-->
				<SPEC_STOCK></SPEC_STOCK>
				<!--Optional:-->
				<ALLOC_INDI></ALLOC_INDI>
				<!--Optional:-->
				<PROFIT_SEG></PROFIT_SEG>
				<!--Optional:-->
				<WBS_ELEM></WBS_ELEM>
				<!--Optional:-->
				<ORDERID></ORDERID>
				<!--Optional:-->
				<PLNG_MATL></PLNG_MATL>
				<!--Optional:-->
				<PLNG_PLANT></PLNG_PLANT>
				<!--Optional:-->
				<BASE_UNIT></BASE_UNIT>
				<!--Optional:-->
				<ISOBASUNIT></ISOBASUNIT>
				<!--Optional:-->
				<CONV_FACT></CONV_FACT>
				<!--Optional:-->
				<ACCTASSCAT></ACCTASSCAT>
				<!--Optional:-->
				<CONSUMPT></CONSUMPT>
				<!--Optional:-->
				<BOMEXPLNO></BOMEXPLNO>
				<!--Optional:-->
				<OBJ_NR_IT></OBJ_NR_IT>
				<!--Optional:-->
				<RES_ANAL></RES_ANAL>
				<!--Optional:-->
				<REQMTSTYP></REQMTSTYP>
				<!--Optional:-->
				<CREDPRICIT></CREDPRICIT>
				<!--Optional:-->
				<PARTRELID></PARTRELID>
				<!--Optional:-->
				<ACTCREDID></ACTCREDID>
				<!--Optional:-->
				<CR_EXCHRAT></CR_EXCHRAT>
				<!--Optional:-->
				<CONFIG></CONFIG>
				<!--Optional:-->
				<CHCLASS_IN></CHCLASS_IN>
				<!--Optional:-->
				<STAT_PRICE></STAT_PRICE>
				<!--Optional:-->
				<COND_UPDAT></COND_UPDAT>
				<!--Optional:-->
				<SERNO_PROF></SERNO_PROF>
				<!--Optional:-->
				<NO_OF_SERI></NO_OF_SERI>
				<!--Optional:-->
				<NOGRPOSTED></NOGRPOSTED>
				<!--Optional:-->
				<MAT_GRP_SM></MAT_GRP_SM>
				<!--Optional:-->
				<MAN_PR_CH></MAN_PR_CH>
				<!--Optional:-->
				<DOC_CAT_SD></DOC_CAT_SD>
				<!--Optional:-->
				<MATDETERID></MATDETERID>
				<!--Optional:-->
				<ITUSAGEID></ITUSAGEID>
				<!--Optional:-->
				<COSTESTNR></COSTESTNR>
				<!--Optional:-->
				<CSTG_VRNT></CSTG_VRNT>
				<!--Optional:-->
				<BOMITEMNR></BOMITEMNR>
				<!--Optional:-->
				<STAT_VAL></STAT_VAL>
				<!--Optional:-->
				<STAT_DATE></STAT_DATE>
				<!--Optional:-->
				<BUS_TRANST></BUS_TRANST>
				<!--Optional:-->
				<PREF_INDIC></PREF_INDIC>
				<!--Optional:-->
				<NRCONDREC></NRCONDREC>
				<!--Optional:-->
				<INTCLASSNR></INTCLASSNR>
				<!--Optional:-->
				<BATCH_EXIT></BATCH_EXIT>
				<!--Optional:-->
				<BOM_CATEGO></BOM_CATEGO>
				<!--Optional:-->
				<BOM_IT_NR></BOM_IT_NR>
				<!--Optional:-->
				<COUNTER></COUNTER>
				<!--Optional:-->
				<INCONSCONF></INCONSCONF>
				<!--Optional:-->
				<OVERH_KEY></OVERH_KEY>
				<!--Optional:-->
				<CSTG_SHEET></CSTG_SHEET>
				<!--Optional:-->
				<CSTG_VRNT1></CSTG_VRNT1>
				<!--Optional:-->
				<PROD_ALLOC></PROD_ALLOC>
				<!--Optional:-->
				<PRICE_REF></PRICE_REF>
				<!--Optional:-->
				<MATPRICGRP></MATPRICGRP>
				<!--Optional:-->
				<MATFRGTGRP></MATFRGTGRP>
				<!--Optional:-->
				<PLANDLVSCH></PLANDLVSCH>
				<!--Optional:-->
				<SEQUENCENO></SEQUENCENO>
				<!--Optional:-->
				<CREDPRIC></CREDPRIC>
				<!--Optional:-->
				<PAY_GUARAN></PAY_GUARAN>
				<!--Optional:-->
				<GURANTEED></GURANTEED>
				<!--Optional:-->
				<CFOP_CODE></CFOP_CODE>
				<!--Optional:-->
				<TAXLAWICMS></TAXLAWICMS>
				<!--Optional:-->
				<TAXLAWIPI></TAXLAWIPI>
				<!--Optional:-->
				<SD_TAXCODE></SD_TAXCODE>
				<!--Optional:-->
				<VALCONTRNR></VALCONTRNR>
				<!--Optional:-->
				<VALCONTRIT></VALCONTRIT>
				<!--Optional:-->
				<ASSORT_MOD></ASSORT_MOD>
				<!--Optional:-->
				<VALSPECSTO></VALSPECSTO>
				<!--Optional:-->
				<MATGRHIE1></MATGRHIE1>
				<!--Optional:-->
				<MATGRHIE2></MATGRHIE2>
				<!--Optional:-->
				<PROMOTION></PROMOTION>
				<!--Optional:-->
				<SALES_DEAL></SALES_DEAL>
				<!--Optional:-->
				<FLGLEADUNI></FLGLEADUNI>
				<!--Optional:-->
				<FREE_GOODS></FREE_GOODS>
				<!--Optional:-->
				<VALID_OBJ></VALID_OBJ>
				<!--Optional:-->
				<TAX_AMOUNT></TAX_AMOUNT>
				<!--Optional:-->
				<MRP_AREA></MRP_AREA>
				<!--Optional:-->
				<CUST_MAT35></CUST_MAT35>
				<!--Optional:-->
				<CR_EXCHRAT_V></CR_EXCHRAT_V>
				<!--Optional:-->
				<EXCHRATEST_V></EXCHRATEST_V>
				<!--Optional:-->
				<PCKG_NO></PCKG_NO>
				<!--Optional:-->
				<MATERIAL_EXTERNAL></MATERIAL_EXTERNAL>
				<!--Optional:-->
				<MATERIAL_GUID></MATERIAL_GUID>
				<!--Optional:-->
				<MATERIAL_VERSION></MATERIAL_VERSION>
				<!--Optional:-->
				<MAT_ENTRD_EXTERNAL></MAT_ENTRD_EXTERNAL>
				<!--Optional:-->
				<MAT_ENTRD_GUID></MAT_ENTRD_GUID>
				<!--Optional:-->
				<MAT_ENTRD_VERSION></MAT_ENTRD_VERSION>
				<!--Optional:-->
				<PLNG_MATL_EXTERNAL></PLNG_MATL_EXTERNAL>
				<!--Optional:-->
				<PLNG_MATL_GUID></PLNG_MATL_GUID>
				<!--Optional:-->
				<PLNG_MATL_VERSION></PLNG_MATL_VERSION>
				<!--Optional:-->
				<PRICE_REF_EXTERNAL></PRICE_REF_EXTERNAL>
				<!--Optional:-->
				<PRICE_REF_GUID></PRICE_REF_GUID>
				<!--Optional:-->
				<PRICE_REF_VERSION></PRICE_REF_VERSION>
				<!--Optional:-->
				<PR_REF_MAT_EXTERNAL></PR_REF_MAT_EXTERNAL>
				<!--Optional:-->
				<PR_REF_MAT_GUID></PR_REF_MAT_GUID>
				<!--Optional:-->
				<PR_REF_MAT_VERSION></PR_REF_MAT_VERSION>
			 </item>
		  </ZSD_INQUIRYDETAILS_AJ_T>
	   </urn:ZSD_CUSTOMER_INQUIRY_AJ>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUS_INQ_AJ&receiverParty=&receiverService=&interface=SI_CUS_INQU_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result1 = JSON.parse(result1);
            res.send(result1);
        }
    });
});

app.post('/masterdataupload', (req, res) => {
	username = loginCred[loginCred.length - 1];
	console.log("Master Data Upload :", username)
    city = req.body.city;
    country = req.body.country;
    currency = req.body.currency;
    distchannel = req.body.distchannel;
    division = req.body.division;
    first_name = req.body.first_name;
    language = req.body.language;
    last_name = req.body.last_name;
    postal_code = req.body.postal_code;
    ref_customer = req.body.ref_customer;
    sales_org = req.body.sales_org;
    street = req.body.street;
    telephone = req.body.telephone;

    const postData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
	<urn:ZFM_MASTERDATA_AJ>
          <!--You may enter the following 13 items in any order-->
          <CITY>`+city+`</CITY>
          <COUNTRY>`+country+`</COUNTRY>
          <CURRENCY>`+currency+`</CURRENCY>
          <DISTCHANNEL>`+distchannel+`</DISTCHANNEL>
          <DIVISION>`+division+`</DIVISION>
          <FIRST_NAME>`+first_name+`</FIRST_NAME>
          <LANGUAGE>`+language+`</LANGUAGE>
          <LAST_NAME>`+last_name+`</LAST_NAME>
          <POSTAL_CODE>`+postal_code+`</POSTAL_CODE>
          <REF_CUSTOMER>`+ref_customer+`</REF_CUSTOMER>
          <SALESORG>`+sales_org+`</SALESORG>
          <STREET>`+street+`</STREET>
          <TELEPHONE>`+telephone+`</TELEPHONE>
		  </urn:ZFM_MASTERDATA_AJ>
    </soapenv:Body>
 </soapenv:Envelope>`;
    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_MD_AJ&receiverParty=&receiverService=&interface=SI_MASTER_DATA_AJ&interfaceNamespace=http://ajpipo.com',

        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },
        body: postData
    };
    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            // alert(result2);
            var resp = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_MASTERDATA_AJ.Response'];
            res.send(resp);
        }
		else{
			console.log(response)
		}
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------VENDOR PORTAL----------------------------------------------------

app.post('/vendorlogin', function(req, res) {
    username = req.body.username;
    password = req.body.password;
    username = username.toUpperCase();
    loginCred.push(username);
    console.log('Login Set Username : ' + loginCred);

    hashedPassword = md5(password);
    hashedPassword = hashedPassword.toUpperCase();
    //827CCB0EEA8A706C4C34A16891F84E7B
    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
		<soapenv:Header/>
		<soapenv:Body>
		   <urn:ZFM_VLOGIN>
			  <!--You may enter the following 2 items in any order-->
			  <PASSWORD>` +
        hashedPassword +
        `</PASSWORD>
			  <USERNAME>` +
        username +
        `</USERNAME>
		   </urn:ZFM_VLOGIN>
		</soapenv:Body>
	 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VLOGIN_AJ&receiverParty=&receiverService=&interface=SI_VLOGIN_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var response = parser.xml2json(body, { compact: true, spaces: 4 });
            response = JSON.parse(response);
            const result = response['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VLOGIN.Response']['UNAME']['_text'];
            console.log(result);
            if (result !== 'UNUS' && result !== 'WP') {
                let payload = { subject: username };
                let token = jwt.sign(payload, 'SeCrEtKeY');
                let resultVal = token + ':::::' + result;
                res.send(JSON.stringify(resultVal));
            } else if (result === 'UNUS') {
                console.log('Error: UNREGISTERED USER');
                res.send(JSON.stringify(result));
            } else {
                res.send(JSON.stringify(result));
            }
        }
    });
});

app.get('/getvendorprofile', function(req, res) {
    username = loginCred[loginCred.length - 1];
    // username = "0000000006"
    console.log('Vendor View Profile: ' + username);
    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZFM_VP_GETDETAILS>
		  <VENDOR_ID>` +
        username +
        `</VENDOR_ID>
	   </urn:ZFM_VP_GETDETAILS>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VP_GETDET_AJ&receiverParty=&receiverService=&interface=SI_VP_GETDET_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            var resp = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_GETDETAILS.Response']['E_DETAILS'];
            res.send(resp);
        }
    });
});

app.post('/updatevendorprofile', (req, res) => {
    username = loginCred[loginCred.length - 1];
    // username = '0000007006'

    const loginData =
        `
	<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZFM_VP_UVENDOR>
         <!--You may enter the following 9 items in any order-->
         <CITY>` +
        req.body.c_city +
        `</CITY>
         <COUNTRY>` +
        req.body.c_country +
        `</COUNTRY>
         <FIRST_NAME>` +
        req.body.cf_name +
        `</FIRST_NAME>
         <LAST_NAME>` +
        req.body.cl_name +
        `</LAST_NAME>
         <MOBILE>` +
        req.body.c_mobile +
        `</MOBILE>
         <PINCODE>` +
        req.body.c_pin +
        `</PINCODE>
         <STATE>` +
        req.body.c_state +
        `</STATE>
         <STREET>` +
        req.body.c_street +
        `</STREET>
         <VENDOR_ID>` +
        username +
        `</VENDOR_ID>
      </urn:ZFM_VP_UVENDOR>
   </soapenv:Body>
</soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VP_UV_AJ&receiverParty=&receiverService=&interface=SI_VP_UV_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            result2 = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_VP_UVENDOR.Response']['UPDATE_STATUS']['_text'];
            console.log('Edit Profile Status:', result2);
            res.send(JSON.stringify('Success'));
        } else {
            res.send(JSON.stringify('Error'));
        }
    });
});

app.get('/vendormemo', function(req, res) {
    username = loginCred[loginCred.length - 1];
    console.log('Vendor Memo: ' + username);

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZFI_VP_CREDIT_DEBIT_MEMO>
		  <!--You may enter the following 3 items in any order-->
		  <VENDOR_ID>` +
        username +
        `</VENDOR_ID>
		  <T_CREDIT>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<KUNNR></KUNNR>
				<!--Optional:-->
				<MATNR></MATNR>
				<!--Optional:-->
				<WERKS></WERKS>
				<!--Optional:-->
				<MENGE></MENGE>
				<!--Optional:-->
				<MEINS></MEINS>
				<!--Optional:-->
				<BUKRS></BUKRS>
				<!--Optional:-->
				<BELNR></BELNR>
				<!--Optional:-->
				<GJAHR></GJAHR>
				<!--Optional:-->
				<BUZEI></BUZEI>
				<!--Optional:-->
				<AUGDT></AUGDT>
				<!--Optional:-->
				<KOART></KOART>
				<!--Optional:-->
				<DMBTR></DMBTR>
				<!--Optional:-->
				<BDIFF></BDIFF>
				<!--Optional:-->
				<XBILK></XBILK>
				<!--Optional:-->
				<LIFNR></LIFNR>
			 </item>
		  </T_CREDIT>
		  <T_DEBIT>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<KUNNR></KUNNR>
				<!--Optional:-->
				<MATNR></MATNR>
				<!--Optional:-->
				<WERKS></WERKS>
				<!--Optional:-->
				<MENGE></MENGE>
				<!--Optional:-->
				<MEINS></MEINS>
				<!--Optional:-->
				<BUKRS></BUKRS>
				<!--Optional:-->
				<BELNR></BELNR>
				<!--Optional:-->
				<GJAHR></GJAHR>
				<!--Optional:-->
				<BUZEI></BUZEI>
				<!--Optional:-->
				<AUGDT></AUGDT>
				<!--Optional:-->
				<KOART></KOART>
				<!--Optional:-->
				<DMBTR></DMBTR>
				<!--Optional:-->
				<BDIFF></BDIFF>
				<!--Optional:-->
				<XBILK></XBILK>
				<!--Optional:-->
				<LIFNR></LIFNR>
			 </item>
		  </T_DEBIT>
	   </urn:ZFI_VP_CREDIT_DEBIT_MEMO>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VP_CREDIT_AJ&receiverParty=&receiverService=&interface=SI_VP_CREDIT_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result1 = JSON.parse(result1);
            res.send(result1);
        }
    });
});

app.get('/goodsreceipt', function(req, res) {
    username = loginCred[loginCred.length - 1];
    console.log('Vendor GoodsReceipt: ' + username);

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZFM_GOODS_RECIPT>
		  <!--You may enter the following 4 items in any order-->
		  <VENDOR_ID>` +
        username +
        `</VENDOR_ID>
		  <T_GOODSMVT_HEADER>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<MAT_DOC></MAT_DOC>
				<!--Optional:-->
				<DOC_YEAR></DOC_YEAR>
				<!--Optional:-->
				<TR_EV_TYPE></TR_EV_TYPE>
				<!--Optional:-->
				<DOC_DATE></DOC_DATE>
				<!--Optional:-->
				<PSTNG_DATE></PSTNG_DATE>
				<!--Optional:-->
				<ENTRY_DATE></ENTRY_DATE>
				<!--Optional:-->
				<ENTRY_TIME></ENTRY_TIME>
				<!--Optional:-->
				<USERNAME></USERNAME>
				<!--Optional:-->
				<VER_GR_GI_SLIP></VER_GR_GI_SLIP>
				<!--Optional:-->
				<EXPIMP_NO></EXPIMP_NO>
				<!--Optional:-->
				<REF_DOC_NO></REF_DOC_NO>
				<!--Optional:-->
				<HEADER_TXT></HEADER_TXT>
				<!--Optional:-->
				<REF_DOC_NO_LONG></REF_DOC_NO_LONG>
			 </item>
		  </T_GOODSMVT_HEADER>
		  <T_GOODSMVT_ITEMS>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<MAT_DOC></MAT_DOC>
				<!--Optional:-->
				<DOC_YEAR></DOC_YEAR>
				<!--Optional:-->
				<MATDOC_ITM></MATDOC_ITM>
				<!--Optional:-->
				<MATERIAL></MATERIAL>
				<!--Optional:-->
				<PLANT></PLANT>
				<!--Optional:-->
				<STGE_LOC></STGE_LOC>
				<!--Optional:-->
				<BATCH></BATCH>
				<!--Optional:-->
				<MOVE_TYPE></MOVE_TYPE>
				<!--Optional:-->
				<STCK_TYPE></STCK_TYPE>
				<!--Optional:-->
				<SPEC_STOCK></SPEC_STOCK>
				<!--Optional:-->
				<VENDOR></VENDOR>
				<!--Optional:-->
				<CUSTOMER></CUSTOMER>
				<!--Optional:-->
				<SALES_ORD></SALES_ORD>
				<!--Optional:-->
				<S_ORD_ITEM></S_ORD_ITEM>
				<!--Optional:-->
				<SCHED_LINE></SCHED_LINE>
				<!--Optional:-->
				<VAL_TYPE></VAL_TYPE>
				<!--Optional:-->
				<ENTRY_QNT></ENTRY_QNT>
				<!--Optional:-->
				<ENTRY_UOM></ENTRY_UOM>
				<!--Optional:-->
				<ENTRY_UOM_ISO></ENTRY_UOM_ISO>
				<!--Optional:-->
				<PO_PR_QNT></PO_PR_QNT>
				<!--Optional:-->
				<ORDERPR_UN></ORDERPR_UN>
				<!--Optional:-->
				<ORDERPR_UN_ISO></ORDERPR_UN_ISO>
				<!--Optional:-->
				<PO_NUMBER></PO_NUMBER>
				<!--Optional:-->
				<PO_ITEM></PO_ITEM>
				<!--Optional:-->
				<SHIPPING></SHIPPING>
				<!--Optional:-->
				<COMP_SHIP></COMP_SHIP>
				<!--Optional:-->
				<NO_MORE_GR></NO_MORE_GR>
				<!--Optional:-->
				<ITEM_TEXT></ITEM_TEXT>
				<!--Optional:-->
				<GR_RCPT></GR_RCPT>
				<!--Optional:-->
				<UNLOAD_PT></UNLOAD_PT>
				<!--Optional:-->
				<COSTCENTER></COSTCENTER>
				<!--Optional:-->
				<ORDERID></ORDERID>
				<!--Optional:-->
				<ORDER_ITNO></ORDER_ITNO>
				<!--Optional:-->
				<CALC_MOTIVE></CALC_MOTIVE>
				<!--Optional:-->
				<ASSET_NO></ASSET_NO>
				<!--Optional:-->
				<SUB_NUMBER></SUB_NUMBER>
				<!--Optional:-->
				<RESERV_NO></RESERV_NO>
				<!--Optional:-->
				<RES_ITEM></RES_ITEM>
				<!--Optional:-->
				<RES_TYPE></RES_TYPE>
				<!--Optional:-->
				<WITHDRAWN></WITHDRAWN>
				<!--Optional:-->
				<MOVE_MAT></MOVE_MAT>
				<!--Optional:-->
				<MOVE_PLANT></MOVE_PLANT>
				<!--Optional:-->
				<MOVE_STLOC></MOVE_STLOC>
				<!--Optional:-->
				<MOVE_BATCH></MOVE_BATCH>
				<!--Optional:-->
				<MOVE_VAL_TYPE></MOVE_VAL_TYPE>
				<!--Optional:-->
				<MVT_IND></MVT_IND>
				<!--Optional:-->
				<MOVE_REAS></MOVE_REAS>
				<!--Optional:-->
				<RL_EST_KEY></RL_EST_KEY>
				<!--Optional:-->
				<REF_DATE></REF_DATE>
				<!--Optional:-->
				<COST_OBJ></COST_OBJ>
				<!--Optional:-->
				<PROFIT_SEGM_NO></PROFIT_SEGM_NO>
				<!--Optional:-->
				<PROFIT_CTR></PROFIT_CTR>
				<!--Optional:-->
				<WBS_ELEM></WBS_ELEM>
				<!--Optional:-->
				<NETWORK></NETWORK>
				<!--Optional:-->
				<ACTIVITY></ACTIVITY>
				<!--Optional:-->
				<PART_ACCT></PART_ACCT>
				<!--Optional:-->
				<AMOUNT_LC></AMOUNT_LC>
				<!--Optional:-->
				<AMOUNT_SV></AMOUNT_SV>
				<!--Optional:-->
				<CURRENCY></CURRENCY>
				<!--Optional:-->
				<CURRENCY_ISO></CURRENCY_ISO>
				<!--Optional:-->
				<REF_DOC_YR></REF_DOC_YR>
				<!--Optional:-->
				<REF_DOC></REF_DOC>
				<!--Optional:-->
				<REF_DOC_IT></REF_DOC_IT>
				<!--Optional:-->
				<EXPIRYDATE></EXPIRYDATE>
				<!--Optional:-->
				<PROD_DATE></PROD_DATE>
				<!--Optional:-->
				<FUND></FUND>
				<!--Optional:-->
				<FUNDS_CTR></FUNDS_CTR>
				<!--Optional:-->
				<CMMT_ITEM></CMMT_ITEM>
				<!--Optional:-->
				<VAL_SALES_ORD></VAL_SALES_ORD>
				<!--Optional:-->
				<VAL_S_ORD_ITEM></VAL_S_ORD_ITEM>
				<!--Optional:-->
				<VAL_WBS_ELEM></VAL_WBS_ELEM>
				<!--Optional:-->
				<CO_BUSPROC></CO_BUSPROC>
				<!--Optional:-->
				<ACTTYPE></ACTTYPE>
				<!--Optional:-->
				<SUPPL_VEND></SUPPL_VEND>
				<!--Optional:-->
				<X_AUTO_CRE></X_AUTO_CRE>
				<!--Optional:-->
				<MATERIAL_EXTERNAL></MATERIAL_EXTERNAL>
				<!--Optional:-->
				<MATERIAL_GUID></MATERIAL_GUID>
				<!--Optional:-->
				<MATERIAL_VERSION></MATERIAL_VERSION>
				<!--Optional:-->
				<MOVE_MAT_EXTERNAL></MOVE_MAT_EXTERNAL>
				<!--Optional:-->
				<MOVE_MAT_GUID></MOVE_MAT_GUID>
				<!--Optional:-->
				<MOVE_MAT_VERSION></MOVE_MAT_VERSION>
				<!--Optional:-->
				<GRANT_NBR></GRANT_NBR>
				<!--Optional:-->
				<CMMT_ITEM_LONG></CMMT_ITEM_LONG>
				<!--Optional:-->
				<FUNC_AREA_LONG></FUNC_AREA_LONG>
				<!--Optional:-->
				<LINE_ID></LINE_ID>
				<!--Optional:-->
				<PARENT_ID></PARENT_ID>
				<!--Optional:-->
				<LINE_DEPTH></LINE_DEPTH>
				<!--Optional:-->
				<BUDGET_PERIOD></BUDGET_PERIOD>
				<!--Optional:-->
				<EARMARKED_NUMBER></EARMARKED_NUMBER>
				<!--Optional:-->
				<EARMARKED_ITEM></EARMARKED_ITEM>
				<!--Optional:-->
				<STK_SEGMENT></STK_SEGMENT>
			 </item>
		  </T_GOODSMVT_ITEMS>
		  <T_RETURN>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<TYPE></TYPE>
				<!--Optional:-->
				<ID></ID>
				<!--Optional:-->
				<NUMBER></NUMBER>
				<!--Optional:-->
				<MESSAGE></MESSAGE>
				<!--Optional:-->
				<LOG_NO></LOG_NO>
				<!--Optional:-->
				<LOG_MSG_NO></LOG_MSG_NO>
				<!--Optional:-->
				<MESSAGE_V1></MESSAGE_V1>
				<!--Optional:-->
				<MESSAGE_V2></MESSAGE_V2>
				<!--Optional:-->
				<MESSAGE_V3></MESSAGE_V3>
				<!--Optional:-->
				<MESSAGE_V4></MESSAGE_V4>
				<!--Optional:-->
				<PARAMETER></PARAMETER>
				<!--Optional:-->
				<ROW></ROW>
				<!--Optional:-->
				<FIELD></FIELD>
				<!--Optional:-->
				<SYSTEM></SYSTEM>
			 </item>
		  </T_RETURN>
	   </urn:ZFM_GOODS_RECIPT>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_GR_AJ&receiverParty=&receiverService=&interface=SI_GR_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            var resp = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_GOODS_RECIPT.Response'];
            res.send(resp);
        }
    });
});

app.get('/vendorpayage', function(req, res) {
    username = loginCred[loginCred.length - 1];
    console.log('Vendor Payage: ' + username);

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZFM_VP_PAYAGE>
		  <!--You may enter the following 6 items in any order-->
		  <COMPANY_CODE>SA01</COMPANY_CODE>
		  <!--Optional:-->
		  <FROM_DATE></FROM_DATE>
		  <!--Optional:-->
		  <TO_DATE></TO_DATE>
		  <VENDOR_ID>` +
        username +
        `</VENDOR_ID>
		  <T_CLOSEDITEMS>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<COMP_CODE></COMP_CODE>
				<!--Optional:-->
				<VENDOR></VENDOR>
				<!--Optional:-->
				<SP_GL_IND></SP_GL_IND>
				<!--Optional:-->
				<CLEAR_DATE></CLEAR_DATE>
				<!--Optional:-->
				<CLR_DOC_NO></CLR_DOC_NO>
				<!--Optional:-->
				<ALLOC_NMBR></ALLOC_NMBR>
				<!--Optional:-->
				<FISC_YEAR></FISC_YEAR>
				<!--Optional:-->
				<DOC_NO></DOC_NO>
				<!--Optional:-->
				<ITEM_NUM></ITEM_NUM>
				<!--Optional:-->
				<PSTNG_DATE></PSTNG_DATE>
				<!--Optional:-->
				<DOC_DATE></DOC_DATE>
				<!--Optional:-->
				<ENTRY_DATE></ENTRY_DATE>
				<!--Optional:-->
				<CURRENCY></CURRENCY>
				<!--Optional:-->
				<LOC_CURRCY></LOC_CURRCY>
				<!--Optional:-->
				<REF_DOC_NO></REF_DOC_NO>
				<!--Optional:-->
				<DOC_TYPE></DOC_TYPE>
				<!--Optional:-->
				<FIS_PERIOD></FIS_PERIOD>
				<!--Optional:-->
				<POST_KEY></POST_KEY>
				<!--Optional:-->
				<DB_CR_IND></DB_CR_IND>
				<!--Optional:-->
				<BUS_AREA></BUS_AREA>
				<!--Optional:-->
				<TAX_CODE></TAX_CODE>
				<!--Optional:-->
				<LC_AMOUNT></LC_AMOUNT>
				<!--Optional:-->
				<AMT_DOCCUR></AMT_DOCCUR>
				<!--Optional:-->
				<LC_TAX></LC_TAX>
				<!--Optional:-->
				<TX_DOC_CUR></TX_DOC_CUR>
				<!--Optional:-->
				<ITEM_TEXT></ITEM_TEXT>
				<!--Optional:-->
				<BRANCH></BRANCH>
				<!--Optional:-->
				<BLINE_DATE></BLINE_DATE>
				<!--Optional:-->
				<PMNTTRMS></PMNTTRMS>
				<!--Optional:-->
				<DSCT_DAYS1></DSCT_DAYS1>
				<!--Optional:-->
				<DSCT_DAYS2></DSCT_DAYS2>
				<!--Optional:-->
				<NETTERMS></NETTERMS>
				<!--Optional:-->
				<DSCT_PCT1></DSCT_PCT1>
				<!--Optional:-->
				<DSCT_PCT2></DSCT_PCT2>
				<!--Optional:-->
				<DISC_BASE></DISC_BASE>
				<!--Optional:-->
				<DSC_AMT_LC></DSC_AMT_LC>
				<!--Optional:-->
				<DSC_AMT_DC></DSC_AMT_DC>
				<!--Optional:-->
				<PYMT_METH></PYMT_METH>
				<!--Optional:-->
				<PMNT_BLOCK></PMNT_BLOCK>
				<!--Optional:-->
				<FIXEDTERMS></FIXEDTERMS>
				<!--Optional:-->
				<INV_REF></INV_REF>
				<!--Optional:-->
				<INV_YEAR></INV_YEAR>
				<!--Optional:-->
				<INV_ITEM></INV_ITEM>
				<!--Optional:-->
				<DUNN_BLOCK></DUNN_BLOCK>
				<!--Optional:-->
				<DUNN_KEY></DUNN_KEY>
				<!--Optional:-->
				<LAST_DUNN></LAST_DUNN>
				<!--Optional:-->
				<DUNN_LEVEL></DUNN_LEVEL>
				<!--Optional:-->
				<DUNN_AREA></DUNN_AREA>
				<!--Optional:-->
				<W_TAX_CODE></W_TAX_CODE>
				<!--Optional:-->
				<W_TAX_BASE></W_TAX_BASE>
				<!--Optional:-->
				<WI_TAX_AMT></WI_TAX_AMT>
				<!--Optional:-->
				<DOC_STATUS></DOC_STATUS>
				<!--Optional:-->
				<NXT_DOCTYP></NXT_DOCTYP>
				<!--Optional:-->
				<VAT_REG_NO></VAT_REG_NO>
				<!--Optional:-->
				<EXEMPT_NO></EXEMPT_NO>
				<!--Optional:-->
				<W_TAX_EXPT></W_TAX_EXPT>
				<!--Optional:-->
				<REASON_CDE></REASON_CDE>
				<!--Optional:-->
				<PMTMTHSUPL></PMTMTHSUPL>
				<!--Optional:-->
				<REF_KEY_1></REF_KEY_1>
				<!--Optional:-->
				<REF_KEY_2></REF_KEY_2>
				<!--Optional:-->
				<T_CURRENCY></T_CURRENCY>
				<!--Optional:-->
				<AMOUNT></AMOUNT>
				<!--Optional:-->
				<NET_AMOUNT></NET_AMOUNT>
				<!--Optional:-->
				<NAME></NAME>
				<!--Optional:-->
				<NAME_2></NAME_2>
				<!--Optional:-->
				<NAME_3></NAME_3>
				<!--Optional:-->
				<NAME_4></NAME_4>
				<!--Optional:-->
				<POSTL_CODE></POSTL_CODE>
				<!--Optional:-->
				<CITY></CITY>
				<!--Optional:-->
				<COUNTRY></COUNTRY>
				<!--Optional:-->
				<STREET></STREET>
				<!--Optional:-->
				<PO_BOX></PO_BOX>
				<!--Optional:-->
				<POBX_PCD></POBX_PCD>
				<!--Optional:-->
				<POBK_CURAC></POBK_CURAC>
				<!--Optional:-->
				<BANK_ACCT></BANK_ACCT>
				<!--Optional:-->
				<BANK_KEY></BANK_KEY>
				<!--Optional:-->
				<BANK_CTRY></BANK_CTRY>
				<!--Optional:-->
				<TAX_NO_1></TAX_NO_1>
				<!--Optional:-->
				<TAX_NO_2></TAX_NO_2>
				<!--Optional:-->
				<TAX></TAX>
				<!--Optional:-->
				<EQUAL_TAX></EQUAL_TAX>
				<!--Optional:-->
				<REGION></REGION>
				<!--Optional:-->
				<CTRL_KEY></CTRL_KEY>
				<!--Optional:-->
				<INSTR_KEY></INSTR_KEY>
				<!--Optional:-->
				<PAYEE_CODE></PAYEE_CODE>
				<!--Optional:-->
				<LANGU></LANGU>
				<!--Optional:-->
				<BILL_LIFE></BILL_LIFE>
				<!--Optional:-->
				<BE_TAXCODE></BE_TAXCODE>
				<!--Optional:-->
				<BILLTAX_LC></BILLTAX_LC>
				<!--Optional:-->
				<BILLTAX_FC></BILLTAX_FC>
				<!--Optional:-->
				<LC_COL_CHG></LC_COL_CHG>
				<!--Optional:-->
				<COLL_CHARG></COLL_CHARG>
				<!--Optional:-->
				<CHGS_TX_CD></CHGS_TX_CD>
				<!--Optional:-->
				<ISSUE_DATE></ISSUE_DATE>
				<!--Optional:-->
				<USAGEDATE></USAGEDATE>
				<!--Optional:-->
				<BILL_USAGE></BILL_USAGE>
				<!--Optional:-->
				<DOMICILE></DOMICILE>
				<!--Optional:-->
				<DRAWER></DRAWER>
				<!--Optional:-->
				<CTRBNK_LOC></CTRBNK_LOC>
				<!--Optional:-->
				<DRAW_CITY1></DRAW_CITY1>
				<!--Optional:-->
				<DRAWEE></DRAWEE>
				<!--Optional:-->
				<DRAW_CITY2></DRAW_CITY2>
				<!--Optional:-->
				<DISCT_DAYS></DISCT_DAYS>
				<!--Optional:-->
				<DISCT_RATE></DISCT_RATE>
				<!--Optional:-->
				<ACCEPTED></ACCEPTED>
				<!--Optional:-->
				<BILLSTATUS></BILLSTATUS>
				<!--Optional:-->
				<PRTEST_IND></PRTEST_IND>
				<!--Optional:-->
				<BE_DEMAND></BE_DEMAND>
				<!--Optional:-->
				<OBJ_TYPE></OBJ_TYPE>
				<!--Optional:-->
				<REF_DOC></REF_DOC>
				<!--Optional:-->
				<REF_ORG_UN></REF_ORG_UN>
				<!--Optional:-->
				<REVERSAL_DOC></REVERSAL_DOC>
				<!--Optional:-->
				<SP_GL_TYPE></SP_GL_TYPE>
				<!--Optional:-->
				<NEG_POSTNG></NEG_POSTNG>
				<!--Optional:-->
				<REF_DOC_NO_LONG></REF_DOC_NO_LONG>
			 </item>
		  </T_CLOSEDITEMS>
		  <T_OPENITEMS>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<COMP_CODE></COMP_CODE>
				<!--Optional:-->
				<VENDOR></VENDOR>
				<!--Optional:-->
				<SP_GL_IND></SP_GL_IND>
				<!--Optional:-->
				<CLEAR_DATE></CLEAR_DATE>
				<!--Optional:-->
				<CLR_DOC_NO></CLR_DOC_NO>
				<!--Optional:-->
				<ALLOC_NMBR></ALLOC_NMBR>
				<!--Optional:-->
				<FISC_YEAR></FISC_YEAR>
				<!--Optional:-->
				<DOC_NO></DOC_NO>
				<!--Optional:-->
				<ITEM_NUM></ITEM_NUM>
				<!--Optional:-->
				<PSTNG_DATE></PSTNG_DATE>
				<!--Optional:-->
				<DOC_DATE></DOC_DATE>
				<!--Optional:-->
				<ENTRY_DATE></ENTRY_DATE>
				<!--Optional:-->
				<CURRENCY></CURRENCY>
				<!--Optional:-->
				<LOC_CURRCY></LOC_CURRCY>
				<!--Optional:-->
				<REF_DOC_NO></REF_DOC_NO>
				<!--Optional:-->
				<DOC_TYPE></DOC_TYPE>
				<!--Optional:-->
				<FIS_PERIOD></FIS_PERIOD>
				<!--Optional:-->
				<POST_KEY></POST_KEY>
				<!--Optional:-->
				<DB_CR_IND></DB_CR_IND>
				<!--Optional:-->
				<BUS_AREA></BUS_AREA>
				<!--Optional:-->
				<TAX_CODE></TAX_CODE>
				<!--Optional:-->
				<LC_AMOUNT></LC_AMOUNT>
				<!--Optional:-->
				<AMT_DOCCUR></AMT_DOCCUR>
				<!--Optional:-->
				<LC_TAX></LC_TAX>
				<!--Optional:-->
				<TX_DOC_CUR></TX_DOC_CUR>
				<!--Optional:-->
				<ITEM_TEXT></ITEM_TEXT>
				<!--Optional:-->
				<BRANCH></BRANCH>
				<!--Optional:-->
				<BLINE_DATE></BLINE_DATE>
				<!--Optional:-->
				<PMNTTRMS></PMNTTRMS>
				<!--Optional:-->
				<DSCT_DAYS1></DSCT_DAYS1>
				<!--Optional:-->
				<DSCT_DAYS2></DSCT_DAYS2>
				<!--Optional:-->
				<NETTERMS></NETTERMS>
				<!--Optional:-->
				<DSCT_PCT1></DSCT_PCT1>
				<!--Optional:-->
				<DSCT_PCT2></DSCT_PCT2>
				<!--Optional:-->
				<DISC_BASE></DISC_BASE>
				<!--Optional:-->
				<DSC_AMT_LC></DSC_AMT_LC>
				<!--Optional:-->
				<DSC_AMT_DC></DSC_AMT_DC>
				<!--Optional:-->
				<PYMT_METH></PYMT_METH>
				<!--Optional:-->
				<PMNT_BLOCK></PMNT_BLOCK>
				<!--Optional:-->
				<FIXEDTERMS></FIXEDTERMS>
				<!--Optional:-->
				<INV_REF></INV_REF>
				<!--Optional:-->
				<INV_YEAR></INV_YEAR>
				<!--Optional:-->
				<INV_ITEM></INV_ITEM>
				<!--Optional:-->
				<DUNN_BLOCK></DUNN_BLOCK>
				<!--Optional:-->
				<DUNN_KEY></DUNN_KEY>
				<!--Optional:-->
				<LAST_DUNN></LAST_DUNN>
				<!--Optional:-->
				<DUNN_LEVEL></DUNN_LEVEL>
				<!--Optional:-->
				<DUNN_AREA></DUNN_AREA>
				<!--Optional:-->
				<W_TAX_CODE></W_TAX_CODE>
				<!--Optional:-->
				<W_TAX_BASE></W_TAX_BASE>
				<!--Optional:-->
				<WI_TAX_AMT></WI_TAX_AMT>
				<!--Optional:-->
				<DOC_STATUS></DOC_STATUS>
				<!--Optional:-->
				<NXT_DOCTYP></NXT_DOCTYP>
				<!--Optional:-->
				<VAT_REG_NO></VAT_REG_NO>
				<!--Optional:-->
				<EXEMPT_NO></EXEMPT_NO>
				<!--Optional:-->
				<W_TAX_EXPT></W_TAX_EXPT>
				<!--Optional:-->
				<REASON_CDE></REASON_CDE>
				<!--Optional:-->
				<PMTMTHSUPL></PMTMTHSUPL>
				<!--Optional:-->
				<REF_KEY_1></REF_KEY_1>
				<!--Optional:-->
				<REF_KEY_2></REF_KEY_2>
				<!--Optional:-->
				<T_CURRENCY></T_CURRENCY>
				<!--Optional:-->
				<AMOUNT></AMOUNT>
				<!--Optional:-->
				<NET_AMOUNT></NET_AMOUNT>
				<!--Optional:-->
				<NAME></NAME>
				<!--Optional:-->
				<NAME_2></NAME_2>
				<!--Optional:-->
				<NAME_3></NAME_3>
				<!--Optional:-->
				<NAME_4></NAME_4>
				<!--Optional:-->
				<POSTL_CODE></POSTL_CODE>
				<!--Optional:-->
				<CITY></CITY>
				<!--Optional:-->
				<COUNTRY></COUNTRY>
				<!--Optional:-->
				<STREET></STREET>
				<!--Optional:-->
				<PO_BOX></PO_BOX>
				<!--Optional:-->
				<POBX_PCD></POBX_PCD>
				<!--Optional:-->
				<POBK_CURAC></POBK_CURAC>
				<!--Optional:-->
				<BANK_ACCT></BANK_ACCT>
				<!--Optional:-->
				<BANK_KEY></BANK_KEY>
				<!--Optional:-->
				<BANK_CTRY></BANK_CTRY>
				<!--Optional:-->
				<TAX_NO_1></TAX_NO_1>
				<!--Optional:-->
				<TAX_NO_2></TAX_NO_2>
				<!--Optional:-->
				<TAX></TAX>
				<!--Optional:-->
				<EQUAL_TAX></EQUAL_TAX>
				<!--Optional:-->
				<REGION></REGION>
				<!--Optional:-->
				<CTRL_KEY></CTRL_KEY>
				<!--Optional:-->
				<INSTR_KEY></INSTR_KEY>
				<!--Optional:-->
				<PAYEE_CODE></PAYEE_CODE>
				<!--Optional:-->
				<LANGU></LANGU>
				<!--Optional:-->
				<BILL_LIFE></BILL_LIFE>
				<!--Optional:-->
				<BE_TAXCODE></BE_TAXCODE>
				<!--Optional:-->
				<BILLTAX_LC></BILLTAX_LC>
				<!--Optional:-->
				<BILLTAX_FC></BILLTAX_FC>
				<!--Optional:-->
				<LC_COL_CHG></LC_COL_CHG>
				<!--Optional:-->
				<COLL_CHARG></COLL_CHARG>
				<!--Optional:-->
				<CHGS_TX_CD></CHGS_TX_CD>
				<!--Optional:-->
				<ISSUE_DATE></ISSUE_DATE>
				<!--Optional:-->
				<USAGEDATE></USAGEDATE>
				<!--Optional:-->
				<BILL_USAGE></BILL_USAGE>
				<!--Optional:-->
				<DOMICILE></DOMICILE>
				<!--Optional:-->
				<DRAWER></DRAWER>
				<!--Optional:-->
				<CTRBNK_LOC></CTRBNK_LOC>
				<!--Optional:-->
				<DRAW_CITY1></DRAW_CITY1>
				<!--Optional:-->
				<DRAWEE></DRAWEE>
				<!--Optional:-->
				<DRAW_CITY2></DRAW_CITY2>
				<!--Optional:-->
				<DISCT_DAYS></DISCT_DAYS>
				<!--Optional:-->
				<DISCT_RATE></DISCT_RATE>
				<!--Optional:-->
				<ACCEPTED></ACCEPTED>
				<!--Optional:-->
				<BILLSTATUS></BILLSTATUS>
				<!--Optional:-->
				<PRTEST_IND></PRTEST_IND>
				<!--Optional:-->
				<BE_DEMAND></BE_DEMAND>
				<!--Optional:-->
				<OBJ_TYPE></OBJ_TYPE>
				<!--Optional:-->
				<REF_DOC></REF_DOC>
				<!--Optional:-->
				<REF_ORG_UN></REF_ORG_UN>
				<!--Optional:-->
				<REVERSAL_DOC></REVERSAL_DOC>
				<!--Optional:-->
				<SP_GL_TYPE></SP_GL_TYPE>
				<!--Optional:-->
				<NEG_POSTNG></NEG_POSTNG>
				<!--Optional:-->
				<REF_DOC_NO_LONG></REF_DOC_NO_LONG>
			 </item>
		  </T_OPENITEMS>
	   </urn:ZFM_VP_PAYAGE>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VP_PAYAGE_AJ&receiverParty=&receiverService=&interface=SI_VPAY_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result1 = JSON.parse(result1);
            res.send(result1);
        }
    });
});

app.get('/vendorpurchase', function(req, res) {
    username = loginCred[loginCred.length - 1];
    console.log('Vendor Purchase: ' + username);

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZFM_VP_PURCHASE>
		  <!--You may enter the following 4 items in any order-->
		  <VENDOR_ID>` +
        username +
        `</VENDOR_ID>
		  <T_PO_HEADER>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<PO_NUMBER></PO_NUMBER>
				<!--Optional:-->
				<CO_CODE></CO_CODE>
				<!--Optional:-->
				<DOC_CAT></DOC_CAT>
				<!--Optional:-->
				<DOC_TYPE></DOC_TYPE>
				<!--Optional:-->
				<CNTRL_IND></CNTRL_IND>
				<!--Optional:-->
				<DELETE_IND></DELETE_IND>
				<!--Optional:-->
				<STATUS></STATUS>
				<!--Optional:-->
				<CREATED_ON></CREATED_ON>
				<!--Optional:-->
				<CREATED_BY></CREATED_BY>
				<!--Optional:-->
				<ITEM_INTVL></ITEM_INTVL>
				<!--Optional:-->
				<LAST_ITEM></LAST_ITEM>
				<!--Optional:-->
				<VENDOR></VENDOR>
				<!--Optional:-->
				<LANGUAGE></LANGUAGE>
				<!--Optional:-->
				<PMNTTRMS></PMNTTRMS>
				<!--Optional:-->
				<DSCNT1_TO></DSCNT1_TO>
				<!--Optional:-->
				<DSCNT2_TO></DSCNT2_TO>
				<!--Optional:-->
				<DSCNT3_TO></DSCNT3_TO>
				<!--Optional:-->
				<CASH_DISC1></CASH_DISC1>
				<!--Optional:-->
				<CASH_DISC2></CASH_DISC2>
				<!--Optional:-->
				<PURCH_ORG></PURCH_ORG>
				<!--Optional:-->
				<PUR_GROUP></PUR_GROUP>
				<!--Optional:-->
				<CURRENCY></CURRENCY>
				<!--Optional:-->
				<EXCH_RATE></EXCH_RATE>
				<!--Optional:-->
				<EX_RATE_FX></EX_RATE_FX>
				<!--Optional:-->
				<DOC_DATE></DOC_DATE>
				<!--Optional:-->
				<VPER_START></VPER_START>
				<!--Optional:-->
				<VPER_END></VPER_END>
				<!--Optional:-->
				<APPLIC_BY></APPLIC_BY>
				<!--Optional:-->
				<QUOT_DEAD></QUOT_DEAD>
				<!--Optional:-->
				<BINDG_PER></BINDG_PER>
				<!--Optional:-->
				<WARRANTY></WARRANTY>
				<!--Optional:-->
				<BIDINV_NO></BIDINV_NO>
				<!--Optional:-->
				<QUOTATION></QUOTATION>
				<!--Optional:-->
				<QUOT_DATE></QUOT_DATE>
				<!--Optional:-->
				<REF_1></REF_1>
				<!--Optional:-->
				<SALES_PERS></SALES_PERS>
				<!--Optional:-->
				<TELEPHONE></TELEPHONE>
				<!--Optional:-->
				<SUPPL_VEND></SUPPL_VEND>
				<!--Optional:-->
				<CUSTOMER></CUSTOMER>
				<!--Optional:-->
				<AGREEMENT></AGREEMENT>
				<!--Optional:-->
				<REJ_REASON></REJ_REASON>
				<!--Optional:-->
				<COMPL_DLV></COMPL_DLV>
				<!--Optional:-->
				<GR_MESSAGE></GR_MESSAGE>
				<!--Optional:-->
				<SUPPL_PLNT></SUPPL_PLNT>
				<!--Optional:-->
				<RCVG_VEND></RCVG_VEND>
				<!--Optional:-->
				<INCOTERMS1></INCOTERMS1>
				<!--Optional:-->
				<INCOTERMS2></INCOTERMS2>
				<!--Optional:-->
				<TARGET_VAL></TARGET_VAL>
				<!--Optional:-->
				<COLL_NO></COLL_NO>
				<!--Optional:-->
				<DOC_COND></DOC_COND>
				<!--Optional:-->
				<PROCEDURE></PROCEDURE>
				<!--Optional:-->
				<UPDATE_GRP></UPDATE_GRP>
				<!--Optional:-->
				<DIFF_INV></DIFF_INV>
				<!--Optional:-->
				<EXPORT_NO></EXPORT_NO>
				<!--Optional:-->
				<OUR_REF></OUR_REF>
				<!--Optional:-->
				<LOGSYSTEM></LOGSYSTEM>
				<!--Optional:-->
				<SUBITEMINT></SUBITEMINT>
				<!--Optional:-->
				<MAST_COND></MAST_COND>
				<!--Optional:-->
				<REL_GROUP></REL_GROUP>
				<!--Optional:-->
				<REL_STRAT></REL_STRAT>
				<!--Optional:-->
				<REL_IND></REL_IND>
				<!--Optional:-->
				<REL_STATUS></REL_STATUS>
				<!--Optional:-->
				<SUBJ_TO_R></SUBJ_TO_R>
				<!--Optional:-->
				<TAXR_CNTRY></TAXR_CNTRY>
				<!--Optional:-->
				<SCHED_IND></SCHED_IND>
				<!--Optional:-->
				<VEND_NAME></VEND_NAME>
				<!--Optional:-->
				<CURRENCY_ISO></CURRENCY_ISO>
				<!--Optional:-->
				<EXCH_RATE_CM></EXCH_RATE_CM>
				<!--Optional:-->
				<HOLD></HOLD>
			 </item>
		  </T_PO_HEADER>
		  <T_PO_ITEMS>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<PO_NUMBER></PO_NUMBER>
				<!--Optional:-->
				<PO_ITEM></PO_ITEM>
				<!--Optional:-->
				<DELETE_IND></DELETE_IND>
				<!--Optional:-->
				<STATUS></STATUS>
				<!--Optional:-->
				<CHANGED_ON></CHANGED_ON>
				<!--Optional:-->
				<SHORT_TEXT></SHORT_TEXT>
				<!--Optional:-->
				<MATERIAL></MATERIAL>
				<!--Optional:-->
				<PUR_MAT></PUR_MAT>
				<!--Optional:-->
				<CO_CODE></CO_CODE>
				<!--Optional:-->
				<PLANT></PLANT>
				<!--Optional:-->
				<STORE_LOC></STORE_LOC>
				<!--Optional:-->
				<TRACKINGNO></TRACKINGNO>
				<!--Optional:-->
				<MAT_GRP></MAT_GRP>
				<!--Optional:-->
				<INFO_REC></INFO_REC>
				<!--Optional:-->
				<VEND_MAT></VEND_MAT>
				<!--Optional:-->
				<TARGET_QTY></TARGET_QTY>
				<!--Optional:-->
				<QUANTITY></QUANTITY>
				<!--Optional:-->
				<UNIT></UNIT>
				<!--Optional:-->
				<ORDERPR_UN></ORDERPR_UN>
				<!--Optional:-->
				<CONV_NUM1></CONV_NUM1>
				<!--Optional:-->
				<CONV_DEN1></CONV_DEN1>
				<!--Optional:-->
				<CONV_NUM2></CONV_NUM2>
				<!--Optional:-->
				<CONV_DEN2></CONV_DEN2>
				<!--Optional:-->
				<NET_PRICE></NET_PRICE>
				<!--Optional:-->
				<PRICE_UNIT></PRICE_UNIT>
				<!--Optional:-->
				<NET_VALUE></NET_VALUE>
				<!--Optional:-->
				<GROS_VALUE></GROS_VALUE>
				<!--Optional:-->
				<QUOT_DEAD></QUOT_DEAD>
				<!--Optional:-->
				<GR_PR_TIME></GR_PR_TIME>
				<!--Optional:-->
				<TAX_CODE></TAX_CODE>
				<!--Optional:-->
				<SETT_GRP1></SETT_GRP1>
				<!--Optional:-->
				<QUAL_INSP></QUAL_INSP>
				<!--Optional:-->
				<INFO_UPD></INFO_UPD>
				<!--Optional:-->
				<PRNT_PRICE></PRNT_PRICE>
				<!--Optional:-->
				<EST_PRICE></EST_PRICE>
				<!--Optional:-->
				<NUM_REMIND></NUM_REMIND>
				<!--Optional:-->
				<REMINDER1></REMINDER1>
				<!--Optional:-->
				<REMINDER2></REMINDER2>
				<!--Optional:-->
				<REMINDER3></REMINDER3>
				<!--Optional:-->
				<OVERDELTOL></OVERDELTOL>
				<!--Optional:-->
				<UNLIMITED></UNLIMITED>
				<!--Optional:-->
				<UNDER_TOL></UNDER_TOL>
				<!--Optional:-->
				<VAL_TYPE></VAL_TYPE>
				<!--Optional:-->
				<VAL_CAT></VAL_CAT>
				<!--Optional:-->
				<REJ_IND></REJ_IND>
				<!--Optional:-->
				<COMMENT></COMMENT>
				<!--Optional:-->
				<DEL_COMPL></DEL_COMPL>
				<!--Optional:-->
				<FINAL_INV></FINAL_INV>
				<!--Optional:-->
				<ITEM_CAT></ITEM_CAT>
				<!--Optional:-->
				<ACCTASSCAT></ACCTASSCAT>
				<!--Optional:-->
				<CONSUMPT></CONSUMPT>
				<!--Optional:-->
				<DISTRIB></DISTRIB>
				<!--Optional:-->
				<PART_INV></PART_INV>
				<!--Optional:-->
				<GR_IND></GR_IND>
				<!--Optional:-->
				<GR_NON_VAL></GR_NON_VAL>
				<!--Optional:-->
				<IR_IND></IR_IND>
				<!--Optional:-->
				<GR_BASEDIV></GR_BASEDIV>
				<!--Optional:-->
				<ACKN_REQD></ACKN_REQD>
				<!--Optional:-->
				<ACKNOWL_NO></ACKNOWL_NO>
				<!--Optional:-->
				<AGREEMENT></AGREEMENT>
				<!--Optional:-->
				<AGMT_ITEM></AGMT_ITEM>
				<!--Optional:-->
				<RECON_DATE></RECON_DATE>
				<!--Optional:-->
				<AGRCUMQTY></AGRCUMQTY>
				<!--Optional:-->
				<FIRM_ZONE></FIRM_ZONE>
				<!--Optional:-->
				<TRADE_OFF></TRADE_OFF>
				<!--Optional:-->
				<BOM_EXPL></BOM_EXPL>
				<!--Optional:-->
				<EXCLUSION></EXCLUSION>
				<!--Optional:-->
				<BASE_UNIT></BASE_UNIT>
				<!--Optional:-->
				<SHIPPING></SHIPPING>
				<!--Optional:-->
				<OUTL_TARGV></OUTL_TARGV>
				<!--Optional:-->
				<NOND_ITAX></NOND_ITAX>
				<!--Optional:-->
				<RELORD_QTY></RELORD_QTY>
				<!--Optional:-->
				<PRICE_DATE></PRICE_DATE>
				<!--Optional:-->
				<DOC_CAT></DOC_CAT>
				<!--Optional:-->
				<EFF_VALUE></EFF_VALUE>
				<!--Optional:-->
				<COMMITMENT></COMMITMENT>
				<!--Optional:-->
				<CUSTOMER></CUSTOMER>
				<!--Optional:-->
				<ADDRESS></ADDRESS>
				<!--Optional:-->
				<COND_GROUP></COND_GROUP>
				<!--Optional:-->
				<NO_C_DISC></NO_C_DISC>
				<!--Optional:-->
				<UPDATE_GRP></UPDATE_GRP>
				<!--Optional:-->
				<PLAN_DEL></PLAN_DEL>
				<!--Optional:-->
				<NET_WEIGHT></NET_WEIGHT>
				<!--Optional:-->
				<WEIGHTUNIT></WEIGHTUNIT>
				<!--Optional:-->
				<TAX_JUR_CD></TAX_JUR_CD>
				<!--Optional:-->
				<PRINT_REL></PRINT_REL>
				<!--Optional:-->
				<SPEC_STOCK></SPEC_STOCK>
				<!--Optional:-->
				<SETRESERNO></SETRESERNO>
				<!--Optional:-->
				<SETTLITMNO></SETTLITMNO>
				<!--Optional:-->
				<NOT_CHGBL></NOT_CHGBL>
				<!--Optional:-->
				<CTR_KEY_QM></CTR_KEY_QM>
				<!--Optional:-->
				<CERT_TYPE></CERT_TYPE>
				<!--Optional:-->
				<EAN_UPC></EAN_UPC>
				<!--Optional:-->
				<CONF_CTRL></CONF_CTRL>
				<!--Optional:-->
				<REV_LEV></REV_LEV>
				<!--Optional:-->
				<FUND></FUND>
				<!--Optional:-->
				<FUNDS_CTR></FUNDS_CTR>
				<!--Optional:-->
				<CMMT_ITEM></CMMT_ITEM>
				<!--Optional:-->
				<BA_PARTNER></BA_PARTNER>
				<!--Optional:-->
				<PTR_ASS_BA></PTR_ASS_BA>
				<!--Optional:-->
				<PROFIT_CTR></PROFIT_CTR>
				<!--Optional:-->
				<PARTNER_PC></PARTNER_PC>
				<!--Optional:-->
				<PRICE_CTR></PRICE_CTR>
				<!--Optional:-->
				<GROSS_WGHT></GROSS_WGHT>
				<!--Optional:-->
				<VOLUME></VOLUME>
				<!--Optional:-->
				<VOLUMEUNIT></VOLUMEUNIT>
				<!--Optional:-->
				<INCOTERMS1></INCOTERMS1>
				<!--Optional:-->
				<INCOTERMS2></INCOTERMS2>
				<!--Optional:-->
				<ADVANCE></ADVANCE>
				<!--Optional:-->
				<PRIOR_VEND></PRIOR_VEND>
				<!--Optional:-->
				<SUB_RANGE></SUB_RANGE>
				<!--Optional:-->
				<PCKG_NO></PCKG_NO>
				<!--Optional:-->
				<STATISTIC></STATISTIC>
				<!--Optional:-->
				<HL_ITEM></HL_ITEM>
				<!--Optional:-->
				<GR_TO_DATE></GR_TO_DATE>
				<!--Optional:-->
				<SUPPL_VEND></SUPPL_VEND>
				<!--Optional:-->
				<SC_VENDOR></SC_VENDOR>
				<!--Optional:-->
				<CONF_MATL></CONF_MATL>
				<!--Optional:-->
				<MAT_CAT></MAT_CAT>
				<!--Optional:-->
				<KANBAN_IND></KANBAN_IND>
				<!--Optional:-->
				<ADDRESS2></ADDRESS2>
				<!--Optional:-->
				<INT_OBJ_NO></INT_OBJ_NO>
				<!--Optional:-->
				<ERS></ERS>
				<!--Optional:-->
				<GRSETTFROM></GRSETTFROM>
				<!--Optional:-->
				<LAST_TRANS></LAST_TRANS>
				<!--Optional:-->
				<TRANS_TIME></TRANS_TIME>
				<!--Optional:-->
				<SER_NO></SER_NO>
				<!--Optional:-->
				<PROMOTION></PROMOTION>
				<!--Optional:-->
				<ALLOC_TBL></ALLOC_TBL>
				<!--Optional:-->
				<AT_ITEM></AT_ITEM>
				<!--Optional:-->
				<POINTS></POINTS>
				<!--Optional:-->
				<POINTS_UN></POINTS_UN>
				<!--Optional:-->
				<SEASON_TY></SEASON_TY>
				<!--Optional:-->
				<SEASON_YR></SEASON_YR>
				<!--Optional:-->
				<SETT_GRP_2></SETT_GRP_2>
				<!--Optional:-->
				<SETT_GRP_3></SETT_GRP_3>
				<!--Optional:-->
				<SETT_ITEM></SETT_ITEM>
				<!--Optional:-->
				<ML_AKT></ML_AKT>
				<!--Optional:-->
				<REMSHLIFE></REMSHLIFE>
				<!--Optional:-->
				<RFQ></RFQ>
				<!--Optional:-->
				<RFQ_ITEM></RFQ_ITEM>
				<!--Optional:-->
				<CONFIG_ORG></CONFIG_ORG>
				<!--Optional:-->
				<QUOTAUSAGE></QUOTAUSAGE>
				<!--Optional:-->
				<SPSTCK_PHY></SPSTCK_PHY>
				<!--Optional:-->
				<PREQ_NO></PREQ_NO>
				<!--Optional:-->
				<PREQ_ITEM></PREQ_ITEM>
				<!--Optional:-->
				<MAT_TYPE></MAT_TYPE>
				<!--Optional:-->
				<SI_CAT></SI_CAT>
				<!--Optional:-->
				<SUB_ITEMS></SUB_ITEMS>
				<!--Optional:-->
				<SUBTOTAL_1></SUBTOTAL_1>
				<!--Optional:-->
				<SUBTOTAL_2></SUBTOTAL_2>
				<!--Optional:-->
				<SUBTOTAL_3></SUBTOTAL_3>
				<!--Optional:-->
				<SUBTOTAL_4></SUBTOTAL_4>
				<!--Optional:-->
				<SUBTOTAL_5></SUBTOTAL_5>
				<!--Optional:-->
				<SUBTOTAL_6></SUBTOTAL_6>
				<!--Optional:-->
				<SUBITM_KEY></SUBITM_KEY>
				<!--Optional:-->
				<MAX_CMG></MAX_CMG>
				<!--Optional:-->
				<MAX_CPGO></MAX_CPGO>
				<!--Optional:-->
				<RET_ITEM></RET_ITEM>
				<!--Optional:-->
				<AT_RELEV></AT_RELEV>
				<!--Optional:-->
				<ORD_REAS></ORD_REAS>
				<!--Optional:-->
				<DEL_TYP_RT></DEL_TYP_RT>
				<!--Optional:-->
				<PRDTE_CTRL></PRDTE_CTRL>
				<!--Optional:-->
				<MANUF_PROF></MANUF_PROF>
				<!--Optional:-->
				<MANU_MAT></MANU_MAT>
				<!--Optional:-->
				<MFR_NO></MFR_NO>
				<!--Optional:-->
				<MFR_NO_EXT></MFR_NO_EXT>
				<!--Optional:-->
				<ITEM_CAT_EXT></ITEM_CAT_EXT>
				<!--Optional:-->
				<PO_UNIT_ISO></PO_UNIT_ISO>
				<!--Optional:-->
				<ORDERPR_UN_ISO></ORDERPR_UN_ISO>
				<!--Optional:-->
				<BASE_UOM_ISO></BASE_UOM_ISO>
				<!--Optional:-->
				<WEIGHTUNIT_ISO></WEIGHTUNIT_ISO>
				<!--Optional:-->
				<VOLUMEUNIT_ISO></VOLUMEUNIT_ISO>
				<!--Optional:-->
				<POINTS_UN_ISO></POINTS_UN_ISO>
				<!--Optional:-->
				<CONF_MATL_EXTERNAL></CONF_MATL_EXTERNAL>
				<!--Optional:-->
				<CONF_MATL_GUID></CONF_MATL_GUID>
				<!--Optional:-->
				<CONF_MATL_VERSION></CONF_MATL_VERSION>
				<!--Optional:-->
				<MATERIAL_EXTERNAL></MATERIAL_EXTERNAL>
				<!--Optional:-->
				<MATERIAL_GUID></MATERIAL_GUID>
				<!--Optional:-->
				<MATERIAL_VERSION></MATERIAL_VERSION>
				<!--Optional:-->
				<PUR_MAT_EXTERNAL></PUR_MAT_EXTERNAL>
				<!--Optional:-->
				<PUR_MAT_GUID></PUR_MAT_GUID>
				<!--Optional:-->
				<PUR_MAT_VERSION></PUR_MAT_VERSION>
				<!--Optional:-->
				<GRANT_NBR></GRANT_NBR>
				<!--Optional:-->
				<CMMT_ITEM_LONG></CMMT_ITEM_LONG>
				<!--Optional:-->
				<FUNC_AREA_LONG></FUNC_AREA_LONG>
				<!--Optional:-->
				<BUDGET_PERIOD></BUDGET_PERIOD>
			 </item>
		  </T_PO_ITEMS>
		  <T_RETURN>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<TYPE></TYPE>
				<!--Optional:-->
				<CODE></CODE>
				<!--Optional:-->
				<MESSAGE></MESSAGE>
				<!--Optional:-->
				<LOG_NO></LOG_NO>
				<!--Optional:-->
				<LOG_MSG_NO></LOG_MSG_NO>
				<!--Optional:-->
				<MESSAGE_V1></MESSAGE_V1>
				<!--Optional:-->
				<MESSAGE_V2></MESSAGE_V2>
				<!--Optional:-->
				<MESSAGE_V3></MESSAGE_V3>
				<!--Optional:-->
				<MESSAGE_V4></MESSAGE_V4>
			 </item>
		  </T_RETURN>
	   </urn:ZFM_VP_PURCHASE>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VP_PR_AJ&receiverParty=&receiverService=&interface=SI_VP_PR_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result1 = JSON.parse(result1);
            res.send(result1);
        }
    });
});

app.get('/vendorrequest', function(req, res) {
    username = loginCred[loginCred.length - 1];
    // username = "6"
    console.log('Vendor Request: ' + username);

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZFM_VP_RFQ>
		  <!--You may enter the following 4 items in any order-->
		  <VENDOR_ID>` +
        username +
        `</VENDOR_ID>
		  <T_RETURN>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<TYPE></TYPE>
				<!--Optional:-->
				<ID></ID>
				<!--Optional:-->
				<NUMBER></NUMBER>
				<!--Optional:-->
				<MESSAGE></MESSAGE>
				<!--Optional:-->
				<LOG_NO></LOG_NO>
				<!--Optional:-->
				<LOG_MSG_NO></LOG_MSG_NO>
				<!--Optional:-->
				<MESSAGE_V1></MESSAGE_V1>
				<!--Optional:-->
				<MESSAGE_V2></MESSAGE_V2>
				<!--Optional:-->
				<MESSAGE_V3></MESSAGE_V3>
				<!--Optional:-->
				<MESSAGE_V4></MESSAGE_V4>
				<!--Optional:-->
				<PARAMETER></PARAMETER>
				<!--Optional:-->
				<ROW></ROW>
				<!--Optional:-->
				<FIELD></FIELD>
				<!--Optional:-->
				<SYSTEM></SYSTEM>
			 </item>
		  </T_RETURN>
		  <T_RFQ_HEADER>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<DOC_NUMBER></DOC_NUMBER>
				<!--Optional:-->
				<CO_CODE></CO_CODE>
				<!--Optional:-->
				<DOC_CAT></DOC_CAT>
				<!--Optional:-->
				<DOC_TYPE></DOC_TYPE>
				<!--Optional:-->
				<CNTRL_IND></CNTRL_IND>
				<!--Optional:-->
				<DELETE_IND></DELETE_IND>
				<!--Optional:-->
				<STATUS></STATUS>
				<!--Optional:-->
				<CREATED_ON></CREATED_ON>
				<!--Optional:-->
				<CREATED_BY></CREATED_BY>
				<!--Optional:-->
				<ITEM_INTVL></ITEM_INTVL>
				<!--Optional:-->
				<LAST_ITEM></LAST_ITEM>
				<!--Optional:-->
				<VENDOR></VENDOR>
				<!--Optional:-->
				<LANGUAGE></LANGUAGE>
				<!--Optional:-->
				<PMNTTRMS></PMNTTRMS>
				<!--Optional:-->
				<DSCNT1_TO></DSCNT1_TO>
				<!--Optional:-->
				<DSCNT2_TO></DSCNT2_TO>
				<!--Optional:-->
				<DSCNT3_TO></DSCNT3_TO>
				<!--Optional:-->
				<CASH_DISC1></CASH_DISC1>
				<!--Optional:-->
				<CASH_DISC2></CASH_DISC2>
				<!--Optional:-->
				<PURCH_ORG></PURCH_ORG>
				<!--Optional:-->
				<PUR_GROUP></PUR_GROUP>
				<!--Optional:-->
				<CURRENCY></CURRENCY>
				<!--Optional:-->
				<EXCH_RATE></EXCH_RATE>
				<!--Optional:-->
				<EX_RATE_FX></EX_RATE_FX>
				<!--Optional:-->
				<DOC_DATE></DOC_DATE>
				<!--Optional:-->
				<VPER_START></VPER_START>
				<!--Optional:-->
				<VPER_END></VPER_END>
				<!--Optional:-->
				<APPLIC_BY></APPLIC_BY>
				<!--Optional:-->
				<QUOT_DEAD></QUOT_DEAD>
				<!--Optional:-->
				<BINDG_PER></BINDG_PER>
				<!--Optional:-->
				<WARRANTY></WARRANTY>
				<!--Optional:-->
				<BIDINV_NO></BIDINV_NO>
				<!--Optional:-->
				<QUOTATION></QUOTATION>
				<!--Optional:-->
				<QUOT_DATE></QUOT_DATE>
				<!--Optional:-->
				<REF_1></REF_1>
				<!--Optional:-->
				<SALES_PERS></SALES_PERS>
				<!--Optional:-->
				<TELEPHONE></TELEPHONE>
				<!--Optional:-->
				<SUPPL_VEND></SUPPL_VEND>
				<!--Optional:-->
				<CUSTOMER></CUSTOMER>
				<!--Optional:-->
				<AGREEMENT></AGREEMENT>
				<!--Optional:-->
				<REJ_REASON></REJ_REASON>
				<!--Optional:-->
				<COMPL_DLV></COMPL_DLV>
				<!--Optional:-->
				<GR_MESSAGE></GR_MESSAGE>
				<!--Optional:-->
				<SUPPL_PLNT></SUPPL_PLNT>
				<!--Optional:-->
				<RCVG_VEND></RCVG_VEND>
				<!--Optional:-->
				<INCOTERMS1></INCOTERMS1>
				<!--Optional:-->
				<INCOTERMS2></INCOTERMS2>
				<!--Optional:-->
				<TARGET_VAL></TARGET_VAL>
				<!--Optional:-->
				<COLL_NO></COLL_NO>
				<!--Optional:-->
				<DOC_COND></DOC_COND>
				<!--Optional:-->
				<PROCEDURE></PROCEDURE>
				<!--Optional:-->
				<UPDATE_GRP></UPDATE_GRP>
				<!--Optional:-->
				<DIFF_INV></DIFF_INV>
				<!--Optional:-->
				<EXPORT_NO></EXPORT_NO>
				<!--Optional:-->
				<OUR_REF></OUR_REF>
				<!--Optional:-->
				<LOGSYSTEM></LOGSYSTEM>
				<!--Optional:-->
				<SUBITEMINT></SUBITEMINT>
				<!--Optional:-->
				<MAST_COND></MAST_COND>
				<!--Optional:-->
				<REL_GROUP></REL_GROUP>
				<!--Optional:-->
				<REL_STRAT></REL_STRAT>
				<!--Optional:-->
				<REL_IND></REL_IND>
				<!--Optional:-->
				<REL_STATUS></REL_STATUS>
				<!--Optional:-->
				<SUBJ_TO_R></SUBJ_TO_R>
				<!--Optional:-->
				<TAXR_CNTRY></TAXR_CNTRY>
				<!--Optional:-->
				<SCHED_IND></SCHED_IND>
				<!--Optional:-->
				<VEND_NAME></VEND_NAME>
				<!--Optional:-->
				<CURRENCY_ISO></CURRENCY_ISO>
				<!--Optional:-->
				<EXCH_RATE_CM></EXCH_RATE_CM>
				<!--Optional:-->
				<TRNSP_MODE></TRNSP_MODE>
				<!--Optional:-->
				<CUSTOMS></CUSTOMS>
			 </item>
		  </T_RFQ_HEADER>
		  <T_RFQ_ITEMS>
			 <!--Zero or more repetitions:-->
			 <item>
				<!--Optional:-->
				<DOC_NUMBER></DOC_NUMBER>
				<!--Optional:-->
				<DOC_ITEM></DOC_ITEM>
				<!--Optional:-->
				<DELETE_IND></DELETE_IND>
				<!--Optional:-->
				<STATUS></STATUS>
				<!--Optional:-->
				<CHANGED_ON></CHANGED_ON>
				<!--Optional:-->
				<SHORT_TEXT></SHORT_TEXT>
				<!--Optional:-->
				<MATERIAL></MATERIAL>
				<!--Optional:-->
				<PUR_MAT></PUR_MAT>
				<!--Optional:-->
				<CO_CODE></CO_CODE>
				<!--Optional:-->
				<PLANT></PLANT>
				<!--Optional:-->
				<STORE_LOC></STORE_LOC>
				<!--Optional:-->
				<TRACKINGNO></TRACKINGNO>
				<!--Optional:-->
				<MAT_GRP></MAT_GRP>
				<!--Optional:-->
				<INFO_REC></INFO_REC>
				<!--Optional:-->
				<VEND_MAT></VEND_MAT>
				<!--Optional:-->
				<TARGET_QTY></TARGET_QTY>
				<!--Optional:-->
				<QUANTITY></QUANTITY>
				<!--Optional:-->
				<UNIT></UNIT>
				<!--Optional:-->
				<ORDERPR_UN></ORDERPR_UN>
				<!--Optional:-->
				<CONV_NUM1></CONV_NUM1>
				<!--Optional:-->
				<CONV_DEN1></CONV_DEN1>
				<!--Optional:-->
				<CONV_NUM2></CONV_NUM2>
				<!--Optional:-->
				<CONV_DEN2></CONV_DEN2>
				<!--Optional:-->
				<NET_PRICE></NET_PRICE>
				<!--Optional:-->
				<PRICE_UNIT></PRICE_UNIT>
				<!--Optional:-->
				<NET_VALUE></NET_VALUE>
				<!--Optional:-->
				<GROS_VALUE></GROS_VALUE>
				<!--Optional:-->
				<QUOT_DEAD></QUOT_DEAD>
				<!--Optional:-->
				<GR_PR_TIME></GR_PR_TIME>
				<!--Optional:-->
				<TAX_CODE></TAX_CODE>
				<!--Optional:-->
				<SETT_GRP1></SETT_GRP1>
				<!--Optional:-->
				<QUAL_INSP></QUAL_INSP>
				<!--Optional:-->
				<INFO_UPD></INFO_UPD>
				<!--Optional:-->
				<PRNT_PRICE></PRNT_PRICE>
				<!--Optional:-->
				<EST_PRICE></EST_PRICE>
				<!--Optional:-->
				<NUM_REMIND></NUM_REMIND>
				<!--Optional:-->
				<REMINDER1></REMINDER1>
				<!--Optional:-->
				<REMINDER2></REMINDER2>
				<!--Optional:-->
				<REMINDER3></REMINDER3>
				<!--Optional:-->
				<OVERDELTOL></OVERDELTOL>
				<!--Optional:-->
				<UNLIMITED></UNLIMITED>
				<!--Optional:-->
				<UNDER_TOL></UNDER_TOL>
				<!--Optional:-->
				<VAL_TYPE></VAL_TYPE>
				<!--Optional:-->
				<VAL_CAT></VAL_CAT>
				<!--Optional:-->
				<REJ_IND></REJ_IND>
				<!--Optional:-->
				<COMMENT></COMMENT>
				<!--Optional:-->
				<DEL_COMPL></DEL_COMPL>
				<!--Optional:-->
				<FINAL_INV></FINAL_INV>
				<!--Optional:-->
				<ITEM_CAT></ITEM_CAT>
				<!--Optional:-->
				<ACCTASSCAT></ACCTASSCAT>
				<!--Optional:-->
				<CONSUMPT></CONSUMPT>
				<!--Optional:-->
				<DISTRIB></DISTRIB>
				<!--Optional:-->
				<PART_INV></PART_INV>
				<!--Optional:-->
				<GR_IND></GR_IND>
				<!--Optional:-->
				<GR_NON_VAL></GR_NON_VAL>
				<!--Optional:-->
				<IR_IND></IR_IND>
				<!--Optional:-->
				<GR_BASEDIV></GR_BASEDIV>
				<!--Optional:-->
				<ACKN_REQD></ACKN_REQD>
				<!--Optional:-->
				<ACKNOWL_NO></ACKNOWL_NO>
				<!--Optional:-->
				<AGREEMENT></AGREEMENT>
				<!--Optional:-->
				<AGMT_ITEM></AGMT_ITEM>
				<!--Optional:-->
				<RECON_DATE></RECON_DATE>
				<!--Optional:-->
				<AGRCUMQTY></AGRCUMQTY>
				<!--Optional:-->
				<FIRM_ZONE></FIRM_ZONE>
				<!--Optional:-->
				<TRADE_OFF></TRADE_OFF>
				<!--Optional:-->
				<BOM_EXPL></BOM_EXPL>
				<!--Optional:-->
				<EXCLUSION></EXCLUSION>
				<!--Optional:-->
				<BASE_UNIT></BASE_UNIT>
				<!--Optional:-->
				<SHIPPING></SHIPPING>
				<!--Optional:-->
				<OUTL_TARGV></OUTL_TARGV>
				<!--Optional:-->
				<NOND_ITAX></NOND_ITAX>
				<!--Optional:-->
				<RELORD_QTY></RELORD_QTY>
				<!--Optional:-->
				<PRICE_DATE></PRICE_DATE>
				<!--Optional:-->
				<DOC_CAT></DOC_CAT>
				<!--Optional:-->
				<EFF_VALUE></EFF_VALUE>
				<!--Optional:-->
				<COMMITMENT></COMMITMENT>
				<!--Optional:-->
				<CUSTOMER></CUSTOMER>
				<!--Optional:-->
				<ADDRESS></ADDRESS>
				<!--Optional:-->
				<COND_GROUP></COND_GROUP>
				<!--Optional:-->
				<NO_C_DISC></NO_C_DISC>
				<!--Optional:-->
				<UPDATE_GRP></UPDATE_GRP>
				<!--Optional:-->
				<PLAN_DEL></PLAN_DEL>
				<!--Optional:-->
				<NET_WEIGHT></NET_WEIGHT>
				<!--Optional:-->
				<WEIGHTUNIT></WEIGHTUNIT>
				<!--Optional:-->
				<TAX_JUR_CD></TAX_JUR_CD>
				<!--Optional:-->
				<PRINT_REL></PRINT_REL>
				<!--Optional:-->
				<SPEC_STOCK></SPEC_STOCK>
				<!--Optional:-->
				<SETRESERNO></SETRESERNO>
				<!--Optional:-->
				<SETTLITMNO></SETTLITMNO>
				<!--Optional:-->
				<NOT_CHGBL></NOT_CHGBL>
				<!--Optional:-->
				<CTR_KEY_QM></CTR_KEY_QM>
				<!--Optional:-->
				<CERT_TYPE></CERT_TYPE>
				<!--Optional:-->
				<EAN_UPC></EAN_UPC>
				<!--Optional:-->
				<CONF_CTRL></CONF_CTRL>
				<!--Optional:-->
				<REV_LEV></REV_LEV>
				<!--Optional:-->
				<FUND></FUND>
				<!--Optional:-->
				<FUNDS_CTR></FUNDS_CTR>
				<!--Optional:-->
				<CMMT_ITEM></CMMT_ITEM>
				<!--Optional:-->
				<BA_PARTNER></BA_PARTNER>
				<!--Optional:-->
				<PTR_ASS_BA></PTR_ASS_BA>
				<!--Optional:-->
				<PROFIT_CTR></PROFIT_CTR>
				<!--Optional:-->
				<PARTNER_PC></PARTNER_PC>
				<!--Optional:-->
				<PRICE_CTR></PRICE_CTR>
				<!--Optional:-->
				<GROSS_WGHT></GROSS_WGHT>
				<!--Optional:-->
				<VOLUME></VOLUME>
				<!--Optional:-->
				<VOLUMEUNIT></VOLUMEUNIT>
				<!--Optional:-->
				<INCOTERMS1></INCOTERMS1>
				<!--Optional:-->
				<INCOTERMS2></INCOTERMS2>
				<!--Optional:-->
				<ADVANCE></ADVANCE>
				<!--Optional:-->
				<PRIOR_VEND></PRIOR_VEND>
				<!--Optional:-->
				<SUB_RANGE></SUB_RANGE>
				<!--Optional:-->
				<PCKG_NO></PCKG_NO>
				<!--Optional:-->
				<STATISTIC></STATISTIC>
				<!--Optional:-->
				<HL_ITEM></HL_ITEM>
				<!--Optional:-->
				<GR_TO_DATE></GR_TO_DATE>
				<!--Optional:-->
				<SUPPL_VEND></SUPPL_VEND>
				<!--Optional:-->
				<SC_VENDOR></SC_VENDOR>
				<!--Optional:-->
				<CONF_MATL></CONF_MATL>
				<!--Optional:-->
				<MAT_CAT></MAT_CAT>
				<!--Optional:-->
				<KANBAN_IND></KANBAN_IND>
				<!--Optional:-->
				<ADDRESS2></ADDRESS2>
				<!--Optional:-->
				<INT_OBJ_NO></INT_OBJ_NO>
				<!--Optional:-->
				<ERS></ERS>
				<!--Optional:-->
				<GRSETTFROM></GRSETTFROM>
				<!--Optional:-->
				<LAST_TRANS></LAST_TRANS>
				<!--Optional:-->
				<TRANS_TIME></TRANS_TIME>
				<!--Optional:-->
				<SER_NO></SER_NO>
				<!--Optional:-->
				<PROMOTION></PROMOTION>
				<!--Optional:-->
				<ALLOC_TBL></ALLOC_TBL>
				<!--Optional:-->
				<AT_ITEM></AT_ITEM>
				<!--Optional:-->
				<POINTS></POINTS>
				<!--Optional:-->
				<POINTS_UN></POINTS_UN>
				<!--Optional:-->
				<SEASON_TY></SEASON_TY>
				<!--Optional:-->
				<SEASON_YR></SEASON_YR>
				<!--Optional:-->
				<SETT_GRP_2></SETT_GRP_2>
				<!--Optional:-->
				<SETT_GRP_3></SETT_GRP_3>
				<!--Optional:-->
				<SETT_ITEM></SETT_ITEM>
				<!--Optional:-->
				<ML_AKT></ML_AKT>
				<!--Optional:-->
				<REMSHLIFE></REMSHLIFE>
				<!--Optional:-->
				<RFQ></RFQ>
				<!--Optional:-->
				<RFQ_ITEM></RFQ_ITEM>
				<!--Optional:-->
				<CONFIG_ORG></CONFIG_ORG>
				<!--Optional:-->
				<QUOTAUSAGE></QUOTAUSAGE>
				<!--Optional:-->
				<SPSTCK_PHY></SPSTCK_PHY>
				<!--Optional:-->
				<PREQ_NO></PREQ_NO>
				<!--Optional:-->
				<PREQ_ITEM></PREQ_ITEM>
				<!--Optional:-->
				<MAT_TYPE></MAT_TYPE>
				<!--Optional:-->
				<SI_CAT></SI_CAT>
				<!--Optional:-->
				<SUB_ITEMS></SUB_ITEMS>
				<!--Optional:-->
				<SUBTOTAL_1></SUBTOTAL_1>
				<!--Optional:-->
				<SUBTOTAL_2></SUBTOTAL_2>
				<!--Optional:-->
				<SUBTOTAL_3></SUBTOTAL_3>
				<!--Optional:-->
				<SUBTOTAL_4></SUBTOTAL_4>
				<!--Optional:-->
				<SUBTOTAL_5></SUBTOTAL_5>
				<!--Optional:-->
				<SUBTOTAL_6></SUBTOTAL_6>
				<!--Optional:-->
				<SUBITM_KEY></SUBITM_KEY>
				<!--Optional:-->
				<MAX_CMG></MAX_CMG>
				<!--Optional:-->
				<MAX_CPGO></MAX_CPGO>
				<!--Optional:-->
				<RET_ITEM></RET_ITEM>
				<!--Optional:-->
				<AT_RELEV></AT_RELEV>
				<!--Optional:-->
				<ORD_REAS></ORD_REAS>
				<!--Optional:-->
				<DEL_TYP_RT></DEL_TYP_RT>
				<!--Optional:-->
				<PRDTE_CTRL></PRDTE_CTRL>
				<!--Optional:-->
				<MANUF_PROF></MANUF_PROF>
				<!--Optional:-->
				<MANU_MAT></MANU_MAT>
				<!--Optional:-->
				<MFR_NO></MFR_NO>
				<!--Optional:-->
				<MFR_NO_EXT></MFR_NO_EXT>
				<!--Optional:-->
				<ITEM_CAT_EXT></ITEM_CAT_EXT>
				<!--Optional:-->
				<PO_UNIT_ISO></PO_UNIT_ISO>
				<!--Optional:-->
				<ORDERPR_UN_ISO></ORDERPR_UN_ISO>
				<!--Optional:-->
				<BASE_UOM_ISO></BASE_UOM_ISO>
				<!--Optional:-->
				<WEIGHTUNIT_ISO></WEIGHTUNIT_ISO>
				<!--Optional:-->
				<VOLUMEUNIT_ISO></VOLUMEUNIT_ISO>
				<!--Optional:-->
				<POINTS_UN_ISO></POINTS_UN_ISO>
				<!--Optional:-->
				<PREQ_NAME></PREQ_NAME>
				<!--Optional:-->
				<BUS_TRANST></BUS_TRANST>
				<!--Optional:-->
				<EXPIMPPROC></EXPIMPPROC>
				<!--Optional:-->
				<COMM_CODE></COMM_CODE>
				<!--Optional:-->
				<REG_ORIGIN></REG_ORIGIN>
				<!--Optional:-->
				<COUNT_ORIG></COUNT_ORIG>
				<!--Optional:-->
				<PO_PRICE></PO_PRICE>
				<!--Optional:-->
				<NO_ROUNDING></NO_ROUNDING>
			 </item>
		  </T_RFQ_ITEMS>
	   </urn:ZFM_VP_RFQ>
	</soapenv:Body>
 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_VP_RFQ_AJ&receiverParty=&receiverService=&interface=SI_VP_RFQ_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result1 = JSON.parse(result1);
            res.send(result1);
        }
    });
});

app.post('/vendorform', function(req, res) {
    // username = loginCred[loginCred.length - 1];
    username = "SA1000"
    console.log('Vendor Form: ' + username);

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
		<soapenv:Header/>
		<soapenv:Body>
		   <urn:ZFM_VP_INVOICE_CALLER>
			  <!--You may enter the following 4 items in any order-->
			  <I_INVOICENO>` + req.body.number + `</I_INVOICENO>
			  <I_VENDOR_ID>` + username + `</I_VENDOR_ID>
			  <I_YEAR>` + req.body.year + `</I_YEAR>
			  <RETURN>
				 <!--Zero or more repetitions:-->
				 <item>
					<!--Optional:-->
					<TYPE></TYPE>
					<!--Optional:-->
					<ID></ID>
					<!--Optional:-->
					<NUMBER></NUMBER>
					<!--Optional:-->
					<MESSAGE></MESSAGE>
					<!--Optional:-->
					<LOG_NO></LOG_NO>
					<!--Optional:-->
					<LOG_MSG_NO></LOG_MSG_NO>
					<!--Optional:-->
					<MESSAGE_V1></MESSAGE_V1>
					<!--Optional:-->
					<MESSAGE_V2></MESSAGE_V2>
					<!--Optional:-->
					<MESSAGE_V3></MESSAGE_V3>
					<!--Optional:-->
					<MESSAGE_V4></MESSAGE_V4>
					<!--Optional:-->
					<PARAMETER></PARAMETER>
					<!--Optional:-->
					<ROW></ROW>
					<!--Optional:-->
					<FIELD></FIELD>
					<!--Optional:-->
					<SYSTEM></SYSTEM>
				 </item>
			  </RETURN>
		   </urn:ZFM_VP_INVOICE_CALLER>
		</soapenv:Body>
	 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_AJPIPO&receiverParty=&receiverService=&interface=SI_VP_FORMS&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result1 = JSON.parse(result1);
            res.send(result1);
        }
    });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//-----------------------EMPLOYEE PORTAL----------------------------------------------------

app.post('/emplogin', function(req, res) {
    username = req.body.username;
    password = req.body.password;
    username = username.toUpperCase();
    loginCred.push(username);
    console.log('Login Set Username : ' + loginCred);

    //827CCB0EEA8A706C4C34A16891F84E7B
    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
		<soapenv:Header/>
		<soapenv:Body>
		   <urn:ZFM_EMP_LOGIN_AJ>
			  <!--You may enter the following 2 items in any order-->
			  <EMP_ID>` + username + `</EMP_ID>
			  <PASSWORD>` + password + `</PASSWORD>
		   </urn:ZFM_EMP_LOGIN_AJ>
		</soapenv:Body>
	 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_AJPIPO&receiverParty=&receiverService=&interface=SI_EMP_LOGIN&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var response = parser.xml2json(body, { compact: true, spaces: 4 });
            response = JSON.parse(response);
            const result = response['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_EMP_LOGIN_AJ.Response']['USERNAME']['_text'];
            console.log(result);
            if (result !== 'UNUS' && result !== 'WP') {
                let payload = { subject: username };
                let token = jwt.sign(payload, 'SeCrEtKeY');
                let resultVal = token + ':::::' + result;
                res.send(JSON.stringify(resultVal));
            } else if (result === 'UNUS') {
                console.log('Error: UNREGISTERED USER');
                res.send(JSON.stringify(result));
            } else {
                res.send(JSON.stringify(result));
            }
        }
    });
});

app.get('/getempprofile', function(req, res) {
    username = loginCred[loginCred.length - 1];
    // username = "0000000006"
    console.log('Employee View Profile: ' + username);
    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
		<soapenv:Header/>
		<soapenv:Body>
		   <urn:ZFM_EMP_GET_DETAILS_AJ>
			  <!--You may enter the following 2 items in any order-->
			  <EMP_ID>` + username + `</EMP_ID>
			  <!--Optional:-->
			  <COMP>
				 <!--Zero or more repetitions:-->
				 <item>
					<!--Optional:-->
					<COMP_CODE></COMP_CODE>
					<!--Optional:-->
					<COMP_NAME></COMP_NAME>
					<!--Optional:-->
					<CITY></CITY>
					<!--Optional:-->
					<COUNTRY></COUNTRY>
					<!--Optional:-->
					<CURRENCY></CURRENCY>
					<!--Optional:-->
					<LANGU></LANGU>
					<!--Optional:-->
					<CHRT_ACCTS></CHRT_ACCTS>
					<!--Optional:-->
					<FY_VARIANT></FY_VARIANT>
					<!--Optional:-->
					<VAT_REG_NO></VAT_REG_NO>
					<!--Optional:-->
					<COMPANY></COMPANY>
					<!--Optional:-->
					<ADDR_NO></ADDR_NO>
					<!--Optional:-->
					<COUNTRY_ISO></COUNTRY_ISO>
					<!--Optional:-->
					<CURRENCY_ISO></CURRENCY_ISO>
					<!--Optional:-->
					<LANGU_ISO></LANGU_ISO>
				 </item>
			  </COMP>
		   </urn:ZFM_EMP_GET_DETAILS_AJ>
		</soapenv:Body>
	 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_AJPIPO&receiverParty=&receiverService=&interface=SI_EMP_GET_DETAILS_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            var resp = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_EMP_GET_DETAILS_AJ.Response']; //This has Employee details and company details as tables
            res.send(resp);
        }
    });
});

app.post('/updateempprofile', (req, res) => {
    username = loginCred[loginCred.length - 1];
    // username = '0000007006'
	console.log('Update Proflie Hitted');
    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
		<soapenv:Header/>
		<soapenv:Body>
		   <urn:ZFM_EMP_UPDATE_AJ>
			  <!--You may enter the following 9 items in any order-->
			  <!--Optional:-->
			  <CITY>`+ req.body.c_city +`</CITY>
			  <!--Optional:-->
			  <COUNTRY>`+req.body.c_country +`</COUNTRY>
			  <!--Optional:-->
			  <DOB>` + req.body.dob + `</DOB>
			  <EMP_ID>` + username + `</EMP_ID>
			  <!--Optional:-->
			  <FIRST_NAME>` + req.body.cf_name +`</FIRST_NAME>
			  <!--Optional:-->
			  <LAST_NAME>`+ req.body.cl_name +`</LAST_NAME>
			  <!--Optional:-->
			  <MOBILE>` + req.body.c_mobile +`</MOBILE>
			  <!--Optional:-->
			  <PINCODE>` + req.body.c_pin +`</PINCODE>
			  <!--Optional:-->
			  <STREET>` + req.body.c_street +`</STREET>
		   </urn:ZFM_EMP_UPDATE_AJ>
		</soapenv:Body>
	 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_AJPIPO&receiverParty=&receiverService=&interface=SI_EMP_UPDATE_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            result2 = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_EMP_UPDATE_AJ.Response']['RETURN']['_text'];
            console.log('Edit Profile Status:', result2);
            if (result2 === "1") {
                res.send(JSON.stringify('Success'));
            } else {
                res.send(JSON.stringify('Error'));
            }
        }
    });
});

app.get('/leavedetails', (req, res) => {
    username = loginCred[loginCred.length - 1];
    // username = '0000007006'
    console.log('Employee Leave Details : ', username)
    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
		<soapenv:Header/>
		<soapenv:Body>
		   <urn:ZFM_EMP_LEAVE_DETAILS_AJ>
			  <!--You may enter the following 4 items in any order-->
			  <EMP_ID>5018</EMP_ID>
			  <!--Optional:-->
			  <IT_LEAVE_DETAILS>
				 <!--Zero or more repetitions:-->
				 <item>
					<!--Optional:-->
					<EMPLOYEENO>` + username + `</EMPLOYEENO>
					<!--Optional:-->
					<SUBTYPE></SUBTYPE>
					<!--Optional:-->
					<OBJECTID></OBJECTID>
					<!--Optional:-->
					<LOCKINDIC></LOCKINDIC>
					<!--Optional:-->
					<VALIDEND></VALIDEND>
					<!--Optional:-->
					<VALIDBEGIN></VALIDBEGIN>
					<!--Optional:-->
					<RECORDNR></RECORDNR>
					<!--Optional:-->
					<START></START>
					<!--Optional:-->
					<END></END>
					<!--Optional:-->
					<ABSENCETYPE></ABSENCETYPE>
					<!--Optional:-->
					<NAMEOFABSENCETYPE></NAMEOFABSENCETYPE>
					<!--Optional:-->
					<ABSENCEDAYS></ABSENCEDAYS>
					<!--Optional:-->
					<ABSENCEHOURS></ABSENCEHOURS>
				 </item>
			  </IT_LEAVE_DETAILS>
			  <!--Optional:-->
			  <IT_LEAVE_REMAIN>
				 <!--Zero or more repetitions:-->
				 <item>
					<!--Optional:-->
					<QUOTATYPE></QUOTATYPE>
					<!--Optional:-->
					<LEAVETYPE></LEAVETYPE>
					<!--Optional:-->
					<QUOTATEXT></QUOTATEXT>
					<!--Optional:-->
					<QUOTAEND></QUOTAEND>
					<!--Optional:-->
					<QUOTABEG></QUOTABEG>
					<!--Optional:-->
					<ENTITLE></ENTITLE>
					<!--Optional:-->
					<DEDUCT></DEDUCT>
					<!--Optional:-->
					<ORDERED></ORDERED>
					<!--Optional:-->
					<QUOTANUM></QUOTANUM>
					<!--Optional:-->
					<TIME_UNIT></TIME_UNIT>
					<!--Optional:-->
					<TIUNITEXT></TIUNITEXT>
				 </item>
			  </IT_LEAVE_REMAIN>
			  <!--Optional:-->
			  <IT_LEAVE_TYPE>
				 <!--Zero or more repetitions:-->
				 <item>
					<!--Optional:-->
					<MANDT></MANDT>
					<!--Optional:-->
					<SPRSL></SPRSL>
					<!--Optional:-->
					<MOABW></MOABW>
					<!--Optional:-->
					<AWART></AWART>
					<!--Optional:-->
					<ATEXT></ATEXT>
				 </item>
			  </IT_LEAVE_TYPE>
		   </urn:ZFM_EMP_LEAVE_DETAILS_AJ>
		</soapenv:Body>
	 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_AJPIPO&receiverParty=&receiverService=&interface=SI_EMP_LEAVE_DET_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            result2 = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_EMP_LEAVE_DETAILS_AJ.Response'];
            res.send(result2)
        }
    });
});

app.post('/leaverequest', (req, res) => {
    username = loginCred[loginCred.length - 1];
    // username = '0000007006'

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
		<soapenv:Header/>
		<soapenv:Body>
		   <urn:ZFM_EMP_LEAVE_REQUEST_AJ>
			  <!--You may enter the following 7 items in any order-->
			  <EMP_ID>` + username + `</EMP_ID>
			  <END_DATE></END_DATE>
			  <!--Optional:-->
			  <END_TIME></END_TIME>
			  <!--Optional:-->
			  <LEAVE_TYPE></LEAVE_TYPE>
			  <START_DATE></START_DATE>
			  <!--Optional:-->
			  <START_TIME></START_TIME>
			  <!--Optional:-->
			  <TOTAL_HRS></TOTAL_HRS>
		   </urn:ZFM_EMP_LEAVE_REQUEST_AJ>
		</soapenv:Body>
	 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_AJPIPO&receiverParty=&receiverService=&interface=SI_EMP_UPDATE_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            result2 = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_EMP_LEAVE_REQUEST_AJ.Response'];
            res.send(result2)
        }
    });
});

app.post('/leavedelete', (req, res) => {
    username = loginCred[loginCred.length - 1];
    // username = '0000007006'

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
		<soapenv:Header/>
		<soapenv:Body>
		   <urn:ZFM_EMP_LEAVE_DELETE_AJ>
			  <!--You may enter the following 7 items in any order-->
			  <I_EMP_ID>` + uername + `</I_EMP_ID>
			  <I_ENDDATE></I_ENDDATE>
			  <!--Optional:-->
			  <I_LOCKINDICATOR></I_LOCKINDICATOR>
			  <!--Optional:-->
			  <I_OBJID></I_OBJID>
			  <I_RECNUM></I_RECNUM>
			  <I_STARTDATE></I_STARTDATE>
			  <I_SUBTYPE></I_SUBTYPE>
		   </urn:ZFM_EMP_LEAVE_DELETE_AJ>
		</soapenv:Body>
	 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_AJPIPO&receiverParty=&receiverService=&interface=SI_EMP_LEAVE_DEL_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            result2 = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_EMP_LEAVE_REQUEST_AJ.Response'];
            res.send(result2)
        }
    });
}); //ERROR IN PIPO

app.post('/emppayslip', (req, res) => {
    username = loginCred[loginCred.length - 1];
    // username = '0000007006'
	console.log('Employee Payslip: ', username)

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
		<soapenv:Header/>
		<soapenv:Body>
		   <urn:ZFM_EMP_PAYSLIP_PDF_AJ>
			  <!--You may enter the following 3 items in any order-->
			  <EMP_ID>` + username + `</EMP_ID>
			  <SEQ_NUM>` + req.body.month + `</SEQ_NUM>
			  <!--Optional:-->
			  <IT_PAYSLIP_HTML>
				 <!--Zero or more repetitions:-->
				 <item>
					<!--Optional:-->
					<LINE>`+req.body.year+`</LINE>
				 </item>
			  </IT_PAYSLIP_HTML>
		   </urn:ZFM_EMP_PAYSLIP_PDF_AJ>
		</soapenv:Body>
	 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_AJPIPO&receiverParty=&receiverService=&interface=SI_EMP_PAYSLIP_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            result2 = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_EMP_PAYSLIP_PDF_AJ.Response'];
            res.send(result2)
        }
    });
});

app.post('/empfs', (req, res) => {
	
    username = loginCred[loginCred.length - 1];
    // username = '0000007006'
	console.log('Employee Payslip: ', username)

    const loginData =
        `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
		<soapenv:Header/>
		<soapenv:Body>
		   <urn:ZFM_EMP_FSETT_AJ>
			  <!--You may enter the following 5 items in any order-->
			  <I_EMP_ID>`+ username +`</I_EMP_ID>
			  <REQ_TYPE>`+ req.body.type +`</REQ_TYPE>
			  <BASICPAY>
				 <!--Zero or more repetitions:-->
				 <item>
					<!--Optional:-->
					<EMPLOYEENO></EMPLOYEENO>
					<!--Optional:-->
					<SUBTYPE></SUBTYPE>
					<!--Optional:-->
					<OBJECTID></OBJECTID>
					<!--Optional:-->
					<LOCKINDIC></LOCKINDIC>
					<!--Optional:-->
					<VALIDEND></VALIDEND>
					<!--Optional:-->
					<VALIDBEGIN></VALIDBEGIN>
					<!--Optional:-->
					<RECORDNR></RECORDNR>
				 </item>
			  </BASICPAY>
			  <COMPANYDETAILS>
				 <!--Zero or more repetitions:-->
				 <item>
					<!--Optional:-->
					<COMP_CODE></COMP_CODE>
					<!--Optional:-->
					<COMP_NAME></COMP_NAME>
					<!--Optional:-->
					<CITY></CITY>
					<!--Optional:-->
					<COUNTRY></COUNTRY>
					<!--Optional:-->
					<CURRENCY></CURRENCY>
					<!--Optional:-->
					<LANGU></LANGU>
					<!--Optional:-->
					<CHRT_ACCTS></CHRT_ACCTS>
					<!--Optional:-->
					<FY_VARIANT></FY_VARIANT>
					<!--Optional:-->
					<VAT_REG_NO></VAT_REG_NO>
					<!--Optional:-->
					<COMPANY></COMPANY>
					<!--Optional:-->
					<ADDR_NO></ADDR_NO>
					<!--Optional:-->
					<COUNTRY_ISO></COUNTRY_ISO>
					<!--Optional:-->
					<CURRENCY_ISO></CURRENCY_ISO>
					<!--Optional:-->
					<LANGU_ISO></LANGU_ISO>
				 </item>
			  </COMPANYDETAILS>
			  <WAGETYPES>
				 <!--Zero or more repetitions:-->
				 <item>
					<!--Optional:-->
					<WAGETYPE></WAGETYPE>
					<!--Optional:-->
					<AMOUNT></AMOUNT>
					<!--Optional:-->
					<NUMBER></NUMBER>
					<!--Optional:-->
					<TIMEUNIT></TIMEUNIT>
					<!--Optional:-->
					<INDVALUAT></INDVALUAT>
					<!--Optional:-->
					<ADDTOTAMNT></ADDTOTAMNT>
					<!--Optional:-->
					<OPERINDIC></OPERINDIC>
					<!--Optional:-->
					<NAMEOFWAGETYPE></NAMEOFWAGETYPE>
				 </item>
			  </WAGETYPES>
		   </urn:ZFM_EMP_FSETT_AJ>
		</soapenv:Body>
	 </soapenv:Envelope>`;

    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_AJPIPO&receiverParty=&receiverService=&interface=SI_EMP_FS_AJ&interfaceNamespace=http://ajpipo.com',
        headers: {
            'Content-Type': 'application/xml',
            Authorization: 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
        },

        body: loginData
    };

    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            result2 = JSON.parse(result1);
            result2 = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_EMP_FSETT_AJ.Response'];
            res.send(result2)
        }
    });
});

//########################################################################################################################################################
app.listen(3000, () => {
        console.log('Server Running on Port:3000');
    })