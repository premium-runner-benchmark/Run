var fs = require('fs');
var path = require('path');
var CodeGen = require('swagger-typescript-codegen').CodeGen;

var swagger = JSON.parse(
    fs.readFileSync(path.resolve('src/api/swagger.json'), 'UTF-8')
);

var runSourceCode = CodeGen.getTypescriptCode({
    className: 'LumiRunAPI',
    swagger: swagger
});

fs.writeFile(path.resolve('src/api/runAPI.ts'), runSourceCode, (error, ok) => {
    console.log(error, ok);
});
