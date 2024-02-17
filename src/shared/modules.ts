export async function delay(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

const dom = new DOMParser()
export function createElement(html: string) {
  return dom.parseFromString(html, 'text/html').activeElement.children.item(0)
}