import React, { FunctionComponent, useEffect, useState } from 'react';

import { Box } from '@material-ui/core';

import ABCJS from 'abcjs';

export interface AbcProps {
  src?: string;
  params?: any;
  onRender?(output: any): void;
}

const Abc: FunctionComponent<AbcProps> = ({
  src,
  params = { responsive: 'resize' },
  onRender,
}) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(`abc-result-${Date.now() + Math.random()}`);
  }, []);

  useEffect(() => {
    if (!id || !src) {
      return;
    }

    onRender?.(ABCJS.renderAbc(id, src, params));
  }, [id, onRender, params, src]);

  return id ? <Box id={id} width={1} /> : null;
};

export default Abc;
