# 共通手順: サイドナビゲーション / ボトムナビゲーションでのページ遷移

## 概要
- デスクトップ表示のサイドナビゲーション（`aria-label="Main navigation"`）またはモバイル表示のボトムナビゲーション（`aria-label="Mobile navigation"`）を使って、Tasks（`/`）、Profile（`/profile`）、Settings（`/settings`）の各ページへ遷移するための共通操作。
- デスクトップ幅ではサイドナビ（`data-testid="nav-tasks"` / `data-testid="nav-profile"` / `data-testid="nav-settings"`）が表示され、モバイル幅ではボトムナビ（`data-testid="mobile-nav-tasks"` / `data-testid="mobile-nav-user"` / `data-testid="mobile-nav-settings"`）が表示される。
- 現在表示中のページに対応するナビ項目は選択状態（アイコンが塗りつぶし表示、テキストが強調表示）になる。

## 引数（パラメーター）
- `遷移先`: 遷移したいページ（`Tasks` / `Profile` / `Settings`）

## 処理手順

### 1. 遷移先のナビ項目を特定する
- デスクトップ幅の場合、サイドナビ内の該当リンク（例: `遷移先` が `Settings` なら "Settings" というテキストを持つリンク、`data-testid="nav-settings"`）を特定する。
- モバイル幅の場合、ボトムナビ内の該当リンク（例: `data-testid="mobile-nav-settings"`）を特定する。

### 2. ナビ項目をクリックする
- 特定したリンクをクリックする。

### 3. 遷移結果を確認する
- ブラウザのURLが遷移先パス（`/`, `/profile`, `/settings` のいずれか）に変わっていることを確認する。
- クリックしたナビ項目が選択状態のスタイル（アクティブ表示）になっていることを確認する。
