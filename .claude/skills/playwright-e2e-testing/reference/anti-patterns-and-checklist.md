# 設定・アンチパターン・チェックリスト

## `playwright.config.ts` の推奨設定

- `retries`: CI では 1〜2 に設定(ローカルは0)。retryは「flakyの隠蔽」ではなく「本当に不安定な外部要因」対策。
- `trace: 'on-first-retry'`, `video: 'retain-on-failure'` を有効化し、失敗時の調査コストを下げる。
- `fullyParallel: true` を前提にテストを設計する(独立性が守られていないと事故る)。
- 環境ごとに `baseURL` をプロジェクト分割する(`projects: [{ name: 'staging', use: { baseURL: ... } }]`)。
- タグ(`@smoke`, `@regression`)を使い、`--grep` でCIパイプラインごとに実行範囲を分ける。

```ts
test('主要フローが動作する @smoke', async ({ page }) => { /* ... */ });
```

## アサーション

- `expect(locator)` は自動リトライするので、これを待機手段として使う。
- `waitForTimeout(ms)` は flaky テストの温床。使用禁止(デバッグ時の一時利用のみ許容)。
- ネットワーク完了を待つ場合は `waitForResponse` を明示的に使うか、画面上の結果要素を待つ方を優先し、`networkidle` は避ける。
- 1テスト内で複数の非致命的な検証をしたい場合は `expect.soft()` を使い、後続の検証も実行させる。

```ts
// NG
await page.click('#submit');
await page.waitForTimeout(2000);
await expect(page.locator('.result')).toBeVisible();

// OK: 自動リトライに任せる
await page.getByRole('button', { name: '送信' }).click();
await expect(page.getByText('送信が完了しました')).toBeVisible();
```

## アンチパターン一覧(レビュー時にチェック)

| アンチパターン | 問題 | 対策 |
|---|---|---|
| `waitForTimeout()` | Flaky・遅い | 状態ベースの `expect` に置き換える |
| CSSクラス/構造依存ロケーター | 実装変更で即壊れる | `getByRole`/`getByTestId` に変更 |
| テスト間でユーザー/データを共有 | 並列実行で衝突、順序依存 | テストごとに動的データ生成 |
| Page Object内でassert | テストの意図が読めない | assertはテスト側に書く |
| UIで毎回ログイン | 遅い、認証UIの変更で全テスト死ぬ | `storageState`/API直叩き |
| 1テストに大量のシナリオを詰め込む | 失敗時の原因特定が困難 | 関心事ごとに分割 |
| セレクタの `nth(2)` 依存 | DOM順序変更で壊れる | `filter({ hasText })` 等で意味的に絞る |
| ネットワーク完了を `networkidle` で待つ | 遅い・不安定(偽陽性) | 画面上の結果要素を待つ |

## 新しいテストを書くときのチェックリスト

- [ ] ロケーターは `getByRole`/`getByLabel`/`getByTestId` を使っているか
- [ ] `waitForTimeout` を使っていないか
- [ ] 前提データはAPI/fixtureで作り、UI操作は検証対象のみか
- [ ] 他のテストと状態(ユーザー・DB行など)を共有していないか
- [ ] テスト名は「操作→期待結果」が明確か
- [ ] Page Objectにassertionを書いていないか
- [ ] 並列実行しても壊れない設計か
- [ ] 失敗時にtrace/videoで原因調査できる設定になっているか

## 参考

- Playwright 公式 Best Practices: https://playwright.dev/docs/best-practices
- Playwright Locators ガイド: https://playwright.dev/docs/locators
- Playwright Test Fixtures: https://playwright.dev/docs/test-fixtures
