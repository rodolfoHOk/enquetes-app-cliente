/**
 * Este utilitário é usado para obter uma cor aleatória para usar no avatar do usuário.
 */

const cores = [
  '#F44336', '#e91e63', '#9c27b0', '#673ab7',
  '#ff9800', '#ff5722', '#795548', '#607d8b',
  '#3f51b5', '#2196F3', '#00bcd4', '#009688',
  '#2196F3', '#32c787', '#00BCD4', '#ff5652',
  '#ffc107', '#ff85af', '#FF9800', '#39bbb0',
  '#4CAF50', '#ffeb3b', '#ffc107',
];

export default function getCorAvatar(nome) {
  const pedacoNome = nome.substr(0, 6);
  let hash = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < pedacoNome.length; i++) {
    hash = 31 * hash + pedacoNome.charCodeAt(i);
    // eslint-disable-next-line prefer-template
  }
  const index = Math.abs(hash % cores.length);
  // eslint-disable-next-line prefer-template
  return cores[index];
}
