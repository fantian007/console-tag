export const COMMITHASH_COMMAND = 'rev-parse HEAD';
export const VERSION_COMMAND = 'describe --always';
export const BRANCH_COMMAND = 'rev-parse --abbrev-ref HEAD';
export const LASTCOMMITDATETIME_COMMAND = 'log -1 --format=%cI';