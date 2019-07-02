export interface CacheInterface {
  get: (key:string) => Promise<string>;
  set: (key: string, val: string, options?: SetOptionsInterface) => Promise<boolean>;
  keys: () => Promise<string[]>;
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
