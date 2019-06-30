import { createClient } from 'redis';
import { promisify } from 'util';
import { CacheInterface, CacheOptionsInterface } from './cache.types'

export class Cache implements CacheInterface {
  options: CacheOptionsInterface;
  private client: any;
  private _asyncGet: any;
  private _asyncSet: any;
  private _asyncKeys: any;

  constructor(options: CacheOptionsInterface) {
    this.options = options;
    this.client = createClient(options.address);

    // Promisify client operations
    this._asyncGet = promisify(this.client.get).bind(this.client);
    this._asyncSet = promisify(this.client.set).bind(this.client);
    this._asyncKeys = promisify(this.client.keys).bind(this.client);
  }

  async get(key:string): Promise<any> {
    return await this._asyncGet(key);
  }

  async set(key:string, val: any): Promise<boolean> {
    return Boolean(await this._asyncSet(key));
  }

  async keys(): Promise<object> {
    return await this._asyncKeys();
  }
}
