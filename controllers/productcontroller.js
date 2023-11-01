const Product = require("../models/productmodel");
const Errorhandler = require("../utils/errorHandler");
const catchasyncerror = require("../middleware/catchAsyncError");
const Apifeature = require("../utils/apiFeature");
const cloudinary = require("cloudinary");
// create product admin only

// exports.createProduct = catchasyncerror(async (req, res, next) => {
//   let images = [];

//   if (typeof req.body.images === "string") {
//     images.push(req.body.images);
//   } else {
//     images = req.body.images;
//   }

//   const imagesLinks = [];

//   for (let i = 0; i < images.length; i++) {
//     const result = await cloudinary.v2.uploader.upload(images[i], {
//       folder: "products",
//     });

//     imagesLinks.push({
//       public_id: result.public_id,
//       url: result.secure_url,
//     });
//   }

//   req.body.images = imagesLinks;
//   req.body.user = req.user.id;

//   const product = await Product.create(req.body);

//   res.status(201).json({
//     success: true,
//     product,
//   });
// });

exports.createproduct = catchasyncerror(async (req, res, next) => {
  const file = req.files.image;
  const imagesLinks = [];
  for (let i = 0; i < file.length; i++) {
    const result = await cloudinary.v2.uploader.upload(file[i].tempFilePath);
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.user = req.user.id;
  req.body.image = imagesLinks;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

//fot test purpose
exports.getsangam = async (req, res) => {
  res.send("hello sangam");
};

exports.getAllProducthome = catchasyncerror(async (req, res, next) => {
  const resultperpage = 8;
  const apifeature = new Apifeature(Product.find(), req.query).pagination(
    resultperpage
  );
  const products = await apifeature.query;
  // const products = await Product.find();
  res.status(200).json({ products });
});
exports.getAllProducts = catchasyncerror(async (req, res, next) => {
  // const resultperpage = 12;
  const productcount = await Product.countDocuments();
  const apifeature = new Apifeature(Product.find(), req.query)
    .search()
    .filter();
  // .pagination(resultperpage);
  const products = await apifeature.query;
  // const products = await Product.find();
  res.status(200).json({ success: true, products, productcount: productcount });
});

//get all prosuct admin
exports.getAllProductsadmin = catchasyncerror(async (req, res, next) => {
  const products = await Product.find();
  // const products = await Product.find();
  res.status(200).json({ success: true, products });
});

// update product only admin
exports.updateproduct = catchasyncerror(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Successfully updated",
    product,
  });
});

// get product details
exports.getproductdetails = catchasyncerror(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  res.status(200).json({
    product,
  });
});

//delete product
exports.deleteproduct = catchasyncerror(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  // if (!product) {
  //   return res.status(500).json({
  //     success: false,
  //     message: "product not found",
  //   });
  // }

  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});

// create review
exports.createReview = catchasyncerror(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isreviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isreviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        (rev.rating = rating), (rev.comment = comment);
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }
  let avg = 0;
  product.ratings = product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// get all reviews of a product
exports.getAllreviews = catchasyncerror(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new Errorhandler("product not found", 400));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// delete review of a product
exports.deleteReview = catchasyncerror(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new Errorhandler("product not found", 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;
  const numberOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
