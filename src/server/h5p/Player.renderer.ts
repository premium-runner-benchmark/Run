export default model => `<!doctype html>
<html class="h5p-iframe">
<head>
    <meta charset="utf-8">
    
    ${model.styles
        .map(style => `<link rel="stylesheet" href="${style}"/>`)
        .join('\n    ')}
    ${model.scripts
        .map(script => `<script src="${script}"></script>`)
        .join('\n    ')}

    <script>
        H5PIntegration = ${JSON.stringify(model.integration, null, 2)};
    </script>${model.customScripts}
</head>
<body>
    <div class="h5p-content" data-content-id="${model.contentId}"></div>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    </body>
</html>`;
