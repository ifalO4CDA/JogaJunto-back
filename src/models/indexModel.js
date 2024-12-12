const Group = require('./group');
const User = require('./user');
const Address = require('./address');

User.belongsToMany(Group, {through: 'membros_grupos'});

Group.belongsToMany(User, {through: 'membros_grupos'});

User.associate({ Address });
Address.associate({ User });

module.exports = {
    User,
    Group,
    Address,
}