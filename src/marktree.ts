import { File, Directory } from 'virtual-file-system';
import markdownIt from 'markdown-it';
//@ts-ignore
import markdownItKatex from '@iktakahiro/markdown-it-katex';
//@ts-ignore
import markdownItHighlight from 'markdown-it-highlightjs';
//@ts-ignore
import markdownItInclude from 'markdown-it-include';
//@ts-ignore
import markdownItInlineComments from 'markdown-it-inline-comments';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';

import {
  defaultConfig,
  defaultHtmlLayout,
  defaultCssStyles,
} from './defaults.js';
//@ts-ignore
import metadataParser from 'markdown-yaml-metadata-parser';

export { buildMarktree };

const config = defaultConfig;
const configFile = File.read('marktree.config.json');
if (configFile) {
  Object.assign(config, JSON.parse(configFile.data));
}
const md = new markdownIt();
md.use(markdownItInclude, {
  includeRe: /\n#include!(.+)/,
  bracesAreOptional: true,
});
md.use(markdownItKatex, { throwOnError: false, errorColor: ' #cc0000' });
md.use(markdownItHighlight, { inline: true });
md.use(markdownItTocDoneRight);
md.use(markdownItAnchor);
md.use(markdownItInlineComments);

function buildMarktree() {
  console.log('Starting build...');

  const mdDirectory = Directory.read(config.source, config.exclude);

  if (mdDirectory == null) return;

  // TODO: Improve inclusion
  if (config.include && config.include.length) {
    for (let dir of mdDirectory.directories) {
      if (!config.include.includes(dir.name)) {
        const index = mdDirectory.directories.indexOf(dir);
        if (index > -1) {
          mdDirectory.directories.splice(index, 1);
        }
      }
    }
  }

  console.log('[Read] ' + mdDirectory.toString());

  editMarkdown(mdDirectory);

  console.log('Edited markdown');

  const htmlDirectory = buildHtml(mdDirectory);
  htmlDirectory.name = config.dest;

  console.log('Rendered html');

  htmlDirectory.write();

  console.log('[Write] ' + htmlDirectory.toString());
  console.log('Successfully finished building!');
}

function editMarkdown(directory: Directory) {
  if (!directory.getFile(config.htmlLayout)) {
    directory.files.push(new File(config.htmlLayout, defaultHtmlLayout));
  }
  if (!directory.getFile(config.cssStyles)) {
    directory.files.push(new File(config.cssStyles, defaultCssStyles));
  }
  readMetadata(directory);
  if (config.autoLink) {
    linkMarkdown(directory);
  }
}

function renderHtml(markdown: string) {
  const data = markdown.replaceAll('%20', '___SPACE___');
  let htmlRender = md
    .render(data)
    .replaceAll('.md', '.html') // TODO: don't replace all .md
    .replaceAll('___SPACE___', ' ')
    .replaceAll('&quot;', '"');
  // TODO: Add all tags
  for (let tag of ['div', 'p', 'a', 'span', 'iframe', 'h4']) {
    htmlRender = htmlRender
      .replaceAll(`&gt;\n&lt;/${tag}&gt;`, `>\n</${tag}>`)
      .replaceAll(`&gt;&lt;/${tag}&gt;`, `></${tag}>`)
      .replaceAll(`&lt;${tag}&gt;`, `<${tag}>`)
      .replaceAll(`&lt;/${tag}&gt;`, `</${tag}>`)
      .replaceAll(`&lt;${tag}`, `<${tag}`);
    // TODO: Catch more cases
  }
  return htmlRender;
}

const mdLinksStart = '\n\n%md:links:start%\n\n';
const mdLinksEnd = '\n\n%md:links:end%\n\n';
/**
 *
 * @param {Directory} mdDirectory
 * @param {*} htmlLayout
 * @param {*} cssStyles
 * @param {*} icon
 * @returns
 */
function buildHtml(
  mdDirectory: Directory,
  htmlLayout: string = '',
  cssStyles: string[] = [],
  icon: string = ''
) {
  // Create a new directory
  const htmlDirectory = new Directory(mdDirectory.name);

  // Get htmlLayout and cssStyles
  const newLayout = mdDirectory.getFile(config.htmlLayout);
  if (newLayout) {
    htmlLayout = newLayout.data;
  }
  if (htmlLayout.length == 0) throw new Error('Invalid htmlLayout!');

  const newStyles = mdDirectory.getFile(config.cssStyles)?.name;
  if (newStyles) {
    cssStyles = [...cssStyles, newStyles];
  }
  const newIcon = mdDirectory.getFile(config.icon);
  if (newIcon) {
    icon = newIcon.name;
  }

  // Copy files to new directory
  mdDirectory.files.forEach((file) => {
    if (file.name.endsWith('.html')) return;
    // Markdown files are converted to html
    if (file.name.endsWith('.md')) {
      const htmlLinksStart = `<p>${mdLinksStart.trim()}</p>`;
      const htmlLinksEnd = `<p>${mdLinksEnd.trim()}</p>`;
      const htmlRender = renderHtml(file.data);
      const linksStart = htmlRender.indexOf(htmlLinksStart);
      const linksEnd = htmlRender.indexOf(htmlLinksEnd) + htmlLinksEnd.length;
      const htmlLinks =
        linksStart > -1 && linksEnd > -1
          ? htmlRender.substring(
              linksStart + htmlLinksStart.length,
              linksEnd - htmlLinksEnd.length
            )
          : '';
      const htmlContent = htmlRender.substring(linksEnd);

      let htmlStyles = '';
      cssStyles.forEach((style) => {
        htmlStyles += `<link rel="stylesheet" href="${style}">\n  `;
      });
      // Inserts
      const htmlData = htmlLayout
        .replaceAll(config.insertMarkdown, htmlContent)
        .replaceAll(config.insertStyles, htmlStyles)
        .replaceAll(
          config.insertTitle,
          file.metadata.title ? file.metadata.title : file.name
        )
        .replaceAll(config.insertIcon, icon)
        .replaceAll(config.insertLinks, htmlLinks);
      const htmlFile = new File(file.name.replaceAll('.md', '.html'), htmlData);
      htmlFile.metadata = file.metadata;
      htmlDirectory.files.push(htmlFile);
    } else {
      htmlDirectory.files.push(new File(file.name, file.data));
    }
  });

  // Recursively create html subdirectories
  const subDirectoryStyles: string[] = [];
  cssStyles.forEach((style) => {
    subDirectoryStyles.push('../' + style);
  });
  icon = '../' + icon;
  mdDirectory.directories.forEach((mdSubDir) => {
    htmlDirectory.directories.push(
      buildHtml(mdSubDir, htmlLayout, subDirectoryStyles, icon)
    );
  });

  return htmlDirectory;
}

/**
 *
 * @param {Directory} directory
 * @param {Directory} parentDirectory
 */
function linkMarkdown(
  directory: Directory,
  parentDirectory: Directory | null = null
) {
  // Get existing index.md
  let indexFile = directory.getFile(/^index.md$/);
  const indexData = indexFile ? indexFile.data : '';
  if (indexFile) directory.removeFile(indexFile);
  let indexMd = '';

  // Create header
  indexMd += '\n<h4>';
  if (parentDirectory) {
    indexMd += `[${parentDirectory.name}/](../index.md)`;
  }
  indexMd += `[${directory.name}](./index.md)\n`;
  indexMd += '</h4>\n';

  // Create links to subdirectories
  if (directory.directories.length) {
    directory.directories.forEach((directory) => {
      indexMd += `- 📂 [${directory.name}](./${directory.name}/index.md)\n`;
    });
  }

  // Create links to files
  if (directory.files.length) {
    directory.files.forEach((file) => {
      if (
        file.name == config.htmlLayout ||
        file.name == config.cssStyles ||
        file.name == config.icon
      )
        return;
      indexMd += `- 📄 [${file.getNameWithoutExtension()}](${file.name.replaceAll(
        ' ',
        '%20'
      )})\n`;
    });
  }

  // Add index.md (back) to directory
  const totalData =
    mdLinksStart +
    indexMd.replace(`[${directory.name}]`, `[${directory.name} ✨]`) +
    '\n<h4>Table of Contents</h4>\n${toc}\n' +
    mdLinksEnd +
    indexData;
  if (indexFile) {
    indexFile.data = totalData;
  } else {
    indexFile = new File('index.md', totalData);
    indexFile.metadata = { title: directory.name };
  }
  directory.files.push(indexFile);

  // Add links to files in the directory
  directory.files.forEach((file) => {
    if (file.name === 'index.md' || !file.name.endsWith('.md')) return;
    if (!('\n' + file.data).includes('\n# ')) {
      file.data = `\n# ${file.getNameWithoutExtension()}\n\n` + file.data;
    }
    file.data =
      mdLinksStart +
      indexMd.replace(
        `[${file.getNameWithoutExtension()}]`,
        `[${file.getNameWithoutExtension()} ✨]`
      ) +
      '\n<h4>Table of Contents</h4>\n${toc}\n' +
      mdLinksEnd +
      file.data;
  });

  // Recursively link subdirectories
  directory.directories.forEach((subDirectory) => {
    linkMarkdown(subDirectory, directory);
  });
}

function readMetadata(directory: Directory) {
  // Read metadata
  directory.files.forEach((file) => {
    if (file.name.endsWith('.md')) {
      const result = metadataParser(file.data);
      file.data = result.content;
      file.metadata = result.metadata;
    }
  });

  // Recursively read metadata in subdirectories
  directory.directories.forEach((subDirectory) => {
    readMetadata(subDirectory);
  });
}
