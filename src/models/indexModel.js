const Group = require('./group');
const User = require('./user');

User.belongsToMany(Group, {through: 'membros_grupos'});

Group.belongsToMany(User, {through: 'membros_grupos'});

module.exports = {
    User,
    Group
}