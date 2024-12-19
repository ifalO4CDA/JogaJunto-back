const MemberGroup = require('../models/groupMember');
const Group = require('./group');
const User = require('./user');
const Address = require('./address');
const Room = require('./room');
const RoomMember = require('./roomMember');

User.belongsToMany(Group, {
  through: MemberGroup,
  foreignKey: 'id_usuario',
  otherKey: 'id_grupo',
});

Group.belongsToMany(User, {
  through: MemberGroup,
  foreignKey: 'id_grupo',
  otherKey: 'id_usuario',
});

// Configuração das associações
User.associate({ Room, Group, RoomMember, Address });
Room.associate({ User, Group, RoomMember });
Group.associate({ User, Room, MemberGroup });
RoomMember.associate({ User, Room });

module.exports = {
  Room,
  User,
  Group,
  Address,
  RoomMember 
}