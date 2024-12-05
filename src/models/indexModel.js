const Group = require('./group');
const User = require('./user');

User.belongsToMany(Group, {
    through: 'membros_grupos' // Usando o nome da tabela intermediária diretamente
    // foreignKey: 'id_usuario',
    // otherKey: 'id_grupo',
});

Group.belongsToMany(User, {
    through: 'membros_grupos' // Usando o nome da tabela intermediária diretamente
    // foreignKey: 'id_grupo',
    // otherKey: 'id_usuario',
});

module.exports = {
    User,
    Group
}