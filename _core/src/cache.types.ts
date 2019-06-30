export interface CacheInterface {
  get: (key:string) => Promise<any>;
  set: (key: string, value: any) => Promise<boolean>;
  keys: () => Promise<object>;
  close: () => void;
}

export interface CacheOptionsInterface {
  address: string;
}
