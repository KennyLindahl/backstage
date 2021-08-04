/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import type { S3 as S3Types } from 'aws-sdk';
import { EventEmitter } from 'events';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

export { Credentials } from 'aws-sdk';

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

export class S3 {
  headObject({ Bucket }: { Bucket: string }) {
    return {
      promise: async () => {
        if (Bucket === 'errorBucket') {
          throw new Error('File does not exist');
        }
      },
    };
  }

  getObject({ Key, Bucket }: { Key: string; Bucket: string }) {
    const filePath = path.join(rootDir, Key);
    return {
      promise: async () => {},
      createReadStream: () => {
        const emitter = new EventEmitter();
        process.nextTick(() => {
          if (Bucket === 'errorBucket') {
            emitter.emit(
              'error',
              new Error(`The file ${filePath} does not exist !`),
            );
          } else {
            emitter.emit('data', Buffer.from(fs.readFileSync(filePath)));
            emitter.emit('end');
          }
        });
        return emitter;
      },
    };
  }

  headBucket({ Bucket }) {
    return {
      promise: async () => {
        if (Bucket === 'errorBucket') {
          throw new Error('Bucket does not exist');
        }
        return {};
      },
    };
  }

  upload() {
    return {
      promise: async () => {},
    };
  }
}

export default {
  S3,
};
