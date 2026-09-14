# 機能

[[画面ナビゲーション]] ユーザーがタスク画面からサイドナビゲーション（またはボトムナビゲーション）の "Profile" をクリックすると、プロフィールページ（`/profile`）に遷移する。

## メタ情報
- id: nav__success-profile
- tags: nav, navigation, profile, happy-path
- related_pages: [/, /profile]

## 前提条件
- ルートページ（`/`）を開いている。

## 操作手順

### 1. タスク画面を開く
- ブラウザで `http://localhost:3000/` にアクセスする。
- ナビゲーション上で "Tasks" 項目が選択状態（アクティブ表示）になっていることを確認する。

### 2. [../_shared/side-nav-navigation.md](遷移先="Profile") の手順を実行する
- 遷移先として "Profile"（`data-testid="nav-profile"` もしくはモバイル表示では `data-testid="mobile-nav-user"`）を指定する。

## 検証内容
- ブラウザのURLが `http://localhost:3000/profile` に変わる。
- ナビゲーション上で "Profile" 項目が選択状態（アクティブ表示）になる。
