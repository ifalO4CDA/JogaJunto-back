const Address = require('./Address');
const AddressEntity = require('./AddressEntity');

// Configurar os relacionamentos
Address.hasMany(AddressEntity, {
  foreignKey: 'id_endereco',
  as: 'entidades',
});

AddressEntity.belongsTo(Address, {
  foreignKey: 'id_endereco',
  as: 'endereco',
});

module.exports = { Address, AddressEntity };
