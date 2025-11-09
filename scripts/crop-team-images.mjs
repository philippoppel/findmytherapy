#!/usr/bin/env node

/**
 * Script to crop team member images to portrait format (3:4 ratio)
 * Optimized for face-centered composition
 *
 * Requires: sharp (npm install sharp)
 * Usage: node scripts/crop-team-images.mjs
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ROOT = join(__dirname, '..');
const IMAGES_DIR = join(PROJECT_ROOT, 'apps/web/public/images/team');
const OUTPUT_DIR = join(IMAGES_DIR, 'cropped');

// Image configurations with crop settings
const CROPS = [
  {
    input: 'gregorstudlar.jpg',
    output: 'gregorstudlar-cropped.jpg',
    // The black bar is extensive - crop only visible person area
    // Testing with very conservative height to eliminate ALL black
    extract: {
      left: 88,        // Center horizontally
      top: 0,          // Start from top
      width: 800,      // Width
      height: 850,     // Very conservative - stop well before any black
    },
    resize: {
      width: 800,
      height: 1000,
      fit: 'fill',     // Stretch slightly to fill
    },
  },
  {
    input: 'thomaskaufmann.jpeg',
    output: 'thomaskaufmann-cropped.jpeg',
    // Zoom in and center the face
    gravity: 'center',
    width: 800,
    height: 1000,
  },
  {
    input: 'philippoppel.jpeg',
    output: 'philippoppel-cropped.jpeg',
    // Keep mostly as is, slight crop
    gravity: 'center',
    width: 800,
    height: 1000,
  },
];

async function cropImage({ input, output, gravity, width, height, extract, resize }) {
  const inputPath = join(IMAGES_DIR, input);
  const outputPath = join(OUTPUT_DIR, output);

  console.log(`Processing ${input}...`);

  try {
    let pipeline = sharp(inputPath);

    if (extract) {
      // Use custom extract coordinates to precisely crop
      pipeline = pipeline.extract(extract);

      // If resize is specified after extract, apply it
      if (resize) {
        pipeline = pipeline.resize(resize.width, resize.height, {
          fit: resize.fit || 'cover',
          position: resize.position || 'center',
        });
      }
    } else {
      // Use standard resize with gravity
      pipeline = pipeline.resize(width, height, {
        fit: 'cover',
        position: gravity,
      });
    }

    await pipeline
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    console.log(`✓ Saved to ${outputPath}`);
  } catch (error) {
    console.error(`✗ Error processing ${input}:`, error.message);
  }
}

async function main() {
  // Create output directory if it doesn't exist
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Cropping team images...\n');

  for (const crop of CROPS) {
    await cropImage(crop);
  }

  console.log('\n✨ Done! Check the cropped images in:');
  console.log(OUTPUT_DIR);
  console.log('\nIf they look good, rename them to replace the originals.');
}

main().catch(console.error);
