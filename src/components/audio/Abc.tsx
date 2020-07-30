import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box } from '@material-ui/core';

import abcjs from 'abcjs';

export interface AbcProps {
  src?: string;
  params?: any;
}

const Abc: FunctionComponent<AbcProps> = ({
  src,
  params = { responsive: 'resize' },
}) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(`abc-result-${Date.now() + Math.random()}`);
  }, []);

  useEffect(() => {
    if (!id || !src) {
      return;
    }

    abcjs.renderAbc(id, src, params);
  }, [id, params, src]);

  return id ? <Box id={id} width={1} /> : null;
};

export default Abc;
