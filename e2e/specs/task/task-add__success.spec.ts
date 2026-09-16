// spec: e2e/scenarios/task/task-add__success.md
// seed: e2e/specs/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task management - add task', () => {
  test('タスクを追加すると一覧に追加され件数・進捗表示が更新される', async ({ page }) => {
    // 1. `http://localhost:3000/` にアクセスする。ヘッダー "Tasks"、件数表示 "0 Tasks Today"、進捗表示 "Daily Progress: 0%"、空状態メッセージ "Nothing to focus on?" が表示されていることを確認する。
    await page.goto('http://localhost:3000/');
    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
    await expect(page.getByTestId('task-count')).toHaveText('0 Tasks Today');
    await expect(page.getByText('Daily Progress')).toBeVisible();
    await expect(page.getByTestId('progress-text')).toHaveText('0%');
    await expect(page.getByTestId('empty-state')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Nothing to focus on?' })).toBeVisible();

    // 2. プレースホルダー "Add a new task..." のテキスト入力欄（`data-testid="task-input"`）に「牛乳を買う」と入力する。
    const taskInput = page.getByTestId('task-input');
    await taskInput.fill('牛乳を買う');

    // 3. "Add" ボタン（`data-testid="add-task-btn"`）をクリックする。
    await page.getByTestId('add-task-btn').click();

    // 検証内容
    await expect(page.getByText('牛乳を買う')).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: 'Mark "牛乳を買う" as complete' })
    ).not.toBeChecked();
    await expect(page.getByTestId('task-count')).toHaveText('1 Tasks Today');
    await expect(page.getByTestId('empty-state')).not.toBeVisible();
    await expect(taskInput).toBeEmpty();
    await expect(page.getByTestId('add-task-error')).not.toBeVisible();
    await expect(page.getByTestId('progress-text')).toHaveText('0%');
  });
});
