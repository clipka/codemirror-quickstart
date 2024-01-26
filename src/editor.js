import { EditorState } from '@codemirror/state';
import { highlightSelectionMatches } from '@codemirror/search';
import { indentWithTab, history, defaultKeymap, historyKeymap } from '@codemirror/commands';
import { foldGutter, indentOnInput, indentUnit, bracketMatching, foldKeymap, syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, keymap, EditorView } from '@codemirror/view';

// Theme
import { oneDark } from "@codemirror/theme-one-dark"

// Language
import { javascriptLanguage, javascript } from "@codemirror/lang-javascript"
import { htmlLanguage, html } from "@codemirror/lang-html"
import { cssLanguage, css } from "@codemirror/lang-css"


function createChangeListener(callback) {
    return EditorView.updateListener.of(update => {
        if (update.docChanged) {
            const currentContent = update.state.doc.toString();
            callback(currentContent);
        }
    });
}


function createEditorState(initialContents, language, callback, options = {}) {

    let lang;
    const changeListener = createChangeListener(callback);

    switch (language) {
        case "html":
            lang = html();
            break;
        case "css":
            lang = css();
            break;
        case "javascript":
            lang = javascript();
            break;
        default:
            throw Error("Language not supported");
    }

    let extensions = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        indentUnit.of("    "),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        lang,
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
            indentWithTab,
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
        ]),
        changeListener,
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    ]

    if (options.oneDark)
        extensions.push(oneDark)

    return EditorState.create({
        doc: initialContents,
        extensions
    });
}

function createEditorView(state, parent) {
    return new EditorView({ state, parent })
}

export { createEditorState, createEditorView }