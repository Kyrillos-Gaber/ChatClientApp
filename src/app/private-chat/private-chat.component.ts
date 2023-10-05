import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-private-chat',
  templateUrl: './private-chat.component.html',
  styleUrls: ['./private-chat.component.css']
})
export class PrivateChatComponent implements  OnDestroy {
  @Input() toUser: string = '';

  constructor(public activeModal: NgbActiveModal, public chatService: ChatService) { }

  ngOnDestroy(): void {
    this.chatService.closePrivateChatMessage(this.toUser);
  }

  sendMessage(content: string){
    this.chatService.sendPrivateMessage(this.toUser, content);
  }

}
