import multer from "multer";

const imageMime = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];
const videoMime = ["video/mp4", "video/webm", "video/ogg"];

function sanitizeFileName(name) {
  return name.replace(/^.*[\\/]/, "").replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|avif|mp4|webm|ogg)$/i;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + sanitizeFileName(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  if (
    !(imageMime.includes(file.mimetype) || videoMime.includes(file.mimetype))
  ) {
    return cb(new Error("Invalid file type"), false);
  }
  if (!allowedExtensions.test(file.originalname)) {
    return cb(new Error("Unsupported file extension"), false);
  }
  cb(null, true);
};

export const uploadFanArt = multer({
  storage,
  fileFilter,
  limits: { files: 13 },
}).fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 2 },
  { name: "vitiligoFace", maxCount: 1 },
]);
