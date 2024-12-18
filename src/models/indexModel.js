const MemberGroup = require('../models/groupMember');
const Group = require('./group');
const User = require('./user');
const Address = require('./address');


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

User.associate({ Address });
Address.associate({ User });


module.exports = {
  User,
  Group,
  Address,
}