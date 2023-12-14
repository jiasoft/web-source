import { newE2EPage } from "@stencil/core/testing";
describe('chart-config', () => {
    it('renders', async () => {
        const page = await newE2EPage();
        await page.setContent('<chart-config></chart-config>');
        const element = await page.find('chart-config');
        expect(element).toHaveClass('hydrated');
    });
    it('renders changes to the name data', async () => {
        const page = await newE2EPage();
        await page.setContent('<chart-config></chart-config>');
        const component = await page.find('chart-config');
        const element = await page.find('chart-config >>> div');
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
//# sourceMappingURL=chart-config.e2e.js.map
