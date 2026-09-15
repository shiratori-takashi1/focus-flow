// spec: e2e/docs/scenario.md
// seed: e2e-tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('タスク編集', () => {
  test('ユーザーが既存タスクの編集ボタンをクリックしてタイトルを変更し保存すると、一覧上のタスクタイトルが新しい内容に更新される', async ({ page }) => {
    // 前提条件: ルートページ（`/`）を開いている。タスク一覧は空の状態。
    await page.goto('http://localhost:3000/');

    // 1. タスク入力欄（`data-testid="task-input"`）に「牛乳を買う」と入力し、"Add" ボタンをクリックする。
    await page.getByTestId('task-input').fill('牛乳を買う');
    await page.getByRole('button', { name: 'Add' }).click();

    // 2. 「牛乳を買う」というタスク項目の編集ボタン（`aria-label="Edit \"牛乳を買う\""`）をクリックする。
    await page.getByRole('button', { name: 'Edit "牛乳を買う"' }).click();

    // タスクタイトルの表示がテキスト入力欄（編集用の `data-testid="task-edit-input-{id}"`）に切り替わり、
    // 値が「牛乳を買う」で初期表示されていること、「保存」ボタン（aria-label="Save edit"）と
    // 「キャンセル」ボタン（aria-label="Cancel edit"）が表示されていることを確認する。
    const editInput = page.getByTestId(/^task-edit-input-/);
    const saveButton = page.getByRole('button', { name: 'Save edit' });
    const cancelButton = page.getByRole('button', { name: 'Cancel edit' });
    await expect(editInput).toBeVisible();
    await expect(editInput).toHaveValue('牛乳を買う');
    await expect(saveButton).toBeVisible();
    await expect(cancelButton).toBeVisible();

    // 3. 編集用テキスト入力欄の内容をすべて削除し、「パンを買う」と入力する。
    await editInput.fill('パンを買う');

    // 4. 「保存」ボタン（`aria-label="Save edit"`）をクリックする。
    await saveButton.click();

    // 検証: 編集モードが終了し、通常表示に戻る。
    await expect(editInput).not.toBeVisible();
    await expect(saveButton).not.toBeVisible();
    await expect(cancelButton).not.toBeVisible();

    // タスクタイトルの表示が「パンを買う」に更新される。
    await expect(page.getByText('パンを買う', { exact: true })).toBeVisible();

    // エラーメッセージは表示されない。
    await expect(page.getByText('タイトルを入力してください')).not.toBeVisible();

    // タスクの完了状態は変更前と変わらない（未完了のまま）。
    await expect(page.getByRole('checkbox', { name: 'Mark "パンを買う" as complete' })).not.toBeChecked();
  });
});
