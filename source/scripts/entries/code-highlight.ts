import hljs from "highlight.js/lib/core";
import hljsGo from "highlight.js/lib/languages/go";
import hljsBash from "highlight.js/lib/languages/bash";
import "highlight.js/styles/github.css";

hljs.registerLanguage("go", hljsGo);
hljs.registerLanguage("bash", hljsBash);
hljs.highlightAll();
