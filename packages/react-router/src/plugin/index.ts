import path from 'path'
import { createUnplugin } from 'unplugin'
import type { ViteDevServer } from 'vite'
import type { Compiler } from 'webpack'

import { generate } from './generate'
import { defaultOptions, Options } from './options'

export default createUnplugin((options?: Partial<Options>) => {
  const resolvedOptions = { ...defaultOptions, ...options }
  const pluginName = 'generouted/react-router'

  return {
    name: pluginName,
    enforce: 'pre',

    // Common hooks for all bundlers
    buildStart() {
      return generate(resolvedOptions)
    },

    // Vite specific hooks
    vite: {
      configureServer(server: ViteDevServer) {
        const listener = (file = '') =>
          file.includes(path.normalize('/src/pages/')) ? generate(resolvedOptions) : null
        server.watcher.on('add', listener)
        server.watcher.on('change', listener)
        server.watcher.on('unlink', listener)
      },
    },

    // Webpack specific hooks
    webpack(compiler: Compiler) {
      compiler.hooks.afterEnvironment.tap(pluginName, () => {
        generate(resolvedOptions)
      })

      if (compiler.options.mode === 'development') {
        compiler.hooks.watchRun.tapPromise(pluginName, async () => {
          await generate(resolvedOptions)
          return Promise.resolve()
        })
      }
    },
  }
})
