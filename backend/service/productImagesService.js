const productImagesRepository = require("../repository/productImagesRepository");
const productRepository = require("../repository/productRepository");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadStream = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadAndCreate = async ({ fileBuffer, product_id, sort_order }) => {
  // Upload to Cloudinary
  const result = await uploadStream(fileBuffer);

  // Save in DB
  const image = await productImagesRepository.createProductImage({
    product_id,
    image_url: result.secure_url,
    sort_order: sort_order || 0,
  });

  return image;
};

// GET BY PRODUCT
const getProductImages = async (product_id) => {
  if (!product_id) {
    const error = new Error("product_id is required");
    error.statusCode = 400;
    throw error;
  }

  return await productImagesRepository.getImagesByProductId(product_id);
};

// DELETE
const deleteProductImage = async (id) => {
  const deleted = await productImagesRepository.deleteProductImage(id);

  if (!deleted) {
    const error = new Error("Product image not found");
    error.statusCode = 404;
    throw error;
  }

  return deleted;
};

module.exports = {
  uploadAndCreate,
  getProductImages,
  deleteProductImage,
};
