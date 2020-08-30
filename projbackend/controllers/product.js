const Product = require("../models/product");
const formidable = require("formidable");
const multer = require("multer");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "product not found",
        });
      }
      req.product = product;
      next();
    });
};

// exports.createProduct = (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, file) => {
//     if (err) {
//       return res.status(400).json({
//         error: "problem with image",
//       });
//     }
//     //destructring the fields
//     const { name, description, price, category, stock } = fields;

//     if (!name || !description || !price || !category || !stock) {
//       return res.status(400).json({
//         error: "Please include all fields",
//       });
//     }

//     let product = new Product(fields);

//     //handle file here
//     if (file.photo) {
//       if (file.photo.size > 3000000) {
//         return res.status(400).json({
//           error: "file is too big",
//         });
//       }
//       product.photo.data = fs.readFileSync(file.photo.path);
//       product.photo.contentType = file.photo.type;
//     }
//     //TODO: remove console.log
//     console.log(product);
//     //save to DB
//     product.save((err, product) => {
//       if (err) {
//         return res.status(400).json({
//           error: "saving product to db failed",
//         });
//       }
//       return res.json(product);
//     });
//   });
// };

//TODO: Testing form data with image upload-------------------------

exports.createProduct = (req, res) => {
  //handle image here
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/productImages");
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      req.prodImgMimeError = "Only jpeg,png and jpg files are allowed";
    }
  };

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
  }).single("photo");

  upload(req, res, function (err) {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "All fields are mandatory",
      });
    }
    //if there is an error with file then also file property don't come in body object
    if (!req.file && !err && !req.prodImgMimeError) {
      return res.json({
        error: "Please choose a product image",
      });
    }
    if (err instanceof multer.MulterError) {
      return res.json({
        error: err.message,
      });
    }
    if (req.prodImgMimeError) {
      return res.json({
        error: req.prodImgMimeError,
      });
    } else if (err) {
      return res.json({
        error: "An unexpected error occured",
      });
    }
    const { path, filename } = req.file;

    let product = new Product(req.body);
    product.photo.path = path;
    product.photo.filename = filename;

    //saving product to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "saving product to db failed",
        });
      }
      return res.json(product);
    });
  });
};
//-----------------------------------------------------
exports.getProduct = (req, res) => {
  // req.product.photo = undefined; //image can be bulky to load directly
  return res.json(req.product); //this will return everything except image
};

//middleware to load photo
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Product can't be deleted",
      });
    }
    return res.json({
      message: "Product deleted successfully",
      deletedProduct,
    });
  });
};

// exports.updateProduct = (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, file) => {
//     if (err) {
//       return res.status(400).json({
//         error: "problem with image",
//       });
//     }
//     // //destructring the fields
//     // const { name, description, price, category, stock } = fields;

//     // if (!name || !description || !price || !category || !stock) {
//     //   return res.status(400).json({
//     //     error: "Please include all fields",
//     //   });
//     // }

//     //updation code
//     let product = req.product;
//     product = _.extend(product, fields); //this is from loadash which puts updated values from fields into product

//     //handle file here
//     if (file.photo) {
//       if (file.photo.size > 3000000) {
//         return res.status(400).json({
//           error: "file is too big",
//         });
//       }
//       product.photo.data = fs.readFileSync(file.photo.path);
//       product.photo.contentType = file.photo.type;
//     }
//     console.log(product);
//     //save to DB
//     product.save((err, product) => {
//       if (err) {
//         return res.status(400).json({
//           error: "updation of product in DB failed",
//         });
//       }
//       return res.json(product);
//     });
//   });
// };

exports.updateProduct = (req, res) => {
  // let product = req.product;
  // console.log(product);
  // const { name, description, price, category, stock } = req.body;
  // product = _.extend(product, req.body); //this is from loadash which puts updated values from fields into product
  // const { path, filename } = req.file;
  // product.photo.path = path;
  // product.photo.filename = filename;
  // console.log(product);

  //handle image here
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/productImages");
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      req.prodImgMimeError = "Only jpeg,png and jpg files are allowed";
    }
  };

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter,
  }).single("photo");

  upload(req, res, function (err) {
    const { name, description, price, category, stock } = req.body;
    let product = req.product;
    product = _.extend(product, req.body); //this is from loadash which puts updated values from fields into product

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "All fields are mandatory",
      });
    }
    //if there is an error with file then also file property don't come in body object
    if (!req.file && !err && !req.prodImgMimeError) {
      return res.json({
        error: "Please choose a product image",
      });
    }
    if (err instanceof multer.MulterError) {
      return res.json({
        error: err.message,
      });
    }
    if (req.prodImgMimeError) {
      return res.json({
        error: req.prodImgMimeError,
      });
    } else if (err) {
      return res.json({
        error: "An unexpected error occured",
      });
    }
    const { path, filename } = req.file;

    // let product = new Product(req.body);
    // product.photo.path = path;
    // product.photo.filename = filename;

    product.photo.path = path;
    product.photo.filename = filename;

    //saving product to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of product in DB failed",
        });
      }
      return res.json(product);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 10; //by default query is in string that's parsing it to convert into integer
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    // .select("-photo") //it will not select photo while fetching data from DB
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit) //to limit fetching amount of data
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No Product Found",
        });
      }
      return res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No category found",
      });
    }
    return res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed",
      });
    }
    next();
  });
};
