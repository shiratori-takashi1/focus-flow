// spec: e2e/scenarios/nav/nav__success-profile.md
// seed: e2e/specs/seed.spec.ts

import { test, expect } from '@playwright/test';
import { navigateVia } from '../_shared/side-nav-navigation';

test.describe('Navigation', () => {
  test('サイドナビゲーションでProfileをクリックするとプロフィールページに遷移する', async ({ page }) => {
    // 1. `http://localhost:3000/` にアクセスする。ナビゲーション上で "Tasks" 項目が選択状態（アクティブ表示）になっていることを確認する。
    await page.goto('http://localhost:3000/');
    await expect(page.getByTestId('nav-tasks')).toHaveClass(/bg-primary-container/);

    // 2. サイドナビゲーション内の "Profile" というテキストを持つリンク（data-testid="nav-profile"）をクリックする。
    await navigateVia(page, 'Profile');
  });
});
