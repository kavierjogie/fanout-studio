import { transform } from 'sucrase'
import reactSrc from '../../node_modules/react/umd/react.production.min.js?raw'
import reactDomSrc from '../../node_modules/react-dom/umd/react-dom.production.min.js?raw'

// Turns a React/JSX snippet into a self-contained document body for the sandboxed runner iframe.
// Compilation happens here (string -> string, nothing is executed); the result only ever runs inside the iframe.
// React ships inline so the sandbox needs no network. ponytail: only react and react-dom can be imported.

const inlineScript = (src: string) => src.replace(/<\/script/gi, '<\\/script')

export function buildReactBody(code: string, typescript: boolean): string {
  let js: string
  try {
    js = transform(code, { transforms: typescript ? ['typescript', 'jsx', 'imports'] : ['jsx', 'imports'], production: true }).code
  } catch (e) {
    throw new Error(`Could not compile JSX: ${e instanceof Error ? e.message : String(e)}`)
  }

  // Capitalised declarations are candidate components when the snippet has no export.
  const names = [...new Set([...code.matchAll(/\b(?:function|class|const|let|var)\s+([A-Z]\w*)/g)].map((m) => m[1]))].filter((n) => /[a-z]/.test(n))
  const candidates = names.map((n) => `${JSON.stringify(n)}:typeof ${n}==='function'?${n}:undefined`).join(',')

  return `<div id="root"></div>
<script>${inlineScript(reactSrc)}</script>
<script>${inlineScript(reactDomSrc)}</script>
<script>
window.__exports={};window.__rendered=false;
try{var cr=ReactDOM.createRoot;ReactDOM.createRoot=function(){window.__rendered=true;return cr.apply(this,arguments)}}catch(e){}
window.__require=function(n){
  if(n==='react')return React;
  if(n==='react-dom'||n==='react-dom/client')return ReactDOM;
  throw new Error("Cannot import '"+n+"': only 'react' and 'react-dom' are available in the sandbox.");
};
</script>
<script>
(function(require,exports,module){
${inlineScript(js)}
;exports.__candidates={${candidates}};
})(window.__require,window.__exports,{exports:window.__exports});
</script>
<script>
(function(){
  if(window.__rendered||window.__failed)return;
  var ex=window.__exports,C=ex.default;
  if(typeof C!=='function'){
    C=undefined;
    for(var k in ex){if(k!=='__candidates'&&k!=='__esModule'&&typeof ex[k]==='function'){C=ex[k];break}}
  }
  if(!C){
    var c=ex.__candidates||{},ks=Object.keys(c).filter(function(k){return c[k]});
    C=c.App||(ks.length&&c[ks[ks.length-1]])||undefined;
  }
  if(!C){window.__send('fatal','No React component found to render. Export one (export default function App() {...}) or declare a component with a capitalised name.');return}
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(C));
})();
</script>`
}
