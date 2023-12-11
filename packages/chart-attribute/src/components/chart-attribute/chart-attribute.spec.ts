import { newSpecPage } from '@stencil/core/testing';
import { ChartAttribute } from './chart-attribute';

describe('chart-attribute', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [ChartAttribute],
      html: '<chart-attribute></chart-attribute>',
    });
    expect(root).toEqualHtml(`
      <chart-attribute>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </chart-attribute>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [ChartAttribute],
      html: `<chart-attribute first="Stencil" last="'Don't call me a framework' JS"></chart-attribute>`,
    });
    expect(root).toEqualHtml(`
      <chart-attribute first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </chart-attribute>
    `);
  });
});
