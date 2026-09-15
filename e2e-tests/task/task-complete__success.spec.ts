// spec: e2e/scenarios/task/task-complete__success.md
// seed: e2e-tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('タスク完了切り替え', () => {
  test('ユーザーがタスクのチェックボックスをクリックすると完了状態になり、進捗が更新される。再度クリックすると未完了状態に戻る', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/');

    // 前提条件: タスク一覧は空の状態
    await expect(page.getByTestId('empty-state')).toBeVisible();

    // 1. タスク入力欄（data-testid="task-input"）に「牛乳を買う」と入力し、"Add" ボタン（data-testid="add-task-btn"）をクリックする。追加直後、進捗表示（data-testid="progress-text"）が "0%" であることを確認する。
    await page.getByTestId('task-input').fill('牛乳を買う');
    await page.getByTestId('add-task-btn').click();
    await expect(page.getByTestId('progress-text')).toHaveText('0%');

    const taskTitle = page.getByText('牛乳を買う', { exact: true });
    const progressbar = page.getByRole('progressbar');

    // 2. 「牛乳を買う」というタスク項目内のチェックボックス（aria-label="Mark \"牛乳を買う\" as complete"）をクリックする。
    await page.getByRole('checkbox', { name: 'Mark "牛乳を買う" as complete' }).click();

    // 3. チェックボックスがチェック済み状態になり、aria-labelが `Mark "牛乳を買う" as incomplete` に変わること、タスクタイトルに取り消し線が付くこと、進捗表示が "100%" に、progressbarのaria-valuenowが100になることを確認する。
    const checkedCheckbox = page.getByRole('checkbox', { name: 'Mark "牛乳を買う" as incomplete' });
    await expect(checkedCheckbox).toBeChecked();
    await expect(taskTitle).toHaveCSS('text-decoration-line', 'line-through');
    await expect(page.getByTestId('progress-text')).toHaveText('100%');
    await expect(progressbar).toHaveAttribute('aria-valuenow', '100');

    // 4. 同じチェックボックスを再度クリックする。
    await checkedCheckbox.click();

    // 検証: チェックボックスが未チェック状態に戻り、aria-labelが `Mark "牛乳を買う" as complete` に戻る。タイトルの取り消し線表示が解除される。進捗表示が "0%" に戻る。
    const uncheckedCheckbox = page.getByRole('checkbox', { name: 'Mark "牛乳を買う" as complete' });
    await expect(uncheckedCheckbox).not.toBeChecked();
    await expect(taskTitle).not.toHaveCSS('text-decoration-line', 'line-through');
    await expect(page.getByTestId('progress-text')).toHaveText('0%');
  });
});
