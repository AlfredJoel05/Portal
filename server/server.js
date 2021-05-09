const express = require('express');
const parser = require('xml-js');
const JsonFind = require('json-find');
const request = require('request');
const bodyParser = require('body-parser');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var loginCred = ['0000000006'];

function verifyToken(req, res, next){
	if(!req.headers.authorization){
		return res.status(401).send('Unauthorized Request')
	}
	let token = req.headers.authorization.split(' ')[1]
	if (token === 'null'){
		return res.status(401).send('Unauthorized Request not null')
	}
	let payload = jwt.verify(token, 'SeCrEtKeY')
	if(!payload) { 
		return res.status(401).send('Unauthorized Request no payload')
	}
	req.username = payload.subject
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

	loginCred.push(username)
	console.log('Login Set Username : '+ loginCred)

	hashedPassword = md5(password)
	hashedPassword = hashedPassword.toUpperCase();

	const loginData =
		`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	<urn:ZSD_FM_LOGIN_AJ>
		<!--You may enter the following 2 items in any order-->
		<I_PASSWORD>`+hashedPassword+`</I_PASSWORD>
		<I_USERNAME>`+username+`</I_USERNAME>
	</urn:ZSD_FM_LOGIN_AJ>
	</soapenv:Body>
	</soapenv:Envelope>`;

	var options = {
		url:
			'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_CUSTOMER_SENDER_AJ&receiverParty=&receiverService=&interface=SI_LOGIN_SERVICE_AJ&interfaceNamespace=http://ajpipo.com',
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
			const resultVal = result.checkKey('_text')
			console.log(resultVal);
			if(resultVal !== "NULL")
			{
				let payload = { subject: username }
				let token = jwt.sign(payload, 'SeCrEtKeY')
				let result = token+':::::'+resultVal
				res.send(JSON.stringify(result))
			}
			else{
				console.log('Error',resultVal);
				res.send(JSON.stringify(resultVal))
			}
			
		}
	});
});


// app.get('/viewprofile' ,verifyToken, function(res) {
app.get('/viewprofile', function(req , res) {

	username = loginCred[loginCred.length-1]
	console.log('View Profile: '+username)
	const loginData =
	`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
		<urn:ZSD_CUSTOMER_DETAILS_AJ>
			<I_CUSTOMER_ID>`+username+`</I_CUSTOMER_ID>
		</urn:ZSD_CUSTOMER_DETAILS_AJ>
	</soapenv:Body>
	</soapenv:Envelope>`;

	var options = {
		url:
			'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BS_CUSTDET_AJ&receiverParty=&receiverService=&interface=SI_CUSTDET_AJ&interfaceNamespace=http://ajpipo.com',
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
})
	

// app.post('/editprofile',verifyToken,(res,req)=>
app.post('/editprofile', (req,res)=>
{
	username = loginCred[loginCred.length-1]
	// username = '0000007006'

	const loginData = `
	<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
   <soapenv:Header/>
   <soapenv:Body>
      <urn:ZSD_UPDATE_PROFILE_AJ>
         <!--You may enter the following 9 items in any order-->
         <I_CITY>`+req.body.c_city+`</I_CITY>
         <I_COUNTRY>`+req.body.c_country+`</I_COUNTRY>
         <I_CUSTOMER_ID>`+username+`</I_CUSTOMER_ID>
         <I_MOBILE>`+req.body.c_mobile+`</I_MOBILE>
         <I_NAME1>`+req.body.cf_name+`</I_NAME1>
         <I_NAME2>`+req.body.cl_name+`</I_NAME2>
         <I_PINCODE>`+req.body.c_pin+`</I_PINCODE>
         <I_STATE>`+req.body.c_state+`</I_STATE>
         <I_STREET>`+req.body.c_street+`</I_STREET>
      </urn:ZSD_UPDATE_PROFILE_AJ>
   </soapenv:Body>
</soapenv:Envelope>`;

var options = {
	url:
		'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_UPDATE_PROFILE_AJ&receiverParty=&receiverService=&interface=SI_PROFILE_UPDATE_AJ&interfaceNamespace=http://ajpipo.com',
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
			console.log('Edit Profile: Success' + result2)
			res.send(JSON.stringify("Success"))
		}
		else{
			res.send(JSON.stringify('Error'))
		}
	});
})


app.get('/salesorder', function(req , res) {

	username = loginCred[loginCred.length-1]
	console.log('SalesOrder: '+username)


	const loginData =
	`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZSD_GET_SALESORDER_AJ>
		  <!--You may enter the following 9 items in any order-->
		  <I_CUSTOMER_ID>`+username+`</I_CUSTOMER_ID>
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
		  <I_SALESORG>`+'SA01'+`</I_SALESORG>
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
})

app.get('/memo', function(req , res) {

	username = loginCred[loginCred.length-1]
	console.log('Memo: '+username)


	const loginData =
	`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZFI_CREDIT_DEBIT_MEMO_AJ>
		  <!--You may enter the following 4 items in any order-->
		  <I_COMPANY_CODE>SA01</I_COMPANY_CODE>
		  <I_CUSTOMER_ID>`+username+`</I_CUSTOMER_ID>
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

	request.post(options,function (error, response, body) {        
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, {compact: true, spaces: 4});
            result1=JSON.parse(result1);
            res.send(result1);
        }
	});
})

app.get('/delivery', function(req , res) {

	username = loginCred[loginCred.length-1]
	console.log('Delivery: '+username)


	const loginData =
	`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZSD_DELIVERY_DETAILS>
		  <!--You may enter the following 2 items in any order-->
		  <I_CUSTOMER_ID>`+username+`</I_CUSTOMER_ID>
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

	request.post(options,function (error, response, body) {        
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, {compact: true, spaces: 4});
            result1=JSON.parse(result1);
            res.send(result1);
        }
	});
})

app.get('/payage', function(req , res) {

	username = loginCred[loginCred.length-1]
	console.log('Payage: '+username)


	const loginData =
	`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
	<soapenv:Header/>
	<soapenv:Body>
	   <urn:ZFI_PAYMENT_AGING_AJ>
		  <!--You may enter the following 4 items in any order-->
		  <I_COMPNAY_CODE>SA01</I_COMPNAY_CODE>
		  <I_CUSTOMER_ID>`+username+`</I_CUSTOMER_ID>
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

	request.post(options,function (error, response, body) {        
			if (!error && response.statusCode == 200) {
				var result1 = parser.xml2json(body, {compact: true, spaces: 4});
				result1=JSON.parse(result1);
				res.send(result1);
			}
		});
})


app.get('/inquiry', function(req , res) {

	username = loginCred[loginCred.length-1]
	console.log('inquiry: '+username)


	const loginData =
	`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
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

	request.post(options,function (error, response, body) {        
        if (!error && response.statusCode == 200) {
            var result1 = parser.xml2json(body, {compact: true, spaces: 4});
            result1=JSON.parse(result1);
            res.send(result1);
        }
	});
})

app.post('/masterdataupload', (req, res) => {
    city = req.body.city;
    console.log(city)
    country = req.body.country;
    console.log(country)
    currency = req.body.currency;
    console.log(currency)
    distchannel = req.body.distchannel;
    console.log(distchannel)
    division = req.body.division;
    console.log(division)
    first_name = req.body.first_name;
    console.log(first_name)
    language = req.body.language;
    console.log(language)
    last_name = req.body.last_name;
    console.log(last_name)
    postal_code = req.body.postal_code;
    console.log(postal_code)
    ref_customer = req.body.ref_customer;
    console.log(ref_customer)
    sales_org = req.body.sales_org;
    console.log(sales_org)
    street = req.body.street;
    console.log(street)
    telephone = req.body.telephone;
    console.log(telephone)

	const postData = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
	<urn:ZFM_MASTERDATA_AJ>
          <!--You may enter the following 13 items in any order-->
          <CITY>` + city + `</CITY>
          <COUNTRY>` + country + `</COUNTRY>
          <CURRENCY>` + currency + `</CURRENCY>
          <DISTCHANNEL>` + distchannel + `</DISTCHANNEL>
          <DIVISION>` + division + `</DIVISION>
          <FIRST_NAME>` + first_name + `</FIRST_NAME>
          <LANGUAGE>` + language + `</LANGUAGE>
          <LAST_NAME>` + last_name + `</LAST_NAME>
          <POSTAL_CODE>` + postal_code + `</POSTAL_CODE>
          <REF_CUSTOMER>` + ref_customer + `</REF_CUSTOMER>
          <SALES_ORG>` + sales_org + `</SALES_ORG>
          <STREET>` + street + ` </STREET>
          <TELEPHONE>` + telephone + `</TELEPHONE>
		  </urn:ZFM_MASTERDATA_AJ>
    </soapenv:Body>
 </soapenv:Envelope>`;
    var options = {
        url: 'http://dxktpipo.kaarcloud.com:50000/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_MD_AJ&receiverParty=&receiverService=&interface=SI_MASTER_DATA_AJ&interfaceNamespace=http://ajpipo.com',

        headers: {
            'Content-Type': 'application/xml',
            'Authorization': 'Basic UE9VU0VSOlRlY2hAMjAyMQ=='
		},
        body: postData
    }
    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            var result1 = parser.xml2json(body, { compact: true, spaces: 4 });
            console.log(result1);
            result2 = JSON.parse(result1);
            console.log(result2);
            // alert(result2);
            var resp = result2['SOAP:Envelope']['SOAP:Body']['ns0:ZFM_CP_MASTERDATA_UPLOAD.Response']['KUNNR'];
            // var resp = result2['SOAP:Envelope'];
            //    var resp = result1['SOAP:Envelope']['SOAP:Body']['ns1:MT_LOGINRESPONSE']['RESULT'];
            console.log(" customer id created =" + resp['_text']);
            // res.send(resp._text);
            res.send(resp);
        }
    })
});

app.listen(3000, () => {
	console.log('Server Running on Port:3000');
});
