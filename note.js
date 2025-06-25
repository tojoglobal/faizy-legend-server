// CREATE TABLE fan_art (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user VARCHAR(100) NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     tags VARCHAR(255),
//     images JSON,      -- Array of image paths
//     videos JSON,      -- Array of video paths
//     approved BOOLEAN DEFAULT NULL, -- NULL=pending, 1=approved, 0=rejected
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );