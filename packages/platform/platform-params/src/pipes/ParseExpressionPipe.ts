import {getValue} from "@tsed/core";
import {Injectable} from "@tsed/di";
import {JsonParameterStore, PipeMethods} from "@tsed/schema";
import {ParamTypes} from "../domain/ParamTypes";
import type {ArgScope} from "../builder/PlatformParams";

@Injectable({
  priority: -1000
})
export class ParseExpressionPipe implements PipeMethods {
  transform(scope: ArgScope, param: JsonParameterStore) {
    const {paramType, type} = param;

    const value = getValue(scope, this.getKey(param));

    if ([ParamTypes.QUERY, ParamTypes.PATH].includes(paramType as ParamTypes) && value === "" && type !== String) {
      return undefined;
    }

    return value;
  }

  protected getKey(param: JsonParameterStore) {
    let {expression, paramType, dataPath} = param;
    paramType = paramType || param.parameter.get("in").toUpperCase();

    if (expression && paramType === ParamTypes.HEADER) {
      expression = String(expression).toLowerCase();
    }

    return [dataPath, expression].filter(Boolean).join(".");
  }
}
