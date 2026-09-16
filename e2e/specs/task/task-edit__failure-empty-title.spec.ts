import { test, expect } from '@playwright/test';

test.describe('タスク編集', () => {
  test('ユーザーが既存タスクの編集中にタイトルを空にして保存しようとすると、保存は行われず「タイトルを入力してください」というエラーメッセージが編集フォーム内に表示され、編集モードが継続する', async ({
    page,
  }) => {
    // 前提条件: ルートページ（/）を開いている。タスク一覧は空の状態。
    await page.goto('http://localhost:3000/');
    await expect(page.getByRole('heading', { name: 'Nothing to focus on?' })).toBeVisible();

    // 1. タスク入力欄（data-testid="task-input"）に「牛乳を買う」と入力し、"Add" ボタンをクリックする。
    await page.getByTestId('task-input').fill('牛乳を買う');
    await page.getByRole('button', { name: 'Add' }).click();

    // 2. 「牛乳を買う」というタスク項目の編集ボタン（aria-label="Edit "牛乳を買う""）をクリックする。
    const editButton = page.getByRole('button', { name: 'Edit "牛乳を買う"' });
    await editButton.click();

    // 3. 編集用テキスト入力欄（data-testid="task-edit-input-{id}"）の内容をすべて削除し、空文字にする。
    const editInput = page.getByTestId(/^task-edit-input-/);
    await editInput.fill('');

    // 4. 「保存」ボタン（aria-label="Save edit"）をクリックする。
    await page.getByRole('button', { name: 'Save edit' }).click();

    // 検証: 編集用フォーム内にエラーメッセージ「タイトルを入力してください」（role="alert"）が表示される。
    await expect(
      page.getByRole('alert').filter({ hasText: 'タイトルを入力してください' }),
    ).toBeVisible();

    // 検証: タスクは編集モードのままであり、通常表示（保存済みタイトル表示）には戻らない。
    await expect(editInput).toBeVisible();
    await expect(page.getByTestId(/^task-title-/)).toHaveCount(0);

    // 検証: 一覧上のタスクタイトルは変更されていない（キャンセルボタンをクリックすると元のタイトル「牛乳を買う」が表示される）。
    await page.getByRole('button', { name: 'Cancel edit' }).click();
    await expect(page.getByTestId(/^task-title-/)).toHaveText('牛乳を買う');
  });
});
