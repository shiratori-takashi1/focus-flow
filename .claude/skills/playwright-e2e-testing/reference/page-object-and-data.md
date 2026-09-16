# Page Object / Fixture パターンとテストデータ管理

## Page Object のルール

- ロケーターとユーザー操作(action)のみを持つ。
- assertion は書かない(テスト側に書く)。Page Object 内 assertion はテストの意図を隠してしまう。
- 画面遷移がある場合は、戻り値で次の Page Object を返す。

```ts
// pages/login-page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('メールアドレス');
    this.passwordInput = page.getByLabel('パスワード');
    this.submitButton = page.getByRole('button', { name: 'ログイン' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

## カスタム Fixture で注入(推奨)

```ts
// fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from './pages/login-page';

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
```

```ts
// login.spec.ts
import { test, expect } from './fixtures';

test('正しい認証情報でログインできる', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  await expect(page.getByText('ようこそ')).toBeVisible();
});
```

Fixture化することで `new LoginPage(page)` の重複記述をなくし、複数のPage Objectをまとめて使う際も宣言的に書ける。

## テストの構造(AAA + 独立性)

```ts
test.describe('カート機能', () => {
  test('商品をカートに追加すると数量バッジが増える', async ({ page, cartFixture }) => {
    // Arrange
    await cartFixture.seedEmptyCart();

    // Act
    await page.goto('/products/123');
    await page.getByRole('button', { name: 'カートに追加' }).click();

    // Assert
    await expect(page.getByTestId('cart-badge')).toHaveText('1');
  });
});
```

- `test.describe` はドメイン(機能)単位でグルーピングする。
- `beforeEach` で毎回クリーンな状態を作り、前のテストの副作用に依存しない。
- テストのタイトルは「何をしたら何が起きるか」を明確に書く。

## テストデータ・状態管理

- API経由のセットアップを最優先する。UIで毎回ログイン/データ作成すると遅く壊れやすい。
- ログイン状態は `storageState` を使って保存・再利用し、認証UIを毎テストで通らないようにする。

```ts
// global-setup.ts でログイン後の状態を保存
await page.context().storageState({ path: 'storageState.json' });
```

```ts
// playwright.config.ts
use: {
  storageState: 'storageState.json',
},
```

- テストデータはハードコードせず、ファクトリ関数で生成する。テストごとに動的生成(UUIDやタイムスタンプ付与)し、並列実行での衝突を避ける。

```ts
// factories/user-factory.ts
export const createTestUser = () => ({
  email: `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
  password: 'Test1234!',
});
```

- 外部APIやメール送信など不安定・低速な依存は `page.route()` でモックし、決定的な結果にする。

```ts
await page.route('**/api/payment', route =>
  route.fulfill({ status: 200, body: JSON.stringify({ status: 'success' }) })
);
```
