"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_express3 = __toESM(require("express"));
var import_dotenv = __toESM(require("dotenv"));
var import_mongoose3 = __toESM(require("mongoose"));

// src/controllers/user.controller.ts
var import_express = __toESM(require("express"));
var import_bcrypt = __toESM(require("bcrypt"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/models/User.model.ts
var import_mongoose = require("mongoose");
var import_mongoose_unique_validator = __toESM(require("mongoose-unique-validator"));
var userSchema = new import_mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
userSchema.plugin(import_mongoose_unique_validator.default);
var User_model_default = (0, import_mongoose.model)("User", userSchema);

// src/controllers/user.controller.ts
var router = import_express.default.Router();
router.post("/signup", (req, res) => {
  import_bcrypt.default.hash(req.body.password, 10).then((hash) => {
    const user = new User_model_default({
      email: req.body.email,
      password: hash
    });
    user.save().then(() => {
      return res.status(201).json({ message: "Utilisateur cr\xE9\xE9 !" });
    }).catch((error) => {
      res.status(400).json({ error });
    });
  }).catch((error) => {
    return res.status(500).json({ error });
  });
});
router.post("/login", (req, res) => {
  User_model_default.findOne({ email: req.body.email }).then((user) => {
    if (user === null) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      import_bcrypt.default.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          res.status(401).json({ message: "Invalid credentials" });
        } else {
          res.status(200).json({ userId: user._id, token: import_jsonwebtoken.default.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }
          ) });
        }
      }).catch((error) => {
        res.status(500).json({ error });
      });
    }
  }).catch((error) => res.status(500).json({ error }));
});
var user_controller_default = router;

// src/controllers/sauce.controller.ts
var import_express2 = __toESM(require("express"));

// src/middlewares/auth.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var auth_default = (req, res, next) => {
  if (req.headers.authorization?.split(" ")[1] !== void 0) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = import_jsonwebtoken2.default.verify(token, process.env.JWT_SECRET_KEY);
      const userId = decodedToken.userId;
      req.auth = {
        userId
      };
      next();
    } catch (error) {
      return res.status(401).json({ error: "Forbidden Access" });
    }
  } else {
    return res.status(401).json({ error: "No Authorization Token" });
  }
};

// src/middlewares/multer-config.ts
var import_multer = __toESM(require("multer"));
var MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png"
};
var storage = import_multer.default.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype] || "jpg";
    callback(null, Date.now() + "." + extension);
  }
});
var multer_config_default = (0, import_multer.default)({ storage }).single("image");

// src/models/Sauce.model.ts
var import_mongoose2 = require("mongoose");
var sauceSchema = new import_mongoose2.Schema({
  description: { type: String, required: true },
  dislikes: { type: Number, required: true },
  heat: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  likes: { type: Number, required: true },
  mainPepper: { type: String, required: true },
  manufacturer: { type: String, required: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  usersDisliked: { type: Array, required: true },
  usersLiked: { type: Array, required: true }
});
var Sauce_model_default = (0, import_mongoose2.model)("Sauce", sauceSchema);

// src/controllers/sauce.controller.ts
var fs = __toESM(require("fs"));

// src/middlewares/completeRequestValidator.ts
var completeRequestValidator_default = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  } : {
    ...req.body
  };
  if (sauceObject.name !== "" && !!sauceObject.name && sauceObject.manufacturer !== "" && !!sauceObject.manufacturer && sauceObject.description !== "" && !!sauceObject.description && sauceObject.manufacturer !== "" && !!sauceObject.manufacturer && sauceObject.heat >= 1 && sauceObject.heat <= 10 && sauceObject.userId !== "" && !!sauceObject.userId) {
    next();
  } else {
    return res.status(400).json({ message: "Bad arguments" });
  }
};

// src/controllers/sauce.controller.ts
var router2 = import_express2.default.Router();
router2.get("/", auth_default, (req, res) => {
  Sauce_model_default.find().then((sauces) => {
    return res.status(200).json(sauces);
  }).catch((error) => {
    return res.status(400).json({ error });
  });
});
router2.get("/:id", auth_default, (req, res) => {
  Sauce_model_default.findOne({ _id: req.params.id }).then((sauce) => {
    return res.status(200).json(sauce);
  }).catch((error) => {
    return res.status(200).json({ error });
  });
});
router2.post(
  "/",
  auth_default,
  multer_config_default,
  completeRequestValidator_default,
  (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.userId;
    const sauce = new Sauce_model_default({
      ...sauceObject,
      dislikes: 0,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file?.filename}`,
      likes: 0,
      userId: req.auth.userId,
      usersDisliked: [],
      usersLiked: []
    });
    sauce.save().then(() => {
      return res.status(201).json({ message: "Object saved" });
    }).catch((error) => {
      return res.status(400).json({ error });
    });
  }
);
router2.put("/:id", auth_default, multer_config_default, completeRequestValidator_default, (req, res) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
  } : {
    ...req.body
  };
  delete sauceObject.userId;
  Sauce_model_default.findOne({ _id: req.params.id }).then((sauce) => {
    if (sauce === null)
      return res.status(404).json({ message: "Sauce not found" });
    if (sauce.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Forbidden access" });
    } else {
      Sauce_model_default.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }).then(() => {
        if (req.file) {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            console.log("Picture successfully deleted");
          });
        }
        return res.status(200).json({ message: "Object modified" });
      }).catch((error) => {
        return res.status(400).json({ error });
      });
    }
  }).catch((error) => {
    return res.status(400).json({ error });
  });
});
router2.delete("/:id", auth_default, (req, res) => {
  Sauce_model_default.findOne({ _id: req.params.id }).then((sauce) => {
    if (sauce !== null) {
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ message: "Forbidden access" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce_model_default.deleteOne({ _id: req.params.id }).then(() => {
            return res.status(204).json({ message: "Object deleted" });
          }).catch((error) => {
            return res.status(401).json({ error });
          });
        });
      }
    } else {
      return res.status(400).json({ message: "Error: Sauce === null" });
    }
  }).catch((error) => {
    return res.status(400).json({ error });
  });
});
router2.post("/:id/like", auth_default, (req, res) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;
  Sauce_model_default.findOne({ _id: sauceId }).then((sauce) => {
    if (sauce !== null) {
      switch (like) {
        case 1:
          if (sauce.usersLiked.includes(userId)) {
            return res.status(409).json({ message: "User has already liked the sauce" });
          }
          if (sauce.usersDisliked.includes(userId)) {
            sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
            sauce.dislikes = sauce.usersDisliked.length;
          }
          sauce.usersLiked.push(userId);
          sauce.likes = sauce.usersLiked.length;
          break;
        case 0:
          if (sauce.usersLiked.includes(userId)) {
            sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
            sauce.likes = sauce.usersLiked.length;
          }
          if (sauce.usersDisliked.includes(userId)) {
            sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
            sauce.dislikes = sauce.usersDisliked.length;
          }
          break;
        case -1:
          if (sauce.usersDisliked.includes(userId)) {
            return res.status(409).json({ message: "User has already disliked the sauce" });
          }
          if (sauce.usersLiked.includes(userId)) {
            sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
            sauce.likes = sauce.usersLiked.length;
          }
          sauce.usersDisliked.push(userId);
          sauce.dislikes = sauce.usersDisliked.length;
          break;
        default:
          return res.status(406).json({ message: "Like is not equal to 1, 0 or -1" });
      }
      Sauce_model_default.updateOne({ _id: req.params.id }, sauce).then(() => {
        return res.status(200).json({ message: "Object modified" });
      }).catch((error) => {
        return res.status(400).json({ error });
      });
    }
  }).catch((error) => {
    return res.status(400).json({ error });
  });
});
var sauce_controller_default = router2;

// src/index.ts
var import_path = __toESM(require("path"));
var app = (0, import_express3.default)();
app.use(import_express3.default.json());
import_dotenv.default.config();
import_dotenv.default.config({ path: `.env.local`, override: true });
import_mongoose3.default.connect("mongodb+srv://" + process.env.MONGOOSE_USERNAME + ":" + process.env.MONGOOSE_PASSWORD + process.env.MONGOOSE_DATABASE_ADDRESS).then(() => console.log("Connexion \xE0 MongoDB r\xE9ussie !")).catch(() => console.log("Connexion \xE0 MongoDB \xE9chou\xE9e !"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.use("/api/auth", user_controller_default);
app.use("/api/sauces", sauce_controller_default);
app.use("/images", import_express3.default.static(import_path.default.join(__dirname, "../images")));
var src_default = app;

// src/server.ts
var import_http = __toESM(require("http"));
var normalizePort = (val) => {
  const port2 = parseInt(val, 10);
  if (isNaN(port2)) {
    return val;
  }
  if (port2 >= 0) {
    return port2;
  }
  return false;
};
var port = normalizePort(process.env.PORT || "3000");
src_default.set("port", port);
var errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
var server = import_http.default.createServer(src_default);
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});
server.listen(port);
