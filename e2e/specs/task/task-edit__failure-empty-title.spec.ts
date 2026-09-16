// spec: e2e/scenarios/task/task-edit__failure-empty-title.md
// seed: e2e/specs/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Task management - edit task', () => {
  test('編集中にタイトルを空にして保存するとエラーになり編集モードが継続する', async ({ page }) => {
    // 1. `http://localhost:3000/` にアクセスし、タスク入力欄（`data-testid="task-input"`）に「牛乳を買う」と入力して "Add" ボタンをクリックする。
    await page.goto('http://localhost:3000/');
    await page.getByTestId('task-input').fill('牛乳を買う');
    await page.getByTestId('add-task-btn').click();

    // 2. 「牛乳を買う」というタスク項目の編集ボタン（aria-label="Edit \"牛乳を買う\""）をクリックする。
    const editButton = page.getByRole('button', { name: 'Edit "牛乳を買う"' });
    await editButton.click();

    // 3. 編集用テキスト入力欄の内容をすべて削除し、空文字にする。
    const editInput = page.locator('[data-testid^="task-edit-input-"]');
    const saveButton = page.getByRole('button', { name: 'Save edit' });
    const cancelButton = page.getByRole('button', { name: 'Cancel edit' });
    await editInput.fill('');

    // 4. 「保存」ボタン（aria-label="Save edit"）をクリックする。
    await saveButton.click();

    // 編集用フォーム内にエラーメッセージ「タイトルを入力してください」（role="alert"）が表示される。
    await expect(page.getByRole('alert').filter({ hasText: 'タイトルを入力してください' })).toBeVisible();

    // タスクは編集モードのままであり、通常表示（保存済みタイトル表示）には戻らない。
    await expect(saveButton).toBeVisible();
    await expect(cancelButton).toBeVisible();
    await expect(editButton).toHaveCount(0);

    // その後「キャンセル」ボタン（aria-label="Cancel edit"）をクリックすると、元のタイトル「牛乳を買う」が表示されることで、保存が成立していないことを確認する。
    await cancelButton.click();
    await expect(page.getByRole('button', { name: 'Edit "牛乳を買う"' })).toBeVisible();
    await expect(editInput).not.toBeVisible();
  });
});
