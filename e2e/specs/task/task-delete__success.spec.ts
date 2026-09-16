// spec: e2e/scenarios/task/task-delete__success.md
// seed: e2e/specs/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('タスク削除', () => {
  test('ユーザーがタスクの削除ボタンをクリックすると、そのタスクが一覧から削除され、件数表示・進捗表示が更新される。すべてのタスクを削除すると空状態メッセージが再表示される', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/');

    // 前提条件: タスク一覧は空の状態
    await expect(page.getByTestId('empty-state')).toBeVisible();

    // 1. タスク入力欄（data-testid="task-input"）に「牛乳を買う」と入力し、"Add" ボタンをクリックする。件数表示が "1 Tasks Today" になっていることを確認する。
    await page.getByTestId('task-input').fill('牛乳を買う');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByTestId('task-count')).toHaveText('1 Tasks Today');

    // 2. 「牛乳を買う」タスクのチェックボックスをクリックして完了状態にする。進捗表示（data-testid="progress-text"）が "100%" になることを確認する。
    await page.getByRole('checkbox', { name: 'Mark "牛乳を買う" as complete' }).click();
    await expect(page.getByTestId('progress-text')).toHaveText('100%');

    // 3. 「牛乳を買う」というタスク項目の削除ボタン（aria-label="Delete \"牛乳を買う\""）をクリックする。
    await page.getByRole('button', { name: 'Delete "牛乳を買う"' }).click();

    // 検証: タスク一覧から「牛乳を買う」の項目が削除される。
    await expect(page.getByText('牛乳を買う')).toHaveCount(0);

    // 検証: 件数表示が "0 Tasks Today" に更新される。
    await expect(page.getByTestId('task-count')).toHaveText('0 Tasks Today');

    // 検証: 進捗表示（data-testid="progress-text"）が "0%" に戻る（タスクが0件のため）。
    await expect(page.getByTestId('progress-text')).toHaveText('0%');

    // 検証: 空状態メッセージ "Nothing to focus on?"（data-testid="empty-state"）が再表示される。
    await expect(page.getByTestId('empty-state')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Nothing to focus on?' })).toBeVisible();
  });
});
