// Resume upload configuration
const multer = require("multer");


const resumeStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/resumes");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + file.originalname;
      cb(null, uniqueSuffix);
    },
  });
  
  const resumeFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  };
  
  const uploadResume = multer({
    storage: resumeStorage,
    fileFilter: resumeFileFilter,
  });
  
  module.exports = uploadResume.single("resume");