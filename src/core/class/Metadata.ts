/**
 * @module common/core
 */
/** */
import "reflect-metadata";
import {getClass} from "../utils";
/**
 * Metadata key
 * @private
 * @type {string}
 */
const DESIGN_PARAM_TYPES = "design:paramtypes";
/**
 * Metadata key
 * @private
 * @type {string}
 */
const DESIGN_TYPE = "design:type";
/**
 * Metadata key
 * @private
 * @type {string}
 */
const DESIGN_RETURN_TYPE = "design:returntype";
/**
 * Properties collections
 * @private
 * @type {string}
 */
const PROPERTIES: Map<string | symbol, any[]> = new Map<string | symbol, any[]>();
/**
 * @stable
 */
export class Metadata {
    /**
     * Define a unique metadata entry on the target.
     * @param key A key used to store and retrieve metadata.
     * @param value A value that contains attached metadata.
     * @param target The target object on which to define metadata.
     * @param propertyKey The property key for the target.
     * @example
     *
     * ```typescript
     * class Example {
     *     // property declarations are not part of ES6, though they are valid in TypeScript:
     *     // static staticProperty;
     *     // property;
     *
     *     static staticMethod(p) { }
     *     method(p) { }
     * }
     *
     * // constructor
     * Reflect.defineMetadata("custom:annotation", options, Example);
     *
     * // property (on constructor)
     * Reflect.defineMetadata("custom:annotation", Number, Example, "staticProperty");
     *
     * // property (on prototype)
     * Reflect.defineMetadata("custom:annotation", Number, Example.prototype, "property");
     *
     * // method (on constructor)
     * Reflect.defineMetadata("custom:annotation", Number, Example, "staticMethod");
     *
     * // method (on prototype)
     * Reflect.defineMetadata("custom:annotation", Number, Example.prototype, "method");
     *
     * // decorator factory as metadata-producing annotation.
     * function MyAnnotation(options): PropertyDecorator {
     *     return (target, key) => Reflect.defineMetadata("custom:annotation", options, target, key);
     * }
     * ```
     *
     */
    static set(key: string, value: any, target: any, propertyKey?: string | symbol): void {

        const targets = PROPERTIES.has(key) ? PROPERTIES.get(key) : [];
        const classConstructor = getClass(target);

        if (targets.indexOf(classConstructor) === -1) {
            targets.push(classConstructor);
            PROPERTIES.set(key, targets);
        }

        Reflect.defineMetadata(key, value, getClass(target), propertyKey);
    }

    /**
     * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
     * @param key A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     * ```typescript
     * class Example {
     *     // property declarations are not part of ES6, though they are valid in TypeScript:
     *     // static staticProperty;
     *     // property;
     *
     *     static staticMethod(p) { }
     *     method(p) { }
     * }
     *
     * // constructor
     * result = Metadata.get("custom:annotation", Example);
     *
     * // property (on constructor)
     * result = Metadata.get("custom:annotation", Example, "staticProperty");
     *
     * // property (on prototype)
     * result = Metadata.get("custom:annotation", Example.prototype, "property");
     *
     * // method (on constructor)
     * result = Metadata.get("custom:annotation", Example, "staticMethod");
     *
     * // method (on prototype)
     * result = Metadata.get("custom:annotation", Example.prototype, "method");
     * ```
     *
     */
    static get = (key: string, target: any, propertyKey?: string | symbol): any =>
        Reflect.getMetadata(key, getClass(target), propertyKey);

    /**
     * Gets the metadata value for the provided metadata DESIGN_TYPE on the target object or its prototype chain.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     * ```typescript
     * class Example {
     *     // property declarations are not part of ES6, though they are valid in TypeScript:
     *     // static staticProperty;
     *     // property;
     *
     *     static staticMethod(p) { }
     *     method(p) { }
     * }
     *
     * // on contructor
     * result = Metadata.getType(Example);
     *
     * // property (on constructor)
     * result = Metadata.getType(Example, "staticProperty");
     *
     * // method (on constructor)
     * result = Metadata.getType(Example, "staticMethod");
     * ```
     *
     */
    static getType = (target: any, propertyKey?: string | symbol): any =>
        Reflect.getMetadata(DESIGN_TYPE, target, propertyKey);

    /**
     * Gets the metadata value for the provided metadata DESIGN_RETURN_TYPE on the target object or its prototype chain.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     * ```typescript
     * class Example {
     *     // property declarations are not part of ES6, though they are valid in TypeScript:
     *     // static staticProperty;
     *     // property;
     *
     *     static staticMethod(p) { }
     *     method(p) { }
     * }
     *
     * // on contructor
     * result = Metadata.getReturnType(Example);
     *
     * // property (on constructor)
     * result = Metadata.getReturnType(Example, "staticProperty");
     *
     * // method (on constructor)
     * result = Metadata.getReturnType(Example, "staticMethod");
     * ```
     *
     */
    static getReturnType = (target: any, propertyKey?: string | symbol): any =>
        Reflect.getMetadata(DESIGN_RETURN_TYPE, target, propertyKey);

    /**
     * Gets the metadata value for the provided metadata DESIGN_PARAM_TYPES on the target object or its prototype chain.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey The property key for the target.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     * ```typescript
     * class Example {
     *     // property declarations are not part of ES6, though they are valid in TypeScript:
     *     // static staticProperty;
     *     // property;
     *
     *     static staticMethod(p) { }
     *     method(p) { }
     * }
     *
     * // on contructor
     * result = Metadata.getParamTypes(Example);
     *
     * // property (on constructor)
     * result = Metadata.getParamTypes(Example, "staticProperty");
     *
     * // method (on constructor)
     * result = Metadata.getParamTypes(Example, "staticMethod");
     * ```
     *
     */
    static getParamTypes(target: any, propertyKey?: string | symbol): any[] {
        return Reflect.getMetadata(DESIGN_PARAM_TYPES, target, propertyKey) || [];
    }

    /**
     * Set the metadata value for the provided metadata DESIGN_PARAM_TYPES on the target object or its prototype chain.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey The property key for the target.
     * @param value A value that contains attached metadata.
     * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
     * @example
     *
     * ```typescript
     * class Example {
     *     // property declarations are not part of ES6, though they are valid in TypeScript:
     *     // static staticProperty;
     *     // property;
     *
     *     static staticMethod(p) { }
     *     method(p) { }
     * }
     *
     * // on contructor
     * result = Metadata.setParamTypes(Example, undefined, [Object]);
     *
     * // property (on constructor)
     * result = Metadata.setParamTypes(Example, "staticProperty", [Object]);
     *
     * // property (on prototype)
     * result = Metadata.setParamTypes(Example.prototype, "property", [Object]);
     *
     * // method (on constructor)
     * result = Metadata.setParamTypes(Example, "staticMethod", [Object]);
     *
     * // method (on prototype)
     * result = Metadata.setParamTypes(Example.prototype, "method", [Object]);
     * ```
     *
     */
    static setParamTypes(target: any, propertyKey: string | symbol, value: any): void {
        return this.set(DESIGN_PARAM_TYPES, value, target.prototype, propertyKey);
    }

    /**
     * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
     * @param key A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey The property key for the target.
     * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
     * @example
     *
     * ```typescript
     * class Example {
     *     // property declarations are not part of ES6, though they are valid in TypeScript:
     *     // static staticProperty;
     *     // property;
     *
     *     static staticMethod(p) { }
     *     method(p) { }
     * }
     *
     * // constructor
     * result = Metadata.has("custom:annotation", Example);
     *
     * // property (on constructor)
     * result = Metadata.has("custom:annotation", Example, "staticProperty");
     *
     * // property (on prototype)
     * result = Metadata.has("custom:annotation", Example.prototype, "property");
     *
     * // method (on constructor)
     * result = Metadata.has("custom:annotation", Example, "staticMethod");
     *
     * // method (on prototype)
     * result = Metadata.has("custom:annotation", Example.prototype, "method");
     * ```
     *
     */
    static has = (key: string, target: any, propertyKey?: string | symbol): boolean =>
        Reflect.hasMetadata(key, getClass(target), propertyKey);
    /**
     * Deletes the metadata entry from the target object with the provided key.
     * @param key A key used to store and retrieve metadata.
     * @param target The target object on which the metadata is defined.
     * @param propertyKey The property key for the target.
     * @returns `true` if the metadata entry was found and deleted; otherwise, false.
     * @example
     *
     * ```typescript
     * class Example {
     *     // property declarations are not part of ES6, though they are valid in TypeScript:
     *     // static staticProperty;
     *     // property;
     *
     *     static staticMethod(p) { }
     *     method(p) { }
     * }
     *
     * // constructor
     * result = Metadata.delete("custom:annotation", Example);
     *
     * // property (on constructor)
     * result = Metadata.delete("custom:annotation", Example, "staticProperty");
     *
     * // property (on prototype)
     * result = Metadata.delete("custom:annotation", Example.prototype, "property");
     *
     * // method (on constructor)
     * result = Metadata.delete("custom:annotation", Example, "staticMethod");
     *
     * // method (on prototype)
     * result = Metadata.delete("custom:annotation", Example.prototype, "method");
     * ```
     *
     */
    static delete = (key: string, target: any, propertyKey?: string | symbol): boolean =>
        Reflect.deleteMetadata(key, getClass(target), propertyKey);
    /**
     * Get all metadata for a metadataKey.
     * @param metadataKey
     */
    static getTargetsFromPropertyKey = (metadataKey: string | symbol): any[] =>
        PROPERTIES.has(metadataKey) ? PROPERTIES.get(metadataKey) : [];

}