import { S3 } from "@aws-sdk/client-s3";
// import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import axios from "axios";

const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// const db = sql("meals.db");

export async function getMeals() {
  // throw new Error("Loading meals failed"); not needed in Next.js
  try {
    const response = await axios.get(process.env.BACKEND_URL + "meals.json");
    const meals = [];

    for (const key in response.data) {
      const meal = {
        creator: response.data[key].creator,
        creator_email: response.data[key].creator_email,
        image: response.data[key].image,
        instructions: response.data[key].instructions,
        slug: response.data[key].slug,
        summary: response.data[key].summary,
        title: response.data[key].title,
        id: key,
      };

      meals.push(meal);
    }

    return meals;
  } catch (error) {
    console.log(error);
  }
}

export async function getMeal(id) {
  try {
    const response = await axios.get(
      process.env.BACKEND_URL + `meals/${id}.json`
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function saveMeal(meal) {
  try {
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    const extension = meal.image.name.split(".").pop();
    const fileName = `${meal.slug}.${extension}`;

    const bufferedImage = await meal.image.arrayBuffer();

    await s3.putObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    });

    meal.image = fileName;

    await axios.post(process.env.BACKEND_URL + "meals.json", meal);
  } catch (error) {
    console.log(error);
  }
}
