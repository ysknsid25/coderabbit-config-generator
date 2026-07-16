import { expect, test } from '@playwright/test';

test.describe('Paste YAML import flow', () => {
  test('rejects unknown keys, imports valid YAML, and allows edit/copy/download', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/');

    await page.getByRole('button', { name: 'Import Configure' }).click();
    await page.getByRole('button', { name: 'Paste YAML' }).click();

    const textarea = page.getByPlaceholder('Paste your .coderabbit.yaml here');
    await textarea.fill('nonexistent_field: true');
    await page.getByRole('button', { name: 'Import' }).click();

    await expect(page.getByRole('listitem')).toContainText('nonexistent_field');

    await textarea.fill('language: ja-JP\nearly_access: true');
    await page.getByRole('button', { name: 'Import' }).click();

    await expect(page.getByRole('listitem')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Import Configure' })).toBeVisible();

    const preview = page.locator('pre');
    await expect(preview).toContainText('language: ja-JP');
    await expect(preview).toContainText('early_access: true');

    const languageSelect = page.locator('#language');
    await languageSelect.selectOption('en-US');
    await expect(preview).not.toContainText('language: ja-JP');

    await page.getByRole('button', { name: 'Copy' }).click();
    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('early_access: true');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('coderabbit-config.zip');
  });
});
