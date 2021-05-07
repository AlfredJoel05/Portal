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

const loginDetails= []

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

	loginDetails.push(username)

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

	username = loginDetails[0]
	username = '0000007006'

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
	// username = loginDetails[0]
	username = '0000007006'
	
	console.log(req.body.cf_name)

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
			console.log('Edit Profile: Success')
			res.send('Success')
		}
		else{
			res.send('Error')
		}
	});
})


app.listen(3000, () => {
	console.log('Server Running on Port:3000');
});
