import {TestBed} from '@angular/core/testing';

import {MessageService} from './message.service';

describe('MessageService', () => {
  let service: MessageService;
  let message: string = 'Das ist ein Test';
  let message2: string = 'Erneuter Test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService]
    });
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should push a message', () => {
    service.add(message);
    expect(service.messages).toEqual([message]);
    service.add(message2);
    expect(service.messages).toEqual([message, message2]);
  });

  it('should clear messages', () => {
    service.add(message);
    expect(service.messages).toEqual([message]);
    service.clear();
    expect(service.messages).toEqual([]);
  });
});
