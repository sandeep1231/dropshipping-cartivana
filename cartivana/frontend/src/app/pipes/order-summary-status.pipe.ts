import { Pipe, PipeTransform } from '@angular/core';
import { OrderItem } from '../models/api-models';

@Pipe({
  name: 'orderSummaryStatus',
  standalone: true
})
export class OrderSummaryStatusPipe implements PipeTransform {
  transform(items: OrderItem[]): string {
    if (!items || items.length === 0) return '';
    // Priority: cancelled > pending > confirmed > shipped > delivered
    const statusPriority = ['cancelled', 'pending', 'confirmed', 'shipped', 'delivered'];
    for (const status of statusPriority) {
      if (items.some(item => item.status === status)) {
        return status;
      }
    }
    return 'delivered';
  }
}
