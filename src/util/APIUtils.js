/* eslint-disable prefer-template */
import { API_BASE_URL, ENQUETE_TAMANHO_LISTA, TOKEN_ACESSO } from '../constantes';

/**
 * Todas as chamadas de API Rest são escritas neste script.
 * Ele usa a API fetch para fazer solicitações ao servidor de back-end.
 */

const requisicao = (opcoes) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  if (localStorage.getItem(TOKEN_ACESSO)) {
    headers.append('autorizacao', `Portador ${localStorage.getItem(TOKEN_ACESSO)}`);
  }

  const padroes = { headers };
  // eslint-disable-next-line no-param-reassign
  opcoes = { ...padroes, ...opcoes };

  return fetch(opcoes.url, opcoes)
    .then((resposta) => resposta.json().then((json) => {
      if (!resposta.ok) {
        return Promise.reject(json);
      }
      return json;
    }));
};

export function getTodasEnquetes(pagina, tamanho) {
  // eslint-disable-next-line no-param-reassign
  pagina = pagina || 0;
  // eslint-disable-next-line no-param-reassign
  tamanho = tamanho || ENQUETE_TAMANHO_LISTA;

  return requisicao({
    url: API_BASE_URL + '/enquetes?pagina=' + pagina + '&tamanho=' + tamanho,
    method: 'GET',
  });
}

export function criarEnquete(dadosEnquete) {
  return requisicao({
    url: API_BASE_URL + '/enquetes',
    method: 'POST',
    body: JSON.stringify(dadosEnquete),
  });
}

export function votar(dadosVoto) {
  return requisicao({
    url: API_BASE_URL + '/enquetes/' + dadosVoto.enqueteId + '/votos',
    method: 'POST',
    body: JSON.stringify(dadosVoto),
  });
}

export function logar(loginRequest) {
  return requisicao({
    url: API_BASE_URL + '/auten/acessar',
    method: 'POST',
    body: JSON.stringify(loginRequest),
  });
}

export function inscrever(cadastroRequest) {
  return requisicao({
    url: API_BASE_URL + '/auten/inscrever',
    method: 'POST',
    body: JSON.stringify(cadastroRequest),
  });
}

export function checarNomeUsuarioDisponivel(nomeUsuario) {
  return requisicao({
    url: API_BASE_URL + '/usuario/checarNomeUsuarioDisponivel?nomeUsuario=' + nomeUsuario,
    method: 'GET',
  });
}

export function checarEmailDisponivel(email) {
  return requisicao({
    url: API_BASE_URL + '/usuario/checarEmailDisponivel?email=' + email,
    method: 'GET',
  });
}

export function getUsuarioAtual() {
  if (!localStorage.getItem(TOKEN_ACESSO)) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('No access token set.');
  }
  return requisicao({
    url: API_BASE_URL + '/usuario/eu',
    method: 'GET',
  });
}

export function getPerfilUsuario(nomeUsuario) {
  return requisicao({
    url: API_BASE_URL + '/usuarios/' + nomeUsuario,
    method: 'GET',
  });
}

export function getEnquetesCriadasUsuario(nomeUsuario, pagina, tamanho) {
  // eslint-disable-next-line no-param-reassign
  pagina = pagina || 0;
  // eslint-disable-next-line no-param-reassign
  tamanho = tamanho || ENQUETE_TAMANHO_LISTA;

  return requisicao({
    url: API_BASE_URL + '/usuarios/' + nomeUsuario + '/enquetes?pagina=' + pagina + '&tamanho=' + tamanho,
    method: 'GET',
  });
}

export function getEnquetesVotadasUsuario(nomeUsuario, pagina, tamanho) {
  // eslint-disable-next-line no-param-reassign
  pagina = pagina || 0;
  // eslint-disable-next-line no-param-reassign
  tamanho = tamanho || ENQUETE_TAMANHO_LISTA;

  return requisicao({
    url: API_BASE_URL + '/usuarios/' + nomeUsuario + '/votos?pagina=' + pagina + '&tamanho=' + tamanho,
    method: 'GET',
  });
}
