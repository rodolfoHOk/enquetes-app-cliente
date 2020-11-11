/**
 * Esta contém funções auxiliares para formatar datas.
 */

export function formatarData(dataString) {
  const data = new Date(dataString);

  const nomesMeses = [
    'Janeiro', 'Fevereiro', 'Março',
    'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro',
    'Novembro', 'Dezembro',
  ];

  const mesIndex = data.getMonth();
  const ano = data.getFullYear();

  return `${nomesMeses[mesIndex]} ${ano}`;
}

export function formatarDataHora(dataHoraString) {
  const data = new Date(dataHoraString);

  const nomesMeses = [
    'Jan', 'Fev', 'Mar', 'Abr',
    'Mai', 'Jun', 'Jul', 'Ago',
    'Set', 'Out', 'Nov', 'Dez',
  ];

  const mesIndex = data.getMonth();
  const ano = data.getFullYear();

  return `${data.getDate()} ${nomesMeses[mesIndex]} ${ano} - ${data.getHours()}:${data.getMinutes()}`;
}
