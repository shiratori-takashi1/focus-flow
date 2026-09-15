// spec: e2e/docs/scenario.md
// seed: e2e-tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('タスク追加', () => {
  test('ユーザーがタイトルを入力せずに（または空白文字のみで）タスク追加を試みると、タスクは追加されず、「タイトルを入力してください」というエラーメッセージが表示される', async ({
    page,
  }) => {
    // 1. ブラウザで `http://localhost:3000/` にアクセスする。
    await page.goto('http://localhost:3000/');

    const taskInput = page.getByTestId('task-input');
    const addTaskButton = page.getByTestId('add-task-btn');
    const addTaskError = page.getByTestId('add-task-error');
    const taskCount = page.getByText('0 Tasks Today');
    const emptyStateHeading = page.getByRole('heading', { name: 'Nothing to focus on?' });

    // 2. タスク入力欄（data-testid="task-input"）に何も入力せず、"Add" ボタン（data-testid="add-task-btn"）をクリックする。
    await addTaskButton.click();

    // 3. エラーメッセージ（data-testid="add-task-error"、role="alert"）に「タイトルを入力してください」と表示されること、件数表示 "0 Tasks Today" が変わらないことを確認する。
    await expect(addTaskError).toBeVisible();
    await expect(addTaskError).toHaveRole('alert');
    await expect(addTaskError).toHaveText('タイトルを入力してください');
    await expect(taskCount).toBeVisible();
    await expect(emptyStateHeading).toBeVisible();

    // 4. タスク入力欄に半角スペースのみ（例: "   "）を入力し、"Add" ボタンをクリックする。
    await taskInput.fill('   ');
    await addTaskButton.click();

    // 検証: タスクは追加されず、エラーメッセージが表示され、空状態メッセージが表示され続ける。
    await expect(addTaskError).toBeVisible();
    await expect(addTaskError).toHaveRole('alert');
    await expect(addTaskError).toHaveText('タイトルを入力してください');
    await expect(taskCount).toBeVisible();
    await expect(emptyStateHeading).toBeVisible();
  });
});
