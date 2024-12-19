const express = require('express');
const roomController = require('../controllers/RoomController');
const {
  createRoomValidation,
  updateRoomValidation,
  deleteRoomValidation,
  getRoomByIdValidation,
} = require('../utils/validations/roomValidations');

const router = express.Router();

router.post('/', createRoomValidation, roomController.createRoom);
router.post('/:id_sala/members', roomController.addMemberToRoom);
router.get('/', roomController.getRooms);
router.get('/:id', getRoomByIdValidation, roomController.getRoomById);
router.get('/user/:id_usuario', roomController.getRoomsOfUser);
router.put('/:id', updateRoomValidation, roomController.updateRoom);
router.delete('/:id_sala/members', roomController.removeMemberFromRoom);
router.delete('/:id', deleteRoomValidation, roomController.deleteRoom);

router.get('/:id_sala/users', roomController.getUsersOfRoom); // Obter usuários de uma sala

module.exports = router;
