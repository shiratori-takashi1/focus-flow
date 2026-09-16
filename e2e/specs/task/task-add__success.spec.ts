// spec: e2e/docs/scenario.md
// seed: e2e/specs/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('タスク追加', () => {
  test('ユーザーがタスク追加フォームにタイトルを入力して送信すると、新しいタスクが一覧の先頭に追加され、タスク件数と進捗表示が更新される', async ({ page }) => {
    // 1. ブラウザで http://localhost:3000/ にアクセスする。ヘッダー "Tasks" と、"0 Tasks Today" という件数表示、"Daily Progress: 0%" という進捗表示、空状態メッセージ "Nothing to focus on?" が表示されていることを確認する。
    await page.goto('http://localhost:3000/');

    const taskCount = page.getByTestId('task-count');
    const progressText = page.getByTestId('progress-text');
    const emptyStateHeading = page.getByRole('heading', { name: 'Nothing to focus on?' });

    await expect(page.getByRole('heading', { name: 'Tasks' })).toBeVisible();
    await expect(taskCount).toHaveText('0 Tasks Today');
    await expect(page.getByText('Daily Progress')).toBeVisible();
    await expect(progressText).toHaveText('0%');
    await expect(emptyStateHeading).toBeVisible();

    // 2. プレースホルダー "Add a new task..." のテキスト入力欄（data-testid="task-input"）に「牛乳を買う」と入力する。
    const taskInput = page.getByTestId('task-input');
    await taskInput.fill('牛乳を買う');

    // 3. "Add" ボタン（data-testid="add-task-btn"）をクリックする。
    await page.getByTestId('add-task-btn').click();

    // 検証内容
    await expect(page.getByText('牛乳を買う')).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Mark "牛乳を買う" as complete' })).not.toBeChecked();
    await expect(taskCount).toHaveText('1 Tasks Today');
    await expect(emptyStateHeading).not.toBeVisible();
    await expect(taskInput).toHaveValue('');
    await expect(page.getByTestId('add-task-error')).not.toBeVisible();
    await expect(progressText).toHaveText('0%');
  });
});
