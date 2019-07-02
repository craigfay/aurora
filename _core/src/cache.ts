import { createClient } from 'redis';
import { promisify } from 'util';
import { enforceArgumentType } from './util';
import {
  CacheInterface,
  CacheOptionsInterface,
  SetOptionsInterface,
} from './cache.types';

export class Cache implements CacheInterface {
  options: CacheOptionsInterface;
  private client: any;
  private _asyncGet: any;
  private _asyncSet: any;
  private _asyncKeys: any;
  private _asyncDel: any;
  private _asyncFlushdb: any;
  constructor(options: CacheOptionsInterface) {
    this.options = options;
    this.client = createClient(options.address);

    // Promisify client operations
    this._asyncGet = promisify(this.client.get).bind(this.client);
    this._asyncSet = promisify(this.client.set).bind(this.client);
    this._asyncKeys = promisify(this.client.keys).bind(this.client);
    this._asyncDel = promisify(this.client.del).bind(this.client);
    this._asyncFlushdb = promisify(this.client.flushdb).bind(this.client);
  }

  async get(key:string): Promise<string | null> {
    enforceArgumentType('key', key, 'string');
    return await this._asyncGet(key);
  }

  async set(key:string, val: string, options:SetOptionsInterface={}): Promise<boolean> {
    enforceArgumentType('key', key, 'string');
    enforceArgumentType('val', val, 'string');
    enforceArgumentType('options', options, 'object');

    let optionsList = [];

    const { expires } = options;
    if (Number.isInteger(expires) && expires > 0) {
      optionsList.push('EX', expires);
    }

    const { ifNotExists } = options;
    if (true == ifNotExists) {
      optionsList.push('NX');
    }

    const { ifExists } = options;
    if (true == ifExists) {
      optionsList.push('XX');
    }

    return 'OK' == await this._asyncSet(key, val, ...optionsList);
  }

  async keys(): Promise<string[]> {
    return await this._asyncKeys('*');
  }

  async delete(key:string): Promise<boolean> {
    enforceArgumentType('key', key, 'string');
    return 'OK' == await this._asyncDel(key);
  }

  async deleteAll(): Promise<boolean>  {
    return 'OK' == await this._asyncFlushdb();
  }

  close(): void {
    this.client.quit();
  }
}
