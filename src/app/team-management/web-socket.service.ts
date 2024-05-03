import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  public socket$: WebSocketSubject<any>;

  constructor() {
    // Connect to the WebSocket server
    this.socket$ = webSocket("ws://localhost:3000");

    // Handle incoming messages
    this.socket$.subscribe(
      (message) => {
        // Handle incoming messages here
        // You may emit an event or update some observable to notify components
        console.log("Received message:", message);
      },
      (error) => {
        console.error("WebSocket error:", error);
      },
      () => {
        console.log("WebSocket connection closed");
      }
    );
  }
  sendMessage(message: any) {
    // Send message to the WebSocket server
    this.socket$.next(message);
  }
}
