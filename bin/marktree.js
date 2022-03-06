#!/usr/bin/env node

import { readMarkdown, writeHtml } from '../src/index.js'

writeHtml(readMarkdown())
