/**
 * @license
 * Copyright (c) 2022 Daniel Imms <http://www.growingwiththeweb.com>
 * Released under MIT license. See LICENSE in the project root for details.
 */

import { assertChunkDataLengthEquals, assertChunkFollows, assertChunkPrecedes, assertChunkSinglular } from '../assert.js';
import { ChunkPartByteLength, IDecodePngOptions, IPartialDecodedPng, IPngChunk, IPngHeaderDetails, IPngMetadataHistogram, KnownChunkTypes } from '../types.js';

/**
 * `hIST` Image histogram
 *
 * Spec: https://www.w3.org/TR/PNG/#11hIST
 */
export function parseChunk(header: IPngHeaderDetails, dataView: DataView, chunk: IPngChunk, decodedPng: IPartialDecodedPng, options: IDecodePngOptions | undefined): IPngMetadataHistogram {
  assertChunkSinglular(chunk, decodedPng, options?.strictMode);
  assertChunkFollows(chunk, KnownChunkTypes.PLTE, decodedPng);
  assertChunkPrecedes(chunk, KnownChunkTypes.IDAT, decodedPng, options?.strictMode);
  assertChunkDataLengthEquals(chunk, decodedPng.palette!.size * 2, decodedPng.warnings, options?.strictMode);

  const offset = chunk.offset + ChunkPartByteLength.Length + ChunkPartByteLength.Type;
  const frequency: number[] = [];
  for (let i = 0; i < decodedPng.palette!.size * 2; i += 2) {
    frequency.push(dataView.getUint16(offset + i));
  }

  return {
    type: 'hIST',
    frequency
  };
}
