import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'never', ['start-case', 'pascal-case']], // Disabled subject case check
    // Add more rules here as needed
  },
  ignores: [(commit) => commit.includes('WIP')], // Ignore WIP commits
  defaultIgnores: true,
  ignoreWarnings: true, // This line makes commitlint ignore all warnings
};

export default config;
