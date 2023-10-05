import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, OnDestroy {
  @Output() closeChatEmitter = new EventEmitter();

  constructor(public chatService: ChatService) { }
  
  ngOnDestroy(): void {
    this.chatService.stopChatConnection();
  }
  
  ngOnInit(): void {
    this.chatService.createChatConnection();
  }

  backToHome() {
    this.closeChatEmitter.emit();
  }

  sendMessage(content: string) {
    this.chatService.sendMessage(content);
  }

}
