

#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <Time.h>

#define WIFI_SSID "MorningBrew"
#define WIFI_PASSWORD ""

#define FIREBASE_HOST "paperless-e44e7.firebaseio.com"
#define FIREBASE_AUTH "dxE1iwlfO1eydoipzWvs8pSwLcS25UhhTr3PV4IM"

// constants
const int button_pin = 2;

// variables
int button_state;
String button_position = "Unpressed";
int pushes = 0;

void setup() {
  // put your setup code here, to run once:

  Serial.begin(115200);
  delay(10);

  // We start by connecting to a WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);

  // connect to wifi.
  WiFi.begin(WIFI_SSID , WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  //set pins
  pinMode(button_pin, INPUT);   //  initializes button pin as input
}

void loop() {
  // put your main code here, to run repeatedly:
  button_state = digitalRead(button_pin);   //  reads button state
  Serial.print("Pushes = ");
  Serial.print(pushes);
  Serial.print(" ");
  Serial.print("Button Position = ");
  Serial.print(button_position);
  Serial.print(" ");

  if (button_state == HIGH) {
    if (button_position == "Pressed") {
      pushes ++;

      Firebase.pushInt("Button_Clicks", time(nullptr));
      // handle error
      if (Firebase.failed()) {
          Serial.print("setting /number failed:");
          Serial.println(Firebase.error());  
          return;
      }
      
    }

    button_position = "Unpressed";
    Serial.print("Button State HIGH\n");
  }
  if (button_state == LOW) {
    button_position = "Pressed";
    Serial.print("Button State LOW\n");
  }
}
