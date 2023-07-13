import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cnpj' })
export class CnpjPipe implements PipeTransform {
    transform(value: string|number): string {
        let formattedValue = value + '';

        formattedValue = formattedValue
            .padStart(14, '0')
            .replace(
                /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
                '$1.$2.$3/$4-$5'
            );

        return formattedValue;
    }
}