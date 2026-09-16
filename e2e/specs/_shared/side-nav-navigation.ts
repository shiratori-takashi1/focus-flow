import { Page, expect } from '@playwright/test';

type NavTarget = 'Tasks' | 'Profile' | 'Settings';

const PATH_BY_TARGET: Record<NavTarget, string> = {
  Tasks: '/',
  Profile: '/profile',
  Settings: '/settings',
};

const SIDE_NAV_TESTID: Record<NavTarget, string> = {
  Tasks: 'nav-tasks',
  Profile: 'nav-profile',
  Settings: 'nav-settings',
};

/**
 * サイドナビゲーションで指定ページへ遷移する共通手順。
 * scenarios/_shared/side-nav-navigation.md と対応。
 * 選択状態はaria-currentではなくクラスのみで表現されるため、bg-primary-containerクラスの有無で判定する。
 */
export async function navigateVia(page: Page, target: NavTarget) {
  const link = page.getByTestId(SIDE_NAV_TESTID[target]);
  await link.click();

  await expect(page).toHaveURL(new RegExp(`${PATH_BY_TARGET[target]}$`));
  await expect(link).toHaveClass(/bg-primary-container/);
}
