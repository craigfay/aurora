export interface CacheInterface {
  get: (key:string) => Promise<any>;
  set: (key: string, val: string, options?: SetOptionsInterface) => Promise<boolean>;
  keys: (glob: string) => Promise<object>;
  close: () => void;
}

export interface CacheOptionsInterface {
  address: string;
}

export interface SetOptionsInterface {
  expires?: number;
  ifNotExists?: boolean;
  ifExists?: boolean;
}
