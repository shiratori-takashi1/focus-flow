// spec: e2e/scenarios/task/task-delete__success.md
// seed: e2e/specs/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task management - delete task', () => {
  test('タスクを削除すると一覧から消え件数・進捗表示が更新される', async ({ page }) => {
    // 前提条件: ルートページ（`/`）を開いている。タスク一覧は空の状態。
    await page.goto('http://localhost:3000/');

    // 1. `http://localhost:3000/` にアクセスし、タスク入力欄（`data-testid="task-input"`）に「牛乳を買う」と入力して "Add" ボタンをクリックする。件数表示が "1 Tasks Today" になることを確認する。
    await page.getByTestId('task-input').fill('牛乳を買う');
    await page.getByTestId('add-task-btn').click();
    await expect(page.getByText('1 Tasks Today')).toBeVisible();

    // 2. 「牛乳を買う」タスクのチェックボックスをクリックして完了状態にする。進捗表示（`data-testid="progress-text"`）が "100%" になることを確認する。
    await page.getByRole('checkbox', { name: 'Mark "牛乳を買う" as complete' }).click();
    await expect(page.getByTestId('progress-text')).toHaveText('100%');

    // 3. 「牛乳を買う」というタスク項目の削除ボタン（`aria-label="Delete \"牛乳を買う\""`）をクリックする。
    await page.getByRole('button', { name: 'Delete "牛乳を買う"' }).click();

    // 検証内容
    await expect(page.getByText('牛乳を買う')).not.toBeVisible();
    await expect(page.getByText('0 Tasks Today')).toBeVisible();
    await expect(page.getByTestId('progress-text')).toHaveText('0%');
    await expect(page.getByTestId('empty-state')).toContainText('Nothing to focus on?');
  });
});
