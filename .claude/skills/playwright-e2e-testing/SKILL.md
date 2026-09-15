---
name: playwright-e2e-testing
description: Playwrightで保守性の高いE2Eテストを書く/レビューするためのガイド。ロケーター戦略、Page Object/Fixture設計、待機・アサーション戦略、テストデータ管理、アンチパターンを含む。Playwrightのテストコードを新規作成する、既存テストを修正・レビューする、flakyなテストを直す、テスト設計の相談を受けるときに使う。
when_to_use: "「Playwrightでテストを書いて」「E2Eテストを追加/直して」「このテストがflakyだから直して」「テストコードをレビューして」といったリクエストで使用する。"
---

# Playwright E2E テスト作成ガイド

Playwright の E2E テストは以下の原則に従って書く。レビュー時もこの原則に沿っているか確認する。

## 大原則

1. UI の実装詳細(CSSクラス・DOM構造)に依存しない。ユーザー視点の操作単位でテストする。
2. 待機は「時間」ではなく「状態」で行う。`waitForTimeout()` は禁止。
3. テストは互いに独立させる。順序依存・共有状態は禁止。
4. 前提データのセットアップは UI 操作でなく API/fixture で行う。UI 操作は検証対象の操作のみに絞る。
5. 1テスト1関心事。Page Object にはロケーターと操作(action)のみを置き、assertion はテスト側に書く。

## ロケーター戦略(最重要)

優先順位: `getByRole()` > `getByLabel()`/`getByPlaceholder()` > `getByText()` > `getByTestId()`。
CSS/XPath セレクタ、`nth()`、クラス名依存は原則禁止。

詳細なルールと具体例は [reference/locator-strategy.md](reference/locator-strategy.md) を参照。

## Page Object / Fixture パターン

Page Object はロケーターと操作の集約のみ。カスタム Fixture(`test.extend`)で各Page Objectをテストに注入する。
実装例・テストデータ管理・モックの書き方は [reference/page-object-and-data.md](reference/page-object-and-data.md) を参照。

## 待機・アサーション

`expect(locator)` の自動リトライを待機手段として使う。`waitForTimeout` は使わない。
ネットワーク待ちは `networkidle` より「画面上の結果要素」を待つことを優先する。

## 設定・アンチパターン

`playwright.config.ts` の推奨設定(retries, trace, storageState, タグ運用など)と、レビュー時にチェックすべきアンチパターン一覧・チェックリストは [reference/anti-patterns-and-checklist.md](reference/anti-patterns-and-checklist.md) を参照。

## 作業の進め方

- 新規テストを書くときは、まず [reference/anti-patterns-and-checklist.md](reference/anti-patterns-and-checklist.md) のチェックリストを踏まえてから実装する。
- 既存テストをレビュー/修正するときは、同ファイルのアンチパターン表と実装を照合し、該当箇所を指摘・修正する。
- ロケーターや Page Object の書き方に迷ったら該当の reference ファイルを開いて具体例に合わせる。
