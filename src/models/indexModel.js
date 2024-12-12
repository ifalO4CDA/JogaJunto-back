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
  
// User.associate({ Address });
// Address.associate({ User });

// // Associações para Room
// Room.associate = (models) => {
//     Room.belongsTo(models.User, {
//         foreignKey: 'id_usuario',
//         as: 'creator',
//     });

//     Room.belongsTo(models.Group, {
//         foreignKey: 'id_grupo',
//         as: 'group',
//     });
// };

// Room.belongsToMany(User, { through: RoomMember, foreignKey: 'id_room', as: 'members' });
// User.belongsToMany(Room, { through: RoomMember, foreignKey: 'id_user', as: 'rooms' });


module.exports = {
    User,
    Group,
    Address,
    Room,
    RoomMember
}