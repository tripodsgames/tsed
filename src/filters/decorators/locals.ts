import {Type} from "../../core/interfaces";
import {ParamRegistry} from "../../mvc/registries/ParamRegistry";
import {LocalsFilter} from "../components/LocalsFilter";
/**
 * Locals return the value from [response.locals](http://expressjs.com/en/4x/api.html#res.locals) object.
 *
 * #### Example
 *
 * ```typescript
 * @Controller('/')
 * class MyCtrl {
 *    @Get('/')
 *    get(@Locals() locals: any) {
 *       console.log('Entire locals', locals);
 *    }
 *
 *    @Get('/')
 *    get(@Locals('user') user: any) {
 *       console.log('user', user);
 *    }
 * }
 * ```
 * > For more information on deserialization see [converters](docs/converters.md) page.
 *
 * @param expression The path of the property to get.
 * @decorator
 * @returns {Function}
 */
export function Locals(expression?: string | any): Function {

    return <T>(target: Type<T>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamRegistry.useFilter(LocalsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useConverter: false
            });

        }

    };
}