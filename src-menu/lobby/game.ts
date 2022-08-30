const bundleUrl = "http://localhost:5000/bundle.js"

export function launchGame() {
    const script = document.createElement("script")
    script.setAttribute("src", bundleUrl)
    document.head.appendChild(script)
}