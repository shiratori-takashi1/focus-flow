// spec: e2e/docs/scenario.md
// seed: e2e/specs/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('画面ナビゲーション', () => {
  test('ユーザーがサイドナビゲーション（またはボトムナビゲーション）の "Settings" をクリックすると、設定ページに遷移する', async ({
    page,
  }) => {
    // 1. ブラウザで http://localhost:3000/ にアクセスする。ナビゲーション上で "Tasks" 項目が選択状態（アクティブ表示）になっていることを確認する。
    await page.goto('http://localhost:3000/');

    const mainNav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(mainNav).toBeVisible();

    const tasksNavLink = page.getByTestId('nav-tasks');
    await expect(tasksNavLink).toHaveClass(/bg-primary-container/);

    // 2. サイドナビ（aria-label="Main navigation"）内の "Settings" テキストを持つリンク（data-testid="nav-settings"）をクリックする。
    const settingsNavLink = page.getByTestId('nav-settings');
    await settingsNavLink.click();

    // ブラウザのURLが http://localhost:3000/settings に変わる。
    await expect(page).toHaveURL('http://localhost:3000/settings');

    // ナビゲーション上で "Settings" 項目が選択状態（アイコンが塗りつぶし表示、テキストが強調表示など）になる。
    await expect(settingsNavLink).toHaveClass(/bg-primary-container/);
    await expect(tasksNavLink).not.toHaveClass(/bg-primary-container/);
  });
});
