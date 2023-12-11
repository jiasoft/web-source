import { newSpecPage } from '@stencil/core/testing';
import { MyComponent } from './data-source-edit';

describe('data-source-edit', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: '<data-source-edit></data-source-edit>',
    });
    expect(root).toEqualHtml(`
      <data-source-edit>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </data-source-edit>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [MyComponent],
      html: `<data-source-edit first="Stencil" last="'Don't call me a framework' JS"></data-source-edit>`,
    });
    expect(root).toEqualHtml(`
      <data-source-edit first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </data-source-edit>
    `);
  });
});
