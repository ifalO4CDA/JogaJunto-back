const { body, param } = require('express-validator');
const Group = require('../../models/group');
const User = require('../../models/user');

const existsGroup = async (id_grupo) => {
    const group = await Group.findByPk(id_grupo);
    if (!group) {
        throw new Error('Grupo não encontrado.');
    }
    return true;
};

const existsUser = async (id_usuario) => {
    const user = await User.findByPk(id_usuario);
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
    return true;
};

exports.createGroupValidation = [
    body('nome')
        .notEmpty().withMessage('O nome do grupo é obrigatório.')
        .isString().withMessage('O nome do grupo deve ser uma string.')
        .isLength({ max: 100 }).withMessage('O nome do grupo não pode ter mais de 100 caracteres.'),

    body('id_criador')
        .notEmpty().withMessage('O ID do criador é obrigatório.')
        .isInt().withMessage('O ID do criador deve ser um número inteiro.')
        .custom(existsUser),

    body('descricao')
        .optional()
        .isString().withMessage('A descrição deve ser uma string.')
        .isLength({ max: 255 }).withMessage('A descrição não pode ter mais de 255 caracteres.')
];

exports.updateGroupValidation = [
    param('id_grupo')
        .notEmpty().withMessage('O ID do grupo é obrigatório.')
        .isInt().withMessage('O ID do grupo deve ser um número inteiro.')
        .custom(existsGroup),

    body('nome')
        .optional()
        .isString().withMessage('O nome do grupo deve ser uma string.')
        .isLength({ max: 100 }).withMessage('O nome do grupo não pode ter mais de 100 caracteres.'),

    body('descricao')
        .optional()
        .isString().withMessage('A descrição deve ser uma string.')
        .isLength({ max: 255 }).withMessage('A descrição não pode ter mais de 255 caracteres.')
];

exports.removeGroupValidation = [
    param('id_grupo')
        .notEmpty().withMessage('O ID do grupo é obrigatório.')
        .isInt().withMessage('O ID do grupo deve ser um número inteiro.')
        .custom(async (id_grupo, { req }) => {
            const group = await Group.findByPk(id_grupo);
            if (!group) {
                throw new Error('Grupo não encontrado.');
            }
            if (group.id_criador !== req.body.id_usuario) {
                throw new Error('Apenas o criador do grupo pode excluí-lo.');
            }
            return true;
        }),
];

exports.listUserGroupsValidation = [
    param('id_usuario')
        .notEmpty().withMessage('O ID do usuário é obrigatório.')
        .isInt().withMessage('O ID do usuário deve ser um número inteiro.')
        .custom(existsUser),
];

exports.addRemoveGroupMemberValidation = [
    param('id_grupo')
        .notEmpty().withMessage('O ID do grupo é obrigatório.')
        .isInt().withMessage('O ID do grupo deve ser um número inteiro.')
        .custom(existsGroup),

    body('id_usuario')
        .notEmpty().withMessage('O ID do usuário é obrigatório.')
        .isInt().withMessage('O ID do usuário deve ser um número inteiro.')
        .custom(existsUser),

    body('acao')
        .notEmpty().withMessage('A ação é obrigatória.')
        .isString().withMessage('A ação deve ser uma string.')
        .isIn(['adicionar', 'remover']).withMessage('A ação deve ser "adicionar" ou "remover".'),
];
