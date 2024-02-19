function resolvePath(path) {
  if (path.startsWith('@/'))
    return path.replace('@/', '')
  if (path.startsWith('/'))
    return path.replace('/', '')
  else return path
}
// 动态导入本地资源jsx
export function required(url) {
  return new URL(`../${resolvePath(url)}`, import.meta.url).href
}
