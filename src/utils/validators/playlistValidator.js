import { body, check } from 'express-validator';
import { validatiorMiddleware } from '../../middlewares/validatorMiddleware.js';
import { playList } from '../../models/playlist.model.js';
import { Video } from '../../models/videoModel.js';

const createPlayListValidator = [
  check('playListName')
    .notEmpty()
    .withMessage('playList name is required')
    .isLength({ min: 3 })
    .withMessage('Too short playList name')
    .isLength({ max: 32 })
    .withMessage('Too long playList name')
    .custom(async (val) => {
      const name = await playList.findOne({ playListName: val });
      if (name) {
        return Promise.reject(new Error('playList name is already exists'));
      }
      return true;
    }),

  validatiorMiddleware,
];

const getPlayListValidator = [
  check('playListName')
    .notEmpty()
    .withMessage('playList name is required')
    .custom(async (val) => {
      const name = await playList.findOne({ playListName: val });
      if (!name) {
        return Promise.reject(new Error('playList name is not exists'));
      }
      return true;
    }),

  check('videoId')
    .notEmpty()
    .withMessage('Video Id is required')
    .isMongoId()
    .withMessage('Invalid video id format')
    .custom(async (videoId) => {
      const video = await Video.findById(videoId);
      if (!video) {
        return Promise.reject(
          new Error(`No video found for this id : ${videoId}`)
        );
      }
    }),

  validatiorMiddleware,
];

const updatePlayListValidator = [
  check('id').isMongoId().withMessage('Invalid playList format'),

  check('playListName')
    .notEmpty()
    .withMessage('playList name is required')
    .isLength({ min: 3 })
    .withMessage('Too short playList name')
    .isLength({ max: 32 })
    .withMessage('Too long playList name')
    .custom(async (val) => {
      const name = await playList.findOne({ playListName: val });
      if (name) {
        return Promise.reject(new Error('playList name is already exists'));
      }
      return true;
    }),

  validatiorMiddleware,
];

const deletePlayListValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid ID formate')
    .custom(async (id) => {
      const name = await playList.findById(id);
      if (!name) {
        return Promise.reject(new Error(`Not found for this id : ${id}`));
      }
    }),

  validatiorMiddleware,
];

export {
  createPlayListValidator,
  getPlayListValidator,
  updatePlayListValidator,
  deletePlayListValidator,
};
