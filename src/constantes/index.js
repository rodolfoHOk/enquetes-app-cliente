/**
 * Definição de todas as constantes globais no arquivo src / constants / index.js para
 * uso de outros componentes
 */

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
export const TOKEN_ACESSO = 'tokenAcesso';

export const ENQUETE_TAMANHO_LISTA = 30;
export const OPCAO_NUM_MAX = 6;
export const ENQUETE_TAMANHO_MAX_PERGUNTA = 140;
export const ENQUETE_TAMANHO_MAX_OPCAO = 40;

export const TAMANHO_MIN_NOME = 4;
export const TAMANHO_MAX_NOME = 40;

export const TAMANHO_MIN_NOME_USUARIO = 3;
export const TAMANHO_MAX_NOME_USUARIO = 15;

export const TAMANHO_MAX_EMAIL = 40;

export const TAMANHO_MIN_SENHA = 6;
export const TAMANHO_MAX_SENHA = 20;
