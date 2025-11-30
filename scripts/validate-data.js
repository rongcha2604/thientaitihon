#!/usr/bin/env node

/**
 * Script để validate data files
 * Usage: node scripts/validate-data.js
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDataDir = join(__dirname, '../public/data');

function validateManifest(manifest) {
  const errors = [];
  
  if (!manifest.version) errors.push('Missing version');
  if (!manifest.grades || !Array.isArray(manifest.grades)) {
    errors.push('Missing or invalid grades array');
  }
  
  manifest.grades?.forEach((grade, i) => {
    if (!grade.grade) errors.push(`Grade ${i}: Missing grade number`);
    if (!grade.subjects || !Array.isArray(grade.subjects)) {
      errors.push(`Grade ${i}: Missing or invalid subjects`);
    }
    
    grade.subjects?.forEach((subject, j) => {
      if (!subject.id) errors.push(`Grade ${i}, Subject ${j}: Missing id`);
      if (!subject.name_vi) errors.push(`Grade ${i}, Subject ${j}: Missing name_vi`);
      if (!subject.paths || !Array.isArray(subject.paths)) {
        errors.push(`Grade ${i}, Subject ${j}: Missing or invalid paths`);
      }
    });
  });
  
  return errors;
}

function validateQuestionBundle(bundle) {
  const errors = [];
  
  if (!bundle.meta) errors.push('Missing meta');
  if (bundle.meta) {
    if (!bundle.meta.grade) errors.push('Missing meta.grade');
    if (!bundle.meta.subject) errors.push('Missing meta.subject');
  }
  
  if (!bundle.topics || !Array.isArray(bundle.topics)) {
    errors.push('Missing or invalid topics');
  }
  
  bundle.topics?.forEach((topic, i) => {
    if (!topic.id) errors.push(`Topic ${i}: Missing id`);
    if (!topic.name) errors.push(`Topic ${i}: Missing name`);
    if (!topic.questions || !Array.isArray(topic.questions)) {
      errors.push(`Topic ${i}: Missing or invalid questions`);
    }
    
    topic.questions?.forEach((q, j) => {
      if (!q.id) errors.push(`Topic ${i}, Question ${j}: Missing id`);
      if (!q.question) errors.push(`Topic ${i}, Question ${j}: Missing question text`);
      if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        errors.push(`Topic ${i}, Question ${j}: Invalid options (must be 4)`);
      }
      if (typeof q.answer_index !== 'number' || q.answer_index < 0 || q.answer_index >= 4) {
        errors.push(`Topic ${i}, Question ${j}: Invalid answer_index`);
      }
    });
  });
  
  return errors;
}

function validateFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    if (filePath.includes('manifest.json')) {
      return validateManifest(data);
    } else {
      return validateQuestionBundle(data);
    }
  } catch (error) {
    return [`Parse error: ${error.message}`];
  }
}

function scanDirectory(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = readdirSync(currentDir);
    
    entries.forEach(entry => {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (entry.endsWith('.json')) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

// Main
console.log('🔍 Validating data files...\n');

const files = scanDirectory(publicDataDir);
let totalErrors = 0;

files.forEach(file => {
  const errors = validateFile(file);
  const relativePath = file.replace(publicDataDir + '/', '');
  
  if (errors.length > 0) {
    console.error(`❌ ${relativePath}:`);
    errors.forEach(err => console.error(`   - ${err}`));
    totalErrors += errors.length;
  } else {
    console.log(`✅ ${relativePath}`);
  }
});

console.log(`\n📊 Total: ${files.length} files`);
if (totalErrors > 0) {
  console.error(`❌ Found ${totalErrors} errors`);
  process.exit(1);
} else {
  console.log('✅ All files valid!');
  process.exit(0);
}

