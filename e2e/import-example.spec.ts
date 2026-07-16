import { expect, test } from '@playwright/test';

test.describe('Official example import flow', () => {
  test('imports an official example and allows edit/copy/download', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    await page.getByRole('button', { name: 'Import Configure' }).click();
    await page.getByRole('button', { name: 'Use an official example' }).click();

    await page.getByLabel('Example category').selectOption('react');
    await expect(page.getByPlaceholder('Paste your .coderabbit.yaml here')).not.toBeEmpty();

    await page.getByRole('button', { name: 'Import' }).click();

    await expect(page.getByRole('button', { name: 'Import Configure' })).toBeVisible();

    const preview = page.locator('pre');
    await expect(preview).not.toHaveText(
      'No overrides yet — change a setting to build your config.',
    );

    const languageSelect = page.locator('#language');
    await languageSelect.selectOption('ja-JP');
    await expect(preview).toContainText('language: ja-JP');

    await page.getByRole('button', { name: 'Copy' }).click();
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('language: ja-JP');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('coderabbit-config.zip');
  });
});
