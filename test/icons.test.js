'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { extensionChips, fileNameChips, chipDefs, iconSvgs, iconManifest, chipTextAttrs } = require('../build/icons');
const { dark, light } = require('../build/tokens');
const { alpha } = require('../build/lib/color');

test('chip table is well-formed', () => {
  for (const e of [...extensionChips, ...fileNameChips]) {
    assert.match(e.chip, /^[A-Z0-9]{1,4}$/, `bad chip ${e.chip}`);
    assert.ok(e.hue in dark && e.hue in light, `unknown hue token ${e.hue}`);
  }
  assert.ok(chipDefs().size > 30, 'expected broad type coverage');
});

test('sizing rule follows the spec', () => {
  assert.deepEqual(chipTextAttrs('TS'), { size: 7, textLength: null });
  assert.deepEqual(chipTextAttrs('CSS'), { size: 6, textLength: 12.5 });
  assert.deepEqual(chipTextAttrs('HTML'), { size: 5.2, textLength: 13.5 });
});

test('chip svgs use the tag recipe from the hue token', () => {
  const svgs = iconSvgs(dark);
  const ts = svgs['chip-ts'];
  assert.ok(ts.includes(`fill="${alpha(dark.accentAlt, 0.13)}"`), 'chip fill = hue @13%');
  assert.ok(ts.includes(`stroke="${alpha(dark.accentAlt, 0.28)}"`), 'chip stroke = hue @28%');
  assert.ok(ts.includes(`fill="${dark.accentAlt}"`), 'chip text = hue');
  assert.ok(ts.includes('>TS<'));
});

test('every svg is structurally sound with lowercase hex only', () => {
  for (const t of [dark, light]) {
    for (const [name, svg] of Object.entries(iconSvgs(t))) {
      assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">'), name);
      assert.ok(svg.trimEnd().endsWith('</svg>'), name);
      for (const hex of svg.match(/#[0-9a-fA-F]+/g) ?? []) {
        assert.match(hex, /^#[0-9a-f]{6}([0-9a-f]{2})?$/, `${name}: ${hex}`);
      }
    }
  }
});

test('folders and generic file are quiet; open folder carries accent', () => {
  const svgs = iconSvgs(dark);
  assert.ok(svgs.folder.includes(`stroke="${dark.textFaint}"`));
  assert.ok(svgs.file.includes(`stroke="${dark.textFaint}"`));
  assert.ok(svgs['folder-open'].includes(`stroke="${dark.accent}"`));
});

test('manifest maps every table entry and lights every mapping', () => {
  const m = iconManifest();
  for (const e of extensionChips) {
    for (const ext of e.extensions) {
      assert.equal(m.fileExtensions[ext], `_chip-${e.chip.toLowerCase()}`);
      assert.equal(m.light.fileExtensions[ext], `_chip-${e.chip.toLowerCase()}_light`);
    }
  }
  for (const e of fileNameChips) {
    for (const fn of e.fileNames) {
      assert.equal(m.fileNames[fn], `_chip-${e.chip.toLowerCase()}`);
      assert.equal(m.light.fileNames[fn], `_chip-${e.chip.toLowerCase()}_light`);
    }
  }
  const allIds = [
    ...Object.values(m.fileExtensions), ...Object.values(m.fileNames),
    ...Object.values(m.light.fileExtensions), ...Object.values(m.light.fileNames),
    m.file, m.folder, m.folderExpanded, m.light.file, m.light.folder, m.light.folderExpanded,
  ];
  for (const id of allIds) assert.ok(m.iconDefinitions[id], `undefined icon id ${id}`);
  assert.equal(m.folder, '_folder');
  assert.equal(m.folderExpanded, '_folder-open');
  assert.equal(m.file, '_file');
  assert.equal(m.hidesExplorerArrows, false);
});
