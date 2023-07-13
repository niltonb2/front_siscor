import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'moeda' })
export class MoedaPipe implements PipeTransform {
    transform(value: string|number): string {
        let formattedValue = value + '';

        formattedValue = formattedValue
            .padStart(11, '0')
            .replace(
                /(\d{3})(\d{3})(\d{3})(\d{2})/,
                '$1.$2.$3,$4'
            );

        return formattedValue;
    }
}