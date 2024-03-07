import { generatePath, redirect } from 'react-router-dom'

export const utils = <Path extends string, Params extends Record<string, any>>() => {
  type Init = number | ResponseInit
  type RedirectOptions<P> = P extends keyof Params ? [Init & { params: Params[P] }] : [Init & { params?: never }] | []

  return {
    redirect: <P extends Path>(url: P, ...[options]: RedirectOptions<P>) => {
      return redirect(options?.params ? generatePath(url, options.params) : url, options)
    },
  }
}
