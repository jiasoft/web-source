import { newSpecPage } from "@stencil/core/testing";
import { ChartConfig } from "./chart-config";
describe('chart-config', () => {
    it('renders', async () => {
        const { root } = await newSpecPage({
            components: [ChartConfig],
            html: '<chart-config></chart-config>',
        });
        expect(root).toEqualHtml(`
      <chart-config>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </chart-config>
    `);
    });
    it('renders with values', async () => {
        const { root } = await newSpecPage({
            components: [ChartConfig],
            html: `<chart-config first="Stencil" last="'Don't call me a framework' JS"></chart-config>`,
        });
        expect(root).toEqualHtml(`
      <chart-config first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </chart-config>
    `);
    });
});
//# sourceMappingURL=chart-config.spec.js.map
