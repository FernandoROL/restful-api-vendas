import { BadRequestError } from "@/common/domain/error/bad-request-error"
import multer from "multer"

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: (request, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if(!allowedMimes.includes(file.mimetype)) {
      return callback(new BadRequestError('.jpg, .jpeg, .png and .webp files are accepted'))
    }

    return callback(null, true)
  }
})
