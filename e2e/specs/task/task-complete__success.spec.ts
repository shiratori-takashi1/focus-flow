// spec: e2e/scenarios/task/task-complete__success.md
// seed: e2e/specs/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task management - complete toggle', () => {
  test('タスクのチェックボックスで完了/未完了を切り替えると進捗表示が更新される', async ({ page }) => {
    // 1. `http://localhost:3000/` にアクセスし、タスク入力欄に「牛乳を買う」と入力して "Add" ボタンをクリックする。追加直後、進捗表示が "0%" であることを確認する。
    await page.goto('http://localhost:3000/');
    await page.getByTestId('task-input').fill('牛乳を買う');
    await page.getByTestId('add-task-btn').click();
    await expect(page.getByTestId('progress-text')).toHaveText('0%');

    // 2. 「牛乳を買う」というタスク項目内のチェックボックスをクリックする。
    const checkbox = page.getByRole('checkbox', { name: 'Mark "牛乳を買う" as complete' });
    await checkbox.click();

    // 3. チェックボックスがチェック済み状態になり、aria-label が変わること、タスクタイトルに取り消し線が付くこと、進捗表示が "100%" になり、進捗バーの aria-valuenow が 100 になることを確認する。
    const toggledCheckbox = page.getByRole('checkbox', { name: 'Mark "牛乳を買う" as incomplete' });
    await expect(toggledCheckbox).toBeChecked();
    await expect(page.getByText('牛乳を買う')).toHaveCSS('text-decoration-line', 'line-through');
    await expect(page.getByTestId('progress-text')).toHaveText('100%');
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

    // 4. 同じチェックボックスを再度クリックする。
    await toggledCheckbox.click();

    // 検証: チェックボックスが未チェック状態に戻り、aria-label が戻る。タイトルの取り消し線が解除される。進捗表示が "0%" に戻る。
    const revertedCheckbox = page.getByRole('checkbox', { name: 'Mark "牛乳を買う" as complete' });
    await expect(revertedCheckbox).not.toBeChecked();
    await expect(page.getByText('牛乳を買う')).not.toHaveCSS('text-decoration-line', 'line-through');
    await expect(page.getByTestId('progress-text')).toHaveText('0%');
  });
});
