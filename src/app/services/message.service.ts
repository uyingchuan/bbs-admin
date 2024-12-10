import { Injectable } from '@angular/core';
import { MessageService as PrimeMessageService } from 'primeng/api';
import { v1 as uuid } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private message: PrimeMessageService) {}

  success(content: string): string {
    const id = uuid();
    this.message.add({ severity: 'success', summary: 'Success', key: 'global', detail: content, id, life: 3000 });
    return id;
  }

  error(content: string): string {
    const id = uuid();
    this.message.add({ severity: 'error', summary: 'Error', key: 'global', detail: content, id, life: 5000 });
    return id;
  }
}
