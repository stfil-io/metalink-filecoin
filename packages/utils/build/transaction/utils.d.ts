import { Buffer } from 'buffer';
/**
 * Serialize a string number to serialized BigInt per filecoin specification
 * @param value - string number to serialize
 * @param base - number base
 * @returns serialized bigint as buffer
 */
export declare const serializeBigNum: (value: string, base?: number) => Buffer;
/**
 * Deserialize a buffer to string number per filecoin specification
 * @param value - buffer number to deserialize
 * @param base - number base
 * @returns deserialized bigint as string
 */
export declare const deserializeBigNum: (value: Buffer, base?: number) => string;
