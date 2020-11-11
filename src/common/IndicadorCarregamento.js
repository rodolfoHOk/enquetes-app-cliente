import React from 'react';
import { Spin, Icon } from 'antd';

/**
 * É usado por outros componentes para renderizar um indicador de carregamento enquanto uma
 * chamada de API está em andamento.
 */
// eslint-disable-next-line no-unused-vars
export default function IndicadorCarregamento(props) {
  const antIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;
  return (
    <Spin indicator={antIcon} style={{ display: 'block', textAlign: 'center', marginTop: 30 }} />
  );
}
