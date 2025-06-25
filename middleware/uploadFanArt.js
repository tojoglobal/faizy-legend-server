import multer from "multer";

// Accept only images or only videos by mimetype
const imageMime = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];
const videoMime = ["video/mp4", "video/webm", "video/ogg"];

// SANITIZE file names: only allow safe chars, replace all others with '_'
function sanitizeFileName(name) {
  // Remove path, keep only filename, replace all non-safe
  return name.replace(/^.*[\\/]/, "").replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

// Allow only specific extensions
const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|avif|mp4|webm|ogg)$/i;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + sanitizeFileName(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (
    !(imageMime.includes(file.mimetype) || videoMime.includes(file.mimetype))
  ) {
    return cb(new Error("Invalid file type"), false);
  }
  // Check extension
  if (!allowedExtensions.test(file.originalname)) {
    return cb(new Error("Unsupported file extension"), false);
  }
  cb(null, true);
};

export const uploadFanArt = multer({
  storage,
  fileFilter,
  limits: {
    files: 12, // 10 images + 2 videos max per upload (enforced in controller)
  },
}).fields([
  { name: "images", maxCount: 10 },
  { name: "videos", maxCount: 2 },
]);
