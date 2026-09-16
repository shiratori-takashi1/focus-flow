# 機能

[[画面ナビゲーション]] ユーザーがタスク画面からサイドナビゲーション（またはボトムナビゲーション）の "Settings" をクリックすると、設定ページ（`/settings`）に遷移する。

## メタ情報
- id: nav__success-settings
- tags: nav, navigation, settings, happy-path
- related_pages: [/, /settings]

## 前提条件
- ルートページ（`/`）を開いている。

## 操作手順

### 1. タスク画面を開く
- ブラウザで `http://localhost:3000/` にアクセスする。
- ナビゲーション上で "Tasks" 項目が選択状態（アクティブ表示）になっていることを確認する。

### 2. [../_shared/side-nav-navigation.md](遷移先="Settings") の手順を実行する
- 遷移先として "Settings"（`data-testid="nav-settings"` もしくはモバイル表示では `data-testid="mobile-nav-settings"`）を指定する。

## 検証内容
- ブラウザのURLが `http://localhost:3000/settings` に変わる。
- ナビゲーション上で "Settings" 項目が選択状態（アクティブ表示）になる。
