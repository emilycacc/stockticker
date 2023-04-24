const { resolve6 } = require('dns');
const express = require('express');
const app = express();
app.use(express.json());       
app.use(express.urlencoded({extended: true}));
var http = require('http');
var url = require('url');

async function dbQuery(txt, radio, res) {
	var MongoClient = require('mongodb').MongoClient;
	var mongourl = "mongodb+srv://ecacc:c@cluster0.ab5aj3p.mongodb.net/?retryWrites=true&w=majority";
   	const client = new MongoClient(mongourl);

	string = "";

    	try {
        	await client.connect();

        	db = client.db("stockticker");
        	collection = db.collection("companies");

	  	if(radio == "company") {
			result = await collection.find({company: txt}, {projection: {_id: 0 }});
	  	} else {
			result = await collection.find({ticker: txt}, {projection: {_id: 0}});
	  	}
	  	await result.forEach(function(item) {
			string += item.company + ", " + item.ticker + ", " + item.price + "<br />";
		});
        res.send(string);
	}
	catch(err) {
		console.log("Database error: " + err);
	}
	finally {
		await client.close();
	}
}

app.get("/", (req, res) => {
    var qobj = url.parse(req.url, true).query;
 	var txt = qobj.inputText;
	var radio = qobj.radio;
    dbQuery(txt, radio, res);
});

app.listen(8080);
