var hostname = "192.168.39.226";
var port = 8883;
var clientId = "WebSocket";
clientId += new Date().getUTCMilliseconds();;
var topic = "topik";
var topicLed = "led";

let prevState = "0";
let ledState = "0";

// Document stuff
let ledButton = document.getElementById("bitch");

// Event listeners
ledButton.addEventListener("click",publishLed);

mqttClient = new Paho.MQTT.Client(hostname, port, clientId);
mqttClient.onMessageArrived = MessageArrived;
mqttClient.onConnectionLost = ConnectionLost;
Connect();

/*Initiates a connection to the MQTT broker*/
function Connect(){
    mqttClient.connect({
        onSuccess: Connected,
        onFailure: ConnectionFailed,
        keepAliveInterval: 10,
    });
}

/*Callback for successful MQTT connection */
function Connected() {
    console.log("Connected to MQTT-over-WebSocket broker.");
    mqttClient.subscribe(topic);
}
function publishLed(){
    //publish to mqtt
    if(prevState === "0"){
        ledState = "1";
        message = new Paho.MQTT.Message("1");
        message.destinationName = topicLed;
        mqttClient.send(message);
        prevState = "1";
        console.log("1");
    }
    else if (prevState === "1"){
        ledState = "0";
        message = new Paho.MQTT.Message("0");
        message.destinationName = topicLed;
        mqttClient.send(message);
        prevState = "0";
        console.log("0");
    }
}

/*Callback for failed connection*/
function ConnectionFailed(res) {
	console.log("Connect failed:" + res.errorMessage);
}

/*Callback for lost connection*/
function ConnectionLost(res) {
    if (res.errorCode !== 0) {
        console.log("Connection lost:" + res.errorMessage);
        Connect();
    }
}

/*Callback for incoming message processing */
function MessageArrived(message) {
    console.log(message.destinationName +" : " + message.payloadString);
    
    var a = parseInt(message.payloadString);
    var ht = 100-a;
    document.getElementById("top").style.height = ""+ht+"%" ;
    document.getElementById("top").innerHTML = message.payloadString+"%";
    document.getElementById("container").style.backgroundColor = "#74add6";
}