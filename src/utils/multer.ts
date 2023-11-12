import { HttpException } from "@exceptions/http.exception";
import { ensureFilePathExists } from "@utils/file";
import multer, { FileFilterCallback, Options } from "multer";
import { v4 as uuidv4 } from "uuid";

interface FileUploadOptions {
  path: string;
  regex?: RegExp;
  error?: string;
  sizeKB?: number;
}

export const configureMulterOption = ({
  path,
  regex = /^image\/(jpeg|png)$/,
  error = "Only JPEG and PNG files are allowed",
  sizeKB = 1024 * 2,
}: FileUploadOptions): Options => ({
  storage: multer.diskStorage({
    destination: (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
      callback(null, ensureFilePathExists(path));
    },

    filename: (req: Express.Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
      callback(null, `${uuidv4()}.${file.originalname.split(".").pop()}`);
    },
  }),

  fileFilter: (req: Express.Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (regex.test(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new HttpException(406, error));
    }
  },

  limits: { fieldNameSize: 255, fileSize: sizeKB * 1024 },
});
