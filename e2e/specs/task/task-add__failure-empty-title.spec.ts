// spec: e2e/scenarios/task/task-add__failure-empty-title.md
// seed: e2e/specs/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task management - add task', () => {
  test('タイトル未入力でタスク追加するとエラーが表示され追加されない', async ({ page }) => {
    // 1. `http://localhost:3000/` にアクセスする。
    await page.goto('http://localhost:3000/');

    // 2. タスク入力欄（`data-testid="task-input"`）に何も入力せず、"Add" ボタン（`data-testid="add-task-btn"`）をクリックする。
    const taskInput = page.getByTestId('task-input');
    const addButton = page.getByTestId('add-task-btn');
    const errorMessage = page.getByTestId('add-task-error');
    const taskCount = page.getByTestId('task-count');
    await addButton.click();

    // 3. エラーメッセージ（`data-testid="add-task-error"`、role="alert"）に「タイトルを入力してください」と表示されることを確認する。件数表示 "0 Tasks Today" が変わらないことを確認する。
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('タイトルを入力してください');
    await expect(taskCount).toHaveText('0 Tasks Today');

    // 4. タスク入力欄に半角スペースのみ（"   "）を入力し、再度 "Add" ボタンをクリックする。
    await taskInput.fill('   ');
    await addButton.click();

    // 検証内容
    // 手順3・4のいずれの場合も、タスク一覧に新しいタスクは追加されない（件数表示は "0 Tasks Today" のまま）。
    await expect(taskCount).toHaveText('0 Tasks Today');

    // エラーメッセージに「タイトルを入力してください」と表示される。
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('タイトルを入力してください');

    // 空状態メッセージ "Nothing to focus on?" が表示され続ける。
    await expect(page.getByRole('heading', { name: 'Nothing to focus on?' })).toBeVisible();
  });
});
