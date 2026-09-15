// spec: e2e/scenarios/nav/nav__success-settings.md
// seed: e2e/specs/seed.spec.ts

import { test, expect } from '@playwright/test';
import { navigateVia } from '../_shared/side-nav-navigation';

test.describe('Navigation', () => {
  test('サイドナビゲーションでSettingsをクリックすると設定ページに遷移する', async ({ page }) => {
    // 1. `http://localhost:3000/` にアクセスする。ナビゲーション上で "Tasks" 項目が選択状態（アクティブ表示）になっていることを確認する。
    await page.goto('http://localhost:3000/');
    const tasksLink = page.getByTestId('nav-tasks');
    await expect(tasksLink).toHaveClass(/bg-primary-container/);

    // 2. サイドナビゲーション内の "Settings" というテキストを持つリンク（`data-testid="nav-settings"`）をクリックする。
    await navigateVia(page, 'Settings');
  });
});
