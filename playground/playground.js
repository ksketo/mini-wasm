let editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "text/x-c++src",
  lineNumbers: true,
  value: "Loading..",
  theme: "mdn-like",
  lineWrapping: true,
  matchBrackets: true,
  viewportMargin: Infinity,
});

let doc = editor.getDoc();
editor.setSize(width='auto', height='95%');

let url = "http://www.felixmaier.info/momo/main.momo?a=" + Date.now();
fetch(url).then((resp) => resp.text().then((text) => {
  doc.setValue(text);
  cmp.click();
}));

if (window.WebAssembly === void 0) {
  alert("Your browser doesn't support WebAssembly!");
}

cmp.onclick = (e) => {
  e.preventDefault();
  buffer.innerHTML = output.innerHTML = celapsed.innerHTML = elapsed.innerHTML = "";
  let code = doc.getValue();
  let _import = {
    error: (msg) => { throw new Error(msg) }
  };
  let cnow = performance.now();
  compile(code, _import).then((result) => {
    let cthen = performance.now();
    buffer.innerHTML = result.dump;
    let main = result.exports.main;
    let memory = new Uint8Array(result.memory.buffer);
    let now = performance.now();
    let out = main();
    let then = performance.now();
    let time = String(then - now).slice(0, 8);
    let ctime = String(cthen - cnow).slice(0, 8);
    console.log(memory);
    celapsed.innerHTML = "Compiled in: " + ctime + "ms";
    elapsed.innerHTML = "Executed in: " + time + "ms";
    output.innerHTML = out;
  });
};

clear_btn.onclick = (e) => {
  e.preventDefault();
  buffer.innerHTML = output.innerHTML = celapsed.innerHTML = elapsed.innerHTML = "";
}
