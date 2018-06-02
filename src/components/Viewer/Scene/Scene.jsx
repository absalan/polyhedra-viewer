// @flow
import React, { Fragment } from 'react';
import X3dScene from './X3dScene';
import X3dPolyhedron from './X3dPolyhedron';
import OptionOverlay from './OptionOverlay';

interface Props {
  solid: string;
  panel: string;
}

export default function Scene({ solid, panel }: Props) {
  return (
    <Fragment>
      <X3dScene>
        <X3dPolyhedron />
      </X3dScene>
      <OptionOverlay solid={solid} panel={panel} />
    </Fragment>
  );
}