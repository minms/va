const fs = require('fs');
const path = require('path');

const isBinary = require('isbinaryfile');

async function generate(dir, files, base = '', rootOptions = {}) {
  const glob = require('glob');

  glob.sync('**/*', {
    cwd: dir,
    nodir: true
  }).forEach(rawPath => {
    const sourcePath = path.resolve(dir, rawPath);
    const filename = path.join(base, rawPath);

    if (isBinary.sync(sourcePath)) {
      files[filename] = fs.readFileSync(sourcePath) // return buffer
    } else {
      let content = fs.readFileSync(sourcePath, 'utf-8');
      if (path.basename(filename) === 'manifest.json') {
        content = content.replace('{{name}}', rootOptions.projectName || '')
      }
      if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {
        files[`.${filename.slice(1)}`] = content
      } else if (filename.charAt(0) === '_' && filename.charAt(1) === '_') {
        files[`${filename.slice(1)}`] = content
      } else {
        files[filename] = content
      }
    }
  })
}

module.exports = (api, options, rootOptions) => {
  // 安装一些基础公共库
  api.extendPackage({
    dependencies: {
      "va-core": "^1.0.0"
    },
    devDependencies: {
      "webpack": "^4.41.6"
    }
  });

  // 公共基础目录和文件
  api.render(async function (files) {
    Object.keys(files).forEach(name => {
      if (['vue.config.js'].includes(name)) return;

      delete files[name]
    });
    await generate(path.resolve(__dirname, './template/src'), files, 'src', rootOptions)
  });

  api.render({
    './.gitignore': './template/_gitignore',
    './public/index.html': './template/public/index.html'
  })
};
