export * from './auth';
export * from './scopes';
export * from './search/public_profile';
export * from './social';
export * from './feed';
// limitation of this structure is that all action names become global,
// so they have to be unique in all files

export const FEED_LIMIT = 10;
export const SCOPE_LIMIT = 8;
