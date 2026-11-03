import fs from 'fs';
import path from 'path';
import { test as base } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { STRONG_PASSWORD, uniqueEmail } from './test-data';

export interface RegisteredUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface Fixtures {
  registeredUser: RegisteredUser;
  demoChaosInjection: void;
}

const SELECTION_FILE = path.join(__dirname, '..', '.demo-chaos.json');

let chaosSelection: Set<string> | undefined;
function selectedForDemoFailure(title: string): boolean {
  if (!chaosSelection) {
    try {
      const raw = JSON.parse(fs.readFileSync(SELECTION_FILE, 'utf-8'));
      chaosSelection = new Set<string>(raw.selected);
    } catch {
      chaosSelection = new Set();
    }
  }
  return chaosSelection.has(title);
}

export const test = base.extend<Fixtures>({
  registeredUser: async ({ page }, use) => {
    const user: RegisteredUser = {
      firstName: 'PW',
      lastName: 'Test',
      email: uniqueEmail(),
      password: STRONG_PASSWORD,
    };

    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(user);

    await use(user);
  },

  // Runs the real test steps first, then fails tests chosen by global-setup's
  // demo-chaos selection. Throwing here (in fixture teardown, after `use()`)
  // happens before the built-in `page`/`context` fixtures tear down, so the
  // screenshot/video/trace capture-on-failure still sees the real page state.
  demoChaosInjection: [
    async ({ page }, use, testInfo) => {
      await use();
      if (selectedForDemoFailure(testInfo.title)) {
        throw new Error(
          `Injected demo failure: "${testInfo.title}" was randomly selected by demo-chaos for a failing-test showcase run.`
        );
      }
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
