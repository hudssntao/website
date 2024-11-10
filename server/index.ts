import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import convert from "heic-convert";
import { readFile, writeFile } from 'fs/promises';
import sharp from "sharp";

dotenv.config()

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.DATABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

// Initialize Prisma client
const prisma = new PrismaClient()


// Directory containing images on your local system
const directoryPath = './unique_images'

async function uploadImages() {
  try {
    const files = fs.readdirSync(directoryPath)

    for (let file of files) {
      if (file.includes("Zone.Identifier")) {
        continue;
      }

      if (file.toLowerCase().includes("heic")) {
        console.log("CONVERTING", file);
        try {
          const inputBuffer = await readFile(`${directoryPath}/${file}`); // Read the HEIC file into a buffer
          const outputBuffer = await convert({
            buffer: inputBuffer, // the HEIC file buffer
            format: 'JPEG',      // output format
            quality: 1           // the jpeg compression quality, between 0 and 1
          });

          const bufferToWrite = Buffer.from(outputBuffer);
          const name = `${file.split(".")[0]}_converted.jpg`

          await writeFile(`${directoryPath}/${name}`, bufferToWrite); // Write the converted image to disk
          file = name
          console.log('Image conversion successful!');
        } catch (error) {
          console.error('Error during conversion:', error);
        }
      }


      const filePath = path.join(directoryPath, file)
      const fileContent = fs.readFileSync(filePath)
      const fileName = file


      // Upload to Supabase
      const { data, error } = await supabase.storage.from('images').upload(fileName, fileContent)

      if (error) {
        console.error(`Failed to upload ${file}:`, error.message)
        continue
      }

      // Get the public URL for the uploaded file
      const { publicUrl } = supabase.storage.from('images').getPublicUrl(fileName).data

      // Store metadata in the database with Prisma
      await prisma.image.create({
        data: {
          url: publicUrl,
          filename: file,
        },
      })

      console.log(`Uploaded and saved metadata for ${file}`)
    }
  } catch (error) {
    console.error('Error uploading images:', error)
  } finally {
    await prisma.$disconnect()
  }
}

async function calculateAverageColor(imageUrl: string): Promise<string> {
  try {
    // Fetch the image and resize it to a smaller size for faster processing
    const imageBuffer = await fetch(imageUrl).then(res => res.arrayBuffer());

    // Resize to a small image since we just need the average color
    const { data, info } = await sharp(imageBuffer)
      .resize(50, 50, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let r = 0, g = 0, b = 0;
    const pixelCount = info.width * info.height;

    // Sharp provides raw pixel data in RGB format
    for (let i = 0; i < data.length; i += 3) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    const avgColor = `${Math.floor(r / pixelCount)},${Math.floor(g / pixelCount)},${Math.floor(b / pixelCount)}`;
    return avgColor;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}

// Function to process all images in your database
async function processExistingImages() {
  try {
    // Get all images that don't have an averageColor yet
    const images = await prisma.image.findMany({
      where: {
        averageColor: null,
        role: "ALT",
      }
    });

    console.log(`Processing ${images.length} images...`);

    // Process images in batches to avoid memory issues
    const batchSize = 10;
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize);

      await Promise.all(batch.map(async (image) => {
        try {
          const averageColor = await calculateAverageColor(image.url);

          await prisma.image.update({
            where: { id: image.id },
            data: { averageColor }
          });

          console.log(`Processed image ${image.id}: ${averageColor}`);
        } catch (error) {
          console.error(`Failed to process image ${image.id}:`, error);
        }
      }));
    }

    console.log('Finished processing images');
  } catch (error) {
    console.error('Error in batch processing:', error);
  }
}


// Example usage for processing existing images
processExistingImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
