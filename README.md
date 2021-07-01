Portal Assignment | Kaar Technologies

#About
This Webapp was developed as an intern-project under Kaar Technologies. This Project comprises of Customer Portal, Vendor Portal and Employee Portal.

#Workflow
This is an Web app which  uses Angular for the front-end,
Pipo (SAP Middleware to communicate with the SAP) as Middleware and
SAP as the back-end to fetch the data.

This responsive UI was completely designed in Angular for a appealing user-exprience. The user can send various requests from the front-end which angular posts to the node-server which in turn handles the requests and responses. The requests are sent as JSON requests and are converted to XML(becasue the XML Data would be converted to RFC Messages) using SOAP.

This SOAP UI converts the JSON to XML Data using the rendered SAP WSDL link through which the data can be read for CRUD Opreations. The RFC Messages aids as the channel for communication between SAP and PIPO Middleware.

The SAP handles the RFC(Remote Function Call) Modules to fetch the data based on the requests and the whole process loops through.

#Technologies
Angular(HTML, CSS, Typescripts), NodeJS, NodeJS Libraries(which is not uploaded in this Github projects because of the file size), ExpresJS(layered on top of NodeJS), SOAP UI, SAP ESB, SAP ICB, SAP Service Registry, SAP SE.



