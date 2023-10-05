import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { User } from '../models/user';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  myName: string = '';
  private chatConnection?: HubConnection;
  onlineUsers: string[] = [];
  messages: Message[] = [];

  constructor(private httpClient: HttpClient) { }
  
  registerUser(user: User){
    return this.httpClient.post(`${environment.apiUrl}api/chat/register`, user, {responseType: 'text'});
  }

  createChatConnection(){
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}hubs/chat`)
      .withAutomaticReconnect()
      .build();

    this.chatConnection.start().catch(error => {
      console.log(error);
    });

    this.chatConnection.on('UserConnected', () => {
      console.log("Server called here");
      this.addUserConnectionId();
    });

    this.chatConnection.on('OnlineUsers', (onlineUsers) => {
      console.log("Server called here");
      this.onlineUsers = [...onlineUsers];
    });

    this.chatConnection.on('NewMessage', (newMessage: Message) =>{
      this.messages = [...this.messages, newMessage];
    })
  }

  stopChatConnection() {
    this.chatConnection?.stop().catch(error => console.log(error));
  }

  async addUserConnectionId() {
    return this.chatConnection?.invoke('AddUserConnectionId', this.myName)
      .catch(error => error.log(error));
  }

  async sendMessage(content: string) {
    const message : Message = {
      from: this.myName,
      content
    };
    return this.chatConnection?.invoke("ReceiveMessage", message)
      .catch(error => console.log(error));
  }

}
