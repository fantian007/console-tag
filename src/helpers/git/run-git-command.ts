import { execSync } from 'child_process';
import path from 'path';

export default function runGitCommand(gitWorkTree: string | undefined, command: string): string {
  const gitCommand = gitWorkTree
    ? `git --git-dir=${path.join(gitWorkTree, '.git')} --work-tree=${gitWorkTree} ${command}`
    : `git ${command}`;

  try {
    return execSync(gitCommand, { encoding: 'utf-8' }).trim();
  } catch {
    return '-';
  }
}
