import { Component, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chathub')
      .build();

    connection.on('ReceiveMessage', (user, message) => {
      console.log(user, ':', message);
    });

    connection
      .start()
      .then(() =>
        connection.invoke('SendMessage', 'user', 'message').catch(console.error)
      );
  }
}
