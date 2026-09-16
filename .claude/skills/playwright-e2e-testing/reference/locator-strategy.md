# ロケーター戦略

## 優先順位(高い順)

1. `getByRole()` — アクセシビリティツリーに基づく。最も推奨。
2. `getByLabel()` / `getByPlaceholder()` — フォーム要素
3. `getByText()` — 一意な静的テキスト
4. `getByTestId()` — 上記で表現できない場合の最終手段(`data-testid` 属性)
5. CSS/XPath セレクタ、`nth()`、クラス名依存 — 原則禁止

## 理由

CSS クラスやDOM構造は実装変更で頻繁に壊れる。`getByRole` はアクセシビリティ改善にも寄与し、UIリファクタでも生き残る。

## data-testid のルール(使う場合)

- `data-testid="checkout-submit-button"` のように役割が分かる名前にする。
- コンポーネント名 + 要素名の組み合わせ(`product-card-price` など)。
- 動的な値(index, id)を testid に埋め込まない。代わりに `.filter({ hasText })` や親スコープの絞り込みを使う。

```ts
// NG
page.locator('.btn.btn-primary.submit-btn')

// OK
page.getByRole('button', { name: '注文を確定する' })

// OK(役割で表現できない場合のみ)
page.getByTestId('checkout-submit-button')
```

## スコープを絞る

グローバルに `page.locator()` するのではなく、親要素で絞ってから探す。

```ts
const row = page.getByRole('row', { name: '田中太郎' });
await row.getByRole('button', { name: '削除' }).click();
```

## 動的な一覧から要素を選ぶ場合

`nth()` はDOM順序の変更で壊れるため避け、意味のある条件で絞る。

```ts
// NG
page.getByRole('listitem').nth(2)

// OK
page.getByRole('listitem').filter({ hasText: '在庫あり' })
```
