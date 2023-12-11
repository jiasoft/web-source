import { newE2EPage } from '@stencil/core/testing';

describe('chart-attribute', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<chart-attribute></chart-attribute>');
    const element = await page.find('chart-attribute');
    expect(element).toHaveClass('hydrated');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<chart-attribute></chart-attribute>');
    const component = await page.find('chart-attribute');
    const element = await page.find('chart-attribute >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
