// spec: e2e/scenarios/task/task-edit__success.md
// seed: e2e-tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task management - edit task', () => {
  test('タスクを編集してタイトルを保存すると一覧の表示が更新される', async ({ page }) => {
    // 1. `http://localhost:3000/` にアクセスし、タスク入力欄（`data-testid="task-input"`）に「牛乳を買う」と入力して "Add" ボタンをクリックする。
    await page.goto('http://localhost:3000/');
    await page.getByTestId('task-input').fill('牛乳を買う');
    await page.getByTestId('add-task-btn').click();

    // 2. 「牛乳を買う」というタスク項目の編集ボタン（aria-label="Edit \"牛乳を買う\""）をクリックする。タスクタイトルの表示が編集用テキスト入力欄に切り替わり、値が「牛乳を買う」で初期表示されていること、「保存」ボタン（aria-label="Save edit"）と「キャンセル」ボタン（aria-label="Cancel edit"）が表示されていることを確認する。
    await page.getByRole('button', { name: 'Edit "牛乳を買う"' }).click();
    const editInput = page.locator('[data-testid^="task-edit-input-"]');
    const saveButton = page.getByRole('button', { name: 'Save edit' });
    const cancelButton = page.getByRole('button', { name: 'Cancel edit' });
    await expect(editInput).toHaveValue('牛乳を買う');
    await expect(saveButton).toBeVisible();
    await expect(cancelButton).toBeVisible();

    // 3. 編集用テキスト入力欄の内容をすべて削除し、「パンを買う」と入力する。
    await editInput.fill('パンを買う');

    // 4. 「保存」ボタン（aria-label="Save edit"）をクリックする。
    await saveButton.click();

    // 検証内容
    // 編集モードが終了し、通常表示に戻る。
    await expect(editInput).not.toBeVisible();
    await expect(saveButton).not.toBeVisible();
    await expect(cancelButton).not.toBeVisible();

    // タスクタイトルの表示が「パンを買う」に更新される。
    await expect(page.getByRole('button', { name: 'Edit "パンを買う"' })).toBeVisible();

    // エラーメッセージは表示されない。
    await expect(page.getByText('タイトルを入力してください')).not.toBeVisible();

    // タスクの完了状態は変更前と変わらない（未完了のまま）。
    await expect(page.getByRole('checkbox', { name: 'Mark "パンを買う" as complete' })).not.toBeChecked();
  });
});
