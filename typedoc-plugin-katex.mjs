// node_modules/typedoc-plugin-katex/src/index.tsx
import { JSX, ParameterType } from "typedoc";
function load(app) {
  app.options.addDeclaration({
    name: "katex",
    help: "KaTeX plugin config",
    type: ParameterType.Mixed,
    defaultValue: {}
  });
  app.renderer.hooks.on("head.end", () => {
    var { version, options } = app.options.getValue("katex");
    var katexUrl = "https://cdn.jsdelivr.net/npm/katex";
    if (version)
      katexUrl += "@" + version;
    katexUrl += "/dist/";
    if (!options)
      optionsStr = `${undefined}`;
    else
      var optionsStr = JSON.stringify(options);
    return /* @__PURE__ */ JSX.createElement(JSX.Fragment, null, /* @__PURE__ */ JSX.createElement("link", {
      rel: "stylesheet",
      href: katexUrl + "katex.min.css"
    }), /* @__PURE__ */ JSX.createElement("script", {
      src: katexUrl + "katex.min.js"
    }), /* @__PURE__ */ JSX.createElement("script", {
      src: katexUrl + "contrib/auto-render.min.js"
    }), /* @__PURE__ */ JSX.createElement("script", null, /* @__PURE__ */ JSX.createElement(JSX.Raw, {
      html: `
					window.__typeDocPluginKatexOptions=${optionsStr};
					window.addEventListener('load', () => window.renderMathInElement(document.body, window.__typeDocPluginKatexOptions));
				`
    })));
  });
}
export {
  load
};
