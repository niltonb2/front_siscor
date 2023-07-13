import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'date' })
export class DatePipe implements PipeTransform {
    transform(value: string|number): string {
        let formattedValue = value + '';

        formattedValue = formattedValue
            .padStart(8, '0')
            .replace(
                /(\d{2})(\d{2})(\d{4})/,
                '$1/$2/$3'
            );

        return formattedValue;
    }
}