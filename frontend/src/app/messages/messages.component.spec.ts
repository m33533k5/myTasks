import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MessagesComponent} from './messages.component';
import {By} from "@angular/platform-browser";
import {MessageService} from "../message.service";
import {TaskService} from "../task.service";

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessagesComponent],
      providers: [TaskService, MessageService]
    })
      .compileComponents();
    fixture = TestBed.createComponent(MessagesComponent)
    messageService = TestBed.inject(MessageService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate message', () => {
    //given
    spyOn(messageService, 'add').and.callThrough();

    //when
    messageService.add('Testnachricht1');
    messageService.add('Testnachricht2');
    fixture.detectChanges();
    const messageText = fixture.debugElement.queryAll(By.css('[data-testid="messageText"]'))

    //then
    expect(messageService.messages.length).toBe(2);
    expect(messageService.add).toHaveBeenCalledWith('Testnachricht1');
    expect(messageText[0].nativeElement.textContent).toContain('Testnachricht1');
    expect(messageText[1].nativeElement.textContent).toContain('Testnachricht2');
  });

  it('should delete messages', () => {
    //given
    spyOn(messageService, 'clear').and.callThrough();
    messageService.add('1');
    messageService.add('2');
    messageService.add('3');

    //when
    expect(messageService.messages.length).toBe(3);
    expect(messageService.messages).toEqual(['1', '2', '3']);
    fixture.detectChanges();

    //then
    let clearButton = fixture.debugElement.query(By.css('[data-testid="clearButton"]'));
    expect(clearButton).toBeTruthy();
    clearButton.triggerEventHandler('click', null);
    expect(messageService.clear).toHaveBeenCalled();
    expect(messageService.messages.length).toBe(0);
    fixture.detectChanges();
    clearButton = fixture.debugElement.query(By.css('[data-testid="clearButton"]'));
    expect(clearButton).toBeNull();
  });

});
