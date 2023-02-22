#include <Arduino.h>
#include <PubSubClient.h>
#include <WiFi.h>

#define BAUD 115200

const int buttonPin = 4;
const int ledPin = 22;
int input = 0;
int i = 0;
char tempVal[ledPin];

WiFiClient client;
PubSubClient mqttClient(client);

const char* ssid = "bahaha";
const char* password = "1sampai8";
char mqttBuffer[8];

char* mqttServer = "192.168.39.226";
int mqttPort = 1883;

// Local MQTT Broker
const char* mqtt_client_name = "esp32Deedat";
const char* mqtt_pub_topic = "topik";
const char* mqtt_sub_topic = "topik";
const char* mqttLedTopic = "led";

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received from: ");
  Serial.println(topic);
  String message;
  for (int i = 0; i < length; i++) {
      message = message + (char) payload[i];  // convert *byte to string
  }
  Serial.println(message);
  if (strcmp(topic, "led") == 0){
    int tempNum = message.toInt();
    Serial.println(tempNum);
    if(tempNum == 1){
      digitalWrite(ledPin,HIGH);
      Serial.println(tempNum);
    }else if (tempNum == 0){
      digitalWrite(ledPin,LOW);
      Serial.println(tempNum);
    }
  }
}

void setup() {
  Serial.begin(BAUD); // ltf style
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while( WiFi.status() != WL_CONNECTED ) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("WiFi connected to: ");
  Serial.println(ssid);
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  delay(2000);
  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(callback);
}

void loop() {
  // put your main code here, to run repeatedly:
  if(!mqttClient.connected()){
    while(!mqttClient.connected()){
      if(mqttClient.connect(mqtt_client_name)){
        Serial.println("MQTT Connected!");
        mqttClient.subscribe(mqtt_sub_topic);
        mqttClient.subscribe(mqttLedTopic);
      } else{
        Serial.print(".");
      }
    }
  }
  input = digitalRead(buttonPin);
  if (input == HIGH){
    i++;
    dtostrf(i,1,2,tempVal);
    mqttClient.publish(mqtt_sub_topic, tempVal);
    Serial.println("Message published");
  } 
  if (input == LOW){
    if (i>0){
      i--;
      dtostrf(i,1,2,tempVal);
      mqttClient.publish(mqtt_sub_topic, tempVal);
      Serial.println("Message published");
    }
  }
  mqttClient.loop();
  delay(500);
}