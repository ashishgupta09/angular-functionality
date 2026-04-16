import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-chat',
  imports: [CommonModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements AfterViewChecked {

  messages: string[] = ['Hello 👋', 'Welcome to chat'];
  items = ['Angular', 'React', 'Vue'];

  @ViewChildren('itemEl') itemElements!: QueryList<ElementRef>;
  @ViewChild('chatContainer') chatContainer !: ElementRef;
  @ViewChild('cardTemplate') cardTemplate!: TemplateRef<any>;

  constructor(
    private vcr: ViewContainerRef
  ) { }

  addMessage() {
    this.messages.push('New Message ' + (this.messages.length + 1));
  }

  sendMessage(input: HTMLInputElement) {
    const value = input.value.trim();
    if (value) {
      this.messages.push(value);
      input.value = '';
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      const element = this.chatContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  // tenplete ref exmaple...

  loadTemplate() {
    this.vcr.clear();

    this.vcr.createEmbeddedView(this.cardTemplate, {
      name: 'Ashish'
    });
  }

  loadMultiple() {
    this.vcr.clear();

    const users = ['Ashish', 'Rahul', 'Priya'];

    users.forEach(user => {
      this.vcr.createEmbeddedView(this.cardTemplate, {
        name: user
      });
    });
  }

  //view child 

  highlightAll() {
    this.itemElements.forEach(el => {
      el.nativeElement.style.backgroundColor = '#4a90e2';
      el.nativeElement.style.color = '#fff';
    });
  }

  highlightLast() {
    const last = this.itemElements.last;
    if (last) {
      last.nativeElement.style.backgroundColor = '#ffc107';
      last.nativeElement.style.color = '#000';
    }
  }
  
}

