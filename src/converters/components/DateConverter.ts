/**
 * @module common/converters
 */ /** */

import {Converter} from "../decorators/converter";
import {IConverter} from "../interfaces/index";

/**
 * @private
 * @converter
 */
@Converter(Date)
export class DateConverter implements IConverter {

    deserialize(data: string): Date {
        return new Date(data);
    }

    serialize(object: Date): any {
        return object.toISOString();
    }
}