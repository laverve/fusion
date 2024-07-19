# @laverve/design-provider

This module provides pre-configured setup for common UI components and design.
[NextUI](https://nextui.org/) library is in the heart of this module.
Icons are provided by a free version of the FontAwesome.

Dependencies:
1. [NextUI](https://nextui.org/)
2. [framer-motion](https://www.framer.com/motion/)
3. [PostCSS](https://postcss.org/)
4. [TailwindCSS](https://tailwindcss.com/)
5. [FontAwesome](fontawesome.com/)

# Installation

1. Install
```
npm i --save @laverve/design-provider
```

2. Add `postcss.config.js` file in your root folder
```

const postCSSConfig = require("@laverve/design-provider/postcss.config.js");

export default postCSSConfig;
```

3. Add `tailwind.config.js` file in your root folder
```

const tailwindConfig = require("@laverve/design-provider/tailwind.config.js");

export default tailwindConfig;
```

4. Configure your build tool so it supports postcss

# Usage

## Design provider
Wrap your application by `LaverveCoreDesignProvider` as shown below, otherwise styles won't be applied.

```
export const App: React.FC<PropsWithChildren> = ({children}) => {
    return (
        <LaverveCoreDesignProvider>
            {children}
        </LaverveCoreDesignProvider>
    );
};
```

## Typography

Tailwind overrides all default settings for all HTML elements.
In order to apply standard typography features you shall use `Typography` component as shown below.

```
<Typography variant="heading-1">
    H1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
    et dolore magna aliqua
</Typography>
```

Supported variants:
- `heading-1`
- `heading-2`
- `heading-3`
- `heading-4`
- `body-1`
- `body-4`

## Icons

We are leveraging FontAwesome icons through it's [react component](https://www.npmjs.com/package/@fortawesome/react-fontawesome). See example below on how to insert an icon.

```
<FontAwesomeIcon icon={["fab", "play"]} className="mr-2" />
```


