const http = require("http");
const mqtt = require('mqtt');
const fs = require("fs");
const host = '192.168.39.226';
const port = 8000;

const broker_address = `mqtt://${host}:1883`

const client = mqtt.connect(broker_address);

var t;

client.on('connect',function(){
	console.log("Publishing to $s",broker_address);
	t = 'ON';
	let message = t.toString();
	let topic = "led";
	client.publish(topic, message);
});