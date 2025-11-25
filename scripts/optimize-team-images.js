#!/usr/bin/env node

/**
 * Image Optimization Script for Team Photos
 *
 * This script compresses team images from ~300-400KB to ~100KB
 * while maintaining good visual quality.
 *
 * Usage: node scripts/optimize-team-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_DIR = path.join(__dirname, '../apps/web/public/images/team');
const OUTPUT_DIR = path.join(__dirname, '../apps/web/public/images/team/optimized');
const TARGET_QUALITY = 80; // JPEG quality (0-100)
const TARGET_SIZE = 100 * 1024; // 100KB in bytes

// Team image files
const images = [
  'gregorstudlar.jpg',
  'thomaskaufmann.jpeg',
  'philippoppel.jpeg',
  'hannesfreudenthaler.jpeg',
];

async function getImageInfo(filePath) {
  const stats = fs.statSync(filePath);
  const metadata = await sharp(filePath).metadata();
  return {
    size: stats.size,
    width: metadata.width,
    height: metadata.height,
    format: metadata.format,
  };
}

async function optimizeImage(inputPath, outputPath) {
  console.log(`\nProcessing: ${path.basename(inputPath)}`);

  const beforeInfo = await getImageInfo(inputPath);
  console.log(
    `  Before: ${(beforeInfo.size / 1024).toFixed(1)}KB (${beforeInfo.width}x${beforeInfo.height})`,
  );

  // Try different quality levels to hit target size
  let quality = TARGET_QUALITY;
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    await sharp(inputPath).jpeg({ quality, mozjpeg: true }).toFile(outputPath);

    const afterInfo = await getImageInfo(outputPath);
    const sizeDiff = afterInfo.size - TARGET_SIZE;

    console.log(
      `  Attempt ${attempts + 1}: ${(afterInfo.size / 1024).toFixed(1)}KB (quality: ${quality})`,
    );

    // If we're within 10KB of target, or quality is too low, stop
    if (Math.abs(sizeDiff) < 10 * 1024 || quality < 50) {
      console.log(
        `  ✓ Final: ${(afterInfo.size / 1024).toFixed(1)}KB (saved ${((1 - afterInfo.size / beforeInfo.size) * 100).toFixed(1)}%)`,
      );
      break;
    }

    // Adjust quality based on how far we are from target
    if (sizeDiff > 0) {
      quality -= 5; // Too large, reduce quality
    } else {
      quality += 2; // Too small, increase quality
    }

    attempts++;
  }
}

async function main() {
  console.log('🖼️  Team Image Optimization Script\n');
  console.log(`Target size: ~${TARGET_SIZE / 1024}KB per image\n`);

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}\n`);
  }

  // Process each image
  for (const image of images) {
    const inputPath = path.join(INPUT_DIR, image);
    const outputPath = path.join(OUTPUT_DIR, image);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Skipping ${image} - file not found`);
      continue;
    }

    try {
      await optimizeImage(inputPath, outputPath);
    } catch (error) {
      console.error(`❌ Error processing ${image}:`, error.message);
    }
  }

  console.log('\n✅ Optimization complete!');
  console.log(`\nOptimized images are in: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Review the optimized images');
  console.log('2. If satisfied, replace the original images:');
  console.log(`   cp ${OUTPUT_DIR}/* ${INPUT_DIR}/`);
  console.log('3. Delete the optimized folder:');
  console.log(`   rm -rf ${OUTPUT_DIR}`);
}

main().catch(console.error);
