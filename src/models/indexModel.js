const MemberGroup = require('../models/groupMember');
const Group = require('./group');
const User = require('./user');
const Address = require('./address');
const Room = require('./room');
const RoomMember = require('./roomMember');
const Court = require('./court'); // Importação do modelo de quadras

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
User.associate({ Room, Group, RoomMember, Address, Court });
Room.associate({ User, Group, RoomMember });
Group.associate({ User, Room, MemberGroup });
RoomMember.associate({ User, Room });
Address.associate({ User, Court });
Court.associate({ User, Address }); // Associações do modelo Court

module.exports = {
  Room,
  User,
  Group,
  Address,
  RoomMember,
  Court,
};
