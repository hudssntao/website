import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import convert from "heic-convert";
import { readFile, writeFile } from 'fs/promises';


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

// Execute the upload
uploadImages().catch((e) => {
  console.error(e)
  process.exit(1)
})

