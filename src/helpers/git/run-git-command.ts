import { execFileSync } from 'child_process';

export default function runGitCommand(gitWorkTree: string | undefined, args: string): string {
  const gitArgs = gitWorkTree
    ? ['--git-dir', `${gitWorkTree}/.git`, '--work-tree', gitWorkTree, ...args.split(' ')]
    : args.split(' ');

  try {
    return execFileSync('git', gitArgs, { encoding: 'utf-8', maxBuffer: 1024 * 1024 }).trim();
  } catch {
    return '-';
  }
}
