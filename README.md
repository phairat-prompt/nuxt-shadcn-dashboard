## Quick Start

1. Install dependencies `pnpm install`.
2. Use `pnpm run dev` to start dev server.

```
## Install leaflet
1. `pnpm add leaflet`.
2. `pnpm add -D @types/leaflet`.
3. `pnpm add leaflet.markercluster`.
4. `pnpm add -D @types/leaflet.markercluster`.




## App Settings
You can change the app settings in `app.config.ts` file.
If you want to change app settings, you have to clear cookie 'app_settings' first.
```
export default defineAppConfig({
  appSettings: {
    sidebar: {
      collapsible: 'offcanvas', // 'offcanvas' | 'icon' | 'none'
      side: 'left', // 'left' | 'right'
      variant: 'inset', // 'sidebar' | 'floating' | 'inset'
    },
    theme: {
      color: 'default', // 'default' | 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'teal' | 'yellow' | 'rose'
      type: 'scaled', // 'default' | 'mono' | 'scaled'
    }
  },
})
```

## Contributing

1. Clone this repository.
2. Install dependencies `pnpm install`.
3. Use `pnpm run dev` to start dev server.

## Credits

- [Nuxt.js](https://nuxtjs.org/)
- [Shadcn Vue](https://shadcn-vue.com/)
- [TailwindCSS](https://tailwindcss.com/)

## License

MIT

[nuxt-src]: https://img.shields.io/badge/Built%20With%20Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com/

