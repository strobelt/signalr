import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as signalR from '@aspnet/signalr';
import { tap } from 'rxjs/operators';
import { ChatMessage } from './chat-message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  connection!: signalR.HubConnection;

  userName = 'Default User';
  userNameControl = new FormControl(this.userName);

  message = '';
  chatForm = new FormGroup({
    message: new FormControl(),
  });

  chatConnected = false;
  messages: ChatMessage[] = [];

  ngOnInit() {
    this.userNameControl.valueChanges
      .pipe(tap((userName) => (this.userName = userName)))
      .subscribe();

    this.chatForm.controls.message.valueChanges
      .pipe(tap((message) => (this.message = message)))
      .subscribe();

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chathub')
      .build();

    this.connection.on('ReceiveMessage', (sender, message) => {
      this.messages.push({
        sender,
        content: message,
      });
    });

    this.connection.start().then(() => (this.chatConnected = true));
  }

  sendMessage() {
    this.connection
      .invoke('SendMessage', this.userName, this.message)
      .catch(console.error);
  }
}
