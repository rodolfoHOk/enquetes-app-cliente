/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
import React from 'react';
import './Enquete.css';
import {
  Avatar, Icon, Radio, Button,
} from 'antd';
import { Link } from 'react-router-dom';
import getCorAvatar from '../util/Cores';
import { formatarDataHora } from '../util/Auxiliar';

const RadioGroup = Radio.Group;

/**
 * É usado pelo componente EnqueteLista para renderizar uma única votação.
 */
class Enquete extends React.Component {
  calcularPorcentagem = (opcao) => {
    // eslint-disable-next-line react/prop-types
    const { enquete } = this.props;
    // eslint-disable-next-line react/prop-types
    if (enquete.totalVotos === 0) {
      return 0;
    }
    // eslint-disable-next-line react/prop-types
    return (opcao.contagemVotos * 100) / (enquete.totalVotos);
  };

  isSelecionada = (opcao) => {
    // eslint-disable-next-line react/prop-types
    const { enquete } = this.props;
    // eslint-disable-next-line react/prop-types
    return enquete.opcaoSelecionada === opcao.id;
  }

  getOpcaoVencendo = () => {
    // eslint-disable-next-line react/prop-types
    const { enquete } = this.props;
    // eslint-disable-next-line react/prop-types
    enquete.opcoes.reduce((opcaoAnterior, opcaoAtual) => (
      // eslint-disable-next-line no-sequences
      (opcaoAtual.contagemVotos > opcaoAnterior.contagemVotos ? opcaoAtual : opcaoAnterior),
      { contagemVotos: -Infinity }));
  }

  getTempoRestante = (enquete) => {
    const tempoExpiracao = new Date(enquete.dataHoraExpiracao).getTime();
    const tempoAtual = new Date().getTime();

    const diferencaMs = tempoExpiracao - tempoAtual;
    const segundos = Math.floor((diferencaMs / 1000) % 60);
    const minutos = Math.floor((diferencaMs / 1000 / 60) % 60);
    const horas = Math.floor((diferencaMs / (1000 * 60 * 60)) % 24);
    const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

    let tempoRestante;

    if (dias > 0) {
      tempoRestante = dias + ' dias restantes';
    } else if (horas > 0) {
      tempoRestante = horas + ' horas restantes';
    } else if (minutos > 0) {
      tempoRestante = minutos + ' minutos restantes';
    } else if (segundos > 0) {
      tempoRestante = segundos + ' segundos restantes';
    } else {
      tempoRestante = 'menos que um segundo restante';
    }

    return tempoRestante;
  }

  render() {
    const opcoesEnquete = [];
    // eslint-disable-next-line react/prop-types
    const { enquete } = this.props;
    // eslint-disable-next-line react/prop-types
    if (enquete.opcaoSelecionada || enquete.expirada) {
      // eslint-disable-next-line react/prop-types
      const opcaoVencendo = enquete.expirada ? this.getOpcaoVencendo() : null;

      // eslint-disable-next-line react/prop-types
      enquete.opcoes.forEach((opcao) => {
        opcoesEnquete.push(<OpcaoEnqueteConcluidaOuVotada
          key={opcao.id}
          opcao={opcao}
          isVencedora={opcaoVencendo && opcao.id === opcaoVencendo.id}
          isSelecionada={this.isSelecionada(opcao)}
          porcentagemVotos={this.calcularPorcentagem(opcao)}
        />);
      });
    } else {
      // eslint-disable-next-line react/prop-types
      enquete.opcoes.forEach((opcao) => {
        opcoesEnquete.push(<Radio className="poll-choice-radio" key={opcao.id} value={opcao.id}>{opcao.texto}</Radio>);
      });
    }
    // eslint-disable-next-line react/prop-types
    const { handleChangeVoto, votoAtual, handleSubmeterVoto } = this.props;
    return (
      <div className="poll-content">
        <div className="poll-header">
          <div className="poll-creator-info">
            <Link className="creator-link" to={'/usuarios/' + enquete.criadoPor.nomeUsuario}>
              <Avatar
                className="poll-creator-avatar"
                style={{ backgroundColor: getCorAvatar(enquete.criadoPor.nome) }}
              >
                {enquete.criadoPor.nome[0].toUpperCase()}
              </Avatar>
              <span className="poll-creator-name">
                {enquete.criadoPor.nome}
              </span>
              <span className="poll-creator-username">
                @
                {enquete.criadoPor.nomeUsuario}
              </span>
              <span className="poll-creation-date">
                {formatarDataHora(enquete.dataHoraCriacao)}
              </span>
            </Link>
          </div>
          <div className="poll-question">
            {enquete.pergunta}
          </div>
        </div>
        <div className="poll-choices">
          <RadioGroup
            className="poll-choice-radio-group"
            onChange={handleChangeVoto}
            value={votoAtual}
          >
            { opcoesEnquete }
          </RadioGroup>
        </div>
        <div className="poll-footer">
          {
            !(enquete.opcaoSelecionada || enquete.expirada)
              ? (<Button className="vote-button" disabled={!votoAtual} onClick={handleSubmeterVoto}>Votar</Button>) : null
          }
          <span className="total-votes">
            {enquete.totalVotos}
            {' '}
            votos
          </span>
          <span className="separator">•</span>
          <span className="time-left">
            {
              enquete.expirada ? 'Resultado Final'
                : this.getTempoRestante(enquete)
            }
          </span>
        </div>
      </div>
    );
  }
}

function OpcaoEnqueteConcluidaOuVotada(props) {
  const {
    // eslint-disable-next-line react/prop-types
    porcentagemVotos,
    // eslint-disable-next-line react/prop-types
    opcao,
    // eslint-disable-next-line react/prop-types
    isSelecionada,
    // eslint-disable-next-line react/prop-types
    isVencedora,
  } = props;
  return (
    <div className="cv-poll-choice">
      <span className="cv-poll-choice-details">
        <span className="cv-choice-percentage">
          {Math.round(porcentagemVotos * 100) / 100}
          %
        </span>
        <span className="cv-choice-text">
          {opcao.texto}
        </span>
        {
          isSelecionada ? (
            <Icon
              className="selected-choice-icon"
              type="check-circle-o"
            />
          ) : null
        }
      </span>
      <span
        className={isVencedora ? 'cv-choice-percent-chart winner' : 'cv-choice-percent-chart'}
        style={{ width: porcentagemVotos + '%' }}
      />
    </div>
  );
}

export default Enquete;
