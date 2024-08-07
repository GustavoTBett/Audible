// vite.generated.ts
import path from "path";
import { existsSync as existsSync5, mkdirSync as mkdirSync2, readdirSync as readdirSync2, readFileSync as readFileSync4, writeFileSync as writeFileSync2 } from "fs";
import { createHash } from "crypto";
import * as net from "net";

// target/plugins/application-theme-plugin/theme-handle.js
import { existsSync as existsSync3, readFileSync as readFileSync2 } from "fs";
import { resolve as resolve3 } from "path";

// target/plugins/application-theme-plugin/theme-generator.js
import { globSync as globSync2 } from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/glob/dist/esm/index.js";
import { resolve as resolve2, basename as basename2 } from "path";
import { existsSync as existsSync2, readFileSync, writeFileSync } from "fs";

// target/plugins/application-theme-plugin/theme-copy.js
import { readdirSync, statSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { resolve, basename, relative, extname } from "path";
import { globSync } from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/glob/dist/esm/index.js";
var ignoredFileExtensions = [".css", ".js", ".json"];
function copyThemeResources(themeFolder2, projectStaticAssetsOutputFolder, logger) {
  const staticAssetsThemeFolder = resolve(projectStaticAssetsOutputFolder, "themes", basename(themeFolder2));
  const collection = collectFolders(themeFolder2, logger);
  if (collection.files.length > 0) {
    mkdirSync(staticAssetsThemeFolder, { recursive: true });
    collection.directories.forEach((directory) => {
      const relativeDirectory = relative(themeFolder2, directory);
      const targetDirectory = resolve(staticAssetsThemeFolder, relativeDirectory);
      mkdirSync(targetDirectory, { recursive: true });
    });
    collection.files.forEach((file) => {
      const relativeFile = relative(themeFolder2, file);
      const targetFile = resolve(staticAssetsThemeFolder, relativeFile);
      copyFileIfAbsentOrNewer(file, targetFile, logger);
    });
  }
}
function collectFolders(folderToCopy, logger) {
  const collection = { directories: [], files: [] };
  logger.trace("files in directory", readdirSync(folderToCopy));
  readdirSync(folderToCopy).forEach((file) => {
    const fileToCopy = resolve(folderToCopy, file);
    try {
      if (statSync(fileToCopy).isDirectory()) {
        logger.debug("Going through directory", fileToCopy);
        const result = collectFolders(fileToCopy, logger);
        if (result.files.length > 0) {
          collection.directories.push(fileToCopy);
          logger.debug("Adding directory", fileToCopy);
          collection.directories.push.apply(collection.directories, result.directories);
          collection.files.push.apply(collection.files, result.files);
        }
      } else if (!ignoredFileExtensions.includes(extname(fileToCopy))) {
        logger.debug("Adding file", fileToCopy);
        collection.files.push(fileToCopy);
      }
    } catch (error) {
      handleNoSuchFileError(fileToCopy, error, logger);
    }
  });
  return collection;
}
function copyStaticAssets(themeName, themeProperties, projectStaticAssetsOutputFolder, logger) {
  const assets = themeProperties["assets"];
  if (!assets) {
    logger.debug("no assets to handle no static assets were copied");
    return;
  }
  mkdirSync(projectStaticAssetsOutputFolder, {
    recursive: true
  });
  const missingModules = checkModules(Object.keys(assets));
  if (missingModules.length > 0) {
    throw Error(
      "Missing npm modules '" + missingModules.join("', '") + "' for assets marked in 'theme.json'.\nInstall package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
    );
  }
  Object.keys(assets).forEach((module) => {
    const copyRules = assets[module];
    Object.keys(copyRules).forEach((copyRule) => {
      const nodeSources = resolve("node_modules/", module, copyRule);
      const files = globSync(nodeSources, { nodir: true });
      const targetFolder = resolve(projectStaticAssetsOutputFolder, "themes", themeName, copyRules[copyRule]);
      mkdirSync(targetFolder, {
        recursive: true
      });
      files.forEach((file) => {
        const copyTarget = resolve(targetFolder, basename(file));
        copyFileIfAbsentOrNewer(file, copyTarget, logger);
      });
    });
  });
}
function checkModules(modules) {
  const missing = [];
  modules.forEach((module) => {
    if (!existsSync(resolve("node_modules/", module))) {
      missing.push(module);
    }
  });
  return missing;
}
function copyFileIfAbsentOrNewer(fileToCopy, copyTarget, logger) {
  try {
    if (!existsSync(copyTarget) || statSync(copyTarget).mtime < statSync(fileToCopy).mtime) {
      logger.trace("Copying: ", fileToCopy, "=>", copyTarget);
      copyFileSync(fileToCopy, copyTarget);
    }
  } catch (error) {
    handleNoSuchFileError(fileToCopy, error, logger);
  }
}
function handleNoSuchFileError(file, error, logger) {
  if (error.code === "ENOENT") {
    logger.warn("Ignoring not existing file " + file + ". File may have been deleted during theme processing.");
  } else {
    throw error;
  }
}

// target/plugins/application-theme-plugin/theme-generator.js
var themeComponentsFolder = "components";
var documentCssFilename = "document.css";
var stylesCssFilename = "styles.css";
var CSSIMPORT_COMMENT = "CSSImport end";
var headerImport = `import 'construct-style-sheets-polyfill';
`;
function writeThemeFiles(themeFolder2, themeName, themeProperties, options) {
  const productionMode = !options.devMode;
  const useDevServerOrInProductionMode = !options.useDevBundle;
  const outputFolder = options.frontendGeneratedFolder;
  const styles = resolve2(themeFolder2, stylesCssFilename);
  const documentCssFile = resolve2(themeFolder2, documentCssFilename);
  const autoInjectComponents = themeProperties.autoInjectComponents ?? true;
  const globalFilename = "theme-" + themeName + ".global.generated.js";
  const componentsFilename = "theme-" + themeName + ".components.generated.js";
  const themeFilename = "theme-" + themeName + ".generated.js";
  let themeFileContent = headerImport;
  let globalImportContent = "// When this file is imported, global styles are automatically applied\n";
  let componentsFileContent = "";
  var componentsFiles;
  if (autoInjectComponents) {
    componentsFiles = globSync2("*.css", {
      cwd: resolve2(themeFolder2, themeComponentsFolder),
      nodir: true
    });
    if (componentsFiles.length > 0) {
      componentsFileContent += "import { unsafeCSS, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles';\n";
    }
  }
  if (themeProperties.parent) {
    themeFileContent += `import { applyTheme as applyBaseTheme } from './theme-${themeProperties.parent}.generated.js';
`;
  }
  themeFileContent += `import { injectGlobalCss } from 'Frontend/generated/jar-resources/theme-util.js';
`;
  themeFileContent += `import './${componentsFilename}';
`;
  themeFileContent += `let needsReloadOnChanges = false;
`;
  const imports = [];
  const componentCssImports = [];
  const globalFileContent = [];
  const globalCssCode = [];
  const shadowOnlyCss = [];
  const componentCssCode = [];
  const parentTheme = themeProperties.parent ? "applyBaseTheme(target);\n" : "";
  const parentThemeGlobalImport = themeProperties.parent ? `import './theme-${themeProperties.parent}.global.generated.js';
` : "";
  const themeIdentifier = "_vaadintheme_" + themeName + "_";
  const lumoCssFlag = "_vaadinthemelumoimports_";
  const globalCssFlag = themeIdentifier + "globalCss";
  const componentCssFlag = themeIdentifier + "componentCss";
  if (!existsSync2(styles)) {
    if (productionMode) {
      throw new Error(`styles.css file is missing and is needed for '${themeName}' in folder '${themeFolder2}'`);
    }
    writeFileSync(
      styles,
      "/* Import your application global css files here or add the styles directly to this file */",
      "utf8"
    );
  }
  let filename = basename2(styles);
  let variable = camelCase(filename);
  const lumoImports = themeProperties.lumoImports || ["color", "typography"];
  if (lumoImports) {
    lumoImports.forEach((lumoImport) => {
      imports.push(`import { ${lumoImport} } from '@vaadin/vaadin-lumo-styles/${lumoImport}.js';
`);
      if (lumoImport === "utility" || lumoImport === "badge" || lumoImport === "typography" || lumoImport === "color") {
        globalFileContent.push(`import '@vaadin/vaadin-lumo-styles/${lumoImport}-global.js';
`);
      }
    });
    lumoImports.forEach((lumoImport) => {
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${lumoImport}.cssText, '', target, true));
`);
    });
  }
  if (useDevServerOrInProductionMode) {
    globalFileContent.push(parentThemeGlobalImport);
    globalFileContent.push(`import 'themes/${themeName}/${filename}';
`);
    imports.push(`import ${variable} from 'themes/${themeName}/${filename}?inline';
`);
    shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable}.toString(), '', target));
    `);
  }
  if (existsSync2(documentCssFile)) {
    filename = basename2(documentCssFile);
    variable = camelCase(filename);
    if (useDevServerOrInProductionMode) {
      globalFileContent.push(`import 'themes/${themeName}/${filename}';
`);
      imports.push(`import ${variable} from 'themes/${themeName}/${filename}?inline';
`);
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable}.toString(),'', document));
    `);
    }
  }
  let i = 0;
  if (themeProperties.documentCss) {
    const missingModules = checkModules(themeProperties.documentCss);
    if (missingModules.length > 0) {
      throw Error(
        "Missing npm modules or files '" + missingModules.join("', '") + "' for documentCss marked in 'theme.json'.\nInstall or update package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
      );
    }
    themeProperties.documentCss.forEach((cssImport) => {
      const variable2 = "module" + i++;
      imports.push(`import ${variable2} from '${cssImport}?inline';
`);
      globalCssCode.push(`if(target !== document) {
        removers.push(injectGlobalCss(${variable2}.toString(), '', target));
    }
    `);
      globalCssCode.push(
        `removers.push(injectGlobalCss(${variable2}.toString(), '${CSSIMPORT_COMMENT}', document));
    `
      );
    });
  }
  if (themeProperties.importCss) {
    const missingModules = checkModules(themeProperties.importCss);
    if (missingModules.length > 0) {
      throw Error(
        "Missing npm modules or files '" + missingModules.join("', '") + "' for importCss marked in 'theme.json'.\nInstall or update package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
      );
    }
    themeProperties.importCss.forEach((cssPath) => {
      const variable2 = "module" + i++;
      globalFileContent.push(`import '${cssPath}';
`);
      imports.push(`import ${variable2} from '${cssPath}?inline';
`);
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable2}.toString(), '${CSSIMPORT_COMMENT}', target));
`);
    });
  }
  if (autoInjectComponents) {
    componentsFiles.forEach((componentCss) => {
      const filename2 = basename2(componentCss);
      const tag = filename2.replace(".css", "");
      const variable2 = camelCase(filename2);
      componentCssImports.push(
        `import ${variable2} from 'themes/${themeName}/${themeComponentsFolder}/${filename2}?inline';
`
      );
      const componentString = `registerStyles(
        '${tag}',
        unsafeCSS(${variable2}.toString())
      );
      `;
      componentCssCode.push(componentString);
    });
  }
  themeFileContent += imports.join("");
  const themeFileApply = `
  let themeRemovers = new WeakMap();
  let targets = [];

  export const applyTheme = (target) => {
    const removers = [];
    if (target !== document) {
      ${shadowOnlyCss.join("")}
    }
    ${parentTheme}
    ${globalCssCode.join("")}

    if (import.meta.hot) {
      targets.push(new WeakRef(target));
      themeRemovers.set(target, removers);
    }

  }
  
`;
  componentsFileContent += `
${componentCssImports.join("")}

if (!document['${componentCssFlag}']) {
  ${componentCssCode.join("")}
  document['${componentCssFlag}'] = true;
}

if (import.meta.hot) {
  import.meta.hot.accept((module) => {
    window.location.reload();
  });
}

`;
  themeFileContent += themeFileApply;
  themeFileContent += `
if (import.meta.hot) {
  import.meta.hot.accept((module) => {

    if (needsReloadOnChanges) {
      window.location.reload();
    } else {
      targets.forEach(targetRef => {
        const target = targetRef.deref();
        if (target) {
          themeRemovers.get(target).forEach(remover => remover())
          module.applyTheme(target);
        }
      })
    }
  });

  import.meta.hot.on('vite:afterUpdate', (update) => {
    document.dispatchEvent(new CustomEvent('vaadin-theme-updated', { detail: update }));
  });
}

`;
  globalImportContent += `
${globalFileContent.join("")}
`;
  writeIfChanged(resolve2(outputFolder, globalFilename), globalImportContent);
  writeIfChanged(resolve2(outputFolder, themeFilename), themeFileContent);
  writeIfChanged(resolve2(outputFolder, componentsFilename), componentsFileContent);
}
function writeIfChanged(file, data) {
  if (!existsSync2(file) || readFileSync(file, { encoding: "utf-8" }) !== data) {
    writeFileSync(file, data);
  }
}
function camelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, "").replace(/\.|\-/g, "");
}

// target/plugins/application-theme-plugin/theme-handle.js
var nameRegex = /theme-(.*)\.generated\.js/;
var prevThemeName = void 0;
var firstThemeName = void 0;
function processThemeResources(options, logger) {
  const themeName = extractThemeName(options.frontendGeneratedFolder);
  if (themeName) {
    if (!prevThemeName && !firstThemeName) {
      firstThemeName = themeName;
    } else if (prevThemeName && prevThemeName !== themeName && firstThemeName !== themeName || !prevThemeName && firstThemeName !== themeName) {
      const warning = `Attention: Active theme is switched to '${themeName}'.`;
      const description = `
      Note that adding new style sheet files to '/themes/${themeName}/components', 
      may not be taken into effect until the next application restart.
      Changes to already existing style sheet files are being reloaded as before.`;
      logger.warn("*******************************************************************");
      logger.warn(warning);
      logger.warn(description);
      logger.warn("*******************************************************************");
    }
    prevThemeName = themeName;
    findThemeFolderAndHandleTheme(themeName, options, logger);
  } else {
    prevThemeName = void 0;
    logger.debug("Skipping Vaadin application theme handling.");
    logger.trace("Most likely no @Theme annotation for application or only themeClass used.");
  }
}
function findThemeFolderAndHandleTheme(themeName, options, logger) {
  let themeFound = false;
  for (let i = 0; i < options.themeProjectFolders.length; i++) {
    const themeProjectFolder = options.themeProjectFolders[i];
    if (existsSync3(themeProjectFolder)) {
      logger.debug("Searching themes folder '" + themeProjectFolder + "' for theme '" + themeName + "'");
      const handled = handleThemes(themeName, themeProjectFolder, options, logger);
      if (handled) {
        if (themeFound) {
          throw new Error(
            "Found theme files in '" + themeProjectFolder + "' and '" + themeFound + "'. Theme should only be available in one folder"
          );
        }
        logger.debug("Found theme files from '" + themeProjectFolder + "'");
        themeFound = themeProjectFolder;
      }
    }
  }
  if (existsSync3(options.themeResourceFolder)) {
    if (themeFound && existsSync3(resolve3(options.themeResourceFolder, themeName))) {
      throw new Error(
        "Theme '" + themeName + `'should not exist inside a jar and in the project at the same time
Extending another theme is possible by adding { "parent": "my-parent-theme" } entry to the theme.json file inside your theme folder.`
      );
    }
    logger.debug(
      "Searching theme jar resource folder '" + options.themeResourceFolder + "' for theme '" + themeName + "'"
    );
    handleThemes(themeName, options.themeResourceFolder, options, logger);
    themeFound = true;
  }
  return themeFound;
}
function handleThemes(themeName, themesFolder, options, logger) {
  const themeFolder2 = resolve3(themesFolder, themeName);
  if (existsSync3(themeFolder2)) {
    logger.debug("Found theme ", themeName, " in folder ", themeFolder2);
    const themeProperties = getThemeProperties(themeFolder2);
    if (themeProperties.parent) {
      const found = findThemeFolderAndHandleTheme(themeProperties.parent, options, logger);
      if (!found) {
        throw new Error(
          "Could not locate files for defined parent theme '" + themeProperties.parent + "'.\nPlease verify that dependency is added or theme folder exists."
        );
      }
    }
    copyStaticAssets(themeName, themeProperties, options.projectStaticAssetsOutputFolder, logger);
    copyThemeResources(themeFolder2, options.projectStaticAssetsOutputFolder, logger);
    writeThemeFiles(themeFolder2, themeName, themeProperties, options);
    return true;
  }
  return false;
}
function getThemeProperties(themeFolder2) {
  const themePropertyFile = resolve3(themeFolder2, "theme.json");
  if (!existsSync3(themePropertyFile)) {
    return {};
  }
  const themePropertyFileAsString = readFileSync2(themePropertyFile);
  if (themePropertyFileAsString.length === 0) {
    return {};
  }
  return JSON.parse(themePropertyFileAsString);
}
function extractThemeName(frontendGeneratedFolder) {
  if (!frontendGeneratedFolder) {
    throw new Error(
      "Couldn't extract theme name from 'theme.js', because the path to folder containing this file is empty. Please set the a correct folder path in ApplicationThemePlugin constructor parameters."
    );
  }
  const generatedThemeFile = resolve3(frontendGeneratedFolder, "theme.js");
  if (existsSync3(generatedThemeFile)) {
    const themeName = nameRegex.exec(readFileSync2(generatedThemeFile, { encoding: "utf8" }))[1];
    if (!themeName) {
      throw new Error("Couldn't parse theme name from '" + generatedThemeFile + "'.");
    }
    return themeName;
  } else {
    return "";
  }
}

// target/plugins/theme-loader/theme-loader-utils.js
import { existsSync as existsSync4, readFileSync as readFileSync3 } from "fs";
import { resolve as resolve4, basename as basename3 } from "path";
import { globSync as globSync3 } from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/glob/dist/esm/index.js";
var urlMatcher = /(url\(\s*)(\'|\")?(\.\/|\.\.\/)((?:\3)*)?(\S*)(\2\s*\))/g;
function assetsContains(fileUrl, themeFolder2, logger) {
  const themeProperties = getThemeProperties2(themeFolder2);
  if (!themeProperties) {
    logger.debug("No theme properties found.");
    return false;
  }
  const assets = themeProperties["assets"];
  if (!assets) {
    logger.debug("No defined assets in theme properties");
    return false;
  }
  for (let module of Object.keys(assets)) {
    const copyRules = assets[module];
    for (let copyRule of Object.keys(copyRules)) {
      if (fileUrl.startsWith(copyRules[copyRule])) {
        const targetFile = fileUrl.replace(copyRules[copyRule], "");
        const files = globSync3(resolve4("node_modules/", module, copyRule), { nodir: true });
        for (let file of files) {
          if (file.endsWith(targetFile)) return true;
        }
      }
    }
  }
  return false;
}
function getThemeProperties2(themeFolder2) {
  const themePropertyFile = resolve4(themeFolder2, "theme.json");
  if (!existsSync4(themePropertyFile)) {
    return {};
  }
  const themePropertyFileAsString = readFileSync3(themePropertyFile);
  if (themePropertyFileAsString.length === 0) {
    return {};
  }
  return JSON.parse(themePropertyFileAsString);
}
function rewriteCssUrls(source, handledResourceFolder, themeFolder2, logger, options) {
  source = source.replace(urlMatcher, function(match, url, quoteMark, replace2, additionalDotSegments, fileUrl, endString) {
    let absolutePath = resolve4(handledResourceFolder, replace2, additionalDotSegments || "", fileUrl);
    let existingThemeResource = absolutePath.startsWith(themeFolder2) && existsSync4(absolutePath);
    if (!existingThemeResource && additionalDotSegments) {
      absolutePath = resolve4(handledResourceFolder, replace2, fileUrl);
      existingThemeResource = absolutePath.startsWith(themeFolder2) && existsSync4(absolutePath);
    }
    const isAsset = assetsContains(fileUrl, themeFolder2, logger);
    if (existingThemeResource || isAsset) {
      const replacement = options.devMode ? "./" : "../static/";
      const skipLoader = existingThemeResource ? "" : replacement;
      const frontendThemeFolder = skipLoader + "themes/" + basename3(themeFolder2);
      logger.log(
        "Updating url for file",
        "'" + replace2 + fileUrl + "'",
        "to use",
        "'" + frontendThemeFolder + "/" + fileUrl + "'"
      );
      const pathResolved = isAsset ? "/" + fileUrl : absolutePath.substring(themeFolder2.length).replace(/\\/g, "/");
      return url + (quoteMark ?? "") + frontendThemeFolder + pathResolved + endString;
    } else if (options.devMode) {
      logger.log("No rewrite for '", match, "' as the file was not found.");
    } else {
      return url + (quoteMark ?? "") + "../../" + fileUrl + endString;
    }
    return match;
  });
  return source;
}

// target/plugins/react-function-location-plugin/react-function-location-plugin.js
import * as t from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/@babel/types/lib/index.js";
function addFunctionComponentSourceLocationBabel() {
  function isReactFunctionName(name) {
    return name && name.match(/^[A-Z].*/);
  }
  function addDebugInfo(path2, name, filename, loc) {
    const lineNumber = loc.start.line;
    const columnNumber = loc.start.column + 1;
    const debugSourceMember = t.memberExpression(t.identifier(name), t.identifier("__debugSourceDefine"));
    const debugSourceDefine = t.objectExpression([
      t.objectProperty(t.identifier("fileName"), t.stringLiteral(filename)),
      t.objectProperty(t.identifier("lineNumber"), t.numericLiteral(lineNumber)),
      t.objectProperty(t.identifier("columnNumber"), t.numericLiteral(columnNumber))
    ]);
    const assignment = t.expressionStatement(t.assignmentExpression("=", debugSourceMember, debugSourceDefine));
    const condition = t.binaryExpression(
      "===",
      t.unaryExpression("typeof", t.identifier(name)),
      t.stringLiteral("function")
    );
    const ifFunction = t.ifStatement(condition, t.blockStatement([assignment]));
    path2.insertAfter(ifFunction);
  }
  return {
    visitor: {
      VariableDeclaration(path2, state) {
        path2.node.declarations.forEach((declaration) => {
          if (declaration.id.type !== "Identifier") {
            return;
          }
          const name = declaration?.id?.name;
          if (!isReactFunctionName(name)) {
            return;
          }
          const filename = state.file.opts.filename;
          if (declaration?.init?.body?.loc) {
            addDebugInfo(path2, name, filename, declaration.init.body.loc);
          }
        });
      },
      FunctionDeclaration(path2, state) {
        const node = path2.node;
        const name = node?.id?.name;
        if (!isReactFunctionName(name)) {
          return;
        }
        const filename = state.file.opts.filename;
        addDebugInfo(path2, name, filename, node.body.loc);
      }
    }
  };
}

// target/vaadin-dev-server-settings.json
var vaadin_dev_server_settings_default = {
  frontendFolder: "C:/Users/gustavo/Desktop/programas/Audible/src/main/frontend",
  themeFolder: "themes",
  themeResourceFolder: "C:/Users/gustavo/Desktop/programas/Audible/src/main/frontend/generated/jar-resources",
  staticOutput: "C:/Users/gustavo/Desktop/programas/Audible/target/classes/META-INF/VAADIN/webapp/VAADIN/static",
  generatedFolder: "generated",
  statsOutput: "C:\\Users\\gustavo\\Desktop\\programas\\Audible\\target\\classes\\META-INF\\VAADIN\\config",
  frontendBundleOutput: "C:\\Users\\gustavo\\Desktop\\programas\\Audible\\target\\classes\\META-INF\\VAADIN\\webapp",
  devBundleOutput: "C:/Users/gustavo/Desktop/programas/Audible/target/dev-bundle/webapp",
  devBundleStatsOutput: "C:/Users/gustavo/Desktop/programas/Audible/target/dev-bundle/config",
  jarResourcesFolder: "C:/Users/gustavo/Desktop/programas/Audible/src/main/frontend/generated/jar-resources",
  themeName: "audible",
  clientServiceWorkerSource: "C:\\Users\\gustavo\\Desktop\\programas\\Audible\\target\\sw.ts",
  pwaEnabled: false,
  offlineEnabled: false,
  offlinePath: "'offline.html'"
};

// vite.generated.ts
import {
  defineConfig,
  mergeConfig
} from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/vite/dist/node/index.js";
import { getManifest } from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/workbox-build/build/index.js";
import * as rollup from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/rollup/dist/es/rollup.js";
import brotli from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/rollup-plugin-brotli/lib/index.cjs.js";
import replace from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/@rollup/plugin-replace/dist/es/index.js";
import checker from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/vite-plugin-checker/dist/esm/main.js";

// target/plugins/rollup-plugin-postcss-lit-custom/rollup-plugin-postcss-lit.js
import { createFilter } from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/@rollup/pluginutils/dist/es/index.js";
import transformAst from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/transform-ast/index.js";
var assetUrlRE = /__VITE_ASSET__([\w$]+)__(?:\$_(.*?)__)?/g;
var escape = (str) => str.replace(assetUrlRE, '${unsafeCSSTag("__VITE_ASSET__$1__$2")}').replace(/`/g, "\\`").replace(/\\(?!`)/g, "\\\\");
function postcssLit(options = {}) {
  const defaultOptions = {
    include: "**/*.{css,sss,pcss,styl,stylus,sass,scss,less}",
    exclude: null,
    importPackage: "lit"
  };
  const opts = { ...defaultOptions, ...options };
  const filter = createFilter(opts.include, opts.exclude);
  return {
    name: "postcss-lit",
    enforce: "post",
    transform(code, id) {
      if (!filter(id)) return;
      const ast = this.parse(code, {});
      let defaultExportName;
      let isDeclarationLiteral = false;
      const magicString = transformAst(code, { ast }, (node) => {
        if (node.type === "ExportDefaultDeclaration") {
          defaultExportName = node.declaration.name;
          isDeclarationLiteral = node.declaration.type === "Literal";
        }
      });
      if (!defaultExportName && !isDeclarationLiteral) {
        return;
      }
      magicString.walk((node) => {
        if (defaultExportName && node.type === "VariableDeclaration") {
          const exportedVar = node.declarations.find((d) => d.id.name === defaultExportName);
          if (exportedVar) {
            exportedVar.init.edit.update(`cssTag\`${escape(exportedVar.init.value)}\``);
          }
        }
        if (isDeclarationLiteral && node.type === "ExportDefaultDeclaration") {
          node.declaration.edit.update(`cssTag\`${escape(node.declaration.value)}\``);
        }
      });
      magicString.prepend(`import {css as cssTag, unsafeCSS as unsafeCSSTag} from '${opts.importPackage}';
`);
      return {
        code: magicString.toString(),
        map: magicString.generateMap({
          hires: true
        })
      };
    }
  };
}

// vite.generated.ts
import { createRequire } from "module";
import { visualizer } from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import reactPlugin from "file:///C:/Users/gustavo/Desktop/programas/Audible/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\gustavo\\Desktop\\programas\\Audible";
var __vite_injected_original_import_meta_url = "file:///C:/Users/gustavo/Desktop/programas/Audible/vite.generated.ts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var appShellUrl = ".";
var frontendFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.frontendFolder);
var themeFolder = path.resolve(frontendFolder, vaadin_dev_server_settings_default.themeFolder);
var frontendBundleFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.frontendBundleOutput);
var devBundleFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.devBundleOutput);
var devBundle = !!process.env.devBundle;
var jarResourcesFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.jarResourcesFolder);
var themeResourceFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.themeResourceFolder);
var projectPackageJsonFile = path.resolve(__vite_injected_original_dirname, "package.json");
var buildOutputFolder = devBundle ? devBundleFolder : frontendBundleFolder;
var statsFolder = path.resolve(__vite_injected_original_dirname, devBundle ? vaadin_dev_server_settings_default.devBundleStatsOutput : vaadin_dev_server_settings_default.statsOutput);
var statsFile = path.resolve(statsFolder, "stats.json");
var bundleSizeFile = path.resolve(statsFolder, "bundle-size.html");
var nodeModulesFolder = path.resolve(__vite_injected_original_dirname, "node_modules");
var webComponentTags = "";
var projectIndexHtml = path.resolve(frontendFolder, "index.html");
var projectStaticAssetsFolders = [
  path.resolve(__vite_injected_original_dirname, "src", "main", "resources", "META-INF", "resources"),
  path.resolve(__vite_injected_original_dirname, "src", "main", "resources", "static"),
  frontendFolder
];
var themeProjectFolders = projectStaticAssetsFolders.map((folder) => path.resolve(folder, vaadin_dev_server_settings_default.themeFolder));
var themeOptions = {
  devMode: false,
  useDevBundle: devBundle,
  // The following matches folder 'frontend/generated/themes/'
  // (not 'frontend/themes') for theme in JAR that is copied there
  themeResourceFolder: path.resolve(themeResourceFolder, vaadin_dev_server_settings_default.themeFolder),
  themeProjectFolders,
  projectStaticAssetsOutputFolder: devBundle ? path.resolve(devBundleFolder, "../assets") : path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.staticOutput),
  frontendGeneratedFolder: path.resolve(frontendFolder, vaadin_dev_server_settings_default.generatedFolder)
};
var hasExportedWebComponents = existsSync5(path.resolve(frontendFolder, "web-component.html"));
console.trace = () => {
};
console.debug = () => {
};
function injectManifestToSWPlugin() {
  const rewriteManifestIndexHtmlUrl = (manifest) => {
    const indexEntry = manifest.find((entry) => entry.url === "index.html");
    if (indexEntry) {
      indexEntry.url = appShellUrl;
    }
    return { manifest, warnings: [] };
  };
  return {
    name: "vaadin:inject-manifest-to-sw",
    async transform(code, id) {
      if (/sw\.(ts|js)$/.test(id)) {
        const { manifestEntries } = await getManifest({
          globDirectory: buildOutputFolder,
          globPatterns: ["**/*"],
          globIgnores: ["**/*.br"],
          manifestTransforms: [rewriteManifestIndexHtmlUrl],
          maximumFileSizeToCacheInBytes: 100 * 1024 * 1024
          // 100mb,
        });
        return code.replace("self.__WB_MANIFEST", JSON.stringify(manifestEntries));
      }
    }
  };
}
function buildSWPlugin(opts) {
  let config;
  const devMode = opts.devMode;
  const swObj = {};
  async function build(action, additionalPlugins = []) {
    const includedPluginNames = [
      "vite:esbuild",
      "rollup-plugin-dynamic-import-variables",
      "vite:esbuild-transpile",
      "vite:terser"
    ];
    const plugins = config.plugins.filter((p) => {
      return includedPluginNames.includes(p.name);
    });
    const resolver = config.createResolver();
    const resolvePlugin = {
      name: "resolver",
      resolveId(source, importer, _options) {
        return resolver(source, importer);
      }
    };
    plugins.unshift(resolvePlugin);
    plugins.push(
      replace({
        values: {
          "process.env.NODE_ENV": JSON.stringify(config.mode),
          ...config.define
        },
        preventAssignment: true
      })
    );
    if (additionalPlugins) {
      plugins.push(...additionalPlugins);
    }
    const bundle = await rollup.rollup({
      input: path.resolve(vaadin_dev_server_settings_default.clientServiceWorkerSource),
      plugins
    });
    try {
      return await bundle[action]({
        file: path.resolve(buildOutputFolder, "sw.js"),
        format: "es",
        exports: "none",
        sourcemap: config.command === "serve" || config.build.sourcemap,
        inlineDynamicImports: true
      });
    } finally {
      await bundle.close();
    }
  }
  return {
    name: "vaadin:build-sw",
    enforce: "post",
    async configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async buildStart() {
      if (devMode) {
        const { output } = await build("generate");
        swObj.code = output[0].code;
        swObj.map = output[0].map;
      }
    },
    async load(id) {
      if (id.endsWith("sw.js")) {
        return "";
      }
    },
    async transform(_code, id) {
      if (id.endsWith("sw.js")) {
        return swObj;
      }
    },
    async closeBundle() {
      if (!devMode) {
        await build("write", [injectManifestToSWPlugin(), brotli()]);
      }
    }
  };
}
function statsExtracterPlugin() {
  function collectThemeJsonsInFrontend(themeJsonContents, themeName) {
    const themeJson = path.resolve(frontendFolder, vaadin_dev_server_settings_default.themeFolder, themeName, "theme.json");
    if (existsSync5(themeJson)) {
      const themeJsonContent = readFileSync4(themeJson, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
      themeJsonContents[themeName] = themeJsonContent;
      const themeJsonObject = JSON.parse(themeJsonContent);
      if (themeJsonObject.parent) {
        collectThemeJsonsInFrontend(themeJsonContents, themeJsonObject.parent);
      }
    }
  }
  return {
    name: "vaadin:stats",
    enforce: "post",
    async writeBundle(options, bundle) {
      const modules = Object.values(bundle).flatMap((b) => b.modules ? Object.keys(b.modules) : []);
      const nodeModulesFolders = modules.map((id) => id.replace(/\\/g, "/")).filter((id) => id.startsWith(nodeModulesFolder.replace(/\\/g, "/"))).map((id) => id.substring(nodeModulesFolder.length + 1));
      const npmModules = nodeModulesFolders.map((id) => id.replace(/\\/g, "/")).map((id) => {
        const parts = id.split("/");
        if (id.startsWith("@")) {
          return parts[0] + "/" + parts[1];
        } else {
          return parts[0];
        }
      }).sort().filter((value, index, self) => self.indexOf(value) === index);
      const npmModuleAndVersion = Object.fromEntries(npmModules.map((module) => [module, getVersion(module)]));
      const cvdls = Object.fromEntries(
        npmModules.filter((module) => getCvdlName(module) != null).map((module) => [module, { name: getCvdlName(module), version: getVersion(module) }])
      );
      mkdirSync2(path.dirname(statsFile), { recursive: true });
      const projectPackageJson = JSON.parse(readFileSync4(projectPackageJsonFile, { encoding: "utf-8" }));
      const entryScripts = Object.values(bundle).filter((bundle2) => bundle2.isEntry).map((bundle2) => bundle2.fileName);
      const generatedIndexHtml = path.resolve(buildOutputFolder, "index.html");
      const customIndexData = readFileSync4(projectIndexHtml, { encoding: "utf-8" });
      const generatedIndexData = readFileSync4(generatedIndexHtml, {
        encoding: "utf-8"
      });
      const customIndexRows = new Set(customIndexData.split(/[\r\n]/).filter((row) => row.trim() !== ""));
      const generatedIndexRows = generatedIndexData.split(/[\r\n]/).filter((row) => row.trim() !== "");
      const rowsGenerated = [];
      generatedIndexRows.forEach((row) => {
        if (!customIndexRows.has(row)) {
          rowsGenerated.push(row);
        }
      });
      const parseImports = (filename, result) => {
        const content = readFileSync4(filename, { encoding: "utf-8" });
        const lines = content.split("\n");
        const staticImports = lines.filter((line) => line.startsWith("import ")).map((line) => line.substring(line.indexOf("'") + 1, line.lastIndexOf("'"))).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line);
        const dynamicImports = lines.filter((line) => line.includes("import(")).map((line) => line.replace(/.*import\(/, "")).map((line) => line.split(/'/)[1]).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line);
        staticImports.forEach((staticImport) => result.add(staticImport));
        dynamicImports.map((dynamicImport) => {
          const importedFile = path.resolve(path.dirname(filename), dynamicImport);
          parseImports(importedFile, result);
        });
      };
      const generatedImportsSet = /* @__PURE__ */ new Set();
      parseImports(
        path.resolve(themeOptions.frontendGeneratedFolder, "flow", "generated-flow-imports.js"),
        generatedImportsSet
      );
      const generatedImports = Array.from(generatedImportsSet).sort();
      const frontendFiles = {};
      const projectFileExtensions = [".js", ".js.map", ".ts", ".ts.map", ".tsx", ".tsx.map", ".css", ".css.map"];
      const isThemeComponentsResource = (id) => id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) && id.match(/.*\/jar-resources\/themes\/[^\/]+\/components\//);
      const isGeneratedWebComponentResource = (id) => id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) && id.match(/.*\/flow\/web-components\//);
      const isFrontendResourceCollected = (id) => !id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) || isThemeComponentsResource(id) || isGeneratedWebComponentResource(id);
      modules.map((id) => id.replace(/\\/g, "/")).filter((id) => id.startsWith(frontendFolder.replace(/\\/g, "/"))).filter(isFrontendResourceCollected).map((id) => id.substring(frontendFolder.length + 1)).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line).forEach((line) => {
        const filePath = path.resolve(frontendFolder, line);
        if (projectFileExtensions.includes(path.extname(filePath))) {
          const fileBuffer = readFileSync4(filePath, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
          frontendFiles[line] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        }
      });
      generatedImports.filter((line) => line.includes("generated/jar-resources")).forEach((line) => {
        let filename = line.substring(line.indexOf("generated"));
        const fileBuffer = readFileSync4(path.resolve(frontendFolder, filename), { encoding: "utf-8" }).replace(
          /\r\n/g,
          "\n"
        );
        const hash = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        const fileKey = line.substring(line.indexOf("jar-resources/") + 14);
        frontendFiles[fileKey] = hash;
      });
      let frontendFolderAlias = "Frontend";
      generatedImports.filter((line) => line.startsWith(frontendFolderAlias + "/")).filter((line) => !line.startsWith(frontendFolderAlias + "/generated/")).filter((line) => !line.startsWith(frontendFolderAlias + "/themes/")).map((line) => line.substring(frontendFolderAlias.length + 1)).filter((line) => !frontendFiles[line]).forEach((line) => {
        const filePath = path.resolve(frontendFolder, line);
        if (projectFileExtensions.includes(path.extname(filePath)) && existsSync5(filePath)) {
          const fileBuffer = readFileSync4(filePath, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
          frontendFiles[line] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        }
      });
      if (existsSync5(path.resolve(frontendFolder, "index.ts"))) {
        const fileBuffer = readFileSync4(path.resolve(frontendFolder, "index.ts"), { encoding: "utf-8" }).replace(
          /\r\n/g,
          "\n"
        );
        frontendFiles[`index.ts`] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
      }
      const themeJsonContents = {};
      const themesFolder = path.resolve(jarResourcesFolder, "themes");
      if (existsSync5(themesFolder)) {
        readdirSync2(themesFolder).forEach((themeFolder2) => {
          const themeJson = path.resolve(themesFolder, themeFolder2, "theme.json");
          if (existsSync5(themeJson)) {
            themeJsonContents[path.basename(themeFolder2)] = readFileSync4(themeJson, { encoding: "utf-8" }).replace(
              /\r\n/g,
              "\n"
            );
          }
        });
      }
      collectThemeJsonsInFrontend(themeJsonContents, vaadin_dev_server_settings_default.themeName);
      let webComponents = [];
      if (webComponentTags) {
        webComponents = webComponentTags.split(";");
      }
      const stats = {
        packageJsonDependencies: projectPackageJson.dependencies,
        npmModules: npmModuleAndVersion,
        bundleImports: generatedImports,
        frontendHashes: frontendFiles,
        themeJsonContents,
        entryScripts,
        webComponents,
        cvdlModules: cvdls,
        packageJsonHash: projectPackageJson?.vaadin?.hash,
        indexHtmlGenerated: rowsGenerated
      };
      writeFileSync2(statsFile, JSON.stringify(stats, null, 1));
    }
  };
}
function vaadinBundlesPlugin() {
  const disabledMessage = "Vaadin component dependency bundles are disabled.";
  const modulesDirectory = nodeModulesFolder.replace(/\\/g, "/");
  let vaadinBundleJson;
  function parseModuleId(id) {
    const [scope, scopedPackageName] = id.split("/", 3);
    const packageName = scope.startsWith("@") ? `${scope}/${scopedPackageName}` : scope;
    const modulePath = `.${id.substring(packageName.length)}`;
    return {
      packageName,
      modulePath
    };
  }
  function getExports(id) {
    const { packageName, modulePath } = parseModuleId(id);
    const packageInfo = vaadinBundleJson.packages[packageName];
    if (!packageInfo) return;
    const exposeInfo = packageInfo.exposes[modulePath];
    if (!exposeInfo) return;
    const exportsSet = /* @__PURE__ */ new Set();
    for (const e of exposeInfo.exports) {
      if (typeof e === "string") {
        exportsSet.add(e);
      } else {
        const { namespace, source } = e;
        if (namespace) {
          exportsSet.add(namespace);
        } else {
          const sourceExports = getExports(source);
          if (sourceExports) {
            sourceExports.forEach((e2) => exportsSet.add(e2));
          }
        }
      }
    }
    return Array.from(exportsSet);
  }
  function getExportBinding(binding) {
    return binding === "default" ? "_default as default" : binding;
  }
  function getImportAssigment(binding) {
    return binding === "default" ? "default: _default" : binding;
  }
  return {
    name: "vaadin:bundles",
    enforce: "pre",
    apply(config, { command }) {
      if (command !== "serve") return false;
      try {
        const vaadinBundleJsonPath = require2.resolve("@vaadin/bundles/vaadin-bundle.json");
        vaadinBundleJson = JSON.parse(readFileSync4(vaadinBundleJsonPath, { encoding: "utf8" }));
      } catch (e) {
        if (typeof e === "object" && e.code === "MODULE_NOT_FOUND") {
          vaadinBundleJson = { packages: {} };
          console.info(`@vaadin/bundles npm package is not found, ${disabledMessage}`);
          return false;
        } else {
          throw e;
        }
      }
      const versionMismatches = [];
      for (const [name, packageInfo] of Object.entries(vaadinBundleJson.packages)) {
        let installedVersion = void 0;
        try {
          const { version: bundledVersion } = packageInfo;
          const installedPackageJsonFile = path.resolve(modulesDirectory, name, "package.json");
          const packageJson = JSON.parse(readFileSync4(installedPackageJsonFile, { encoding: "utf8" }));
          installedVersion = packageJson.version;
          if (installedVersion && installedVersion !== bundledVersion) {
            versionMismatches.push({
              name,
              bundledVersion,
              installedVersion
            });
          }
        } catch (_) {
        }
      }
      if (versionMismatches.length) {
        console.info(`@vaadin/bundles has version mismatches with installed packages, ${disabledMessage}`);
        console.info(`Packages with version mismatches: ${JSON.stringify(versionMismatches, void 0, 2)}`);
        vaadinBundleJson = { packages: {} };
        return false;
      }
      return true;
    },
    async config(config) {
      return mergeConfig(
        {
          optimizeDeps: {
            exclude: [
              // Vaadin bundle
              "@vaadin/bundles",
              ...Object.keys(vaadinBundleJson.packages),
              "@vaadin/vaadin-material-styles"
            ]
          }
        },
        config
      );
    },
    load(rawId) {
      const [path2, params] = rawId.split("?");
      if (!path2.startsWith(modulesDirectory)) return;
      const id = path2.substring(modulesDirectory.length + 1);
      const bindings = getExports(id);
      if (bindings === void 0) return;
      const cacheSuffix = params ? `?${params}` : "";
      const bundlePath = `@vaadin/bundles/vaadin.js${cacheSuffix}`;
      return `import { init as VaadinBundleInit, get as VaadinBundleGet } from '${bundlePath}';
await VaadinBundleInit('default');
const { ${bindings.map(getImportAssigment).join(", ")} } = (await VaadinBundleGet('./node_modules/${id}'))();
export { ${bindings.map(getExportBinding).join(", ")} };`;
    }
  };
}
function themePlugin(opts) {
  const fullThemeOptions = { ...themeOptions, devMode: opts.devMode };
  return {
    name: "vaadin:theme",
    config() {
      processThemeResources(fullThemeOptions, console);
    },
    configureServer(server) {
      function handleThemeFileCreateDelete(themeFile, stats) {
        if (themeFile.startsWith(themeFolder)) {
          const changed = path.relative(themeFolder, themeFile);
          console.debug("Theme file " + (!!stats ? "created" : "deleted"), changed);
          processThemeResources(fullThemeOptions, console);
        }
      }
      server.watcher.on("add", handleThemeFileCreateDelete);
      server.watcher.on("unlink", handleThemeFileCreateDelete);
    },
    handleHotUpdate(context) {
      const contextPath = path.resolve(context.file);
      const themePath = path.resolve(themeFolder);
      if (contextPath.startsWith(themePath)) {
        const changed = path.relative(themePath, contextPath);
        console.debug("Theme file changed", changed);
        if (changed.startsWith(vaadin_dev_server_settings_default.themeName)) {
          processThemeResources(fullThemeOptions, console);
        }
      }
    },
    async resolveId(id, importer) {
      if (path.resolve(themeOptions.frontendGeneratedFolder, "theme.js") === importer && !existsSync5(path.resolve(themeOptions.frontendGeneratedFolder, id))) {
        console.debug("Generate theme file " + id + " not existing. Processing theme resource");
        processThemeResources(fullThemeOptions, console);
        return;
      }
      if (!id.startsWith(vaadin_dev_server_settings_default.themeFolder)) {
        return;
      }
      for (const location of [themeResourceFolder, frontendFolder]) {
        const result = await this.resolve(path.resolve(location, id));
        if (result) {
          return result;
        }
      }
    },
    async transform(raw, id, options) {
      const [bareId, query] = id.split("?");
      if (!bareId?.startsWith(themeFolder) && !bareId?.startsWith(themeOptions.themeResourceFolder) || !bareId?.endsWith(".css")) {
        return;
      }
      const resourceThemeFolder = bareId.startsWith(themeFolder) ? themeFolder : themeOptions.themeResourceFolder;
      const [themeName] = bareId.substring(resourceThemeFolder.length + 1).split("/");
      return rewriteCssUrls(raw, path.dirname(bareId), path.resolve(resourceThemeFolder, themeName), console, opts);
    }
  };
}
function runWatchDog(watchDogPort, watchDogHost) {
  const client = net.Socket();
  client.setEncoding("utf8");
  client.on("error", function(err) {
    console.log("Watchdog connection error. Terminating vite process...", err);
    client.destroy();
    process.exit(0);
  });
  client.on("close", function() {
    client.destroy();
    runWatchDog(watchDogPort, watchDogHost);
  });
  client.connect(watchDogPort, watchDogHost || "localhost");
}
var allowedFrontendFolders = [frontendFolder, nodeModulesFolder];
function showRecompileReason() {
  return {
    name: "vaadin:why-you-compile",
    handleHotUpdate(context) {
      console.log("Recompiling because", context.file, "changed");
    }
  };
}
var DEV_MODE_START_REGEXP = /\/\*[\*!]\s+vaadin-dev-mode:start/;
var DEV_MODE_CODE_REGEXP = /\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i;
function preserveUsageStats() {
  return {
    name: "vaadin:preserve-usage-stats",
    transform(src, id) {
      if (id.includes("vaadin-usage-statistics")) {
        if (src.includes("vaadin-dev-mode:start")) {
          const newSrc = src.replace(DEV_MODE_START_REGEXP, "/*! vaadin-dev-mode:start");
          if (newSrc === src) {
            console.error("Comment replacement failed to change anything");
          } else if (!newSrc.match(DEV_MODE_CODE_REGEXP)) {
            console.error("New comment fails to match original regexp");
          } else {
            return { code: newSrc };
          }
        }
      }
      return { code: src };
    }
  };
}
var vaadinConfig = (env) => {
  const devMode = env.mode === "development";
  const productionMode = !devMode && !devBundle;
  if (devMode && process.env.watchDogPort) {
    runWatchDog(process.env.watchDogPort, process.env.watchDogHost);
  }
  return {
    root: frontendFolder,
    base: "",
    publicDir: false,
    resolve: {
      alias: {
        "@vaadin/flow-frontend": jarResourcesFolder,
        Frontend: frontendFolder
      },
      preserveSymlinks: true
    },
    define: {
      OFFLINE_PATH: vaadin_dev_server_settings_default.offlinePath,
      VITE_ENABLED: "true"
    },
    server: {
      host: "127.0.0.1",
      strictPort: true,
      fs: {
        allow: allowedFrontendFolders
      }
    },
    build: {
      minify: productionMode,
      outDir: buildOutputFolder,
      emptyOutDir: devBundle,
      assetsDir: "VAADIN/build",
      target: ["esnext", "safari15"],
      rollupOptions: {
        input: {
          indexhtml: projectIndexHtml,
          ...hasExportedWebComponents ? { webcomponenthtml: path.resolve(frontendFolder, "web-component.html") } : {}
        },
        onwarn: (warning, defaultHandler) => {
          const ignoreEvalWarning = [
            "generated/jar-resources/FlowClient.js",
            "generated/jar-resources/vaadin-spreadsheet/spreadsheet-export.js",
            "@vaadin/charts/src/helpers.js"
          ];
          if (warning.code === "EVAL" && warning.id && !!ignoreEvalWarning.find((id) => warning.id.endsWith(id))) {
            return;
          }
          defaultHandler(warning);
        }
      }
    },
    optimizeDeps: {
      entries: [
        // Pre-scan entrypoints in Vite to avoid reloading on first open
        "generated/vaadin.ts"
      ],
      exclude: [
        "@vaadin/router",
        "@vaadin/vaadin-license-checker",
        "@vaadin/vaadin-usage-statistics",
        "workbox-core",
        "workbox-precaching",
        "workbox-routing",
        "workbox-strategies"
      ]
    },
    plugins: [
      productionMode && brotli(),
      devMode && vaadinBundlesPlugin(),
      devMode && showRecompileReason(),
      vaadin_dev_server_settings_default.offlineEnabled && buildSWPlugin({ devMode }),
      !devMode && statsExtracterPlugin(),
      !productionMode && preserveUsageStats(),
      themePlugin({ devMode }),
      postcssLit({
        include: ["**/*.css", /.*\/.*\.css\?.*/],
        exclude: [
          `${themeFolder}/**/*.css`,
          new RegExp(`${themeFolder}/.*/.*\\.css\\?.*`),
          `${themeResourceFolder}/**/*.css`,
          new RegExp(`${themeResourceFolder}/.*/.*\\.css\\?.*`),
          new RegExp(".*/.*\\?html-proxy.*")
        ]
      }),
      // The React plugin provides fast refresh and debug source info
      reactPlugin({
        include: "**/*.tsx",
        babel: {
          // We need to use babel to provide the source information for it to be correct
          // (otherwise Babel will slightly rewrite the source file and esbuild generate source info for the modified file)
          presets: [["@babel/preset-react", { runtime: "automatic", development: !productionMode }]],
          // React writes the source location for where components are used, this writes for where they are defined
          plugins: [
            !productionMode && addFunctionComponentSourceLocationBabel()
          ].filter(Boolean)
        }
      }),
      {
        name: "vaadin:force-remove-html-middleware",
        configureServer(server) {
          return () => {
            server.middlewares.stack = server.middlewares.stack.filter((mw) => {
              const handleName = `${mw.handle}`;
              return !handleName.includes("viteHtmlFallbackMiddleware");
            });
          };
        }
      },
      hasExportedWebComponents && {
        name: "vaadin:inject-entrypoints-to-web-component-html",
        transformIndexHtml: {
          order: "pre",
          handler(_html, { path: path2, server }) {
            if (path2 !== "/web-component.html") {
              return;
            }
            return [
              {
                tag: "script",
                attrs: { type: "module", src: `/generated/vaadin-web-component.ts` },
                injectTo: "head"
              }
            ];
          }
        }
      },
      {
        name: "vaadin:inject-entrypoints-to-index-html",
        transformIndexHtml: {
          order: "pre",
          handler(_html, { path: path2, server }) {
            if (path2 !== "/index.html") {
              return;
            }
            const scripts = [];
            if (devMode) {
              scripts.push({
                tag: "script",
                attrs: { type: "module", src: `/generated/vite-devmode.ts`, onerror: "document.location.reload()" },
                injectTo: "head"
              });
            }
            scripts.push({
              tag: "script",
              attrs: { type: "module", src: "/generated/vaadin.ts" },
              injectTo: "head"
            });
            return scripts;
          }
        }
      },
      checker({
        typescript: true
      }),
      productionMode && visualizer({ brotliSize: true, filename: bundleSizeFile })
    ]
  };
};
var overrideVaadinConfig = (customConfig2) => {
  return defineConfig((env) => mergeConfig(vaadinConfig(env), customConfig2(env)));
};
function getVersion(module) {
  const packageJson = path.resolve(nodeModulesFolder, module, "package.json");
  return JSON.parse(readFileSync4(packageJson, { encoding: "utf-8" })).version;
}
function getCvdlName(module) {
  const packageJson = path.resolve(nodeModulesFolder, module, "package.json");
  return JSON.parse(readFileSync4(packageJson, { encoding: "utf-8" })).cvdlName;
}

// vite.config.ts
var customConfig = (env) => ({
  // Here you can add custom Vite parameters
  // https://vitejs.dev/config/
});
var vite_config_default = overrideVaadinConfig(customConfig);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5nZW5lcmF0ZWQudHMiLCAidGFyZ2V0L3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luL3RoZW1lLWhhbmRsZS5qcyIsICJ0YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtZ2VuZXJhdG9yLmpzIiwgInRhcmdldC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpbi90aGVtZS1jb3B5LmpzIiwgInRhcmdldC9wbHVnaW5zL3RoZW1lLWxvYWRlci90aGVtZS1sb2FkZXItdXRpbHMuanMiLCAidGFyZ2V0L3BsdWdpbnMvcmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi5qcyIsICJ0YXJnZXQvdmFhZGluLWRldi1zZXJ2ZXItc2V0dGluZ3MuanNvbiIsICJ0YXJnZXQvcGx1Z2lucy9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LWN1c3RvbS9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LmpzIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxndXN0YXZvXFxcXERlc2t0b3BcXFxccHJvZ3JhbWFzXFxcXEF1ZGlibGVcXFxcdml0ZS5nZW5lcmF0ZWQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2d1c3Rhdm8vRGVza3RvcC9wcm9ncmFtYXMvQXVkaWJsZS92aXRlLmdlbmVyYXRlZC50c1wiOy8qKlxuICogTk9USUNFOiB0aGlzIGlzIGFuIGF1dG8tZ2VuZXJhdGVkIGZpbGVcbiAqXG4gKiBUaGlzIGZpbGUgaGFzIGJlZW4gZ2VuZXJhdGVkIGJ5IHRoZSBgZmxvdzpwcmVwYXJlLWZyb250ZW5kYCBtYXZlbiBnb2FsLlxuICogVGhpcyBmaWxlIHdpbGwgYmUgb3ZlcndyaXR0ZW4gb24gZXZlcnkgcnVuLiBBbnkgY3VzdG9tIGNoYW5nZXMgc2hvdWxkIGJlIG1hZGUgdG8gdml0ZS5jb25maWcudHNcbiAqL1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBleGlzdHNTeW5jLCBta2RpclN5bmMsIHJlYWRkaXJTeW5jLCByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBjcmVhdGVIYXNoIH0gZnJvbSAnY3J5cHRvJztcbmltcG9ydCAqIGFzIG5ldCBmcm9tICduZXQnO1xuXG5pbXBvcnQgeyBwcm9jZXNzVGhlbWVSZXNvdXJjZXMgfSBmcm9tICcuL3RhcmdldC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpbi90aGVtZS1oYW5kbGUuanMnO1xuaW1wb3J0IHsgcmV3cml0ZUNzc1VybHMgfSBmcm9tICcuL3RhcmdldC9wbHVnaW5zL3RoZW1lLWxvYWRlci90aGVtZS1sb2FkZXItdXRpbHMuanMnO1xuaW1wb3J0IHsgYWRkRnVuY3Rpb25Db21wb25lbnRTb3VyY2VMb2NhdGlvbkJhYmVsIH0gZnJvbSAnLi90YXJnZXQvcGx1Z2lucy9yZWFjdC1mdW5jdGlvbi1sb2NhdGlvbi1wbHVnaW4vcmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luLmpzJztcbmltcG9ydCBzZXR0aW5ncyBmcm9tICcuL3RhcmdldC92YWFkaW4tZGV2LXNlcnZlci1zZXR0aW5ncy5qc29uJztcbmltcG9ydCB7XG4gIEFzc2V0SW5mbyxcbiAgQ2h1bmtJbmZvLFxuICBkZWZpbmVDb25maWcsXG4gIG1lcmdlQ29uZmlnLFxuICBPdXRwdXRPcHRpb25zLFxuICBQbHVnaW5PcHRpb24sXG4gIFJlc29sdmVkQ29uZmlnLFxuICBVc2VyQ29uZmlnRm5cbn0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBnZXRNYW5pZmVzdCB9IGZyb20gJ3dvcmtib3gtYnVpbGQnO1xuXG5pbXBvcnQgKiBhcyByb2xsdXAgZnJvbSAncm9sbHVwJztcbmltcG9ydCBicm90bGkgZnJvbSAncm9sbHVwLXBsdWdpbi1icm90bGknO1xuaW1wb3J0IHJlcGxhY2UgZnJvbSAnQHJvbGx1cC9wbHVnaW4tcmVwbGFjZSc7XG5pbXBvcnQgY2hlY2tlciBmcm9tICd2aXRlLXBsdWdpbi1jaGVja2VyJztcbmltcG9ydCBwb3N0Y3NzTGl0IGZyb20gJy4vdGFyZ2V0L3BsdWdpbnMvcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC1jdXN0b20vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC5qcyc7XG5cbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnO1xuXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcbmltcG9ydCByZWFjdFBsdWdpbiBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cblxuXG4vLyBNYWtlIGByZXF1aXJlYCBjb21wYXRpYmxlIHdpdGggRVMgbW9kdWxlc1xuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKTtcblxuY29uc3QgYXBwU2hlbGxVcmwgPSAnLic7XG5cbmNvbnN0IGZyb250ZW5kRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuZnJvbnRlbmRGb2xkZXIpO1xuY29uc3QgdGhlbWVGb2xkZXIgPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIHNldHRpbmdzLnRoZW1lRm9sZGVyKTtcbmNvbnN0IGZyb250ZW5kQnVuZGxlRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuZnJvbnRlbmRCdW5kbGVPdXRwdXQpO1xuY29uc3QgZGV2QnVuZGxlRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuZGV2QnVuZGxlT3V0cHV0KTtcbmNvbnN0IGRldkJ1bmRsZSA9ICEhcHJvY2Vzcy5lbnYuZGV2QnVuZGxlO1xuY29uc3QgamFyUmVzb3VyY2VzRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuamFyUmVzb3VyY2VzRm9sZGVyKTtcbmNvbnN0IHRoZW1lUmVzb3VyY2VGb2xkZXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBzZXR0aW5ncy50aGVtZVJlc291cmNlRm9sZGVyKTtcbmNvbnN0IHByb2plY3RQYWNrYWdlSnNvbkZpbGUgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncGFja2FnZS5qc29uJyk7XG5cbmNvbnN0IGJ1aWxkT3V0cHV0Rm9sZGVyID0gZGV2QnVuZGxlID8gZGV2QnVuZGxlRm9sZGVyIDogZnJvbnRlbmRCdW5kbGVGb2xkZXI7XG5jb25zdCBzdGF0c0ZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGRldkJ1bmRsZSA/IHNldHRpbmdzLmRldkJ1bmRsZVN0YXRzT3V0cHV0IDogc2V0dGluZ3Muc3RhdHNPdXRwdXQpO1xuY29uc3Qgc3RhdHNGaWxlID0gcGF0aC5yZXNvbHZlKHN0YXRzRm9sZGVyLCAnc3RhdHMuanNvbicpO1xuY29uc3QgYnVuZGxlU2l6ZUZpbGUgPSBwYXRoLnJlc29sdmUoc3RhdHNGb2xkZXIsICdidW5kbGUtc2l6ZS5odG1sJyk7XG5jb25zdCBub2RlTW9kdWxlc0ZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMnKTtcbmNvbnN0IHdlYkNvbXBvbmVudFRhZ3MgPSAnJztcblxuY29uc3QgcHJvamVjdEluZGV4SHRtbCA9IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ2luZGV4Lmh0bWwnKTtcblxuY29uc3QgcHJvamVjdFN0YXRpY0Fzc2V0c0ZvbGRlcnMgPSBbXG4gIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCAnbWFpbicsICdyZXNvdXJjZXMnLCAnTUVUQS1JTkYnLCAncmVzb3VyY2VzJyksXG4gIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCAnbWFpbicsICdyZXNvdXJjZXMnLCAnc3RhdGljJyksXG4gIGZyb250ZW5kRm9sZGVyXG5dO1xuXG4vLyBGb2xkZXJzIGluIHRoZSBwcm9qZWN0IHdoaWNoIGNhbiBjb250YWluIGFwcGxpY2F0aW9uIHRoZW1lc1xuY29uc3QgdGhlbWVQcm9qZWN0Rm9sZGVycyA9IHByb2plY3RTdGF0aWNBc3NldHNGb2xkZXJzLm1hcCgoZm9sZGVyKSA9PiBwYXRoLnJlc29sdmUoZm9sZGVyLCBzZXR0aW5ncy50aGVtZUZvbGRlcikpO1xuXG5jb25zdCB0aGVtZU9wdGlvbnMgPSB7XG4gIGRldk1vZGU6IGZhbHNlLFxuICB1c2VEZXZCdW5kbGU6IGRldkJ1bmRsZSxcbiAgLy8gVGhlIGZvbGxvd2luZyBtYXRjaGVzIGZvbGRlciAnZnJvbnRlbmQvZ2VuZXJhdGVkL3RoZW1lcy8nXG4gIC8vIChub3QgJ2Zyb250ZW5kL3RoZW1lcycpIGZvciB0aGVtZSBpbiBKQVIgdGhhdCBpcyBjb3BpZWQgdGhlcmVcbiAgdGhlbWVSZXNvdXJjZUZvbGRlcjogcGF0aC5yZXNvbHZlKHRoZW1lUmVzb3VyY2VGb2xkZXIsIHNldHRpbmdzLnRoZW1lRm9sZGVyKSxcbiAgdGhlbWVQcm9qZWN0Rm9sZGVyczogdGhlbWVQcm9qZWN0Rm9sZGVycyxcbiAgcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlcjogZGV2QnVuZGxlXG4gICAgPyBwYXRoLnJlc29sdmUoZGV2QnVuZGxlRm9sZGVyLCAnLi4vYXNzZXRzJylcbiAgICA6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLnN0YXRpY091dHB1dCksXG4gIGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyOiBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIHNldHRpbmdzLmdlbmVyYXRlZEZvbGRlcilcbn07XG5cbmNvbnN0IGhhc0V4cG9ydGVkV2ViQ29tcG9uZW50cyA9IGV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCAnd2ViLWNvbXBvbmVudC5odG1sJykpO1xuXG4vLyBCbG9jayBkZWJ1ZyBhbmQgdHJhY2UgbG9ncy5cbmNvbnNvbGUudHJhY2UgPSAoKSA9PiB7fTtcbmNvbnNvbGUuZGVidWcgPSAoKSA9PiB7fTtcblxuZnVuY3Rpb24gaW5qZWN0TWFuaWZlc3RUb1NXUGx1Z2luKCk6IHJvbGx1cC5QbHVnaW4ge1xuICBjb25zdCByZXdyaXRlTWFuaWZlc3RJbmRleEh0bWxVcmwgPSAobWFuaWZlc3QpID0+IHtcbiAgICBjb25zdCBpbmRleEVudHJ5ID0gbWFuaWZlc3QuZmluZCgoZW50cnkpID0+IGVudHJ5LnVybCA9PT0gJ2luZGV4Lmh0bWwnKTtcbiAgICBpZiAoaW5kZXhFbnRyeSkge1xuICAgICAgaW5kZXhFbnRyeS51cmwgPSBhcHBTaGVsbFVybDtcbiAgICB9XG5cbiAgICByZXR1cm4geyBtYW5pZmVzdCwgd2FybmluZ3M6IFtdIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOmluamVjdC1tYW5pZmVzdC10by1zdycsXG4gICAgYXN5bmMgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XG4gICAgICBpZiAoL3N3XFwuKHRzfGpzKSQvLnRlc3QoaWQpKSB7XG4gICAgICAgIGNvbnN0IHsgbWFuaWZlc3RFbnRyaWVzIH0gPSBhd2FpdCBnZXRNYW5pZmVzdCh7XG4gICAgICAgICAgZ2xvYkRpcmVjdG9yeTogYnVpbGRPdXRwdXRGb2xkZXIsXG4gICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyonXSxcbiAgICAgICAgICBnbG9iSWdub3JlczogWycqKi8qLmJyJ10sXG4gICAgICAgICAgbWFuaWZlc3RUcmFuc2Zvcm1zOiBbcmV3cml0ZU1hbmlmZXN0SW5kZXhIdG1sVXJsXSxcbiAgICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMTAwICogMTAyNCAqIDEwMjQgLy8gMTAwbWIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2UoJ3NlbGYuX19XQl9NQU5JRkVTVCcsIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0RW50cmllcykpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRTV1BsdWdpbihvcHRzKTogUGx1Z2luT3B0aW9uIHtcbiAgbGV0IGNvbmZpZzogUmVzb2x2ZWRDb25maWc7XG4gIGNvbnN0IGRldk1vZGUgPSBvcHRzLmRldk1vZGU7XG5cbiAgY29uc3Qgc3dPYmogPSB7fTtcblxuICBhc3luYyBmdW5jdGlvbiBidWlsZChhY3Rpb246ICdnZW5lcmF0ZScgfCAnd3JpdGUnLCBhZGRpdGlvbmFsUGx1Z2luczogcm9sbHVwLlBsdWdpbltdID0gW10pIHtcbiAgICBjb25zdCBpbmNsdWRlZFBsdWdpbk5hbWVzID0gW1xuICAgICAgJ3ZpdGU6ZXNidWlsZCcsXG4gICAgICAncm9sbHVwLXBsdWdpbi1keW5hbWljLWltcG9ydC12YXJpYWJsZXMnLFxuICAgICAgJ3ZpdGU6ZXNidWlsZC10cmFuc3BpbGUnLFxuICAgICAgJ3ZpdGU6dGVyc2VyJ1xuICAgIF07XG4gICAgY29uc3QgcGx1Z2luczogcm9sbHVwLlBsdWdpbltdID0gY29uZmlnLnBsdWdpbnMuZmlsdGVyKChwKSA9PiB7XG4gICAgICByZXR1cm4gaW5jbHVkZWRQbHVnaW5OYW1lcy5pbmNsdWRlcyhwLm5hbWUpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJlc29sdmVyID0gY29uZmlnLmNyZWF0ZVJlc29sdmVyKCk7XG4gICAgY29uc3QgcmVzb2x2ZVBsdWdpbjogcm9sbHVwLlBsdWdpbiA9IHtcbiAgICAgIG5hbWU6ICdyZXNvbHZlcicsXG4gICAgICByZXNvbHZlSWQoc291cmNlLCBpbXBvcnRlciwgX29wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVyKHNvdXJjZSwgaW1wb3J0ZXIpO1xuICAgICAgfVxuICAgIH07XG4gICAgcGx1Z2lucy51bnNoaWZ0KHJlc29sdmVQbHVnaW4pOyAvLyBQdXQgcmVzb2x2ZSBmaXJzdFxuICAgIHBsdWdpbnMucHVzaChcbiAgICAgIHJlcGxhY2Uoe1xuICAgICAgICB2YWx1ZXM6IHtcbiAgICAgICAgICAncHJvY2Vzcy5lbnYuTk9ERV9FTlYnOiBKU09OLnN0cmluZ2lmeShjb25maWcubW9kZSksXG4gICAgICAgICAgLi4uY29uZmlnLmRlZmluZVxuICAgICAgICB9LFxuICAgICAgICBwcmV2ZW50QXNzaWdubWVudDogdHJ1ZVxuICAgICAgfSlcbiAgICApO1xuICAgIGlmIChhZGRpdGlvbmFsUGx1Z2lucykge1xuICAgICAgcGx1Z2lucy5wdXNoKC4uLmFkZGl0aW9uYWxQbHVnaW5zKTtcbiAgICB9XG4gICAgY29uc3QgYnVuZGxlID0gYXdhaXQgcm9sbHVwLnJvbGx1cCh7XG4gICAgICBpbnB1dDogcGF0aC5yZXNvbHZlKHNldHRpbmdzLmNsaWVudFNlcnZpY2VXb3JrZXJTb3VyY2UpLFxuICAgICAgcGx1Z2luc1xuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBidW5kbGVbYWN0aW9uXSh7XG4gICAgICAgIGZpbGU6IHBhdGgucmVzb2x2ZShidWlsZE91dHB1dEZvbGRlciwgJ3N3LmpzJyksXG4gICAgICAgIGZvcm1hdDogJ2VzJyxcbiAgICAgICAgZXhwb3J0czogJ25vbmUnLFxuICAgICAgICBzb3VyY2VtYXA6IGNvbmZpZy5jb21tYW5kID09PSAnc2VydmUnIHx8IGNvbmZpZy5idWlsZC5zb3VyY2VtYXAsXG4gICAgICAgIGlubGluZUR5bmFtaWNJbXBvcnRzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYXdhaXQgYnVuZGxlLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOmJ1aWxkLXN3JyxcbiAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgYXN5bmMgY29uZmlnUmVzb2x2ZWQocmVzb2x2ZWRDb25maWcpIHtcbiAgICAgIGNvbmZpZyA9IHJlc29sdmVkQ29uZmlnO1xuICAgIH0sXG4gICAgYXN5bmMgYnVpbGRTdGFydCgpIHtcbiAgICAgIGlmIChkZXZNb2RlKSB7XG4gICAgICAgIGNvbnN0IHsgb3V0cHV0IH0gPSBhd2FpdCBidWlsZCgnZ2VuZXJhdGUnKTtcbiAgICAgICAgc3dPYmouY29kZSA9IG91dHB1dFswXS5jb2RlO1xuICAgICAgICBzd09iai5tYXAgPSBvdXRwdXRbMF0ubWFwO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgbG9hZChpZCkge1xuICAgICAgaWYgKGlkLmVuZHNXaXRoKCdzdy5qcycpKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jIHRyYW5zZm9ybShfY29kZSwgaWQpIHtcbiAgICAgIGlmIChpZC5lbmRzV2l0aCgnc3cuanMnKSkge1xuICAgICAgICByZXR1cm4gc3dPYmo7XG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyBjbG9zZUJ1bmRsZSgpIHtcbiAgICAgIGlmICghZGV2TW9kZSkge1xuICAgICAgICBhd2FpdCBidWlsZCgnd3JpdGUnLCBbaW5qZWN0TWFuaWZlc3RUb1NXUGx1Z2luKCksIGJyb3RsaSgpXSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBzdGF0c0V4dHJhY3RlclBsdWdpbigpOiBQbHVnaW5PcHRpb24ge1xuICBmdW5jdGlvbiBjb2xsZWN0VGhlbWVKc29uc0luRnJvbnRlbmQodGhlbWVKc29uQ29udGVudHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sIHRoZW1lTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgdGhlbWVKc29uID0gcGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCBzZXR0aW5ncy50aGVtZUZvbGRlciwgdGhlbWVOYW1lLCAndGhlbWUuanNvbicpO1xuICAgIGlmIChleGlzdHNTeW5jKHRoZW1lSnNvbikpIHtcbiAgICAgIGNvbnN0IHRoZW1lSnNvbkNvbnRlbnQgPSByZWFkRmlsZVN5bmModGhlbWVKc29uLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pLnJlcGxhY2UoL1xcclxcbi9nLCAnXFxuJyk7XG4gICAgICB0aGVtZUpzb25Db250ZW50c1t0aGVtZU5hbWVdID0gdGhlbWVKc29uQ29udGVudDtcbiAgICAgIGNvbnN0IHRoZW1lSnNvbk9iamVjdCA9IEpTT04ucGFyc2UodGhlbWVKc29uQ29udGVudCk7XG4gICAgICBpZiAodGhlbWVKc29uT2JqZWN0LnBhcmVudCkge1xuICAgICAgICBjb2xsZWN0VGhlbWVKc29uc0luRnJvbnRlbmQodGhlbWVKc29uQ29udGVudHMsIHRoZW1lSnNvbk9iamVjdC5wYXJlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjpzdGF0cycsXG4gICAgZW5mb3JjZTogJ3Bvc3QnLFxuICAgIGFzeW5jIHdyaXRlQnVuZGxlKG9wdGlvbnM6IE91dHB1dE9wdGlvbnMsIGJ1bmRsZTogeyBbZmlsZU5hbWU6IHN0cmluZ106IEFzc2V0SW5mbyB8IENodW5rSW5mbyB9KSB7XG4gICAgICBjb25zdCBtb2R1bGVzID0gT2JqZWN0LnZhbHVlcyhidW5kbGUpLmZsYXRNYXAoKGIpID0+IChiLm1vZHVsZXMgPyBPYmplY3Qua2V5cyhiLm1vZHVsZXMpIDogW10pKTtcbiAgICAgIGNvbnN0IG5vZGVNb2R1bGVzRm9sZGVycyA9IG1vZHVsZXNcbiAgICAgICAgLm1hcCgoaWQpID0+IGlkLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgLmZpbHRlcigoaWQpID0+IGlkLnN0YXJ0c1dpdGgobm9kZU1vZHVsZXNGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpKSlcbiAgICAgICAgLm1hcCgoaWQpID0+IGlkLnN1YnN0cmluZyhub2RlTW9kdWxlc0ZvbGRlci5sZW5ndGggKyAxKSk7XG4gICAgICBjb25zdCBucG1Nb2R1bGVzID0gbm9kZU1vZHVsZXNGb2xkZXJzXG4gICAgICAgIC5tYXAoKGlkKSA9PiBpZC5yZXBsYWNlKC9cXFxcL2csICcvJykpXG4gICAgICAgIC5tYXAoKGlkKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGFydHMgPSBpZC5zcGxpdCgnLycpO1xuICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJ0c1swXSArICcvJyArIHBhcnRzWzFdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGFydHNbMF07XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc29ydCgpXG4gICAgICAgIC5maWx0ZXIoKHZhbHVlLCBpbmRleCwgc2VsZikgPT4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXgpO1xuICAgICAgY29uc3QgbnBtTW9kdWxlQW5kVmVyc2lvbiA9IE9iamVjdC5mcm9tRW50cmllcyhucG1Nb2R1bGVzLm1hcCgobW9kdWxlKSA9PiBbbW9kdWxlLCBnZXRWZXJzaW9uKG1vZHVsZSldKSk7XG4gICAgICBjb25zdCBjdmRscyA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgbnBtTW9kdWxlc1xuICAgICAgICAgIC5maWx0ZXIoKG1vZHVsZSkgPT4gZ2V0Q3ZkbE5hbWUobW9kdWxlKSAhPSBudWxsKVxuICAgICAgICAgIC5tYXAoKG1vZHVsZSkgPT4gW21vZHVsZSwgeyBuYW1lOiBnZXRDdmRsTmFtZShtb2R1bGUpLCB2ZXJzaW9uOiBnZXRWZXJzaW9uKG1vZHVsZSkgfV0pXG4gICAgICApO1xuXG4gICAgICBta2RpclN5bmMocGF0aC5kaXJuYW1lKHN0YXRzRmlsZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgY29uc3QgcHJvamVjdFBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocHJvamVjdFBhY2thZ2VKc29uRmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSk7XG5cbiAgICAgIGNvbnN0IGVudHJ5U2NyaXB0cyA9IE9iamVjdC52YWx1ZXMoYnVuZGxlKVxuICAgICAgICAuZmlsdGVyKChidW5kbGUpID0+IGJ1bmRsZS5pc0VudHJ5KVxuICAgICAgICAubWFwKChidW5kbGUpID0+IGJ1bmRsZS5maWxlTmFtZSk7XG5cbiAgICAgIGNvbnN0IGdlbmVyYXRlZEluZGV4SHRtbCA9IHBhdGgucmVzb2x2ZShidWlsZE91dHB1dEZvbGRlciwgJ2luZGV4Lmh0bWwnKTtcbiAgICAgIGNvbnN0IGN1c3RvbUluZGV4RGF0YTogc3RyaW5nID0gcmVhZEZpbGVTeW5jKHByb2plY3RJbmRleEh0bWwsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRJbmRleERhdGE6IHN0cmluZyA9IHJlYWRGaWxlU3luYyhnZW5lcmF0ZWRJbmRleEh0bWwsIHtcbiAgICAgICAgZW5jb2Rpbmc6ICd1dGYtOCdcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjdXN0b21JbmRleFJvd3MgPSBuZXcgU2V0KGN1c3RvbUluZGV4RGF0YS5zcGxpdCgvW1xcclxcbl0vKS5maWx0ZXIoKHJvdykgPT4gcm93LnRyaW0oKSAhPT0gJycpKTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZEluZGV4Um93cyA9IGdlbmVyYXRlZEluZGV4RGF0YS5zcGxpdCgvW1xcclxcbl0vKS5maWx0ZXIoKHJvdykgPT4gcm93LnRyaW0oKSAhPT0gJycpO1xuXG4gICAgICBjb25zdCByb3dzR2VuZXJhdGVkOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgZ2VuZXJhdGVkSW5kZXhSb3dzLmZvckVhY2goKHJvdykgPT4ge1xuICAgICAgICBpZiAoIWN1c3RvbUluZGV4Um93cy5oYXMocm93KSkge1xuICAgICAgICAgIHJvd3NHZW5lcmF0ZWQucHVzaChyb3cpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy9BZnRlciBkZXYtYnVuZGxlIGJ1aWxkIGFkZCB1c2VkIEZsb3cgZnJvbnRlbmQgaW1wb3J0cyBKc01vZHVsZS9KYXZhU2NyaXB0L0Nzc0ltcG9ydFxuXG4gICAgICBjb25zdCBwYXJzZUltcG9ydHMgPSAoZmlsZW5hbWU6IHN0cmluZywgcmVzdWx0OiBTZXQ8c3RyaW5nPik6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBjb250ZW50OiBzdHJpbmcgPSByZWFkRmlsZVN5bmMoZmlsZW5hbWUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGNvbnN0IHN0YXRpY0ltcG9ydHMgPSBsaW5lc1xuICAgICAgICAgIC5maWx0ZXIoKGxpbmUpID0+IGxpbmUuc3RhcnRzV2l0aCgnaW1wb3J0ICcpKVxuICAgICAgICAgIC5tYXAoKGxpbmUpID0+IGxpbmUuc3Vic3RyaW5nKGxpbmUuaW5kZXhPZihcIidcIikgKyAxLCBsaW5lLmxhc3RJbmRleE9mKFwiJ1wiKSkpXG4gICAgICAgICAgLm1hcCgobGluZSkgPT4gKGxpbmUuaW5jbHVkZXMoJz8nKSA/IGxpbmUuc3Vic3RyaW5nKDAsIGxpbmUubGFzdEluZGV4T2YoJz8nKSkgOiBsaW5lKSk7XG4gICAgICAgIGNvbnN0IGR5bmFtaWNJbXBvcnRzID0gbGluZXNcbiAgICAgICAgICAuZmlsdGVyKChsaW5lKSA9PiBsaW5lLmluY2x1ZGVzKCdpbXBvcnQoJykpXG4gICAgICAgICAgLm1hcCgobGluZSkgPT4gbGluZS5yZXBsYWNlKC8uKmltcG9ydFxcKC8sICcnKSlcbiAgICAgICAgICAubWFwKChsaW5lKSA9PiBsaW5lLnNwbGl0KC8nLylbMV0pXG4gICAgICAgICAgLm1hcCgobGluZSkgPT4gKGxpbmUuaW5jbHVkZXMoJz8nKSA/IGxpbmUuc3Vic3RyaW5nKDAsIGxpbmUubGFzdEluZGV4T2YoJz8nKSkgOiBsaW5lKSk7XG5cbiAgICAgICAgc3RhdGljSW1wb3J0cy5mb3JFYWNoKChzdGF0aWNJbXBvcnQpID0+IHJlc3VsdC5hZGQoc3RhdGljSW1wb3J0KSk7XG5cbiAgICAgICAgZHluYW1pY0ltcG9ydHMubWFwKChkeW5hbWljSW1wb3J0KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW1wb3J0ZWRGaWxlID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShmaWxlbmFtZSksIGR5bmFtaWNJbXBvcnQpO1xuICAgICAgICAgIHBhcnNlSW1wb3J0cyhpbXBvcnRlZEZpbGUsIHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2VuZXJhdGVkSW1wb3J0c1NldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgcGFyc2VJbXBvcnRzKFxuICAgICAgICBwYXRoLnJlc29sdmUodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCAnZmxvdycsICdnZW5lcmF0ZWQtZmxvdy1pbXBvcnRzLmpzJyksXG4gICAgICAgIGdlbmVyYXRlZEltcG9ydHNTZXRcbiAgICAgICk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRJbXBvcnRzID0gQXJyYXkuZnJvbShnZW5lcmF0ZWRJbXBvcnRzU2V0KS5zb3J0KCk7XG5cbiAgICAgIGNvbnN0IGZyb250ZW5kRmlsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblxuICAgICAgY29uc3QgcHJvamVjdEZpbGVFeHRlbnNpb25zID0gWycuanMnLCAnLmpzLm1hcCcsICcudHMnLCAnLnRzLm1hcCcsICcudHN4JywgJy50c3gubWFwJywgJy5jc3MnLCAnLmNzcy5tYXAnXTtcblxuICAgICAgY29uc3QgaXNUaGVtZUNvbXBvbmVudHNSZXNvdXJjZSA9IChpZDogc3RyaW5nKSA9PlxuICAgICAgICAgIGlkLnN0YXJ0c1dpdGgodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgICAgICAgJiYgaWQubWF0Y2goLy4qXFwvamFyLXJlc291cmNlc1xcL3RoZW1lc1xcL1teXFwvXStcXC9jb21wb25lbnRzXFwvLyk7XG5cbiAgICAgIGNvbnN0IGlzR2VuZXJhdGVkV2ViQ29tcG9uZW50UmVzb3VyY2UgPSAoaWQ6IHN0cmluZykgPT5cbiAgICAgICAgICBpZC5zdGFydHNXaXRoKHRoZW1lT3B0aW9ucy5mcm9udGVuZEdlbmVyYXRlZEZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJykpXG4gICAgICAgICAgICAgICYmIGlkLm1hdGNoKC8uKlxcL2Zsb3dcXC93ZWItY29tcG9uZW50c1xcLy8pO1xuXG4gICAgICBjb25zdCBpc0Zyb250ZW5kUmVzb3VyY2VDb2xsZWN0ZWQgPSAoaWQ6IHN0cmluZykgPT5cbiAgICAgICAgICAhaWQuc3RhcnRzV2l0aCh0aGVtZU9wdGlvbnMuZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAgIHx8IGlzVGhlbWVDb21wb25lbnRzUmVzb3VyY2UoaWQpXG4gICAgICAgICAgfHwgaXNHZW5lcmF0ZWRXZWJDb21wb25lbnRSZXNvdXJjZShpZCk7XG5cbiAgICAgIC8vIGNvbGxlY3RzIHByb2plY3QncyBmcm9udGVuZCByZXNvdXJjZXMgaW4gZnJvbnRlbmQgZm9sZGVyLCBleGNsdWRpbmdcbiAgICAgIC8vICdnZW5lcmF0ZWQnIHN1Yi1mb2xkZXIsIGV4Y2VwdCBmb3IgbGVnYWN5IHNoYWRvdyBET00gc3R5bGVzaGVldHNcbiAgICAgIC8vIHBhY2thZ2VkIGluIGB0aGVtZS9jb21wb25lbnRzL2AgZm9sZGVyXG4gICAgICAvLyBhbmQgZ2VuZXJhdGVkIHdlYiBjb21wb25lbnQgcmVzb3VyY2VzIGluIGBmbG93L3dlYi1jb21wb25lbnRzYCBmb2xkZXIuXG4gICAgICBtb2R1bGVzXG4gICAgICAgIC5tYXAoKGlkKSA9PiBpZC5yZXBsYWNlKC9cXFxcL2csICcvJykpXG4gICAgICAgIC5maWx0ZXIoKGlkKSA9PiBpZC5zdGFydHNXaXRoKGZyb250ZW5kRm9sZGVyLnJlcGxhY2UoL1xcXFwvZywgJy8nKSkpXG4gICAgICAgIC5maWx0ZXIoaXNGcm9udGVuZFJlc291cmNlQ29sbGVjdGVkKVxuICAgICAgICAubWFwKChpZCkgPT4gaWQuc3Vic3RyaW5nKGZyb250ZW5kRm9sZGVyLmxlbmd0aCArIDEpKVxuICAgICAgICAubWFwKChsaW5lOiBzdHJpbmcpID0+IChsaW5lLmluY2x1ZGVzKCc/JykgPyBsaW5lLnN1YnN0cmluZygwLCBsaW5lLmxhc3RJbmRleE9mKCc/JykpIDogbGluZSkpXG4gICAgICAgIC5mb3JFYWNoKChsaW5lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAvLyBcXHJcXG4gZnJvbSB3aW5kb3dzIG1hZGUgZmlsZXMgbWF5IGJlIHVzZWQgc28gY2hhbmdlIHRvIFxcblxuICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCBsaW5lKTtcbiAgICAgICAgICBpZiAocHJvamVjdEZpbGVFeHRlbnNpb25zLmluY2x1ZGVzKHBhdGguZXh0bmFtZShmaWxlUGF0aCkpKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxlQnVmZmVyID0gcmVhZEZpbGVTeW5jKGZpbGVQYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pLnJlcGxhY2UoL1xcclxcbi9nLCAnXFxuJyk7XG4gICAgICAgICAgICBmcm9udGVuZEZpbGVzW2xpbmVdID0gY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKGZpbGVCdWZmZXIsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAvLyBjb2xsZWN0cyBmcm9udGVuZCByZXNvdXJjZXMgZnJvbSB0aGUgSkFSc1xuICAgICAgZ2VuZXJhdGVkSW1wb3J0c1xuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+IGxpbmUuaW5jbHVkZXMoJ2dlbmVyYXRlZC9qYXItcmVzb3VyY2VzJykpXG4gICAgICAgIC5mb3JFYWNoKChsaW5lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBsZXQgZmlsZW5hbWUgPSBsaW5lLnN1YnN0cmluZyhsaW5lLmluZGV4T2YoJ2dlbmVyYXRlZCcpKTtcbiAgICAgICAgICAvLyBcXHJcXG4gZnJvbSB3aW5kb3dzIG1hZGUgZmlsZXMgbWF5IGJlIHVzZWQgcm8gcmVtb3ZlIHRvIGJlIG9ubHkgXFxuXG4gICAgICAgICAgY29uc3QgZmlsZUJ1ZmZlciA9IHJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIGZpbGVuYW1lKSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KS5yZXBsYWNlKFxuICAgICAgICAgICAgL1xcclxcbi9nLFxuICAgICAgICAgICAgJ1xcbidcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbnN0IGhhc2ggPSBjcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoZmlsZUJ1ZmZlciwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xuXG4gICAgICAgICAgY29uc3QgZmlsZUtleSA9IGxpbmUuc3Vic3RyaW5nKGxpbmUuaW5kZXhPZignamFyLXJlc291cmNlcy8nKSArIDE0KTtcbiAgICAgICAgICBmcm9udGVuZEZpbGVzW2ZpbGVLZXldID0gaGFzaDtcbiAgICAgICAgfSk7XG4gICAgICAvLyBjb2xsZWN0cyBhbmQgaGFzaCByZXN0IG9mIHRoZSBGcm9udGVuZCByZXNvdXJjZXMgZXhjbHVkaW5nIGZpbGVzIGluIC9nZW5lcmF0ZWQvIGFuZCAvdGhlbWVzL1xuICAgICAgLy8gYW5kIGZpbGVzIGFscmVhZHkgaW4gZnJvbnRlbmRGaWxlcy5cbiAgICAgIGxldCBmcm9udGVuZEZvbGRlckFsaWFzID0gXCJGcm9udGVuZFwiO1xuICAgICAgZ2VuZXJhdGVkSW1wb3J0c1xuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+IGxpbmUuc3RhcnRzV2l0aChmcm9udGVuZEZvbGRlckFsaWFzICsgJy8nKSlcbiAgICAgICAgLmZpbHRlcigobGluZTogc3RyaW5nKSA9PiAhbGluZS5zdGFydHNXaXRoKGZyb250ZW5kRm9sZGVyQWxpYXMgKyAnL2dlbmVyYXRlZC8nKSlcbiAgICAgICAgLmZpbHRlcigobGluZTogc3RyaW5nKSA9PiAhbGluZS5zdGFydHNXaXRoKGZyb250ZW5kRm9sZGVyQWxpYXMgKyAnL3RoZW1lcy8nKSlcbiAgICAgICAgLm1hcCgobGluZSkgPT4gbGluZS5zdWJzdHJpbmcoZnJvbnRlbmRGb2xkZXJBbGlhcy5sZW5ndGggKyAxKSlcbiAgICAgICAgLmZpbHRlcigobGluZTogc3RyaW5nKSA9PiAhZnJvbnRlbmRGaWxlc1tsaW5lXSlcbiAgICAgICAgLmZvckVhY2goKGxpbmU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCBsaW5lKTtcbiAgICAgICAgICBpZiAocHJvamVjdEZpbGVFeHRlbnNpb25zLmluY2x1ZGVzKHBhdGguZXh0bmFtZShmaWxlUGF0aCkpICYmIGV4aXN0c1N5bmMoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxlQnVmZmVyID0gcmVhZEZpbGVTeW5jKGZpbGVQYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pLnJlcGxhY2UoL1xcclxcbi9nLCAnXFxuJyk7XG4gICAgICAgICAgICBmcm9udGVuZEZpbGVzW2xpbmVdID0gY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKGZpbGVCdWZmZXIsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgLy8gSWYgYSBpbmRleC50cyBleGlzdHMgaGFzaCBpdCB0byBiZSBhYmxlIHRvIHNlZSBpZiBpdCBjaGFuZ2VzLlxuICAgICAgaWYgKGV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCAnaW5kZXgudHMnKSkpIHtcbiAgICAgICAgY29uc3QgZmlsZUJ1ZmZlciA9IHJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsICdpbmRleC50cycpLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pLnJlcGxhY2UoXG4gICAgICAgICAgL1xcclxcbi9nLFxuICAgICAgICAgICdcXG4nXG4gICAgICAgICk7XG4gICAgICAgIGZyb250ZW5kRmlsZXNbYGluZGV4LnRzYF0gPSBjcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoZmlsZUJ1ZmZlciwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0aGVtZUpzb25Db250ZW50czogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgICAgY29uc3QgdGhlbWVzRm9sZGVyID0gcGF0aC5yZXNvbHZlKGphclJlc291cmNlc0ZvbGRlciwgJ3RoZW1lcycpO1xuICAgICAgaWYgKGV4aXN0c1N5bmModGhlbWVzRm9sZGVyKSkge1xuICAgICAgICByZWFkZGlyU3luYyh0aGVtZXNGb2xkZXIpLmZvckVhY2goKHRoZW1lRm9sZGVyKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGhlbWVKc29uID0gcGF0aC5yZXNvbHZlKHRoZW1lc0ZvbGRlciwgdGhlbWVGb2xkZXIsICd0aGVtZS5qc29uJyk7XG4gICAgICAgICAgaWYgKGV4aXN0c1N5bmModGhlbWVKc29uKSkge1xuICAgICAgICAgICAgdGhlbWVKc29uQ29udGVudHNbcGF0aC5iYXNlbmFtZSh0aGVtZUZvbGRlcildID0gcmVhZEZpbGVTeW5jKHRoZW1lSnNvbiwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KS5yZXBsYWNlKFxuICAgICAgICAgICAgICAvXFxyXFxuL2csXG4gICAgICAgICAgICAgICdcXG4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbGxlY3RUaGVtZUpzb25zSW5Gcm9udGVuZCh0aGVtZUpzb25Db250ZW50cywgc2V0dGluZ3MudGhlbWVOYW1lKTtcblxuICAgICAgbGV0IHdlYkNvbXBvbmVudHM6IHN0cmluZ1tdID0gW107XG4gICAgICBpZiAod2ViQ29tcG9uZW50VGFncykge1xuICAgICAgICB3ZWJDb21wb25lbnRzID0gd2ViQ29tcG9uZW50VGFncy5zcGxpdCgnOycpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzdGF0cyA9IHtcbiAgICAgICAgcGFja2FnZUpzb25EZXBlbmRlbmNpZXM6IHByb2plY3RQYWNrYWdlSnNvbi5kZXBlbmRlbmNpZXMsXG4gICAgICAgIG5wbU1vZHVsZXM6IG5wbU1vZHVsZUFuZFZlcnNpb24sXG4gICAgICAgIGJ1bmRsZUltcG9ydHM6IGdlbmVyYXRlZEltcG9ydHMsXG4gICAgICAgIGZyb250ZW5kSGFzaGVzOiBmcm9udGVuZEZpbGVzLFxuICAgICAgICB0aGVtZUpzb25Db250ZW50czogdGhlbWVKc29uQ29udGVudHMsXG4gICAgICAgIGVudHJ5U2NyaXB0cyxcbiAgICAgICAgd2ViQ29tcG9uZW50cyxcbiAgICAgICAgY3ZkbE1vZHVsZXM6IGN2ZGxzLFxuICAgICAgICBwYWNrYWdlSnNvbkhhc2g6IHByb2plY3RQYWNrYWdlSnNvbj8udmFhZGluPy5oYXNoLFxuICAgICAgICBpbmRleEh0bWxHZW5lcmF0ZWQ6IHJvd3NHZW5lcmF0ZWRcbiAgICAgIH07XG4gICAgICB3cml0ZUZpbGVTeW5jKHN0YXRzRmlsZSwgSlNPTi5zdHJpbmdpZnkoc3RhdHMsIG51bGwsIDEpKTtcbiAgICB9XG4gIH07XG59XG5mdW5jdGlvbiB2YWFkaW5CdW5kbGVzUGx1Z2luKCk6IFBsdWdpbk9wdGlvbiB7XG4gIHR5cGUgRXhwb3J0SW5mbyA9XG4gICAgfCBzdHJpbmdcbiAgICB8IHtcbiAgICAgICAgbmFtZXNwYWNlPzogc3RyaW5nO1xuICAgICAgICBzb3VyY2U6IHN0cmluZztcbiAgICAgIH07XG5cbiAgdHlwZSBFeHBvc2VJbmZvID0ge1xuICAgIGV4cG9ydHM6IEV4cG9ydEluZm9bXTtcbiAgfTtcblxuICB0eXBlIFBhY2thZ2VJbmZvID0ge1xuICAgIHZlcnNpb246IHN0cmluZztcbiAgICBleHBvc2VzOiBSZWNvcmQ8c3RyaW5nLCBFeHBvc2VJbmZvPjtcbiAgfTtcblxuICB0eXBlIEJ1bmRsZUpzb24gPSB7XG4gICAgcGFja2FnZXM6IFJlY29yZDxzdHJpbmcsIFBhY2thZ2VJbmZvPjtcbiAgfTtcblxuICBjb25zdCBkaXNhYmxlZE1lc3NhZ2UgPSAnVmFhZGluIGNvbXBvbmVudCBkZXBlbmRlbmN5IGJ1bmRsZXMgYXJlIGRpc2FibGVkLic7XG5cbiAgY29uc3QgbW9kdWxlc0RpcmVjdG9yeSA9IG5vZGVNb2R1bGVzRm9sZGVyLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcblxuICBsZXQgdmFhZGluQnVuZGxlSnNvbjogQnVuZGxlSnNvbjtcblxuICBmdW5jdGlvbiBwYXJzZU1vZHVsZUlkKGlkOiBzdHJpbmcpOiB7IHBhY2thZ2VOYW1lOiBzdHJpbmc7IG1vZHVsZVBhdGg6IHN0cmluZyB9IHtcbiAgICBjb25zdCBbc2NvcGUsIHNjb3BlZFBhY2thZ2VOYW1lXSA9IGlkLnNwbGl0KCcvJywgMyk7XG4gICAgY29uc3QgcGFja2FnZU5hbWUgPSBzY29wZS5zdGFydHNXaXRoKCdAJykgPyBgJHtzY29wZX0vJHtzY29wZWRQYWNrYWdlTmFtZX1gIDogc2NvcGU7XG4gICAgY29uc3QgbW9kdWxlUGF0aCA9IGAuJHtpZC5zdWJzdHJpbmcocGFja2FnZU5hbWUubGVuZ3RoKX1gO1xuICAgIHJldHVybiB7XG4gICAgICBwYWNrYWdlTmFtZSxcbiAgICAgIG1vZHVsZVBhdGhcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RXhwb3J0cyhpZDogc3RyaW5nKTogc3RyaW5nW10gfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHsgcGFja2FnZU5hbWUsIG1vZHVsZVBhdGggfSA9IHBhcnNlTW9kdWxlSWQoaWQpO1xuICAgIGNvbnN0IHBhY2thZ2VJbmZvID0gdmFhZGluQnVuZGxlSnNvbi5wYWNrYWdlc1twYWNrYWdlTmFtZV07XG5cbiAgICBpZiAoIXBhY2thZ2VJbmZvKSByZXR1cm47XG5cbiAgICBjb25zdCBleHBvc2VJbmZvOiBFeHBvc2VJbmZvID0gcGFja2FnZUluZm8uZXhwb3Nlc1ttb2R1bGVQYXRoXTtcbiAgICBpZiAoIWV4cG9zZUluZm8pIHJldHVybjtcblxuICAgIGNvbnN0IGV4cG9ydHNTZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICBmb3IgKGNvbnN0IGUgb2YgZXhwb3NlSW5mby5leHBvcnRzKSB7XG4gICAgICBpZiAodHlwZW9mIGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGV4cG9ydHNTZXQuYWRkKGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgeyBuYW1lc3BhY2UsIHNvdXJjZSB9ID0gZTtcbiAgICAgICAgaWYgKG5hbWVzcGFjZSkge1xuICAgICAgICAgIGV4cG9ydHNTZXQuYWRkKG5hbWVzcGFjZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3Qgc291cmNlRXhwb3J0cyA9IGdldEV4cG9ydHMoc291cmNlKTtcbiAgICAgICAgICBpZiAoc291cmNlRXhwb3J0cykge1xuICAgICAgICAgICAgc291cmNlRXhwb3J0cy5mb3JFYWNoKChlKSA9PiBleHBvcnRzU2V0LmFkZChlKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5mcm9tKGV4cG9ydHNTZXQpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RXhwb3J0QmluZGluZyhiaW5kaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYmluZGluZyA9PT0gJ2RlZmF1bHQnID8gJ19kZWZhdWx0IGFzIGRlZmF1bHQnIDogYmluZGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEltcG9ydEFzc2lnbWVudChiaW5kaW5nOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gYmluZGluZyA9PT0gJ2RlZmF1bHQnID8gJ2RlZmF1bHQ6IF9kZWZhdWx0JyA6IGJpbmRpbmc7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2YWFkaW46YnVuZGxlcycsXG4gICAgZW5mb3JjZTogJ3ByZScsXG4gICAgYXBwbHkoY29uZmlnLCB7IGNvbW1hbmQgfSkge1xuICAgICAgaWYgKGNvbW1hbmQgIT09ICdzZXJ2ZScpIHJldHVybiBmYWxzZTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdmFhZGluQnVuZGxlSnNvblBhdGggPSByZXF1aXJlLnJlc29sdmUoJ0B2YWFkaW4vYnVuZGxlcy92YWFkaW4tYnVuZGxlLmpzb24nKTtcbiAgICAgICAgdmFhZGluQnVuZGxlSnNvbiA9IEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHZhYWRpbkJ1bmRsZUpzb25QYXRoLCB7IGVuY29kaW5nOiAndXRmOCcgfSkpO1xuICAgICAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgICAgICBpZiAodHlwZW9mIGUgPT09ICdvYmplY3QnICYmIChlIGFzIHsgY29kZTogc3RyaW5nIH0pLmNvZGUgPT09ICdNT0RVTEVfTk9UX0ZPVU5EJykge1xuICAgICAgICAgIHZhYWRpbkJ1bmRsZUpzb24gPSB7IHBhY2thZ2VzOiB7fSB9O1xuICAgICAgICAgIGNvbnNvbGUuaW5mbyhgQHZhYWRpbi9idW5kbGVzIG5wbSBwYWNrYWdlIGlzIG5vdCBmb3VuZCwgJHtkaXNhYmxlZE1lc3NhZ2V9YCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgdmVyc2lvbk1pc21hdGNoZXM6IEFycmF5PHsgbmFtZTogc3RyaW5nOyBidW5kbGVkVmVyc2lvbjogc3RyaW5nOyBpbnN0YWxsZWRWZXJzaW9uOiBzdHJpbmcgfT4gPSBbXTtcbiAgICAgIGZvciAoY29uc3QgW25hbWUsIHBhY2thZ2VJbmZvXSBvZiBPYmplY3QuZW50cmllcyh2YWFkaW5CdW5kbGVKc29uLnBhY2thZ2VzKSkge1xuICAgICAgICBsZXQgaW5zdGFsbGVkVmVyc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHsgdmVyc2lvbjogYnVuZGxlZFZlcnNpb24gfSA9IHBhY2thZ2VJbmZvO1xuICAgICAgICAgIGNvbnN0IGluc3RhbGxlZFBhY2thZ2VKc29uRmlsZSA9IHBhdGgucmVzb2x2ZShtb2R1bGVzRGlyZWN0b3J5LCBuYW1lLCAncGFja2FnZS5qc29uJyk7XG4gICAgICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhpbnN0YWxsZWRQYWNrYWdlSnNvbkZpbGUsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KSk7XG4gICAgICAgICAgaW5zdGFsbGVkVmVyc2lvbiA9IHBhY2thZ2VKc29uLnZlcnNpb247XG4gICAgICAgICAgaWYgKGluc3RhbGxlZFZlcnNpb24gJiYgaW5zdGFsbGVkVmVyc2lvbiAhPT0gYnVuZGxlZFZlcnNpb24pIHtcbiAgICAgICAgICAgIHZlcnNpb25NaXNtYXRjaGVzLnB1c2goe1xuICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICBidW5kbGVkVmVyc2lvbixcbiAgICAgICAgICAgICAgaW5zdGFsbGVkVmVyc2lvblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgLy8gaWdub3JlIHBhY2thZ2Ugbm90IGZvdW5kXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2ZXJzaW9uTWlzbWF0Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKGBAdmFhZGluL2J1bmRsZXMgaGFzIHZlcnNpb24gbWlzbWF0Y2hlcyB3aXRoIGluc3RhbGxlZCBwYWNrYWdlcywgJHtkaXNhYmxlZE1lc3NhZ2V9YCk7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgUGFja2FnZXMgd2l0aCB2ZXJzaW9uIG1pc21hdGNoZXM6ICR7SlNPTi5zdHJpbmdpZnkodmVyc2lvbk1pc21hdGNoZXMsIHVuZGVmaW5lZCwgMil9YCk7XG4gICAgICAgIHZhYWRpbkJ1bmRsZUpzb24gPSB7IHBhY2thZ2VzOiB7fSB9O1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgYXN5bmMgY29uZmlnKGNvbmZpZykge1xuICAgICAgcmV0dXJuIG1lcmdlQ29uZmlnKFxuICAgICAgICB7XG4gICAgICAgICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICAgICAgICBleGNsdWRlOiBbXG4gICAgICAgICAgICAgIC8vIFZhYWRpbiBidW5kbGVcbiAgICAgICAgICAgICAgJ0B2YWFkaW4vYnVuZGxlcycsXG4gICAgICAgICAgICAgIC4uLk9iamVjdC5rZXlzKHZhYWRpbkJ1bmRsZUpzb24ucGFja2FnZXMpLFxuICAgICAgICAgICAgICAnQHZhYWRpbi92YWFkaW4tbWF0ZXJpYWwtc3R5bGVzJ1xuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnXG4gICAgICApO1xuICAgIH0sXG4gICAgbG9hZChyYXdJZCkge1xuICAgICAgY29uc3QgW3BhdGgsIHBhcmFtc10gPSByYXdJZC5zcGxpdCgnPycpO1xuICAgICAgaWYgKCFwYXRoLnN0YXJ0c1dpdGgobW9kdWxlc0RpcmVjdG9yeSkpIHJldHVybjtcblxuICAgICAgY29uc3QgaWQgPSBwYXRoLnN1YnN0cmluZyhtb2R1bGVzRGlyZWN0b3J5Lmxlbmd0aCArIDEpO1xuICAgICAgY29uc3QgYmluZGluZ3MgPSBnZXRFeHBvcnRzKGlkKTtcbiAgICAgIGlmIChiaW5kaW5ncyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGNhY2hlU3VmZml4ID0gcGFyYW1zID8gYD8ke3BhcmFtc31gIDogJyc7XG4gICAgICBjb25zdCBidW5kbGVQYXRoID0gYEB2YWFkaW4vYnVuZGxlcy92YWFkaW4uanMke2NhY2hlU3VmZml4fWA7XG5cbiAgICAgIHJldHVybiBgaW1wb3J0IHsgaW5pdCBhcyBWYWFkaW5CdW5kbGVJbml0LCBnZXQgYXMgVmFhZGluQnVuZGxlR2V0IH0gZnJvbSAnJHtidW5kbGVQYXRofSc7XG5hd2FpdCBWYWFkaW5CdW5kbGVJbml0KCdkZWZhdWx0Jyk7XG5jb25zdCB7ICR7YmluZGluZ3MubWFwKGdldEltcG9ydEFzc2lnbWVudCkuam9pbignLCAnKX0gfSA9IChhd2FpdCBWYWFkaW5CdW5kbGVHZXQoJy4vbm9kZV9tb2R1bGVzLyR7aWR9JykpKCk7XG5leHBvcnQgeyAke2JpbmRpbmdzLm1hcChnZXRFeHBvcnRCaW5kaW5nKS5qb2luKCcsICcpfSB9O2A7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiB0aGVtZVBsdWdpbihvcHRzKTogUGx1Z2luT3B0aW9uIHtcbiAgY29uc3QgZnVsbFRoZW1lT3B0aW9ucyA9IHsgLi4udGhlbWVPcHRpb25zLCBkZXZNb2RlOiBvcHRzLmRldk1vZGUgfTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOnRoZW1lJyxcbiAgICBjb25maWcoKSB7XG4gICAgICBwcm9jZXNzVGhlbWVSZXNvdXJjZXMoZnVsbFRoZW1lT3B0aW9ucywgY29uc29sZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBmdW5jdGlvbiBoYW5kbGVUaGVtZUZpbGVDcmVhdGVEZWxldGUodGhlbWVGaWxlLCBzdGF0cykge1xuICAgICAgICBpZiAodGhlbWVGaWxlLnN0YXJ0c1dpdGgodGhlbWVGb2xkZXIpKSB7XG4gICAgICAgICAgY29uc3QgY2hhbmdlZCA9IHBhdGgucmVsYXRpdmUodGhlbWVGb2xkZXIsIHRoZW1lRmlsZSk7XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZygnVGhlbWUgZmlsZSAnICsgKCEhc3RhdHMgPyAnY3JlYXRlZCcgOiAnZGVsZXRlZCcpLCBjaGFuZ2VkKTtcbiAgICAgICAgICBwcm9jZXNzVGhlbWVSZXNvdXJjZXMoZnVsbFRoZW1lT3B0aW9ucywgY29uc29sZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNlcnZlci53YXRjaGVyLm9uKCdhZGQnLCBoYW5kbGVUaGVtZUZpbGVDcmVhdGVEZWxldGUpO1xuICAgICAgc2VydmVyLndhdGNoZXIub24oJ3VubGluaycsIGhhbmRsZVRoZW1lRmlsZUNyZWF0ZURlbGV0ZSk7XG4gICAgfSxcbiAgICBoYW5kbGVIb3RVcGRhdGUoY29udGV4dCkge1xuICAgICAgY29uc3QgY29udGV4dFBhdGggPSBwYXRoLnJlc29sdmUoY29udGV4dC5maWxlKTtcbiAgICAgIGNvbnN0IHRoZW1lUGF0aCA9IHBhdGgucmVzb2x2ZSh0aGVtZUZvbGRlcik7XG4gICAgICBpZiAoY29udGV4dFBhdGguc3RhcnRzV2l0aCh0aGVtZVBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGNoYW5nZWQgPSBwYXRoLnJlbGF0aXZlKHRoZW1lUGF0aCwgY29udGV4dFBhdGgpO1xuXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ1RoZW1lIGZpbGUgY2hhbmdlZCcsIGNoYW5nZWQpO1xuXG4gICAgICAgIGlmIChjaGFuZ2VkLnN0YXJ0c1dpdGgoc2V0dGluZ3MudGhlbWVOYW1lKSkge1xuICAgICAgICAgIHByb2Nlc3NUaGVtZVJlc291cmNlcyhmdWxsVGhlbWVPcHRpb25zLCBjb25zb2xlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgcmVzb2x2ZUlkKGlkLCBpbXBvcnRlcikge1xuICAgICAgLy8gZm9yY2UgdGhlbWUgZ2VuZXJhdGlvbiBpZiBnZW5lcmF0ZWQgdGhlbWUgc291cmNlcyBkb2VzIG5vdCB5ZXQgZXhpc3RcbiAgICAgIC8vIHRoaXMgbWF5IGhhcHBlbiBmb3IgZXhhbXBsZSBkdXJpbmcgSmF2YSBob3QgcmVsb2FkIHdoZW4gdXBkYXRpbmdcbiAgICAgIC8vIEBUaGVtZSBhbm5vdGF0aW9uIHZhbHVlXG4gICAgICBpZiAoXG4gICAgICAgIHBhdGgucmVzb2x2ZSh0aGVtZU9wdGlvbnMuZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIsICd0aGVtZS5qcycpID09PSBpbXBvcnRlciAmJlxuICAgICAgICAhZXhpc3RzU3luYyhwYXRoLnJlc29sdmUodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCBpZCkpXG4gICAgICApIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnR2VuZXJhdGUgdGhlbWUgZmlsZSAnICsgaWQgKyAnIG5vdCBleGlzdGluZy4gUHJvY2Vzc2luZyB0aGVtZSByZXNvdXJjZScpO1xuICAgICAgICBwcm9jZXNzVGhlbWVSZXNvdXJjZXMoZnVsbFRoZW1lT3B0aW9ucywgY29uc29sZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghaWQuc3RhcnRzV2l0aChzZXR0aW5ncy50aGVtZUZvbGRlcikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBsb2NhdGlvbiBvZiBbdGhlbWVSZXNvdXJjZUZvbGRlciwgZnJvbnRlbmRGb2xkZXJdKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucmVzb2x2ZShwYXRoLnJlc29sdmUobG9jYXRpb24sIGlkKSk7XG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyB0cmFuc2Zvcm0ocmF3LCBpZCwgb3B0aW9ucykge1xuICAgICAgLy8gcmV3cml0ZSB1cmxzIGZvciB0aGUgYXBwbGljYXRpb24gdGhlbWUgY3NzIGZpbGVzXG4gICAgICBjb25zdCBbYmFyZUlkLCBxdWVyeV0gPSBpZC5zcGxpdCgnPycpO1xuICAgICAgaWYgKFxuICAgICAgICAoIWJhcmVJZD8uc3RhcnRzV2l0aCh0aGVtZUZvbGRlcikgJiYgIWJhcmVJZD8uc3RhcnRzV2l0aCh0aGVtZU9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlcikpIHx8XG4gICAgICAgICFiYXJlSWQ/LmVuZHNXaXRoKCcuY3NzJylcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByZXNvdXJjZVRoZW1lRm9sZGVyID0gYmFyZUlkLnN0YXJ0c1dpdGgodGhlbWVGb2xkZXIpID8gdGhlbWVGb2xkZXIgOiB0aGVtZU9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlcjtcbiAgICAgIGNvbnN0IFt0aGVtZU5hbWVdID0gIGJhcmVJZC5zdWJzdHJpbmcocmVzb3VyY2VUaGVtZUZvbGRlci5sZW5ndGggKyAxKS5zcGxpdCgnLycpO1xuICAgICAgcmV0dXJuIHJld3JpdGVDc3NVcmxzKHJhdywgcGF0aC5kaXJuYW1lKGJhcmVJZCksIHBhdGgucmVzb2x2ZShyZXNvdXJjZVRoZW1lRm9sZGVyLCB0aGVtZU5hbWUpLCBjb25zb2xlLCBvcHRzKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJ1bldhdGNoRG9nKHdhdGNoRG9nUG9ydCwgd2F0Y2hEb2dIb3N0KSB7XG4gIGNvbnN0IGNsaWVudCA9IG5ldC5Tb2NrZXQoKTtcbiAgY2xpZW50LnNldEVuY29kaW5nKCd1dGY4Jyk7XG4gIGNsaWVudC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coJ1dhdGNoZG9nIGNvbm5lY3Rpb24gZXJyb3IuIFRlcm1pbmF0aW5nIHZpdGUgcHJvY2Vzcy4uLicsIGVycik7XG4gICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICBwcm9jZXNzLmV4aXQoMCk7XG4gIH0pO1xuICBjbGllbnQub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgIGNsaWVudC5kZXN0cm95KCk7XG4gICAgcnVuV2F0Y2hEb2cod2F0Y2hEb2dQb3J0LCB3YXRjaERvZ0hvc3QpO1xuICB9KTtcblxuICBjbGllbnQuY29ubmVjdCh3YXRjaERvZ1BvcnQsIHdhdGNoRG9nSG9zdCB8fCAnbG9jYWxob3N0Jyk7XG59XG5cbmNvbnN0IGFsbG93ZWRGcm9udGVuZEZvbGRlcnMgPSBbZnJvbnRlbmRGb2xkZXIsIG5vZGVNb2R1bGVzRm9sZGVyXTtcblxuZnVuY3Rpb24gc2hvd1JlY29tcGlsZVJlYXNvbigpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2YWFkaW46d2h5LXlvdS1jb21waWxlJyxcbiAgICBoYW5kbGVIb3RVcGRhdGUoY29udGV4dCkge1xuICAgICAgY29uc29sZS5sb2coJ1JlY29tcGlsaW5nIGJlY2F1c2UnLCBjb250ZXh0LmZpbGUsICdjaGFuZ2VkJyk7XG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBERVZfTU9ERV9TVEFSVF9SRUdFWFAgPSAvXFwvXFwqW1xcKiFdXFxzK3ZhYWRpbi1kZXYtbW9kZTpzdGFydC87XG5jb25zdCBERVZfTU9ERV9DT0RFX1JFR0VYUCA9IC9cXC9cXCpbXFwqIV1cXHMrdmFhZGluLWRldi1tb2RlOnN0YXJ0KFtcXHNcXFNdKil2YWFkaW4tZGV2LW1vZGU6ZW5kXFxzK1xcKlxcKlxcLy9pO1xuXG5mdW5jdGlvbiBwcmVzZXJ2ZVVzYWdlU3RhdHMoKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjpwcmVzZXJ2ZS11c2FnZS1zdGF0cycsXG5cbiAgICB0cmFuc2Zvcm0oc3JjOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgICAgIGlmIChpZC5pbmNsdWRlcygndmFhZGluLXVzYWdlLXN0YXRpc3RpY3MnKSkge1xuICAgICAgICBpZiAoc3JjLmluY2x1ZGVzKCd2YWFkaW4tZGV2LW1vZGU6c3RhcnQnKSkge1xuICAgICAgICAgIGNvbnN0IG5ld1NyYyA9IHNyYy5yZXBsYWNlKERFVl9NT0RFX1NUQVJUX1JFR0VYUCwgJy8qISB2YWFkaW4tZGV2LW1vZGU6c3RhcnQnKTtcbiAgICAgICAgICBpZiAobmV3U3JjID09PSBzcmMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbW1lbnQgcmVwbGFjZW1lbnQgZmFpbGVkIHRvIGNoYW5nZSBhbnl0aGluZycpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIW5ld1NyYy5tYXRjaChERVZfTU9ERV9DT0RFX1JFR0VYUCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05ldyBjb21tZW50IGZhaWxzIHRvIG1hdGNoIG9yaWdpbmFsIHJlZ2V4cCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4geyBjb2RlOiBuZXdTcmMgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgY29kZTogc3JjIH07XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgdmFhZGluQ29uZmlnOiBVc2VyQ29uZmlnRm4gPSAoZW52KSA9PiB7XG4gIGNvbnN0IGRldk1vZGUgPSBlbnYubW9kZSA9PT0gJ2RldmVsb3BtZW50JztcbiAgY29uc3QgcHJvZHVjdGlvbk1vZGUgPSAhZGV2TW9kZSAmJiAhZGV2QnVuZGxlXG5cbiAgaWYgKGRldk1vZGUgJiYgcHJvY2Vzcy5lbnYud2F0Y2hEb2dQb3J0KSB7XG4gICAgLy8gT3BlbiBhIGNvbm5lY3Rpb24gd2l0aCB0aGUgSmF2YSBkZXYtbW9kZSBoYW5kbGVyIGluIG9yZGVyIHRvIGZpbmlzaFxuICAgIC8vIHZpdGUgd2hlbiBpdCBleGl0cyBvciBjcmFzaGVzLlxuICAgIHJ1bldhdGNoRG9nKHByb2Nlc3MuZW52LndhdGNoRG9nUG9ydCwgcHJvY2Vzcy5lbnYud2F0Y2hEb2dIb3N0KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcm9vdDogZnJvbnRlbmRGb2xkZXIsXG4gICAgYmFzZTogJycsXG4gICAgcHVibGljRGlyOiBmYWxzZSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQHZhYWRpbi9mbG93LWZyb250ZW5kJzogamFyUmVzb3VyY2VzRm9sZGVyLFxuICAgICAgICBGcm9udGVuZDogZnJvbnRlbmRGb2xkZXJcbiAgICAgIH0sXG4gICAgICBwcmVzZXJ2ZVN5bWxpbmtzOiB0cnVlXG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIE9GRkxJTkVfUEFUSDogc2V0dGluZ3Mub2ZmbGluZVBhdGgsXG4gICAgICBWSVRFX0VOQUJMRUQ6ICd0cnVlJ1xuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiAnMTI3LjAuMC4xJyxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBmczoge1xuICAgICAgICBhbGxvdzogYWxsb3dlZEZyb250ZW5kRm9sZGVyc1xuICAgICAgfVxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIG1pbmlmeTogcHJvZHVjdGlvbk1vZGUsXG4gICAgICBvdXREaXI6IGJ1aWxkT3V0cHV0Rm9sZGVyLFxuICAgICAgZW1wdHlPdXREaXI6IGRldkJ1bmRsZSxcbiAgICAgIGFzc2V0c0RpcjogJ1ZBQURJTi9idWlsZCcsXG4gICAgICB0YXJnZXQ6IFtcImVzbmV4dFwiLCBcInNhZmFyaTE1XCJdLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBpbnB1dDoge1xuICAgICAgICAgIGluZGV4aHRtbDogcHJvamVjdEluZGV4SHRtbCxcblxuICAgICAgICAgIC4uLihoYXNFeHBvcnRlZFdlYkNvbXBvbmVudHMgPyB7IHdlYmNvbXBvbmVudGh0bWw6IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ3dlYi1jb21wb25lbnQuaHRtbCcpIH0gOiB7fSlcbiAgICAgICAgfSxcbiAgICAgICAgb253YXJuOiAod2FybmluZzogcm9sbHVwLlJvbGx1cFdhcm5pbmcsIGRlZmF1bHRIYW5kbGVyOiByb2xsdXAuV2FybmluZ0hhbmRsZXIpID0+IHtcbiAgICAgICAgICBjb25zdCBpZ25vcmVFdmFsV2FybmluZyA9IFtcbiAgICAgICAgICAgICdnZW5lcmF0ZWQvamFyLXJlc291cmNlcy9GbG93Q2xpZW50LmpzJyxcbiAgICAgICAgICAgICdnZW5lcmF0ZWQvamFyLXJlc291cmNlcy92YWFkaW4tc3ByZWFkc2hlZXQvc3ByZWFkc2hlZXQtZXhwb3J0LmpzJyxcbiAgICAgICAgICAgICdAdmFhZGluL2NoYXJ0cy9zcmMvaGVscGVycy5qcydcbiAgICAgICAgICBdO1xuICAgICAgICAgIGlmICh3YXJuaW5nLmNvZGUgPT09ICdFVkFMJyAmJiB3YXJuaW5nLmlkICYmICEhaWdub3JlRXZhbFdhcm5pbmcuZmluZCgoaWQpID0+IHdhcm5pbmcuaWQuZW5kc1dpdGgoaWQpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWZhdWx0SGFuZGxlcih3YXJuaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBlbnRyaWVzOiBbXG4gICAgICAgIC8vIFByZS1zY2FuIGVudHJ5cG9pbnRzIGluIFZpdGUgdG8gYXZvaWQgcmVsb2FkaW5nIG9uIGZpcnN0IG9wZW5cbiAgICAgICAgJ2dlbmVyYXRlZC92YWFkaW4udHMnXG4gICAgICBdLFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnQHZhYWRpbi9yb3V0ZXInLFxuICAgICAgICAnQHZhYWRpbi92YWFkaW4tbGljZW5zZS1jaGVja2VyJyxcbiAgICAgICAgJ0B2YWFkaW4vdmFhZGluLXVzYWdlLXN0YXRpc3RpY3MnLFxuICAgICAgICAnd29ya2JveC1jb3JlJyxcbiAgICAgICAgJ3dvcmtib3gtcHJlY2FjaGluZycsXG4gICAgICAgICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAnd29ya2JveC1zdHJhdGVnaWVzJ1xuICAgICAgXVxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcHJvZHVjdGlvbk1vZGUgJiYgYnJvdGxpKCksXG4gICAgICBkZXZNb2RlICYmIHZhYWRpbkJ1bmRsZXNQbHVnaW4oKSxcbiAgICAgIGRldk1vZGUgJiYgc2hvd1JlY29tcGlsZVJlYXNvbigpLFxuICAgICAgc2V0dGluZ3Mub2ZmbGluZUVuYWJsZWQgJiYgYnVpbGRTV1BsdWdpbih7IGRldk1vZGUgfSksXG4gICAgICAhZGV2TW9kZSAmJiBzdGF0c0V4dHJhY3RlclBsdWdpbigpLFxuICAgICAgIXByb2R1Y3Rpb25Nb2RlICYmIHByZXNlcnZlVXNhZ2VTdGF0cygpLFxuICAgICAgdGhlbWVQbHVnaW4oeyBkZXZNb2RlIH0pLFxuICAgICAgcG9zdGNzc0xpdCh7XG4gICAgICAgIGluY2x1ZGU6IFsnKiovKi5jc3MnLCAvLipcXC8uKlxcLmNzc1xcPy4qL10sXG4gICAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgICBgJHt0aGVtZUZvbGRlcn0vKiovKi5jc3NgLFxuICAgICAgICAgIG5ldyBSZWdFeHAoYCR7dGhlbWVGb2xkZXJ9Ly4qLy4qXFxcXC5jc3NcXFxcPy4qYCksXG4gICAgICAgICAgYCR7dGhlbWVSZXNvdXJjZUZvbGRlcn0vKiovKi5jc3NgLFxuICAgICAgICAgIG5ldyBSZWdFeHAoYCR7dGhlbWVSZXNvdXJjZUZvbGRlcn0vLiovLipcXFxcLmNzc1xcXFw/LipgKSxcbiAgICAgICAgICBuZXcgUmVnRXhwKCcuKi8uKlxcXFw/aHRtbC1wcm94eS4qJylcbiAgICAgICAgXVxuICAgICAgfSksXG4gICAgICAvLyBUaGUgUmVhY3QgcGx1Z2luIHByb3ZpZGVzIGZhc3QgcmVmcmVzaCBhbmQgZGVidWcgc291cmNlIGluZm9cbiAgICAgIHJlYWN0UGx1Z2luKHtcbiAgICAgICAgaW5jbHVkZTogJyoqLyoudHN4JyxcbiAgICAgICAgYmFiZWw6IHtcbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIHVzZSBiYWJlbCB0byBwcm92aWRlIHRoZSBzb3VyY2UgaW5mb3JtYXRpb24gZm9yIGl0IHRvIGJlIGNvcnJlY3RcbiAgICAgICAgICAvLyAob3RoZXJ3aXNlIEJhYmVsIHdpbGwgc2xpZ2h0bHkgcmV3cml0ZSB0aGUgc291cmNlIGZpbGUgYW5kIGVzYnVpbGQgZ2VuZXJhdGUgc291cmNlIGluZm8gZm9yIHRoZSBtb2RpZmllZCBmaWxlKVxuICAgICAgICAgIHByZXNldHM6IFtbJ0BiYWJlbC9wcmVzZXQtcmVhY3QnLCB7IHJ1bnRpbWU6ICdhdXRvbWF0aWMnLCBkZXZlbG9wbWVudDogIXByb2R1Y3Rpb25Nb2RlIH1dXSxcbiAgICAgICAgICAvLyBSZWFjdCB3cml0ZXMgdGhlIHNvdXJjZSBsb2NhdGlvbiBmb3Igd2hlcmUgY29tcG9uZW50cyBhcmUgdXNlZCwgdGhpcyB3cml0ZXMgZm9yIHdoZXJlIHRoZXkgYXJlIGRlZmluZWRcbiAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAhcHJvZHVjdGlvbk1vZGUgJiYgYWRkRnVuY3Rpb25Db21wb25lbnRTb3VyY2VMb2NhdGlvbkJhYmVsKClcbiAgICAgICAgICBdLmZpbHRlcihCb29sZWFuKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3ZhYWRpbjpmb3JjZS1yZW1vdmUtaHRtbC1taWRkbGV3YXJlJyxcbiAgICAgICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMuc3RhY2sgPSBzZXJ2ZXIubWlkZGxld2FyZXMuc3RhY2suZmlsdGVyKChtdykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBoYW5kbGVOYW1lID0gYCR7bXcuaGFuZGxlfWA7XG4gICAgICAgICAgICAgIHJldHVybiAhaGFuZGxlTmFtZS5pbmNsdWRlcygndml0ZUh0bWxGYWxsYmFja01pZGRsZXdhcmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgaGFzRXhwb3J0ZWRXZWJDb21wb25lbnRzICYmIHtcbiAgICAgICAgbmFtZTogJ3ZhYWRpbjppbmplY3QtZW50cnlwb2ludHMtdG8td2ViLWNvbXBvbmVudC1odG1sJyxcbiAgICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sOiB7XG4gICAgICAgICAgb3JkZXI6ICdwcmUnLFxuICAgICAgICAgIGhhbmRsZXIoX2h0bWwsIHsgcGF0aCwgc2VydmVyIH0pIHtcbiAgICAgICAgICAgIGlmIChwYXRoICE9PSAnL3dlYi1jb21wb25lbnQuaHRtbCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGFnOiAnc2NyaXB0JyxcbiAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiAnbW9kdWxlJywgc3JjOiBgL2dlbmVyYXRlZC92YWFkaW4td2ViLWNvbXBvbmVudC50c2AgfSxcbiAgICAgICAgICAgICAgICBpbmplY3RUbzogJ2hlYWQnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAndmFhZGluOmluamVjdC1lbnRyeXBvaW50cy10by1pbmRleC1odG1sJyxcbiAgICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sOiB7XG4gICAgICAgICAgb3JkZXI6ICdwcmUnLFxuICAgICAgICAgIGhhbmRsZXIoX2h0bWwsIHsgcGF0aCwgc2VydmVyIH0pIHtcbiAgICAgICAgICAgIGlmIChwYXRoICE9PSAnL2luZGV4Lmh0bWwnKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2NyaXB0cyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoZGV2TW9kZSkge1xuICAgICAgICAgICAgICBzY3JpcHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXG4gICAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogJ21vZHVsZScsIHNyYzogYC9nZW5lcmF0ZWQvdml0ZS1kZXZtb2RlLnRzYCwgb25lcnJvcjogXCJkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQoKVwiIH0sXG4gICAgICAgICAgICAgICAgaW5qZWN0VG86ICdoZWFkJ1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjcmlwdHMucHVzaCh7XG4gICAgICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXG4gICAgICAgICAgICAgIGF0dHJzOiB7IHR5cGU6ICdtb2R1bGUnLCBzcmM6ICcvZ2VuZXJhdGVkL3ZhYWRpbi50cycgfSxcbiAgICAgICAgICAgICAgaW5qZWN0VG86ICdoZWFkJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gc2NyaXB0cztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaGVja2VyKHtcbiAgICAgICAgdHlwZXNjcmlwdDogdHJ1ZVxuICAgICAgfSksXG4gICAgICBwcm9kdWN0aW9uTW9kZSAmJiB2aXN1YWxpemVyKHsgYnJvdGxpU2l6ZTogdHJ1ZSwgZmlsZW5hbWU6IGJ1bmRsZVNpemVGaWxlIH0pXG4gICAgICBcbiAgICBdXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3Qgb3ZlcnJpZGVWYWFkaW5Db25maWcgPSAoY3VzdG9tQ29uZmlnOiBVc2VyQ29uZmlnRm4pID0+IHtcbiAgcmV0dXJuIGRlZmluZUNvbmZpZygoZW52KSA9PiBtZXJnZUNvbmZpZyh2YWFkaW5Db25maWcoZW52KSwgY3VzdG9tQ29uZmlnKGVudikpKTtcbn07XG5mdW5jdGlvbiBnZXRWZXJzaW9uKG1vZHVsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFja2FnZUpzb24gPSBwYXRoLnJlc29sdmUobm9kZU1vZHVsZXNGb2xkZXIsIG1vZHVsZSwgJ3BhY2thZ2UuanNvbicpO1xuICByZXR1cm4gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGFja2FnZUpzb24sIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpLnZlcnNpb247XG59XG5mdW5jdGlvbiBnZXRDdmRsTmFtZShtb2R1bGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhY2thZ2VKc29uID0gcGF0aC5yZXNvbHZlKG5vZGVNb2R1bGVzRm9sZGVyLCBtb2R1bGUsICdwYWNrYWdlLmpzb24nKTtcbiAgcmV0dXJuIEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHBhY2thZ2VKc29uLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKS5jdmRsTmFtZTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXGFwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXGFwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblxcXFx0aGVtZS1oYW5kbGUuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2d1c3Rhdm8vRGVza3RvcC9wcm9ncmFtYXMvQXVkaWJsZS90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtaGFuZGxlLmpzXCI7LypcbiAqIENvcHlyaWdodCAyMDAwLTIwMjQgVmFhZGluIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyBmdW5jdGlvbnMgZm9yIGxvb2sgdXAgYW5kIGhhbmRsZSB0aGUgdGhlbWUgcmVzb3VyY2VzXG4gKiBmb3IgYXBwbGljYXRpb24gdGhlbWUgcGx1Z2luLlxuICovXG5pbXBvcnQgeyBleGlzdHNTeW5jLCByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyB3cml0ZVRoZW1lRmlsZXMgfSBmcm9tICcuL3RoZW1lLWdlbmVyYXRvci5qcyc7XG5pbXBvcnQgeyBjb3B5U3RhdGljQXNzZXRzLCBjb3B5VGhlbWVSZXNvdXJjZXMgfSBmcm9tICcuL3RoZW1lLWNvcHkuanMnO1xuXG4vLyBtYXRjaGVzIHRoZW1lIG5hbWUgaW4gJy4vdGhlbWUtbXktdGhlbWUuZ2VuZXJhdGVkLmpzJ1xuY29uc3QgbmFtZVJlZ2V4ID0gL3RoZW1lLSguKilcXC5nZW5lcmF0ZWRcXC5qcy87XG5cbmxldCBwcmV2VGhlbWVOYW1lID0gdW5kZWZpbmVkO1xubGV0IGZpcnN0VGhlbWVOYW1lID0gdW5kZWZpbmVkO1xuXG4vKipcbiAqIExvb2tzIHVwIGZvciBhIHRoZW1lIHJlc291cmNlcyBpbiBhIGN1cnJlbnQgcHJvamVjdCBhbmQgaW4gamFyIGRlcGVuZGVuY2llcyxcbiAqIGNvcGllcyB0aGUgZm91bmQgcmVzb3VyY2VzIGFuZCBnZW5lcmF0ZXMvdXBkYXRlcyBtZXRhIGRhdGEgZm9yIHdlYnBhY2tcbiAqIGNvbXBpbGF0aW9uLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIGFwcGxpY2F0aW9uIHRoZW1lIHBsdWdpbiBtYW5kYXRvcnkgb3B0aW9ucyxcbiAqIEBzZWUge0BsaW5rIEFwcGxpY2F0aW9uVGhlbWVQbHVnaW59XG4gKlxuICogQHBhcmFtIGxvZ2dlciBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NUaGVtZVJlc291cmNlcyhvcHRpb25zLCBsb2dnZXIpIHtcbiAgY29uc3QgdGhlbWVOYW1lID0gZXh0cmFjdFRoZW1lTmFtZShvcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyKTtcbiAgaWYgKHRoZW1lTmFtZSkge1xuICAgIGlmICghcHJldlRoZW1lTmFtZSAmJiAhZmlyc3RUaGVtZU5hbWUpIHtcbiAgICAgIGZpcnN0VGhlbWVOYW1lID0gdGhlbWVOYW1lO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAocHJldlRoZW1lTmFtZSAmJiBwcmV2VGhlbWVOYW1lICE9PSB0aGVtZU5hbWUgJiYgZmlyc3RUaGVtZU5hbWUgIT09IHRoZW1lTmFtZSkgfHxcbiAgICAgICghcHJldlRoZW1lTmFtZSAmJiBmaXJzdFRoZW1lTmFtZSAhPT0gdGhlbWVOYW1lKVxuICAgICkge1xuICAgICAgLy8gV2FybmluZyBtZXNzYWdlIGlzIHNob3duIHRvIHRoZSBkZXZlbG9wZXIgd2hlbjpcbiAgICAgIC8vIDEuIEhlIGlzIHN3aXRjaGluZyB0byBhbnkgdGhlbWUsIHdoaWNoIGlzIGRpZmZlciBmcm9tIG9uZSBiZWluZyBzZXQgdXBcbiAgICAgIC8vIG9uIGFwcGxpY2F0aW9uIHN0YXJ0dXAsIGJ5IGNoYW5naW5nIHRoZW1lIG5hbWUgaW4gYEBUaGVtZSgpYFxuICAgICAgLy8gMi4gSGUgcmVtb3ZlcyBvciBjb21tZW50cyBvdXQgYEBUaGVtZSgpYCB0byBzZWUgaG93IHRoZSBhcHBcbiAgICAgIC8vIGxvb2tzIGxpa2Ugd2l0aG91dCB0aGVtaW5nLCBhbmQgdGhlbiBhZ2FpbiBicmluZ3MgYEBUaGVtZSgpYCBiYWNrXG4gICAgICAvLyB3aXRoIGEgdGhlbWVOYW1lIHdoaWNoIGlzIGRpZmZlciBmcm9tIG9uZSBiZWluZyBzZXQgdXAgb24gYXBwbGljYXRpb25cbiAgICAgIC8vIHN0YXJ0dXAuXG4gICAgICBjb25zdCB3YXJuaW5nID0gYEF0dGVudGlvbjogQWN0aXZlIHRoZW1lIGlzIHN3aXRjaGVkIHRvICcke3RoZW1lTmFtZX0nLmA7XG4gICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGBcbiAgICAgIE5vdGUgdGhhdCBhZGRpbmcgbmV3IHN0eWxlIHNoZWV0IGZpbGVzIHRvICcvdGhlbWVzLyR7dGhlbWVOYW1lfS9jb21wb25lbnRzJywgXG4gICAgICBtYXkgbm90IGJlIHRha2VuIGludG8gZWZmZWN0IHVudGlsIHRoZSBuZXh0IGFwcGxpY2F0aW9uIHJlc3RhcnQuXG4gICAgICBDaGFuZ2VzIHRvIGFscmVhZHkgZXhpc3Rpbmcgc3R5bGUgc2hlZXQgZmlsZXMgYXJlIGJlaW5nIHJlbG9hZGVkIGFzIGJlZm9yZS5gO1xuICAgICAgbG9nZ2VyLndhcm4oJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKTtcbiAgICAgIGxvZ2dlci53YXJuKHdhcm5pbmcpO1xuICAgICAgbG9nZ2VyLndhcm4oZGVzY3JpcHRpb24pO1xuICAgICAgbG9nZ2VyLndhcm4oJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKTtcbiAgICB9XG4gICAgcHJldlRoZW1lTmFtZSA9IHRoZW1lTmFtZTtcblxuICAgIGZpbmRUaGVtZUZvbGRlckFuZEhhbmRsZVRoZW1lKHRoZW1lTmFtZSwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUaGlzIGlzIG5lZWRlZCBpbiB0aGUgc2l0dWF0aW9uIHRoYXQgdGhlIHVzZXIgZGVjaWRlcyB0byBjb21tZW50IG9yXG4gICAgLy8gcmVtb3ZlIHRoZSBAVGhlbWUoLi4uKSBjb21wbGV0ZWx5IHRvIHNlZSBob3cgdGhlIGFwcGxpY2F0aW9uIGxvb2tzXG4gICAgLy8gd2l0aG91dCBhbnkgdGhlbWUuIFRoZW4gd2hlbiB0aGUgdXNlciBicmluZ3MgYmFjayBvbmUgb2YgdGhlIHRoZW1lcyxcbiAgICAvLyB0aGUgcHJldmlvdXMgdGhlbWUgc2hvdWxkIGJlIHVuZGVmaW5lZCB0byBlbmFibGUgdXMgdG8gZGV0ZWN0IHRoZSBjaGFuZ2UuXG4gICAgcHJldlRoZW1lTmFtZSA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIuZGVidWcoJ1NraXBwaW5nIFZhYWRpbiBhcHBsaWNhdGlvbiB0aGVtZSBoYW5kbGluZy4nKTtcbiAgICBsb2dnZXIudHJhY2UoJ01vc3QgbGlrZWx5IG5vIEBUaGVtZSBhbm5vdGF0aW9uIGZvciBhcHBsaWNhdGlvbiBvciBvbmx5IHRoZW1lQ2xhc3MgdXNlZC4nKTtcbiAgfVxufVxuXG4vKipcbiAqIFNlYXJjaCBmb3IgdGhlIGdpdmVuIHRoZW1lIGluIHRoZSBwcm9qZWN0IGFuZCByZXNvdXJjZSBmb2xkZXJzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZU5hbWUgbmFtZSBvZiB0aGVtZSB0byBmaW5kXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHBhcmFtIGxvZ2dlciBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbG9nZ2VyXG4gKiBAcmV0dXJuIHRydWUgb3IgZmFsc2UgZm9yIGlmIHRoZW1lIHdhcyBmb3VuZFxuICovXG5mdW5jdGlvbiBmaW5kVGhlbWVGb2xkZXJBbmRIYW5kbGVUaGVtZSh0aGVtZU5hbWUsIG9wdGlvbnMsIGxvZ2dlcikge1xuICBsZXQgdGhlbWVGb3VuZCA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVycy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHRoZW1lUHJvamVjdEZvbGRlciA9IG9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVyc1tpXTtcbiAgICBpZiAoZXhpc3RzU3luYyh0aGVtZVByb2plY3RGb2xkZXIpKSB7XG4gICAgICBsb2dnZXIuZGVidWcoXCJTZWFyY2hpbmcgdGhlbWVzIGZvbGRlciAnXCIgKyB0aGVtZVByb2plY3RGb2xkZXIgKyBcIicgZm9yIHRoZW1lICdcIiArIHRoZW1lTmFtZSArIFwiJ1wiKTtcbiAgICAgIGNvbnN0IGhhbmRsZWQgPSBoYW5kbGVUaGVtZXModGhlbWVOYW1lLCB0aGVtZVByb2plY3RGb2xkZXIsIG9wdGlvbnMsIGxvZ2dlcik7XG4gICAgICBpZiAoaGFuZGxlZCkge1xuICAgICAgICBpZiAodGhlbWVGb3VuZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiRm91bmQgdGhlbWUgZmlsZXMgaW4gJ1wiICtcbiAgICAgICAgICAgICAgdGhlbWVQcm9qZWN0Rm9sZGVyICtcbiAgICAgICAgICAgICAgXCInIGFuZCAnXCIgK1xuICAgICAgICAgICAgICB0aGVtZUZvdW5kICtcbiAgICAgICAgICAgICAgXCInLiBUaGVtZSBzaG91bGQgb25seSBiZSBhdmFpbGFibGUgaW4gb25lIGZvbGRlclwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBsb2dnZXIuZGVidWcoXCJGb3VuZCB0aGVtZSBmaWxlcyBmcm9tICdcIiArIHRoZW1lUHJvamVjdEZvbGRlciArIFwiJ1wiKTtcbiAgICAgICAgdGhlbWVGb3VuZCA9IHRoZW1lUHJvamVjdEZvbGRlcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZXhpc3RzU3luYyhvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIpKSB7XG4gICAgaWYgKHRoZW1lRm91bmQgJiYgZXhpc3RzU3luYyhyZXNvbHZlKG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciwgdGhlbWVOYW1lKSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJUaGVtZSAnXCIgK1xuICAgICAgICAgIHRoZW1lTmFtZSArXG4gICAgICAgICAgXCInc2hvdWxkIG5vdCBleGlzdCBpbnNpZGUgYSBqYXIgYW5kIGluIHRoZSBwcm9qZWN0IGF0IHRoZSBzYW1lIHRpbWVcXG5cIiArXG4gICAgICAgICAgJ0V4dGVuZGluZyBhbm90aGVyIHRoZW1lIGlzIHBvc3NpYmxlIGJ5IGFkZGluZyB7IFwicGFyZW50XCI6IFwibXktcGFyZW50LXRoZW1lXCIgfSBlbnRyeSB0byB0aGUgdGhlbWUuanNvbiBmaWxlIGluc2lkZSB5b3VyIHRoZW1lIGZvbGRlci4nXG4gICAgICApO1xuICAgIH1cbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICBcIlNlYXJjaGluZyB0aGVtZSBqYXIgcmVzb3VyY2UgZm9sZGVyICdcIiArIG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciArIFwiJyBmb3IgdGhlbWUgJ1wiICsgdGhlbWVOYW1lICsgXCInXCJcbiAgICApO1xuICAgIGhhbmRsZVRoZW1lcyh0aGVtZU5hbWUsIG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgICB0aGVtZUZvdW5kID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdGhlbWVGb3VuZDtcbn1cblxuLyoqXG4gKiBDb3BpZXMgc3RhdGljIHJlc291cmNlcyBmb3IgdGhlbWUgYW5kIGdlbmVyYXRlcy93cml0ZXMgdGhlXG4gKiBbdGhlbWUtbmFtZV0uZ2VuZXJhdGVkLmpzIGZvciB3ZWJwYWNrIHRvIGhhbmRsZS5cbiAqXG4gKiBOb3RlISBJZiBhIHBhcmVudCB0aGVtZSBpcyBkZWZpbmVkIGl0IHdpbGwgYWxzbyBiZSBoYW5kbGVkIGhlcmUgc28gdGhhdCB0aGUgcGFyZW50IHRoZW1lIGdlbmVyYXRlZCBmaWxlIGlzXG4gKiBnZW5lcmF0ZWQgaW4gYWR2YW5jZSBvZiB0aGUgdGhlbWUgZ2VuZXJhdGVkIGZpbGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBuYW1lIG9mIHRoZW1lIHRvIGhhbmRsZVxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lc0ZvbGRlciBmb2xkZXIgY29udGFpbmluZyBhcHBsaWNhdGlvbiB0aGVtZSBmb2xkZXJzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyIGluc3RhbmNlXG4gKlxuICogQHRocm93cyBFcnJvciBpZiBwYXJlbnQgdGhlbWUgZGVmaW5lZCwgYnV0IGNhbid0IGxvY2F0ZSBwYXJlbnQgdGhlbWVcbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZW1lIHdhcyBmb3VuZCBlbHNlIGZhbHNlLlxuICovXG5mdW5jdGlvbiBoYW5kbGVUaGVtZXModGhlbWVOYW1lLCB0aGVtZXNGb2xkZXIsIG9wdGlvbnMsIGxvZ2dlcikge1xuICBjb25zdCB0aGVtZUZvbGRlciA9IHJlc29sdmUodGhlbWVzRm9sZGVyLCB0aGVtZU5hbWUpO1xuICBpZiAoZXhpc3RzU3luYyh0aGVtZUZvbGRlcikpIHtcbiAgICBsb2dnZXIuZGVidWcoJ0ZvdW5kIHRoZW1lICcsIHRoZW1lTmFtZSwgJyBpbiBmb2xkZXIgJywgdGhlbWVGb2xkZXIpO1xuXG4gICAgY29uc3QgdGhlbWVQcm9wZXJ0aWVzID0gZ2V0VGhlbWVQcm9wZXJ0aWVzKHRoZW1lRm9sZGVyKTtcblxuICAgIC8vIElmIHRoZW1lIGhhcyBwYXJlbnQgaGFuZGxlIHBhcmVudCB0aGVtZSBpbW1lZGlhdGVseS5cbiAgICBpZiAodGhlbWVQcm9wZXJ0aWVzLnBhcmVudCkge1xuICAgICAgY29uc3QgZm91bmQgPSBmaW5kVGhlbWVGb2xkZXJBbmRIYW5kbGVUaGVtZSh0aGVtZVByb3BlcnRpZXMucGFyZW50LCBvcHRpb25zLCBsb2dnZXIpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJDb3VsZCBub3QgbG9jYXRlIGZpbGVzIGZvciBkZWZpbmVkIHBhcmVudCB0aGVtZSAnXCIgK1xuICAgICAgICAgICAgdGhlbWVQcm9wZXJ0aWVzLnBhcmVudCArXG4gICAgICAgICAgICBcIicuXFxuXCIgK1xuICAgICAgICAgICAgJ1BsZWFzZSB2ZXJpZnkgdGhhdCBkZXBlbmRlbmN5IGlzIGFkZGVkIG9yIHRoZW1lIGZvbGRlciBleGlzdHMuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBjb3B5U3RhdGljQXNzZXRzKHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zLnByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIGxvZ2dlcik7XG4gICAgY29weVRoZW1lUmVzb3VyY2VzKHRoZW1lRm9sZGVyLCBvcHRpb25zLnByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIGxvZ2dlcik7XG5cbiAgICB3cml0ZVRoZW1lRmlsZXModGhlbWVGb2xkZXIsIHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW1lUHJvcGVydGllcyh0aGVtZUZvbGRlcikge1xuICBjb25zdCB0aGVtZVByb3BlcnR5RmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsICd0aGVtZS5qc29uJyk7XG4gIGlmICghZXhpc3RzU3luYyh0aGVtZVByb3BlcnR5RmlsZSkpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgY29uc3QgdGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZyA9IHJlYWRGaWxlU3luYyh0aGVtZVByb3BlcnR5RmlsZSk7XG4gIGlmICh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICByZXR1cm4gSlNPTi5wYXJzZSh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nKTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0cyBjdXJyZW50IHRoZW1lIG5hbWUgZnJvbSBhdXRvLWdlbmVyYXRlZCAndGhlbWUuanMnIGZpbGUgbG9jYXRlZCBvbiBhXG4gKiBnaXZlbiBmb2xkZXIuXG4gKiBAcGFyYW0gZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIgZm9sZGVyIGluIHByb2plY3QgY29udGFpbmluZyAndGhlbWUuanMnIGZpbGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGN1cnJlbnQgdGhlbWUgbmFtZVxuICovXG5mdW5jdGlvbiBleHRyYWN0VGhlbWVOYW1lKGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyKSB7XG4gIGlmICghZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIkNvdWxkbid0IGV4dHJhY3QgdGhlbWUgbmFtZSBmcm9tICd0aGVtZS5qcycsXCIgK1xuICAgICAgICAnIGJlY2F1c2UgdGhlIHBhdGggdG8gZm9sZGVyIGNvbnRhaW5pbmcgdGhpcyBmaWxlIGlzIGVtcHR5LiBQbGVhc2Ugc2V0JyArXG4gICAgICAgICcgdGhlIGEgY29ycmVjdCBmb2xkZXIgcGF0aCBpbiBBcHBsaWNhdGlvblRoZW1lUGx1Z2luIGNvbnN0cnVjdG9yJyArXG4gICAgICAgICcgcGFyYW1ldGVycy4nXG4gICAgKTtcbiAgfVxuICBjb25zdCBnZW5lcmF0ZWRUaGVtZUZpbGUgPSByZXNvbHZlKGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCAndGhlbWUuanMnKTtcbiAgaWYgKGV4aXN0c1N5bmMoZ2VuZXJhdGVkVGhlbWVGaWxlKSkge1xuICAgIC8vIHJlYWQgdGhlbWUgbmFtZSBmcm9tIHRoZSAnZ2VuZXJhdGVkL3RoZW1lLmpzJyBhcyB0aGVyZSB3ZSBhbHdheXNcbiAgICAvLyBtYXJrIHRoZSB1c2VkIHRoZW1lIGZvciB3ZWJwYWNrIHRvIGhhbmRsZS5cbiAgICBjb25zdCB0aGVtZU5hbWUgPSBuYW1lUmVnZXguZXhlYyhyZWFkRmlsZVN5bmMoZ2VuZXJhdGVkVGhlbWVGaWxlLCB7IGVuY29kaW5nOiAndXRmOCcgfSkpWzFdO1xuICAgIGlmICghdGhlbWVOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBwYXJzZSB0aGVtZSBuYW1lIGZyb20gJ1wiICsgZ2VuZXJhdGVkVGhlbWVGaWxlICsgXCInLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoZW1lTmFtZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuLyoqXG4gKiBGaW5kcyBhbGwgdGhlIHBhcmVudCB0aGVtZXMgbG9jYXRlZCBpbiB0aGUgcHJvamVjdCB0aGVtZXMgZm9sZGVycyBhbmQgaW5cbiAqIHRoZSBKQVIgZGVwZW5kZW5jaWVzIHdpdGggcmVzcGVjdCB0byB0aGUgZ2l2ZW4gY3VzdG9tIHRoZW1lIHdpdGhcbiAqIHtAY29kZSB0aGVtZU5hbWV9LlxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBnaXZlbiBjdXN0b20gdGhlbWUgbmFtZSB0byBsb29rIHBhcmVudHMgZm9yXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHJldHVybnMge3N0cmluZ1tdfSBhcnJheSBvZiBwYXRocyB0byBmb3VuZCBwYXJlbnQgdGhlbWVzIHdpdGggcmVzcGVjdCB0byB0aGVcbiAqIGdpdmVuIGN1c3RvbSB0aGVtZVxuICovXG5mdW5jdGlvbiBmaW5kUGFyZW50VGhlbWVzKHRoZW1lTmFtZSwgb3B0aW9ucykge1xuICBjb25zdCBleGlzdGluZ1RoZW1lRm9sZGVycyA9IFtvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIsIC4uLm9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVyc10uZmlsdGVyKChmb2xkZXIpID0+XG4gICAgZXhpc3RzU3luYyhmb2xkZXIpXG4gICk7XG4gIHJldHVybiBjb2xsZWN0UGFyZW50VGhlbWVzKHRoZW1lTmFtZSwgZXhpc3RpbmdUaGVtZUZvbGRlcnMsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdFBhcmVudFRoZW1lcyh0aGVtZU5hbWUsIHRoZW1lRm9sZGVycywgaXNQYXJlbnQpIHtcbiAgbGV0IGZvdW5kUGFyZW50VGhlbWVzID0gW107XG4gIHRoZW1lRm9sZGVycy5mb3JFYWNoKChmb2xkZXIpID0+IHtcbiAgICBjb25zdCB0aGVtZUZvbGRlciA9IHJlc29sdmUoZm9sZGVyLCB0aGVtZU5hbWUpO1xuICAgIGlmIChleGlzdHNTeW5jKHRoZW1lRm9sZGVyKSkge1xuICAgICAgY29uc3QgdGhlbWVQcm9wZXJ0aWVzID0gZ2V0VGhlbWVQcm9wZXJ0aWVzKHRoZW1lRm9sZGVyKTtcblxuICAgICAgaWYgKHRoZW1lUHJvcGVydGllcy5wYXJlbnQpIHtcbiAgICAgICAgZm91bmRQYXJlbnRUaGVtZXMucHVzaCguLi5jb2xsZWN0UGFyZW50VGhlbWVzKHRoZW1lUHJvcGVydGllcy5wYXJlbnQsIHRoZW1lRm9sZGVycywgdHJ1ZSkpO1xuICAgICAgICBpZiAoIWZvdW5kUGFyZW50VGhlbWVzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiQ291bGQgbm90IGxvY2F0ZSBmaWxlcyBmb3IgZGVmaW5lZCBwYXJlbnQgdGhlbWUgJ1wiICtcbiAgICAgICAgICAgICAgdGhlbWVQcm9wZXJ0aWVzLnBhcmVudCArXG4gICAgICAgICAgICAgIFwiJy5cXG5cIiArXG4gICAgICAgICAgICAgICdQbGVhc2UgdmVyaWZ5IHRoYXQgZGVwZW5kZW5jeSBpcyBhZGRlZCBvciB0aGVtZSBmb2xkZXIgZXhpc3RzLidcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBBZGQgYSB0aGVtZSBwYXRoIHRvIHJlc3VsdCBjb2xsZWN0aW9uIG9ubHkgaWYgYSBnaXZlbiB0aGVtZU5hbWVcbiAgICAgIC8vIGlzIHN1cHBvc2VkIHRvIGJlIGEgcGFyZW50IHRoZW1lXG4gICAgICBpZiAoaXNQYXJlbnQpIHtcbiAgICAgICAgZm91bmRQYXJlbnRUaGVtZXMucHVzaCh0aGVtZUZvbGRlcik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZvdW5kUGFyZW50VGhlbWVzO1xufVxuXG5leHBvcnQgeyBwcm9jZXNzVGhlbWVSZXNvdXJjZXMsIGV4dHJhY3RUaGVtZU5hbWUsIGZpbmRQYXJlbnRUaGVtZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXGFwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXGFwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblxcXFx0aGVtZS1nZW5lcmF0b3IuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2d1c3Rhdm8vRGVza3RvcC9wcm9ncmFtYXMvQXVkaWJsZS90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtZ2VuZXJhdG9yLmpzXCI7LypcbiAqIENvcHlyaWdodCAyMDAwLTIwMjQgVmFhZGluIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgZmlsZSBoYW5kbGVzIHRoZSBnZW5lcmF0aW9uIG9mIHRoZSAnW3RoZW1lLW5hbWVdLmpzJyB0b1xuICogdGhlIHRoZW1lcy9bdGhlbWUtbmFtZV0gZm9sZGVyIGFjY29yZGluZyB0byBwcm9wZXJ0aWVzIGZyb20gJ3RoZW1lLmpzb24nLlxuICovXG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGNoZWNrTW9kdWxlcyB9IGZyb20gJy4vdGhlbWUtY29weS5qcyc7XG5cbi8vIFNwZWNpYWwgZm9sZGVyIGluc2lkZSBhIHRoZW1lIGZvciBjb21wb25lbnQgdGhlbWVzIHRoYXQgZ28gaW5zaWRlIHRoZSBjb21wb25lbnQgc2hhZG93IHJvb3RcbmNvbnN0IHRoZW1lQ29tcG9uZW50c0ZvbGRlciA9ICdjb21wb25lbnRzJztcbi8vIFRoZSBjb250ZW50cyBvZiBhIGdsb2JhbCBDU1MgZmlsZSB3aXRoIHRoaXMgbmFtZSBpbiBhIHRoZW1lIGlzIGFsd2F5cyBhZGRlZCB0b1xuLy8gdGhlIGRvY3VtZW50LiBFLmcuIEBmb250LWZhY2UgbXVzdCBiZSBpbiB0aGlzXG5jb25zdCBkb2N1bWVudENzc0ZpbGVuYW1lID0gJ2RvY3VtZW50LmNzcyc7XG4vLyBzdHlsZXMuY3NzIGlzIHRoZSBvbmx5IGVudHJ5cG9pbnQgY3NzIGZpbGUgd2l0aCBkb2N1bWVudC5jc3MuIEV2ZXJ5dGhpbmcgZWxzZSBzaG91bGQgYmUgaW1wb3J0ZWQgdXNpbmcgY3NzIEBpbXBvcnRcbmNvbnN0IHN0eWxlc0Nzc0ZpbGVuYW1lID0gJ3N0eWxlcy5jc3MnO1xuXG5jb25zdCBDU1NJTVBPUlRfQ09NTUVOVCA9ICdDU1NJbXBvcnQgZW5kJztcbmNvbnN0IGhlYWRlckltcG9ydCA9IGBpbXBvcnQgJ2NvbnN0cnVjdC1zdHlsZS1zaGVldHMtcG9seWZpbGwnO1xuYDtcblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgW3RoZW1lTmFtZV0uanMgZmlsZSBmb3IgdGhlbWVGb2xkZXIgd2hpY2ggY29sbGVjdHMgYWxsIHJlcXVpcmVkIGluZm9ybWF0aW9uIGZyb20gdGhlIGZvbGRlci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhlbWVGb2xkZXIgZm9sZGVyIG9mIHRoZSB0aGVtZVxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBuYW1lIG9mIHRoZSBoYW5kbGVkIHRoZW1lXG4gKiBAcGFyYW0ge0pTT059IHRoZW1lUHJvcGVydGllcyBjb250ZW50IG9mIHRoZW1lLmpzb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIGJ1aWxkIG9wdGlvbnMgKGUuZy4gcHJvZCBvciBkZXYgbW9kZSlcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZW1lIGZpbGUgY29udGVudFxuICovXG5mdW5jdGlvbiB3cml0ZVRoZW1lRmlsZXModGhlbWVGb2xkZXIsIHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHByb2R1Y3Rpb25Nb2RlID0gIW9wdGlvbnMuZGV2TW9kZTtcbiAgY29uc3QgdXNlRGV2U2VydmVyT3JJblByb2R1Y3Rpb25Nb2RlID0gIW9wdGlvbnMudXNlRGV2QnVuZGxlO1xuICBjb25zdCBvdXRwdXRGb2xkZXIgPSBvcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyO1xuICBjb25zdCBzdHlsZXMgPSByZXNvbHZlKHRoZW1lRm9sZGVyLCBzdHlsZXNDc3NGaWxlbmFtZSk7XG4gIGNvbnN0IGRvY3VtZW50Q3NzRmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsIGRvY3VtZW50Q3NzRmlsZW5hbWUpO1xuICBjb25zdCBhdXRvSW5qZWN0Q29tcG9uZW50cyA9IHRoZW1lUHJvcGVydGllcy5hdXRvSW5qZWN0Q29tcG9uZW50cyA/PyB0cnVlO1xuICBjb25zdCBnbG9iYWxGaWxlbmFtZSA9ICd0aGVtZS0nICsgdGhlbWVOYW1lICsgJy5nbG9iYWwuZ2VuZXJhdGVkLmpzJztcbiAgY29uc3QgY29tcG9uZW50c0ZpbGVuYW1lID0gJ3RoZW1lLScgKyB0aGVtZU5hbWUgKyAnLmNvbXBvbmVudHMuZ2VuZXJhdGVkLmpzJztcbiAgY29uc3QgdGhlbWVGaWxlbmFtZSA9ICd0aGVtZS0nICsgdGhlbWVOYW1lICsgJy5nZW5lcmF0ZWQuanMnO1xuXG4gIGxldCB0aGVtZUZpbGVDb250ZW50ID0gaGVhZGVySW1wb3J0O1xuICBsZXQgZ2xvYmFsSW1wb3J0Q29udGVudCA9ICcvLyBXaGVuIHRoaXMgZmlsZSBpcyBpbXBvcnRlZCwgZ2xvYmFsIHN0eWxlcyBhcmUgYXV0b21hdGljYWxseSBhcHBsaWVkXFxuJztcbiAgbGV0IGNvbXBvbmVudHNGaWxlQ29udGVudCA9ICcnO1xuICB2YXIgY29tcG9uZW50c0ZpbGVzO1xuXG4gIGlmIChhdXRvSW5qZWN0Q29tcG9uZW50cykge1xuICAgIGNvbXBvbmVudHNGaWxlcyA9IGdsb2JTeW5jKCcqLmNzcycsIHtcbiAgICAgIGN3ZDogcmVzb2x2ZSh0aGVtZUZvbGRlciwgdGhlbWVDb21wb25lbnRzRm9sZGVyKSxcbiAgICAgIG5vZGlyOiB0cnVlXG4gICAgfSk7XG5cbiAgICBpZiAoY29tcG9uZW50c0ZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbXBvbmVudHNGaWxlQ29udGVudCArPVxuICAgICAgICBcImltcG9ydCB7IHVuc2FmZUNTUywgcmVnaXN0ZXJTdHlsZXMgfSBmcm9tICdAdmFhZGluL3ZhYWRpbi10aGVtYWJsZS1taXhpbi9yZWdpc3Rlci1zdHlsZXMnO1xcblwiO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGVtZVByb3BlcnRpZXMucGFyZW50KSB7XG4gICAgdGhlbWVGaWxlQ29udGVudCArPSBgaW1wb3J0IHsgYXBwbHlUaGVtZSBhcyBhcHBseUJhc2VUaGVtZSB9IGZyb20gJy4vdGhlbWUtJHt0aGVtZVByb3BlcnRpZXMucGFyZW50fS5nZW5lcmF0ZWQuanMnO1xcbmA7XG4gIH1cblxuICB0aGVtZUZpbGVDb250ZW50ICs9IGBpbXBvcnQgeyBpbmplY3RHbG9iYWxDc3MgfSBmcm9tICdGcm9udGVuZC9nZW5lcmF0ZWQvamFyLXJlc291cmNlcy90aGVtZS11dGlsLmpzJztcXG5gO1xuICB0aGVtZUZpbGVDb250ZW50ICs9IGBpbXBvcnQgJy4vJHtjb21wb25lbnRzRmlsZW5hbWV9JztcXG5gO1xuXG4gIHRoZW1lRmlsZUNvbnRlbnQgKz0gYGxldCBuZWVkc1JlbG9hZE9uQ2hhbmdlcyA9IGZhbHNlO1xcbmA7XG4gIGNvbnN0IGltcG9ydHMgPSBbXTtcbiAgY29uc3QgY29tcG9uZW50Q3NzSW1wb3J0cyA9IFtdO1xuICBjb25zdCBnbG9iYWxGaWxlQ29udGVudCA9IFtdO1xuICBjb25zdCBnbG9iYWxDc3NDb2RlID0gW107XG4gIGNvbnN0IHNoYWRvd09ubHlDc3MgPSBbXTtcbiAgY29uc3QgY29tcG9uZW50Q3NzQ29kZSA9IFtdO1xuICBjb25zdCBwYXJlbnRUaGVtZSA9IHRoZW1lUHJvcGVydGllcy5wYXJlbnQgPyAnYXBwbHlCYXNlVGhlbWUodGFyZ2V0KTtcXG4nIDogJyc7XG4gIGNvbnN0IHBhcmVudFRoZW1lR2xvYmFsSW1wb3J0ID0gdGhlbWVQcm9wZXJ0aWVzLnBhcmVudFxuICAgID8gYGltcG9ydCAnLi90aGVtZS0ke3RoZW1lUHJvcGVydGllcy5wYXJlbnR9Lmdsb2JhbC5nZW5lcmF0ZWQuanMnO1xcbmBcbiAgICA6ICcnO1xuXG4gIGNvbnN0IHRoZW1lSWRlbnRpZmllciA9ICdfdmFhZGludGhlbWVfJyArIHRoZW1lTmFtZSArICdfJztcbiAgY29uc3QgbHVtb0Nzc0ZsYWcgPSAnX3ZhYWRpbnRoZW1lbHVtb2ltcG9ydHNfJztcbiAgY29uc3QgZ2xvYmFsQ3NzRmxhZyA9IHRoZW1lSWRlbnRpZmllciArICdnbG9iYWxDc3MnO1xuICBjb25zdCBjb21wb25lbnRDc3NGbGFnID0gdGhlbWVJZGVudGlmaWVyICsgJ2NvbXBvbmVudENzcyc7XG5cbiAgaWYgKCFleGlzdHNTeW5jKHN0eWxlcykpIHtcbiAgICBpZiAocHJvZHVjdGlvbk1vZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc3R5bGVzLmNzcyBmaWxlIGlzIG1pc3NpbmcgYW5kIGlzIG5lZWRlZCBmb3IgJyR7dGhlbWVOYW1lfScgaW4gZm9sZGVyICcke3RoZW1lRm9sZGVyfSdgKTtcbiAgICB9XG4gICAgd3JpdGVGaWxlU3luYyhcbiAgICAgIHN0eWxlcyxcbiAgICAgICcvKiBJbXBvcnQgeW91ciBhcHBsaWNhdGlvbiBnbG9iYWwgY3NzIGZpbGVzIGhlcmUgb3IgYWRkIHRoZSBzdHlsZXMgZGlyZWN0bHkgdG8gdGhpcyBmaWxlICovJyxcbiAgICAgICd1dGY4J1xuICAgICk7XG4gIH1cblxuICAvLyBzdHlsZXMuY3NzIHdpbGwgYWx3YXlzIGJlIGF2YWlsYWJsZSBhcyB3ZSB3cml0ZSBvbmUgaWYgaXQgZG9lc24ndCBleGlzdC5cbiAgbGV0IGZpbGVuYW1lID0gYmFzZW5hbWUoc3R5bGVzKTtcbiAgbGV0IHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcblxuICAvKiBMVU1PICovXG4gIGNvbnN0IGx1bW9JbXBvcnRzID0gdGhlbWVQcm9wZXJ0aWVzLmx1bW9JbXBvcnRzIHx8IFsnY29sb3InLCAndHlwb2dyYXBoeSddO1xuICBpZiAobHVtb0ltcG9ydHMpIHtcbiAgICBsdW1vSW1wb3J0cy5mb3JFYWNoKChsdW1vSW1wb3J0KSA9PiB7XG4gICAgICBpbXBvcnRzLnB1c2goYGltcG9ydCB7ICR7bHVtb0ltcG9ydH0gfSBmcm9tICdAdmFhZGluL3ZhYWRpbi1sdW1vLXN0eWxlcy8ke2x1bW9JbXBvcnR9LmpzJztcXG5gKTtcbiAgICAgIGlmIChsdW1vSW1wb3J0ID09PSAndXRpbGl0eScgfHwgbHVtb0ltcG9ydCA9PT0gJ2JhZGdlJyB8fCBsdW1vSW1wb3J0ID09PSAndHlwb2dyYXBoeScgfHwgbHVtb0ltcG9ydCA9PT0gJ2NvbG9yJykge1xuICAgICAgICAvLyBJbmplY3QgaW50byBtYWluIGRvY3VtZW50IHRoZSBzYW1lIHdheSBhcyBvdGhlciBMdW1vIHN0eWxlcyBhcmUgaW5qZWN0ZWRcbiAgICAgICAgLy8gTHVtbyBpbXBvcnRzIGdvIHRvIHRoZSB0aGVtZSBnbG9iYWwgaW1wb3J0cyBmaWxlIHRvIHByZXZlbnQgc3R5bGUgbGVha3NcbiAgICAgICAgLy8gd2hlbiB0aGUgdGhlbWUgaXMgYXBwbGllZCB0byBhbiBlbWJlZGRlZCBjb21wb25lbnRcbiAgICAgICAgZ2xvYmFsRmlsZUNvbnRlbnQucHVzaChgaW1wb3J0ICdAdmFhZGluL3ZhYWRpbi1sdW1vLXN0eWxlcy8ke2x1bW9JbXBvcnR9LWdsb2JhbC5qcyc7XFxuYCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsdW1vSW1wb3J0cy5mb3JFYWNoKChsdW1vSW1wb3J0KSA9PiB7XG4gICAgICAvLyBMdW1vIGlzIGluamVjdGVkIHRvIHRoZSBkb2N1bWVudCBieSBMdW1vIGl0c2VsZlxuICAgICAgc2hhZG93T25seUNzcy5wdXNoKGByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke2x1bW9JbXBvcnR9LmNzc1RleHQsICcnLCB0YXJnZXQsIHRydWUpKTtcXG5gKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIFRoZW1lICovXG4gIGlmICh1c2VEZXZTZXJ2ZXJPckluUHJvZHVjdGlvbk1vZGUpIHtcbiAgICBnbG9iYWxGaWxlQ29udGVudC5wdXNoKHBhcmVudFRoZW1lR2xvYmFsSW1wb3J0KTtcbiAgICBnbG9iYWxGaWxlQ29udGVudC5wdXNoKGBpbXBvcnQgJ3RoZW1lcy8ke3RoZW1lTmFtZX0vJHtmaWxlbmFtZX0nO1xcbmApO1xuXG4gICAgaW1wb3J0cy5wdXNoKGBpbXBvcnQgJHt2YXJpYWJsZX0gZnJvbSAndGhlbWVzLyR7dGhlbWVOYW1lfS8ke2ZpbGVuYW1lfT9pbmxpbmUnO1xcbmApO1xuICAgIHNoYWRvd09ubHlDc3MucHVzaChgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwgJycsIHRhcmdldCkpO1xcbiAgICBgKTtcbiAgfVxuICBpZiAoZXhpc3RzU3luYyhkb2N1bWVudENzc0ZpbGUpKSB7XG4gICAgZmlsZW5hbWUgPSBiYXNlbmFtZShkb2N1bWVudENzc0ZpbGUpO1xuICAgIHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcblxuICAgIGlmICh1c2VEZXZTZXJ2ZXJPckluUHJvZHVjdGlvbk1vZGUpIHtcbiAgICAgIGdsb2JhbEZpbGVDb250ZW50LnB1c2goYGltcG9ydCAndGhlbWVzLyR7dGhlbWVOYW1lfS8ke2ZpbGVuYW1lfSc7XFxuYCk7XG5cbiAgICAgIGltcG9ydHMucHVzaChgaW1wb3J0ICR7dmFyaWFibGV9IGZyb20gJ3RoZW1lcy8ke3RoZW1lTmFtZX0vJHtmaWxlbmFtZX0/aW5saW5lJztcXG5gKTtcbiAgICAgIHNoYWRvd09ubHlDc3MucHVzaChgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwnJywgZG9jdW1lbnQpKTtcXG4gICAgYCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IGkgPSAwO1xuICBpZiAodGhlbWVQcm9wZXJ0aWVzLmRvY3VtZW50Q3NzKSB7XG4gICAgY29uc3QgbWlzc2luZ01vZHVsZXMgPSBjaGVja01vZHVsZXModGhlbWVQcm9wZXJ0aWVzLmRvY3VtZW50Q3NzKTtcbiAgICBpZiAobWlzc2luZ01vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgIFwiTWlzc2luZyBucG0gbW9kdWxlcyBvciBmaWxlcyAnXCIgK1xuICAgICAgICAgIG1pc3NpbmdNb2R1bGVzLmpvaW4oXCInLCAnXCIpICtcbiAgICAgICAgICBcIicgZm9yIGRvY3VtZW50Q3NzIG1hcmtlZCBpbiAndGhlbWUuanNvbicuXFxuXCIgK1xuICAgICAgICAgIFwiSW5zdGFsbCBvciB1cGRhdGUgcGFja2FnZShzKSBieSBhZGRpbmcgYSBATnBtUGFja2FnZSBhbm5vdGF0aW9uIG9yIGluc3RhbGwgaXQgdXNpbmcgJ25wbS9wbnBtL2J1biBpJ1wiXG4gICAgICApO1xuICAgIH1cbiAgICB0aGVtZVByb3BlcnRpZXMuZG9jdW1lbnRDc3MuZm9yRWFjaCgoY3NzSW1wb3J0KSA9PiB7XG4gICAgICBjb25zdCB2YXJpYWJsZSA9ICdtb2R1bGUnICsgaSsrO1xuICAgICAgaW1wb3J0cy5wdXNoKGBpbXBvcnQgJHt2YXJpYWJsZX0gZnJvbSAnJHtjc3NJbXBvcnR9P2lubGluZSc7XFxuYCk7XG4gICAgICAvLyBEdWUgdG8gY2hyb21lIGJ1ZyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0zMzY4NzYgZm9udC1mYWNlIHdpbGwgbm90IHdvcmtcbiAgICAgIC8vIGluc2lkZSBzaGFkb3dSb290IHNvIHdlIG5lZWQgdG8gaW5qZWN0IGl0IHRoZXJlIGFsc28uXG4gICAgICBnbG9iYWxDc3NDb2RlLnB1c2goYGlmKHRhcmdldCAhPT0gZG9jdW1lbnQpIHtcbiAgICAgICAgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwgJycsIHRhcmdldCkpO1xuICAgIH1cXG4gICAgYCk7XG4gICAgICBnbG9iYWxDc3NDb2RlLnB1c2goXG4gICAgICAgIGByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke3ZhcmlhYmxlfS50b1N0cmluZygpLCAnJHtDU1NJTVBPUlRfQ09NTUVOVH0nLCBkb2N1bWVudCkpO1xcbiAgICBgXG4gICAgICApO1xuICAgIH0pO1xuICB9XG4gIGlmICh0aGVtZVByb3BlcnRpZXMuaW1wb3J0Q3NzKSB7XG4gICAgY29uc3QgbWlzc2luZ01vZHVsZXMgPSBjaGVja01vZHVsZXModGhlbWVQcm9wZXJ0aWVzLmltcG9ydENzcyk7XG4gICAgaWYgKG1pc3NpbmdNb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBcIk1pc3NpbmcgbnBtIG1vZHVsZXMgb3IgZmlsZXMgJ1wiICtcbiAgICAgICAgICBtaXNzaW5nTW9kdWxlcy5qb2luKFwiJywgJ1wiKSArXG4gICAgICAgICAgXCInIGZvciBpbXBvcnRDc3MgbWFya2VkIGluICd0aGVtZS5qc29uJy5cXG5cIiArXG4gICAgICAgICAgXCJJbnN0YWxsIG9yIHVwZGF0ZSBwYWNrYWdlKHMpIGJ5IGFkZGluZyBhIEBOcG1QYWNrYWdlIGFubm90YXRpb24gb3IgaW5zdGFsbCBpdCB1c2luZyAnbnBtL3BucG0vYnVuIGknXCJcbiAgICAgICk7XG4gICAgfVxuICAgIHRoZW1lUHJvcGVydGllcy5pbXBvcnRDc3MuZm9yRWFjaCgoY3NzUGF0aCkgPT4ge1xuICAgICAgY29uc3QgdmFyaWFibGUgPSAnbW9kdWxlJyArIGkrKztcbiAgICAgIGdsb2JhbEZpbGVDb250ZW50LnB1c2goYGltcG9ydCAnJHtjc3NQYXRofSc7XFxuYCk7XG4gICAgICBpbXBvcnRzLnB1c2goYGltcG9ydCAke3ZhcmlhYmxlfSBmcm9tICcke2Nzc1BhdGh9P2lubGluZSc7XFxuYCk7XG4gICAgICBzaGFkb3dPbmx5Q3NzLnB1c2goYHJlbW92ZXJzLnB1c2goaW5qZWN0R2xvYmFsQ3NzKCR7dmFyaWFibGV9LnRvU3RyaW5nKCksICcke0NTU0lNUE9SVF9DT01NRU5UfScsIHRhcmdldCkpO1xcbmApO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKGF1dG9JbmplY3RDb21wb25lbnRzKSB7XG4gICAgY29tcG9uZW50c0ZpbGVzLmZvckVhY2goKGNvbXBvbmVudENzcykgPT4ge1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSBiYXNlbmFtZShjb21wb25lbnRDc3MpO1xuICAgICAgY29uc3QgdGFnID0gZmlsZW5hbWUucmVwbGFjZSgnLmNzcycsICcnKTtcbiAgICAgIGNvbnN0IHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcbiAgICAgIGNvbXBvbmVudENzc0ltcG9ydHMucHVzaChcbiAgICAgICAgYGltcG9ydCAke3ZhcmlhYmxlfSBmcm9tICd0aGVtZXMvJHt0aGVtZU5hbWV9LyR7dGhlbWVDb21wb25lbnRzRm9sZGVyfS8ke2ZpbGVuYW1lfT9pbmxpbmUnO1xcbmBcbiAgICAgICk7XG4gICAgICAvLyBEb24ndCBmb3JtYXQgYXMgdGhlIGdlbmVyYXRlZCBmaWxlIGZvcm1hdHRpbmcgd2lsbCBnZXQgd29ua3khXG4gICAgICBjb25zdCBjb21wb25lbnRTdHJpbmcgPSBgcmVnaXN0ZXJTdHlsZXMoXG4gICAgICAgICcke3RhZ30nLFxuICAgICAgICB1bnNhZmVDU1MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSlcbiAgICAgICk7XG4gICAgICBgO1xuICAgICAgY29tcG9uZW50Q3NzQ29kZS5wdXNoKGNvbXBvbmVudFN0cmluZyk7XG4gICAgfSk7XG4gIH1cblxuICB0aGVtZUZpbGVDb250ZW50ICs9IGltcG9ydHMuam9pbignJyk7XG5cbiAgLy8gRG9uJ3QgZm9ybWF0IGFzIHRoZSBnZW5lcmF0ZWQgZmlsZSBmb3JtYXR0aW5nIHdpbGwgZ2V0IHdvbmt5IVxuICAvLyBJZiB0YXJnZXRzIGNoZWNrIHRoYXQgd2Ugb25seSByZWdpc3RlciB0aGUgc3R5bGUgcGFydHMgb25jZSwgY2hlY2tzIGV4aXN0IGZvciBnbG9iYWwgY3NzIGFuZCBjb21wb25lbnQgY3NzXG4gIGNvbnN0IHRoZW1lRmlsZUFwcGx5ID0gYFxuICBsZXQgdGhlbWVSZW1vdmVycyA9IG5ldyBXZWFrTWFwKCk7XG4gIGxldCB0YXJnZXRzID0gW107XG5cbiAgZXhwb3J0IGNvbnN0IGFwcGx5VGhlbWUgPSAodGFyZ2V0KSA9PiB7XG4gICAgY29uc3QgcmVtb3ZlcnMgPSBbXTtcbiAgICBpZiAodGFyZ2V0ICE9PSBkb2N1bWVudCkge1xuICAgICAgJHtzaGFkb3dPbmx5Q3NzLmpvaW4oJycpfVxuICAgIH1cbiAgICAke3BhcmVudFRoZW1lfVxuICAgICR7Z2xvYmFsQ3NzQ29kZS5qb2luKCcnKX1cblxuICAgIGlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgICAgIHRhcmdldHMucHVzaChuZXcgV2Vha1JlZih0YXJnZXQpKTtcbiAgICAgIHRoZW1lUmVtb3ZlcnMuc2V0KHRhcmdldCwgcmVtb3ZlcnMpO1xuICAgIH1cblxuICB9XG4gIFxuYDtcbiAgY29tcG9uZW50c0ZpbGVDb250ZW50ICs9IGBcbiR7Y29tcG9uZW50Q3NzSW1wb3J0cy5qb2luKCcnKX1cblxuaWYgKCFkb2N1bWVudFsnJHtjb21wb25lbnRDc3NGbGFnfSddKSB7XG4gICR7Y29tcG9uZW50Q3NzQ29kZS5qb2luKCcnKX1cbiAgZG9jdW1lbnRbJyR7Y29tcG9uZW50Q3NzRmxhZ30nXSA9IHRydWU7XG59XG5cbmlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgaW1wb3J0Lm1ldGEuaG90LmFjY2VwdCgobW9kdWxlKSA9PiB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9KTtcbn1cblxuYDtcblxuICB0aGVtZUZpbGVDb250ZW50ICs9IHRoZW1lRmlsZUFwcGx5O1xuICB0aGVtZUZpbGVDb250ZW50ICs9IGBcbmlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgaW1wb3J0Lm1ldGEuaG90LmFjY2VwdCgobW9kdWxlKSA9PiB7XG5cbiAgICBpZiAobmVlZHNSZWxvYWRPbkNoYW5nZXMpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldFJlZiA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRhcmdldFJlZi5kZXJlZigpO1xuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgdGhlbWVSZW1vdmVycy5nZXQodGFyZ2V0KS5mb3JFYWNoKHJlbW92ZXIgPT4gcmVtb3ZlcigpKVxuICAgICAgICAgIG1vZHVsZS5hcHBseVRoZW1lKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KTtcblxuICBpbXBvcnQubWV0YS5ob3Qub24oJ3ZpdGU6YWZ0ZXJVcGRhdGUnLCAodXBkYXRlKSA9PiB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3ZhYWRpbi10aGVtZS11cGRhdGVkJywgeyBkZXRhaWw6IHVwZGF0ZSB9KSk7XG4gIH0pO1xufVxuXG5gO1xuXG4gIGdsb2JhbEltcG9ydENvbnRlbnQgKz0gYFxuJHtnbG9iYWxGaWxlQ29udGVudC5qb2luKCcnKX1cbmA7XG5cbiAgd3JpdGVJZkNoYW5nZWQocmVzb2x2ZShvdXRwdXRGb2xkZXIsIGdsb2JhbEZpbGVuYW1lKSwgZ2xvYmFsSW1wb3J0Q29udGVudCk7XG4gIHdyaXRlSWZDaGFuZ2VkKHJlc29sdmUob3V0cHV0Rm9sZGVyLCB0aGVtZUZpbGVuYW1lKSwgdGhlbWVGaWxlQ29udGVudCk7XG4gIHdyaXRlSWZDaGFuZ2VkKHJlc29sdmUob3V0cHV0Rm9sZGVyLCBjb21wb25lbnRzRmlsZW5hbWUpLCBjb21wb25lbnRzRmlsZUNvbnRlbnQpO1xufVxuXG5mdW5jdGlvbiB3cml0ZUlmQ2hhbmdlZChmaWxlLCBkYXRhKSB7XG4gIGlmICghZXhpc3RzU3luYyhmaWxlKSB8fCByZWFkRmlsZVN5bmMoZmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSAhPT0gZGF0YSkge1xuICAgIHdyaXRlRmlsZVN5bmMoZmlsZSwgZGF0YSk7XG4gIH1cbn1cblxuLyoqXG4gKiBNYWtlIGdpdmVuIHN0cmluZyBpbnRvIGNhbWVsQ2FzZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIHN0cmluZyB0byBtYWtlIGludG8gY2FtZUNhc2VcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNhbWVsQ2FzZWQgdmVyc2lvblxuICovXG5mdW5jdGlvbiBjYW1lbENhc2Uoc3RyKSB7XG4gIHJldHVybiBzdHJcbiAgICAucmVwbGFjZSgvKD86Xlxcd3xbQS1aXXxcXGJcXHcpL2csIGZ1bmN0aW9uICh3b3JkLCBpbmRleCkge1xuICAgICAgcmV0dXJuIGluZGV4ID09PSAwID8gd29yZC50b0xvd2VyQ2FzZSgpIDogd29yZC50b1VwcGVyQ2FzZSgpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoL1xccysvZywgJycpXG4gICAgLnJlcGxhY2UoL1xcLnxcXC0vZywgJycpO1xufVxuXG5leHBvcnQgeyB3cml0ZVRoZW1lRmlsZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXGFwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXGFwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblxcXFx0aGVtZS1jb3B5LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9ndXN0YXZvL0Rlc2t0b3AvcHJvZ3JhbWFzL0F1ZGlibGUvdGFyZ2V0L3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luL3RoZW1lLWNvcHkuanNcIjsvKlxuICogQ29weXJpZ2h0IDIwMDAtMjAyNCBWYWFkaW4gTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90XG4gKiB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZlxuICogdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVRcbiAqIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZVxuICogTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXJcbiAqIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogVGhpcyBjb250YWlucyBmdW5jdGlvbnMgYW5kIGZlYXR1cmVzIHVzZWQgdG8gY29weSB0aGVtZSBmaWxlcy5cbiAqL1xuXG5pbXBvcnQgeyByZWFkZGlyU3luYywgc3RhdFN5bmMsIG1rZGlyU3luYywgZXhpc3RzU3luYywgY29weUZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUsIHJlbGF0aXZlLCBleHRuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InO1xuXG5jb25zdCBpZ25vcmVkRmlsZUV4dGVuc2lvbnMgPSBbJy5jc3MnLCAnLmpzJywgJy5qc29uJ107XG5cbi8qKlxuICogQ29weSB0aGVtZSBzdGF0aWMgcmVzb3VyY2VzIHRvIHN0YXRpYyBhc3NldHMgZm9sZGVyLiBBbGwgZmlsZXMgaW4gdGhlIHRoZW1lXG4gKiBmb2xkZXIgd2lsbCBiZSBjb3BpZWQgZXhjbHVkaW5nIGNzcywganMgYW5kIGpzb24gZmlsZXMgdGhhdCB3aWxsIGJlXG4gKiBoYW5kbGVkIGJ5IHdlYnBhY2sgYW5kIG5vdCBiZSBzaGFyZWQgYXMgc3RhdGljIGZpbGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZUZvbGRlciBGb2xkZXIgd2l0aCB0aGVtZSBmaWxlXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciByZXNvdXJjZXMgb3V0cHV0IGZvbGRlclxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIGNvcHlUaGVtZVJlc291cmNlcyh0aGVtZUZvbGRlciwgcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciwgbG9nZ2VyKSB7XG4gIGNvbnN0IHN0YXRpY0Fzc2V0c1RoZW1lRm9sZGVyID0gcmVzb2x2ZShwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCAndGhlbWVzJywgYmFzZW5hbWUodGhlbWVGb2xkZXIpKTtcbiAgY29uc3QgY29sbGVjdGlvbiA9IGNvbGxlY3RGb2xkZXJzKHRoZW1lRm9sZGVyLCBsb2dnZXIpO1xuXG4gIC8vIE9ubHkgY3JlYXRlIGFzc2V0cyBmb2xkZXIgaWYgdGhlcmUgYXJlIGZpbGVzIHRvIGNvcHkuXG4gIGlmIChjb2xsZWN0aW9uLmZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICBta2RpclN5bmMoc3RhdGljQXNzZXRzVGhlbWVGb2xkZXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgIC8vIGNyZWF0ZSBmb2xkZXJzIHdpdGhcbiAgICBjb2xsZWN0aW9uLmRpcmVjdG9yaWVzLmZvckVhY2goKGRpcmVjdG9yeSkgPT4ge1xuICAgICAgY29uc3QgcmVsYXRpdmVEaXJlY3RvcnkgPSByZWxhdGl2ZSh0aGVtZUZvbGRlciwgZGlyZWN0b3J5KTtcbiAgICAgIGNvbnN0IHRhcmdldERpcmVjdG9yeSA9IHJlc29sdmUoc3RhdGljQXNzZXRzVGhlbWVGb2xkZXIsIHJlbGF0aXZlRGlyZWN0b3J5KTtcblxuICAgICAgbWtkaXJTeW5jKHRhcmdldERpcmVjdG9yeSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgfSk7XG5cbiAgICBjb2xsZWN0aW9uLmZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlRmlsZSA9IHJlbGF0aXZlKHRoZW1lRm9sZGVyLCBmaWxlKTtcbiAgICAgIGNvbnN0IHRhcmdldEZpbGUgPSByZXNvbHZlKHN0YXRpY0Fzc2V0c1RoZW1lRm9sZGVyLCByZWxhdGl2ZUZpbGUpO1xuICAgICAgY29weUZpbGVJZkFic2VudE9yTmV3ZXIoZmlsZSwgdGFyZ2V0RmlsZSwgbG9nZ2VyKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbGxlY3QgYWxsIGZvbGRlcnMgd2l0aCBjb3B5YWJsZSBmaWxlcyBhbmQgYWxsIGZpbGVzIHRvIGJlIGNvcGllZC5cbiAqIEZvbGVkIHdpbGwgbm90IGJlIGFkZGVkIGlmIG5vIGZpbGVzIGluIGZvbGRlciBvciBzdWJmb2xkZXJzLlxuICpcbiAqIEZpbGVzIHdpbGwgbm90IGNvbnRhaW4gZmlsZXMgd2l0aCBpZ25vcmVkIGV4dGVuc2lvbnMgYW5kIGZvbGRlcnMgb25seSBjb250YWluaW5nIGlnbm9yZWQgZmlsZXMgd2lsbCBub3QgYmUgYWRkZWQuXG4gKlxuICogQHBhcmFtIGZvbGRlclRvQ29weSBmb2xkZXIgd2Ugd2lsbCBjb3B5IGZpbGVzIGZyb21cbiAqIEBwYXJhbSBsb2dnZXIgcGx1Z2luIGxvZ2dlclxuICogQHJldHVybiB7e2RpcmVjdG9yaWVzOiBbXSwgZmlsZXM6IFtdfX0gb2JqZWN0IGNvbnRhaW5pbmcgZGlyZWN0b3JpZXMgdG8gY3JlYXRlIGFuZCBmaWxlcyB0byBjb3B5XG4gKi9cbmZ1bmN0aW9uIGNvbGxlY3RGb2xkZXJzKGZvbGRlclRvQ29weSwgbG9nZ2VyKSB7XG4gIGNvbnN0IGNvbGxlY3Rpb24gPSB7IGRpcmVjdG9yaWVzOiBbXSwgZmlsZXM6IFtdIH07XG4gIGxvZ2dlci50cmFjZSgnZmlsZXMgaW4gZGlyZWN0b3J5JywgcmVhZGRpclN5bmMoZm9sZGVyVG9Db3B5KSk7XG4gIHJlYWRkaXJTeW5jKGZvbGRlclRvQ29weSkuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgIGNvbnN0IGZpbGVUb0NvcHkgPSByZXNvbHZlKGZvbGRlclRvQ29weSwgZmlsZSk7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChzdGF0U3luYyhmaWxlVG9Db3B5KS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnR29pbmcgdGhyb3VnaCBkaXJlY3RvcnknLCBmaWxlVG9Db3B5KTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29sbGVjdEZvbGRlcnMoZmlsZVRvQ29weSwgbG9nZ2VyKTtcbiAgICAgICAgaWYgKHJlc3VsdC5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3Rvcmllcy5wdXNoKGZpbGVUb0NvcHkpO1xuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQWRkaW5nIGRpcmVjdG9yeScsIGZpbGVUb0NvcHkpO1xuICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0b3JpZXMucHVzaC5hcHBseShjb2xsZWN0aW9uLmRpcmVjdG9yaWVzLCByZXN1bHQuZGlyZWN0b3JpZXMpO1xuICAgICAgICAgIGNvbGxlY3Rpb24uZmlsZXMucHVzaC5hcHBseShjb2xsZWN0aW9uLmZpbGVzLCByZXN1bHQuZmlsZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFpZ25vcmVkRmlsZUV4dGVuc2lvbnMuaW5jbHVkZXMoZXh0bmFtZShmaWxlVG9Db3B5KSkpIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdBZGRpbmcgZmlsZScsIGZpbGVUb0NvcHkpO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbGVzLnB1c2goZmlsZVRvQ29weSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGhhbmRsZU5vU3VjaEZpbGVFcnJvcihmaWxlVG9Db3B5LCBlcnJvciwgbG9nZ2VyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gY29sbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBDb3B5IGFueSBzdGF0aWMgbm9kZV9tb2R1bGVzIGFzc2V0cyBtYXJrZWQgaW4gdGhlbWUuanNvbiB0b1xuICogcHJvamVjdCBzdGF0aWMgYXNzZXRzIGZvbGRlci5cbiAqXG4gKiBUaGUgdGhlbWUuanNvbiBjb250ZW50IGZvciBhc3NldHMgaXMgc2V0IHVwIGFzOlxuICoge1xuICogICBhc3NldHM6IHtcbiAqICAgICBcIm5vZGVfbW9kdWxlIGlkZW50aWZpZXJcIjoge1xuICogICAgICAgXCJjb3B5LXJ1bGVcIjogXCJ0YXJnZXQvZm9sZGVyXCIsXG4gKiAgICAgfVxuICogICB9XG4gKiB9XG4gKlxuICogVGhpcyB3b3VsZCBtZWFuIHRoYXQgYW4gYXNzZXQgd291bGQgYmUgYnVpbHQgYXM6XG4gKiBcIkBmb3J0YXdlc29tZS9mb250YXdlc29tZS1mcmVlXCI6IHtcbiAqICAgXCJzdmdzL3JlZ3VsYXIvKipcIjogXCJmb3J0YXdlc29tZS9pY29uc1wiXG4gKiB9XG4gKiBXaGVyZSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLWZyZWUnIGlzIHRoZSBucG0gcGFja2FnZSwgJ3N2Z3MvcmVndWxhci8qKicgaXMgd2hhdCBzaG91bGQgYmUgY29waWVkXG4gKiBhbmQgJ2ZvcnRhd2Vzb21lL2ljb25zJyBpcyB0aGUgdGFyZ2V0IGRpcmVjdG9yeSB1bmRlciBwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyIHdoZXJlIHRoaW5nc1xuICogd2lsbCBnZXQgY29waWVkIHRvLlxuICpcbiAqIE5vdGUhIHRoZXJlIGNhbiBiZSBtdWx0aXBsZSBjb3B5LXJ1bGVzIHdpdGggdGFyZ2V0IGZvbGRlcnMgZm9yIG9uZSBucG0gcGFja2FnZSBhc3NldC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhlbWVOYW1lIG5hbWUgb2YgdGhlIHRoZW1lIHdlIGFyZSBjb3B5aW5nIGFzc2V0cyBmb3JcbiAqIEBwYXJhbSB7anNvbn0gdGhlbWVQcm9wZXJ0aWVzIHRoZW1lIHByb3BlcnRpZXMganNvbiB3aXRoIGRhdGEgb24gYXNzZXRzXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciBwcm9qZWN0IG91dHB1dCBmb2xkZXIgd2hlcmUgd2UgY29weSBhc3NldHMgdG8gdW5kZXIgdGhlbWUvW3RoZW1lTmFtZV1cbiAqIEBwYXJhbSB7b2JqZWN0fSBsb2dnZXIgcGx1Z2luIGxvZ2dlclxuICovXG5mdW5jdGlvbiBjb3B5U3RhdGljQXNzZXRzKHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCBsb2dnZXIpIHtcbiAgY29uc3QgYXNzZXRzID0gdGhlbWVQcm9wZXJ0aWVzWydhc3NldHMnXTtcbiAgaWYgKCFhc3NldHMpIHtcbiAgICBsb2dnZXIuZGVidWcoJ25vIGFzc2V0cyB0byBoYW5kbGUgbm8gc3RhdGljIGFzc2V0cyB3ZXJlIGNvcGllZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG1rZGlyU3luYyhwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCB7XG4gICAgcmVjdXJzaXZlOiB0cnVlXG4gIH0pO1xuICBjb25zdCBtaXNzaW5nTW9kdWxlcyA9IGNoZWNrTW9kdWxlcyhPYmplY3Qua2V5cyhhc3NldHMpKTtcbiAgaWYgKG1pc3NpbmdNb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBFcnJvcihcbiAgICAgIFwiTWlzc2luZyBucG0gbW9kdWxlcyAnXCIgK1xuICAgICAgICBtaXNzaW5nTW9kdWxlcy5qb2luKFwiJywgJ1wiKSArXG4gICAgICAgIFwiJyBmb3IgYXNzZXRzIG1hcmtlZCBpbiAndGhlbWUuanNvbicuXFxuXCIgK1xuICAgICAgICBcIkluc3RhbGwgcGFja2FnZShzKSBieSBhZGRpbmcgYSBATnBtUGFja2FnZSBhbm5vdGF0aW9uIG9yIGluc3RhbGwgaXQgdXNpbmcgJ25wbS9wbnBtL2J1biBpJ1wiXG4gICAgKTtcbiAgfVxuICBPYmplY3Qua2V5cyhhc3NldHMpLmZvckVhY2goKG1vZHVsZSkgPT4ge1xuICAgIGNvbnN0IGNvcHlSdWxlcyA9IGFzc2V0c1ttb2R1bGVdO1xuICAgIE9iamVjdC5rZXlzKGNvcHlSdWxlcykuZm9yRWFjaCgoY29weVJ1bGUpID0+IHtcbiAgICAgIGNvbnN0IG5vZGVTb3VyY2VzID0gcmVzb2x2ZSgnbm9kZV9tb2R1bGVzLycsIG1vZHVsZSwgY29weVJ1bGUpO1xuICAgICAgY29uc3QgZmlsZXMgPSBnbG9iU3luYyhub2RlU291cmNlcywgeyBub2RpcjogdHJ1ZSB9KTtcbiAgICAgIGNvbnN0IHRhcmdldEZvbGRlciA9IHJlc29sdmUocHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciwgJ3RoZW1lcycsIHRoZW1lTmFtZSwgY29weVJ1bGVzW2NvcHlSdWxlXSk7XG5cbiAgICAgIG1rZGlyU3luYyh0YXJnZXRGb2xkZXIsIHtcbiAgICAgICAgcmVjdXJzaXZlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgY29uc3QgY29weVRhcmdldCA9IHJlc29sdmUodGFyZ2V0Rm9sZGVyLCBiYXNlbmFtZShmaWxlKSk7XG4gICAgICAgIGNvcHlGaWxlSWZBYnNlbnRPck5ld2VyKGZpbGUsIGNvcHlUYXJnZXQsIGxvZ2dlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrTW9kdWxlcyhtb2R1bGVzKSB7XG4gIGNvbnN0IG1pc3NpbmcgPSBbXTtcblxuICBtb2R1bGVzLmZvckVhY2goKG1vZHVsZSkgPT4ge1xuICAgIGlmICghZXhpc3RzU3luYyhyZXNvbHZlKCdub2RlX21vZHVsZXMvJywgbW9kdWxlKSkpIHtcbiAgICAgIG1pc3NpbmcucHVzaChtb2R1bGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG1pc3Npbmc7XG59XG5cbi8qKlxuICogQ29waWVzIGdpdmVuIGZpbGUgdG8gYSBnaXZlbiB0YXJnZXQgcGF0aCwgaWYgdGFyZ2V0IGZpbGUgZG9lc24ndCBleGlzdCBvciBpZlxuICogZmlsZSB0byBjb3B5IGlzIG5ld2VyLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVUb0NvcHkgcGF0aCBvZiB0aGUgZmlsZSB0byBjb3B5XG4gKiBAcGFyYW0ge3N0cmluZ30gY29weVRhcmdldCBwYXRoIG9mIHRoZSB0YXJnZXQgZmlsZVxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIGNvcHlGaWxlSWZBYnNlbnRPck5ld2VyKGZpbGVUb0NvcHksIGNvcHlUYXJnZXQsIGxvZ2dlcikge1xuICB0cnkge1xuICAgIGlmICghZXhpc3RzU3luYyhjb3B5VGFyZ2V0KSB8fCBzdGF0U3luYyhjb3B5VGFyZ2V0KS5tdGltZSA8IHN0YXRTeW5jKGZpbGVUb0NvcHkpLm10aW1lKSB7XG4gICAgICBsb2dnZXIudHJhY2UoJ0NvcHlpbmc6ICcsIGZpbGVUb0NvcHksICc9PicsIGNvcHlUYXJnZXQpO1xuICAgICAgY29weUZpbGVTeW5jKGZpbGVUb0NvcHksIGNvcHlUYXJnZXQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBoYW5kbGVOb1N1Y2hGaWxlRXJyb3IoZmlsZVRvQ29weSwgZXJyb3IsIGxvZ2dlcik7XG4gIH1cbn1cblxuLy8gSWdub3JlcyBlcnJvcnMgZHVlIHRvIGZpbGUgbWlzc2luZyBkdXJpbmcgdGhlbWUgcHJvY2Vzc2luZ1xuLy8gVGhpcyBtYXkgaGFwcGVuIGZvciBleGFtcGxlIHdoZW4gYW4gSURFIGNyZWF0ZXMgYSB0ZW1wb3JhcnkgZmlsZVxuLy8gYW5kIHRoZW4gaW1tZWRpYXRlbHkgZGVsZXRlcyBpdFxuZnVuY3Rpb24gaGFuZGxlTm9TdWNoRmlsZUVycm9yKGZpbGUsIGVycm9yLCBsb2dnZXIpIHtcbiAgaWYgKGVycm9yLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgbG9nZ2VyLndhcm4oJ0lnbm9yaW5nIG5vdCBleGlzdGluZyBmaWxlICcgKyBmaWxlICsgJy4gRmlsZSBtYXkgaGF2ZSBiZWVuIGRlbGV0ZWQgZHVyaW5nIHRoZW1lIHByb2Nlc3NpbmcuJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuZXhwb3J0IHsgY2hlY2tNb2R1bGVzLCBjb3B5U3RhdGljQXNzZXRzLCBjb3B5VGhlbWVSZXNvdXJjZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXHRoZW1lLWxvYWRlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXHRoZW1lLWxvYWRlclxcXFx0aGVtZS1sb2FkZXItdXRpbHMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2d1c3Rhdm8vRGVza3RvcC9wcm9ncmFtYXMvQXVkaWJsZS90YXJnZXQvcGx1Z2lucy90aGVtZS1sb2FkZXIvdGhlbWUtbG9hZGVyLXV0aWxzLmpzXCI7aW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGdsb2JTeW5jIH0gZnJvbSAnZ2xvYic7XG5cbi8vIENvbGxlY3QgZ3JvdXBzIFt1cmwoXSBbJ3xcIl1vcHRpb25hbCAnLi98Li4vJywgb3RoZXIgJy4uLycgc2VnbWVudHMgb3B0aW9uYWwsIGZpbGUgcGFydCBhbmQgZW5kIG9mIHVybFxuLy8gVGhlIGFkZGl0aW9uYWwgZG90IHNlZ21lbnRzIGNvdWxkIGJlIFVSTCByZWZlcmVuY2luZyBhc3NldHMgaW4gbmVzdGVkIGltcG9ydGVkIENTU1xuLy8gV2hlbiBWaXRlIGlubGluZXMgQ1NTIGltcG9ydCBpdCBkb2VzIG5vdCByZXdyaXRlIHJlbGF0aXZlIFVSTCBmb3Igbm90LXJlc29sdmFibGUgcmVzb3VyY2Vcbi8vIHNvIHRoZSBmaW5hbCBDU1MgZW5kcyB1cCB3aXRoIHdyb25nIHJlbGF0aXZlIFVSTHMgKHIuZy4gLi4vLi4vcGtnL2ljb24uc3ZnKVxuLy8gSWYgdGhlIFVSTCBpcyByZWxhdGl2ZSwgd2Ugc2hvdWxkIHRyeSB0byBjaGVjayBpZiBpdCBpcyBhbiBhc3NldCBieSBpZ25vcmluZyB0aGUgYWRkaXRpb25hbCBkb3Qgc2VnbWVudHNcbmNvbnN0IHVybE1hdGNoZXIgPSAvKHVybFxcKFxccyopKFxcJ3xcXFwiKT8oXFwuXFwvfFxcLlxcLlxcLykoKD86XFwzKSopPyhcXFMqKShcXDJcXHMqXFwpKS9nO1xuXG5mdW5jdGlvbiBhc3NldHNDb250YWlucyhmaWxlVXJsLCB0aGVtZUZvbGRlciwgbG9nZ2VyKSB7XG4gIGNvbnN0IHRoZW1lUHJvcGVydGllcyA9IGdldFRoZW1lUHJvcGVydGllcyh0aGVtZUZvbGRlcik7XG4gIGlmICghdGhlbWVQcm9wZXJ0aWVzKSB7XG4gICAgbG9nZ2VyLmRlYnVnKCdObyB0aGVtZSBwcm9wZXJ0aWVzIGZvdW5kLicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBhc3NldHMgPSB0aGVtZVByb3BlcnRpZXNbJ2Fzc2V0cyddO1xuICBpZiAoIWFzc2V0cykge1xuICAgIGxvZ2dlci5kZWJ1ZygnTm8gZGVmaW5lZCBhc3NldHMgaW4gdGhlbWUgcHJvcGVydGllcycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBHbyB0aHJvdWdoIGVhY2ggYXNzZXQgbW9kdWxlXG4gIGZvciAobGV0IG1vZHVsZSBvZiBPYmplY3Qua2V5cyhhc3NldHMpKSB7XG4gICAgY29uc3QgY29weVJ1bGVzID0gYXNzZXRzW21vZHVsZV07XG4gICAgLy8gR28gdGhyb3VnaCBlYWNoIGNvcHkgcnVsZVxuICAgIGZvciAobGV0IGNvcHlSdWxlIG9mIE9iamVjdC5rZXlzKGNvcHlSdWxlcykpIHtcbiAgICAgIC8vIGlmIGZpbGUgc3RhcnRzIHdpdGggY29weVJ1bGUgdGFyZ2V0IGNoZWNrIGlmIGZpbGUgd2l0aCBwYXRoIGFmdGVyIGNvcHkgdGFyZ2V0IGNhbiBiZSBmb3VuZFxuICAgICAgaWYgKGZpbGVVcmwuc3RhcnRzV2l0aChjb3B5UnVsZXNbY29weVJ1bGVdKSkge1xuICAgICAgICBjb25zdCB0YXJnZXRGaWxlID0gZmlsZVVybC5yZXBsYWNlKGNvcHlSdWxlc1tjb3B5UnVsZV0sICcnKTtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBnbG9iU3luYyhyZXNvbHZlKCdub2RlX21vZHVsZXMvJywgbW9kdWxlLCBjb3B5UnVsZSksIHsgbm9kaXI6IHRydWUgfSk7XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgIGlmIChmaWxlLmVuZHNXaXRoKHRhcmdldEZpbGUpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW1lUHJvcGVydGllcyh0aGVtZUZvbGRlcikge1xuICBjb25zdCB0aGVtZVByb3BlcnR5RmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsICd0aGVtZS5qc29uJyk7XG4gIGlmICghZXhpc3RzU3luYyh0aGVtZVByb3BlcnR5RmlsZSkpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgY29uc3QgdGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZyA9IHJlYWRGaWxlU3luYyh0aGVtZVByb3BlcnR5RmlsZSk7XG4gIGlmICh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICByZXR1cm4gSlNPTi5wYXJzZSh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nKTtcbn1cblxuZnVuY3Rpb24gcmV3cml0ZUNzc1VybHMoc291cmNlLCBoYW5kbGVkUmVzb3VyY2VGb2xkZXIsIHRoZW1lRm9sZGVyLCBsb2dnZXIsIG9wdGlvbnMpIHtcbiAgc291cmNlID0gc291cmNlLnJlcGxhY2UodXJsTWF0Y2hlciwgZnVuY3Rpb24gKG1hdGNoLCB1cmwsIHF1b3RlTWFyaywgcmVwbGFjZSwgYWRkaXRpb25hbERvdFNlZ21lbnRzLCBmaWxlVXJsLCBlbmRTdHJpbmcpIHtcbiAgICBsZXQgYWJzb2x1dGVQYXRoID0gcmVzb2x2ZShoYW5kbGVkUmVzb3VyY2VGb2xkZXIsIHJlcGxhY2UsIGFkZGl0aW9uYWxEb3RTZWdtZW50cyB8fCAnJywgZmlsZVVybCk7XG4gICAgbGV0IGV4aXN0aW5nVGhlbWVSZXNvdXJjZSA9IGFic29sdXRlUGF0aC5zdGFydHNXaXRoKHRoZW1lRm9sZGVyKSAmJiBleGlzdHNTeW5jKGFic29sdXRlUGF0aCk7XG4gICAgaWYgKCFleGlzdGluZ1RoZW1lUmVzb3VyY2UgJiYgYWRkaXRpb25hbERvdFNlZ21lbnRzKSB7XG4gICAgICAvLyBUcnkgdG8gcmVzb2x2ZSBwYXRoIHdpdGhvdXQgZG90IHNlZ21lbnRzIGFzIGl0IG1heSBiZSBhbiB1bnJlc29sdmFibGVcbiAgICAgIC8vIHJlbGF0aXZlIFVSTCBmcm9tIGFuIGlubGluZWQgbmVzdGVkIENTU1xuICAgICAgYWJzb2x1dGVQYXRoID0gcmVzb2x2ZShoYW5kbGVkUmVzb3VyY2VGb2xkZXIsIHJlcGxhY2UsIGZpbGVVcmwpO1xuICAgICAgZXhpc3RpbmdUaGVtZVJlc291cmNlID0gYWJzb2x1dGVQYXRoLnN0YXJ0c1dpdGgodGhlbWVGb2xkZXIpICYmIGV4aXN0c1N5bmMoYWJzb2x1dGVQYXRoKTtcbiAgICB9XG4gICAgY29uc3QgaXNBc3NldCA9IGFzc2V0c0NvbnRhaW5zKGZpbGVVcmwsIHRoZW1lRm9sZGVyLCBsb2dnZXIpO1xuICAgIGlmIChleGlzdGluZ1RoZW1lUmVzb3VyY2UgfHwgaXNBc3NldCkge1xuICAgICAgLy8gQWRkaW5nIC4vIHdpbGwgc2tpcCBjc3MtbG9hZGVyLCB3aGljaCBzaG91bGQgYmUgZG9uZSBmb3IgYXNzZXQgZmlsZXNcbiAgICAgIC8vIEluIGEgcHJvZHVjdGlvbiBidWlsZCwgdGhlIGNzcyBmaWxlIGlzIGluIFZBQURJTi9idWlsZCBhbmQgc3RhdGljIGZpbGVzIGFyZSBpbiBWQUFESU4vc3RhdGljLCBzbyAuLi9zdGF0aWMgbmVlZHMgdG8gYmUgYWRkZWRcbiAgICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gb3B0aW9ucy5kZXZNb2RlID8gJy4vJyA6ICcuLi9zdGF0aWMvJztcblxuICAgICAgY29uc3Qgc2tpcExvYWRlciA9IGV4aXN0aW5nVGhlbWVSZXNvdXJjZSA/ICcnIDogcmVwbGFjZW1lbnQ7XG4gICAgICBjb25zdCBmcm9udGVuZFRoZW1lRm9sZGVyID0gc2tpcExvYWRlciArICd0aGVtZXMvJyArIGJhc2VuYW1lKHRoZW1lRm9sZGVyKTtcbiAgICAgIGxvZ2dlci5sb2coXG4gICAgICAgICdVcGRhdGluZyB1cmwgZm9yIGZpbGUnLFxuICAgICAgICBcIidcIiArIHJlcGxhY2UgKyBmaWxlVXJsICsgXCInXCIsXG4gICAgICAgICd0byB1c2UnLFxuICAgICAgICBcIidcIiArIGZyb250ZW5kVGhlbWVGb2xkZXIgKyAnLycgKyBmaWxlVXJsICsgXCInXCJcbiAgICAgICk7XG4gICAgICAvLyBhc3NldHMgYXJlIGFsd2F5cyByZWxhdGl2ZSB0byB0aGVtZSBmb2xkZXJcbiAgICAgIGNvbnN0IHBhdGhSZXNvbHZlZCA9IGlzQXNzZXQgPyAnLycgKyBmaWxlVXJsXG4gICAgICAgICAgOiBhYnNvbHV0ZVBhdGguc3Vic3RyaW5nKHRoZW1lRm9sZGVyLmxlbmd0aCkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gICAgICAvLyBrZWVwIHRoZSB1cmwgdGhlIHNhbWUgZXhjZXB0IHJlcGxhY2UgdGhlIC4vIG9yIC4uLyB0byB0aGVtZXMvW3RoZW1lRm9sZGVyXVxuICAgICAgcmV0dXJuIHVybCArIChxdW90ZU1hcmsgPz8gJycpICsgZnJvbnRlbmRUaGVtZUZvbGRlciArIHBhdGhSZXNvbHZlZCArIGVuZFN0cmluZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGV2TW9kZSkge1xuICAgICAgbG9nZ2VyLmxvZyhcIk5vIHJld3JpdGUgZm9yICdcIiwgbWF0Y2gsIFwiJyBhcyB0aGUgZmlsZSB3YXMgbm90IGZvdW5kLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gcHJvZHVjdGlvbiwgdGhlIGNzcyBpcyBpbiBWQUFESU4vYnVpbGQgYnV0IHRoZSB0aGVtZSBmaWxlcyBhcmUgaW4gLlxuICAgICAgcmV0dXJuIHVybCArIChxdW90ZU1hcmsgPz8gJycpICsgJy4uLy4uLycgKyBmaWxlVXJsICsgZW5kU3RyaW5nO1xuICAgIH1cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH0pO1xuICByZXR1cm4gc291cmNlO1xufVxuXG5leHBvcnQgeyByZXdyaXRlQ3NzVXJscyB9O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxndXN0YXZvXFxcXERlc2t0b3BcXFxccHJvZ3JhbWFzXFxcXEF1ZGlibGVcXFxcdGFyZ2V0XFxcXHBsdWdpbnNcXFxccmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxndXN0YXZvXFxcXERlc2t0b3BcXFxccHJvZ3JhbWFzXFxcXEF1ZGlibGVcXFxcdGFyZ2V0XFxcXHBsdWdpbnNcXFxccmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luXFxcXHJlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvZ3VzdGF2by9EZXNrdG9wL3Byb2dyYW1hcy9BdWRpYmxlL3RhcmdldC9wbHVnaW5zL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi9yZWFjdC1mdW5jdGlvbi1sb2NhdGlvbi1wbHVnaW4uanNcIjtpbXBvcnQgKiBhcyB0IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGdW5jdGlvbkNvbXBvbmVudFNvdXJjZUxvY2F0aW9uQmFiZWwoKSB7XG4gIGZ1bmN0aW9uIGlzUmVhY3RGdW5jdGlvbk5hbWUobmFtZSkge1xuICAgIC8vIEEgUmVhY3QgY29tcG9uZW50IGZ1bmN0aW9uIGFsd2F5cyBzdGFydHMgd2l0aCBhIENhcGl0YWwgbGV0dGVyXG4gICAgcmV0dXJuIG5hbWUgJiYgbmFtZS5tYXRjaCgvXltBLVpdLiovKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgZGVidWcgaW5mbyBhcyBOYW1lLl9fZGVidWdTb3VyY2VEZWZpbmU9ey4uLn0gYWZ0ZXIgdGhlIGdpdmVuIHN0YXRlbWVudCAoXCJwYXRoXCIpLlxuICAgKiBUaGlzIGlzIHVzZWQgdG8gbWFrZSB0aGUgc291cmNlIGxvY2F0aW9uIG9mIHRoZSBmdW5jdGlvbiAoZGVmaW5lZCBieSB0aGUgbG9jIHBhcmFtZXRlcikgYXZhaWxhYmxlIGluIHRoZSBicm93c2VyIGluIGRldmVsb3BtZW50IG1vZGUuXG4gICAqIFRoZSBuYW1lIF9fZGVidWdTb3VyY2VEZWZpbmUgaXMgcHJlZml4ZWQgYnkgX18gdG8gbWFyayB0aGlzIGlzIG5vdCBhIHB1YmxpYyBBUEkuXG4gICAqL1xuICBmdW5jdGlvbiBhZGREZWJ1Z0luZm8ocGF0aCwgbmFtZSwgZmlsZW5hbWUsIGxvYykge1xuICAgIGNvbnN0IGxpbmVOdW1iZXIgPSBsb2Muc3RhcnQubGluZTtcbiAgICBjb25zdCBjb2x1bW5OdW1iZXIgPSBsb2Muc3RhcnQuY29sdW1uICsgMTtcbiAgICBjb25zdCBkZWJ1Z1NvdXJjZU1lbWJlciA9IHQubWVtYmVyRXhwcmVzc2lvbih0LmlkZW50aWZpZXIobmFtZSksIHQuaWRlbnRpZmllcignX19kZWJ1Z1NvdXJjZURlZmluZScpKTtcbiAgICBjb25zdCBkZWJ1Z1NvdXJjZURlZmluZSA9IHQub2JqZWN0RXhwcmVzc2lvbihbXG4gICAgICB0Lm9iamVjdFByb3BlcnR5KHQuaWRlbnRpZmllcignZmlsZU5hbWUnKSwgdC5zdHJpbmdMaXRlcmFsKGZpbGVuYW1lKSksXG4gICAgICB0Lm9iamVjdFByb3BlcnR5KHQuaWRlbnRpZmllcignbGluZU51bWJlcicpLCB0Lm51bWVyaWNMaXRlcmFsKGxpbmVOdW1iZXIpKSxcbiAgICAgIHQub2JqZWN0UHJvcGVydHkodC5pZGVudGlmaWVyKCdjb2x1bW5OdW1iZXInKSwgdC5udW1lcmljTGl0ZXJhbChjb2x1bW5OdW1iZXIpKVxuICAgIF0pO1xuICAgIGNvbnN0IGFzc2lnbm1lbnQgPSB0LmV4cHJlc3Npb25TdGF0ZW1lbnQodC5hc3NpZ25tZW50RXhwcmVzc2lvbignPScsIGRlYnVnU291cmNlTWVtYmVyLCBkZWJ1Z1NvdXJjZURlZmluZSkpO1xuICAgIGNvbnN0IGNvbmRpdGlvbiA9IHQuYmluYXJ5RXhwcmVzc2lvbihcbiAgICAgICc9PT0nLFxuICAgICAgdC51bmFyeUV4cHJlc3Npb24oJ3R5cGVvZicsIHQuaWRlbnRpZmllcihuYW1lKSksXG4gICAgICB0LnN0cmluZ0xpdGVyYWwoJ2Z1bmN0aW9uJylcbiAgICApO1xuICAgIGNvbnN0IGlmRnVuY3Rpb24gPSB0LmlmU3RhdGVtZW50KGNvbmRpdGlvbiwgdC5ibG9ja1N0YXRlbWVudChbYXNzaWdubWVudF0pKTtcbiAgICBwYXRoLmluc2VydEFmdGVyKGlmRnVuY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB2aXNpdG9yOiB7XG4gICAgICBWYXJpYWJsZURlY2xhcmF0aW9uKHBhdGgsIHN0YXRlKSB7XG4gICAgICAgIC8vIEZpbmRzIGRlY2xhcmF0aW9ucyBzdWNoIGFzXG4gICAgICAgIC8vIGNvbnN0IEZvbyA9ICgpID0+IDxkaXYvPlxuICAgICAgICAvLyBleHBvcnQgY29uc3QgQmFyID0gKCkgPT4gPHNwYW4vPlxuXG4gICAgICAgIC8vIGFuZCB3cml0ZXMgYSBGb28uX19kZWJ1Z1NvdXJjZURlZmluZT0gey4ufSBhZnRlciBpdCwgcmVmZXJyaW5nIHRvIHRoZSBzdGFydCBvZiB0aGUgZnVuY3Rpb24gYm9keVxuICAgICAgICBwYXRoLm5vZGUuZGVjbGFyYXRpb25zLmZvckVhY2goKGRlY2xhcmF0aW9uKSA9PiB7XG4gICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLmlkLnR5cGUgIT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBuYW1lID0gZGVjbGFyYXRpb24/LmlkPy5uYW1lO1xuICAgICAgICAgIGlmICghaXNSZWFjdEZ1bmN0aW9uTmFtZShuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGZpbGVuYW1lID0gc3RhdGUuZmlsZS5vcHRzLmZpbGVuYW1lO1xuICAgICAgICAgIGlmIChkZWNsYXJhdGlvbj8uaW5pdD8uYm9keT8ubG9jKSB7XG4gICAgICAgICAgICBhZGREZWJ1Z0luZm8ocGF0aCwgbmFtZSwgZmlsZW5hbWUsIGRlY2xhcmF0aW9uLmluaXQuYm9keS5sb2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBGdW5jdGlvbkRlY2xhcmF0aW9uKHBhdGgsIHN0YXRlKSB7XG4gICAgICAgIC8vIEZpbmRzIGRlY2xhcmF0aW9ucyBzdWNoIGFzXG4gICAgICAgIC8vIGZ1bmN0aW8gRm9vKCkgeyByZXR1cm4gPGRpdi8+OyB9XG4gICAgICAgIC8vIGV4cG9ydCBmdW5jdGlvbiBCYXIoKSB7IHJldHVybiA8c3Bhbj5IZWxsbzwvc3Bhbj47fVxuXG4gICAgICAgIC8vIGFuZCB3cml0ZXMgYSBGb28uX19kZWJ1Z1NvdXJjZURlZmluZT0gey4ufSBhZnRlciBpdCwgcmVmZXJyaW5nIHRvIHRoZSBzdGFydCBvZiB0aGUgZnVuY3Rpb24gYm9keVxuICAgICAgICBjb25zdCBub2RlID0gcGF0aC5ub2RlO1xuICAgICAgICBjb25zdCBuYW1lID0gbm9kZT8uaWQ/Lm5hbWU7XG4gICAgICAgIGlmICghaXNSZWFjdEZ1bmN0aW9uTmFtZShuYW1lKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHN0YXRlLmZpbGUub3B0cy5maWxlbmFtZTtcbiAgICAgICAgYWRkRGVidWdJbmZvKHBhdGgsIG5hbWUsIGZpbGVuYW1lLCBub2RlLmJvZHkubG9jKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iLCAie1xuICBcImZyb250ZW5kRm9sZGVyXCI6IFwiQzovVXNlcnMvZ3VzdGF2by9EZXNrdG9wL3Byb2dyYW1hcy9BdWRpYmxlL3NyYy9tYWluL2Zyb250ZW5kXCIsXG4gIFwidGhlbWVGb2xkZXJcIjogXCJ0aGVtZXNcIixcbiAgXCJ0aGVtZVJlc291cmNlRm9sZGVyXCI6IFwiQzovVXNlcnMvZ3VzdGF2by9EZXNrdG9wL3Byb2dyYW1hcy9BdWRpYmxlL3NyYy9tYWluL2Zyb250ZW5kL2dlbmVyYXRlZC9qYXItcmVzb3VyY2VzXCIsXG4gIFwic3RhdGljT3V0cHV0XCI6IFwiQzovVXNlcnMvZ3VzdGF2by9EZXNrdG9wL3Byb2dyYW1hcy9BdWRpYmxlL3RhcmdldC9jbGFzc2VzL01FVEEtSU5GL1ZBQURJTi93ZWJhcHAvVkFBRElOL3N0YXRpY1wiLFxuICBcImdlbmVyYXRlZEZvbGRlclwiOiBcImdlbmVyYXRlZFwiLFxuICBcInN0YXRzT3V0cHV0XCI6IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXFxcXHRhcmdldFxcXFxjbGFzc2VzXFxcXE1FVEEtSU5GXFxcXFZBQURJTlxcXFxjb25maWdcIixcbiAgXCJmcm9udGVuZEJ1bmRsZU91dHB1dFwiOiBcIkM6XFxcXFVzZXJzXFxcXGd1c3Rhdm9cXFxcRGVza3RvcFxcXFxwcm9ncmFtYXNcXFxcQXVkaWJsZVxcXFx0YXJnZXRcXFxcY2xhc3Nlc1xcXFxNRVRBLUlORlxcXFxWQUFESU5cXFxcd2ViYXBwXCIsXG4gIFwiZGV2QnVuZGxlT3V0cHV0XCI6IFwiQzovVXNlcnMvZ3VzdGF2by9EZXNrdG9wL3Byb2dyYW1hcy9BdWRpYmxlL3RhcmdldC9kZXYtYnVuZGxlL3dlYmFwcFwiLFxuICBcImRldkJ1bmRsZVN0YXRzT3V0cHV0XCI6IFwiQzovVXNlcnMvZ3VzdGF2by9EZXNrdG9wL3Byb2dyYW1hcy9BdWRpYmxlL3RhcmdldC9kZXYtYnVuZGxlL2NvbmZpZ1wiLFxuICBcImphclJlc291cmNlc0ZvbGRlclwiOiBcIkM6L1VzZXJzL2d1c3Rhdm8vRGVza3RvcC9wcm9ncmFtYXMvQXVkaWJsZS9zcmMvbWFpbi9mcm9udGVuZC9nZW5lcmF0ZWQvamFyLXJlc291cmNlc1wiLFxuICBcInRoZW1lTmFtZVwiOiBcImF1ZGlibGVcIixcbiAgXCJjbGllbnRTZXJ2aWNlV29ya2VyU291cmNlXCI6IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXFxcXHRhcmdldFxcXFxzdy50c1wiLFxuICBcInB3YUVuYWJsZWRcIjogZmFsc2UsXG4gIFwib2ZmbGluZUVuYWJsZWRcIjogZmFsc2UsXG4gIFwib2ZmbGluZVBhdGhcIjogXCInb2ZmbGluZS5odG1sJ1wiXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxndXN0YXZvXFxcXERlc2t0b3BcXFxccHJvZ3JhbWFzXFxcXEF1ZGlibGVcXFxcdGFyZ2V0XFxcXHBsdWdpbnNcXFxccm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC1jdXN0b21cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGd1c3Rhdm9cXFxcRGVza3RvcFxcXFxwcm9ncmFtYXNcXFxcQXVkaWJsZVxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFxyb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LWN1c3RvbVxcXFxyb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9ndXN0YXZvL0Rlc2t0b3AvcHJvZ3JhbWFzL0F1ZGlibGUvdGFyZ2V0L3BsdWdpbnMvcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC1jdXN0b20vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC5qc1wiOy8qKlxuICogTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDE5IFVtYmVydG8gUGVwYXRvXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiAqL1xuLy8gVGhpcyBpcyBodHRwczovL2dpdGh1Yi5jb20vdW1ib3BlcGF0by9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0IDIuMC4wICsgaHR0cHM6Ly9naXRodWIuY29tL3VtYm9wZXBhdG8vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC9wdWxsLzU0XG4vLyB0byBtYWtlIGl0IHdvcmsgd2l0aCBWaXRlIDNcbi8vIE9uY2UgLyBpZiBodHRwczovL2dpdGh1Yi5jb20vdW1ib3BlcGF0by9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0L3B1bGwvNTQgaXMgbWVyZ2VkIHRoaXMgc2hvdWxkIGJlIHJlbW92ZWQgYW5kIHJvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQgc2hvdWxkIGJlIHVzZWQgaW5zdGVhZFxuXG5pbXBvcnQgeyBjcmVhdGVGaWx0ZXIgfSBmcm9tICdAcm9sbHVwL3BsdWdpbnV0aWxzJztcbmltcG9ydCB0cmFuc2Zvcm1Bc3QgZnJvbSAndHJhbnNmb3JtLWFzdCc7XG5cbmNvbnN0IGFzc2V0VXJsUkUgPSAvX19WSVRFX0FTU0VUX18oW1xcdyRdKylfXyg/OlxcJF8oLio/KV9fKT8vZ1xuXG5jb25zdCBlc2NhcGUgPSAoc3RyKSA9PlxuICBzdHJcbiAgICAucmVwbGFjZShhc3NldFVybFJFLCAnJHt1bnNhZmVDU1NUYWcoXCJfX1ZJVEVfQVNTRVRfXyQxX18kMlwiKX0nKVxuICAgIC5yZXBsYWNlKC9gL2csICdcXFxcYCcpXG4gICAgLnJlcGxhY2UoL1xcXFwoPyFgKS9nLCAnXFxcXFxcXFwnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcG9zdGNzc0xpdChvcHRpb25zID0ge30pIHtcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgaW5jbHVkZTogJyoqLyoue2Nzcyxzc3MscGNzcyxzdHlsLHN0eWx1cyxzYXNzLHNjc3MsbGVzc30nLFxuICAgIGV4Y2x1ZGU6IG51bGwsXG4gICAgaW1wb3J0UGFja2FnZTogJ2xpdCdcbiAgfTtcblxuICBjb25zdCBvcHRzID0geyAuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuICBjb25zdCBmaWx0ZXIgPSBjcmVhdGVGaWx0ZXIob3B0cy5pbmNsdWRlLCBvcHRzLmV4Y2x1ZGUpO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3Bvc3Rjc3MtbGl0JyxcbiAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XG4gICAgICBpZiAoIWZpbHRlcihpZCkpIHJldHVybjtcbiAgICAgIGNvbnN0IGFzdCA9IHRoaXMucGFyc2UoY29kZSwge30pO1xuICAgICAgLy8gZXhwb3J0IGRlZmF1bHQgY29uc3QgY3NzO1xuICAgICAgbGV0IGRlZmF1bHRFeHBvcnROYW1lO1xuXG4gICAgICAvLyBleHBvcnQgZGVmYXVsdCAnLi4uJztcbiAgICAgIGxldCBpc0RlY2xhcmF0aW9uTGl0ZXJhbCA9IGZhbHNlO1xuICAgICAgY29uc3QgbWFnaWNTdHJpbmcgPSB0cmFuc2Zvcm1Bc3QoY29kZSwgeyBhc3Q6IGFzdCB9LCAobm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJykge1xuICAgICAgICAgIGRlZmF1bHRFeHBvcnROYW1lID0gbm9kZS5kZWNsYXJhdGlvbi5uYW1lO1xuXG4gICAgICAgICAgaXNEZWNsYXJhdGlvbkxpdGVyYWwgPSBub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdMaXRlcmFsJztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghZGVmYXVsdEV4cG9ydE5hbWUgJiYgIWlzRGVjbGFyYXRpb25MaXRlcmFsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1hZ2ljU3RyaW5nLndhbGsoKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKGRlZmF1bHRFeHBvcnROYW1lICYmIG5vZGUudHlwZSA9PT0gJ1ZhcmlhYmxlRGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgY29uc3QgZXhwb3J0ZWRWYXIgPSBub2RlLmRlY2xhcmF0aW9ucy5maW5kKChkKSA9PiBkLmlkLm5hbWUgPT09IGRlZmF1bHRFeHBvcnROYW1lKTtcbiAgICAgICAgICBpZiAoZXhwb3J0ZWRWYXIpIHtcbiAgICAgICAgICAgIGV4cG9ydGVkVmFyLmluaXQuZWRpdC51cGRhdGUoYGNzc1RhZ1xcYCR7ZXNjYXBlKGV4cG9ydGVkVmFyLmluaXQudmFsdWUpfVxcYGApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0RlY2xhcmF0aW9uTGl0ZXJhbCAmJiBub2RlLnR5cGUgPT09ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbi5lZGl0LnVwZGF0ZShgY3NzVGFnXFxgJHtlc2NhcGUobm9kZS5kZWNsYXJhdGlvbi52YWx1ZSl9XFxgYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbWFnaWNTdHJpbmcucHJlcGVuZChgaW1wb3J0IHtjc3MgYXMgY3NzVGFnLCB1bnNhZmVDU1MgYXMgdW5zYWZlQ1NTVGFnfSBmcm9tICcke29wdHMuaW1wb3J0UGFja2FnZX0nO1xcbmApO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogbWFnaWNTdHJpbmcudG9TdHJpbmcoKSxcbiAgICAgICAgbWFwOiBtYWdpY1N0cmluZy5nZW5lcmF0ZU1hcCh7XG4gICAgICAgICAgaGlyZXM6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH07XG4gICAgfVxuICB9O1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VzdGF2b1xcXFxEZXNrdG9wXFxcXHByb2dyYW1hc1xcXFxBdWRpYmxlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxndXN0YXZvXFxcXERlc2t0b3BcXFxccHJvZ3JhbWFzXFxcXEF1ZGlibGVcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2d1c3Rhdm8vRGVza3RvcC9wcm9ncmFtYXMvQXVkaWJsZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IFVzZXJDb25maWdGbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgb3ZlcnJpZGVWYWFkaW5Db25maWcgfSBmcm9tICcuL3ZpdGUuZ2VuZXJhdGVkJztcblxuY29uc3QgY3VzdG9tQ29uZmlnOiBVc2VyQ29uZmlnRm4gPSAoZW52KSA9PiAoe1xuICAvLyBIZXJlIHlvdSBjYW4gYWRkIGN1c3RvbSBWaXRlIHBhcmFtZXRlcnNcbiAgLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBvdmVycmlkZVZhYWRpbkNvbmZpZyhjdXN0b21Db25maWcpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQU1BLE9BQU8sVUFBVTtBQUNqQixTQUFTLGNBQUFBLGFBQVksYUFBQUMsWUFBVyxlQUFBQyxjQUFhLGdCQUFBQyxlQUFjLGlCQUFBQyxzQkFBcUI7QUFDaEYsU0FBUyxrQkFBa0I7QUFDM0IsWUFBWSxTQUFTOzs7QUNXckIsU0FBUyxjQUFBQyxhQUFZLGdCQUFBQyxxQkFBb0I7QUFDekMsU0FBUyxXQUFBQyxnQkFBZTs7O0FDRHhCLFNBQVMsWUFBQUMsaUJBQWdCO0FBQ3pCLFNBQVMsV0FBQUMsVUFBUyxZQUFBQyxpQkFBZ0I7QUFDbEMsU0FBUyxjQUFBQyxhQUFZLGNBQWMscUJBQXFCOzs7QUNGeEQsU0FBUyxhQUFhLFVBQVUsV0FBVyxZQUFZLG9CQUFvQjtBQUMzRSxTQUFTLFNBQVMsVUFBVSxVQUFVLGVBQWU7QUFD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QU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLFlBQVk7QUFBQSxNQUNkLENBQUM7QUFBQSxNQUNELGtCQUFrQixXQUFXLEVBQUUsWUFBWSxNQUFNLFVBQVUsZUFBZSxDQUFDO0FBQUEsSUFFN0U7QUFBQSxFQUNGO0FBQ0Y7QUFFTyxJQUFNLHVCQUF1QixDQUFDQyxrQkFBK0I7QUFDbEUsU0FBTyxhQUFhLENBQUMsUUFBUSxZQUFZLGFBQWEsR0FBRyxHQUFHQSxjQUFhLEdBQUcsQ0FBQyxDQUFDO0FBQ2hGO0FBQ0EsU0FBUyxXQUFXLFFBQXdCO0FBQzFDLFFBQU0sY0FBYyxLQUFLLFFBQVEsbUJBQW1CLFFBQVEsY0FBYztBQUMxRSxTQUFPLEtBQUssTUFBTVIsY0FBYSxhQUFhLEVBQUUsVUFBVSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RFO0FBQ0EsU0FBUyxZQUFZLFFBQXdCO0FBQzNDLFFBQU0sY0FBYyxLQUFLLFFBQVEsbUJBQW1CLFFBQVEsY0FBYztBQUMxRSxTQUFPLEtBQUssTUFBTUEsY0FBYSxhQUFhLEVBQUUsVUFBVSxRQUFRLENBQUMsQ0FBQyxFQUFFO0FBQ3RFOzs7QVEvMUJBLElBQU0sZUFBNkIsQ0FBQyxTQUFTO0FBQUE7QUFBQTtBQUc3QztBQUVBLElBQU8sc0JBQVEscUJBQXFCLFlBQVk7IiwKICAibmFtZXMiOiBbImV4aXN0c1N5bmMiLCAibWtkaXJTeW5jIiwgInJlYWRkaXJTeW5jIiwgInJlYWRGaWxlU3luYyIsICJ3cml0ZUZpbGVTeW5jIiwgImV4aXN0c1N5bmMiLCAicmVhZEZpbGVTeW5jIiwgInJlc29sdmUiLCAiZ2xvYlN5bmMiLCAicmVzb2x2ZSIsICJiYXNlbmFtZSIsICJleGlzdHNTeW5jIiwgInRoZW1lRm9sZGVyIiwgInRoZW1lRm9sZGVyIiwgInJlc29sdmUiLCAiZ2xvYlN5bmMiLCAiZXhpc3RzU3luYyIsICJiYXNlbmFtZSIsICJ2YXJpYWJsZSIsICJmaWxlbmFtZSIsICJleGlzdHNTeW5jIiwgInJlc29sdmUiLCAidGhlbWVGb2xkZXIiLCAicmVhZEZpbGVTeW5jIiwgImV4aXN0c1N5bmMiLCAicmVhZEZpbGVTeW5jIiwgInJlc29sdmUiLCAiYmFzZW5hbWUiLCAiZ2xvYlN5bmMiLCAidGhlbWVGb2xkZXIiLCAiZ2V0VGhlbWVQcm9wZXJ0aWVzIiwgImdsb2JTeW5jIiwgInJlc29sdmUiLCAiZXhpc3RzU3luYyIsICJyZWFkRmlsZVN5bmMiLCAicmVwbGFjZSIsICJiYXNlbmFtZSIsICJwYXRoIiwgInJlcXVpcmUiLCAiZXhpc3RzU3luYyIsICJyZWFkRmlsZVN5bmMiLCAibWtkaXJTeW5jIiwgImJ1bmRsZSIsICJyZWFkZGlyU3luYyIsICJ0aGVtZUZvbGRlciIsICJ3cml0ZUZpbGVTeW5jIiwgImUiLCAicGF0aCIsICJjdXN0b21Db25maWciXQp9Cg==
