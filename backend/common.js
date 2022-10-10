const fs = require('fs/promises');
const path = require('path');

/**
 * bibliothèque interne à node
 * contient la liste des codes http
 */
const { STATUS_CODES } = require('node:http');

exports.regex = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  proto: /^https?:\/\//,
  bearer: /^Bearer ([\w.-]+)$/,
};

/**
 * intercepte l'exception et renvoie au gestionnaire d'érreurs
 */
// prettier-ignore
exports.asyncWrapper = (cb) => (...args) => {
  const fn = cb(...args);
  const next = args[args.length - 1];
  return Promise.resolve(fn).catch(next);
};

/**
 * érreurs personnalisées
 */
exports.HttpError = class extends Error {
  constructor(arg = 500) {
    if (Number.isInteger(arg)) {
      super(STATUS_CODES[arg]);
      this.status = arg;
    } else {
      super(arg.message);
      this.status = arg.status;
      this.details = arg.details;
    }
    this.name = 'HttpError';
  }
};

/**
 * gestionnaire d'érreur d'express
 */
exports.errorHandler = async (err, req, res, next) => {
  console.error(err);
  const { status, message, details } = err instanceof this.HttpError ? err : new this.HttpError();
  if (req.file) await fs.unlink(req.file.path);
  res.status(status).json({ status, message, details });
};

/**
 * Verifie la présence d'un dossier upload
 * si non présent créer ce dernier
 */
exports.initUploadFolder = async () => {
  const upload = path.join(__dirname, 'upload');
  await fs.access(upload, fs.constants.F_OK).catch(async () => {
    await fs.mkdir(upload).catch((e) => {
      console.error(e);
      process.exit(2);
    });
  });
  return upload;
};
