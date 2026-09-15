// spec: e2e/docs/scenario.md
// seed: e2e-tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('画面ナビゲーション', () => {
  test('ユーザーがサイドナビゲーション（またはボトムナビゲーション）の "Profile" をクリックすると、プロフィールページに遷移する', async ({
    page,
  }) => {
    // 1. ブラウザで `http://localhost:3000/` にアクセスする。ナビゲーション上で "Tasks" 項目が選択状態（アクティブ表示）になっていることを確認する。
    await page.goto('http://localhost:3000/');

    const tasksNavLink = page.getByTestId('nav-tasks');
    await expect(tasksNavLink).toBeVisible();
    await expect(tasksNavLink).toHaveClass(/bg-primary-container/);

    // 2. デスクトップ幅の場合、サイドナビ（aria-label="Main navigation"）内の "Profile" テキストを持つリンク（data-testid="nav-profile"）をクリックする。
    const profileNavLink = page.getByTestId('nav-profile');
    await profileNavLink.click();

    // 検証: ブラウザのURLが `http://localhost:3000/profile` に変わる。
    await expect(page).toHaveURL('http://localhost:3000/profile');
    await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible();

    // 検証: ナビゲーション上で "Profile" 項目が選択状態（アイコンが塗りつぶし表示、テキストが強調表示など）になる。
    await expect(profileNavLink).toHaveClass(/bg-primary-container/);
    await expect(tasksNavLink).not.toHaveClass(/bg-primary-container/);
  });
});
