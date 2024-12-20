const MemberGroup = require('../models/groupMember');
const Group = require('./group');
const User = require('./user');
const Address = require('./address');
const Room = require('./room');
const RoomMember = require('./roomMember');
const Court = require('./court');
const Reservation = require('./reservation');

// Configuração das associações
User.belongsToMany(Group, {
  through: MemberGroup,
  foreignKey: 'id_usuario',
  otherKey: 'id_grupo',
});
User.associate({ Room, Group, RoomMember, Address, Court });

// Associações do modelo Group
Group.belongsToMany(User, {
  through: MemberGroup,
  foreignKey: 'id_grupo',
  otherKey: 'id_usuario',
});
Group.associate({ User, Room, MemberGroup });

// Associações do modelo Room
Room.belongsToMany(User, {
  through: RoomMember,
  foreignKey: 'id_sala',
  otherKey: 'id_usuario',
  as: 'membros',
});
Room.hasMany(RoomMember, {
  foreignKey: 'id_sala',
  as: 'membrosDetalhes', // Novo alias para evitar conflitos
});
Room.associate({ User, Group, RoomMember, Reservation });

RoomMember.associate({ User, Room });

// Associações do modelo Court
Court.associate({ User, Address });

// Associações do modelo Address
Address.associate({ User, Court });

// Associações do modelo Reservation
Reservation.associate({ Room, Court });

// Exportação dos modelos
module.exports = {
  User,
  Group,
  Address,
  Room,
  RoomMember,
  Court,
  Reservation,
  MemberGroup,
};
