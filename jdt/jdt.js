let htmlContent = "";
let cssContent = "";
let jsContent = "";


const getGeneratedPageURL = ({ html, css, js }) => {
  const getBlobURL = (code, type) => {
    const blob = new Blob([code], { type })
    return URL.createObjectURL(blob)
  }

  const cssURL = getBlobURL(css, 'text/css')
  const jsURL = getBlobURL(js, 'text/javascript')

  const source = `
    <html>
      <head>
        ${css && `<link rel="stylesheet" type="text/css" href="${cssURL}" />`}
        ${js && `<script src="${jsURL}"></script>`}
      </head>
      <body>
        ${html || ''}
      </body>
    </html>
  `

  return getBlobURL(source, 'text/html')
}


function updateIframe() {
  const url = getGeneratedPageURL({
    html: htmlContent,
    css: cssContent,
    js: jsContent
  })

  const iframe = document.querySelector('#iframe')
  iframe.src = url
}

// Create an initial state for the view
function onHtmlEditorChange(content) {
  htmlContent = content;
  updateIframe();
}
function onCssEditorChange(content) {
  cssContent = content;
  updateIframe();
}
function onJsEditorChange(content) {
  jsContent = content;
  updateIframe();
}


const html_initialState = cm6.createEditorState("", "html", onHtmlEditorChange);
const html_view = cm6.createEditorView(html_initialState, document.getElementById("html-editor"));

const css_initialState = cm6.createEditorState("", "css", onCssEditorChange);
const css_view = cm6.createEditorView(css_initialState, document.getElementById("css-editor"));

const js_initialState = cm6.createEditorState("", "javascript", onJsEditorChange);
const js_view = cm6.createEditorView(js_initialState, document.getElementById("js-editor"));
