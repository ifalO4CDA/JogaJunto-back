const jwt = require('jsonwebtoken');
const createResponse = require('../helpers/responseHelper');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']; // Verifica o cabeçalho Authorization

    if (!token) {
        return res.status(401).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao realizar a consulta!',
                errors: [{
                    msg: 'Token não fornecido.'
                }],
            })
        );
    }

    try {
        // Remove o prefixo 'Bearer ' caso esteja presente
        const cleanToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        // Verifica e decodifica o token
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || 'seu-segredo-jwt');
        req.user = decoded; // Armazena os dados decodificados no objeto `req.user`
        next(); // Continua para o próximo middleware/controlador
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json(
                createResponse({
                    status: 'Erro',
                    message: 'Erro ao realizar a consulta!',
                    errors: [{
                        msg: 'Token expirado.'
                    }],
                })
            );
        }

    
        return res.status(401).json(
            createResponse({
                status: 'Erro',
                message: 'Erro ao realizar a consulta!',
                errors: [{
                    msg: 'Token invalido.'
                }],
            })
        );
    }
};

module.exports = authenticate;
