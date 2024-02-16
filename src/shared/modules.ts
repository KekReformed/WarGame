export async function delay(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

const dom = new DOMParser()
export function createElement(html: string) {
  return dom.parseFromString(html, 'text/html').activeElement.children.item(0)
}

/** Saves a game to the browser after receiving it from the server for the first time, then navigates to the lobby. */
export function saveNewGame(body: { secret: string }) {
  if (location.hostname === "localhost") localStorage.secret = body.secret
  delete body.secret
  localStorage.game = JSON.stringify(body)
  location.pathname = "/game/"
}