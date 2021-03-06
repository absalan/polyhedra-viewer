// @flow strict
import _ from 'lodash';

import { flatMap } from 'utils';
import { removeExtraneousVertices } from '../operationUtils';
import { Cap } from 'math/polyhedra';
import type { Operation } from '../operationTypes';
import { hasMultiple, getCapAlignment, getCupolaGyrate } from './cutPasteUtils';

function removeCap(polyhedron, cap) {
  return removeExtraneousVertices(
    polyhedron.withChanges(solid =>
      solid.withoutFaces(cap.faces()).addFaces([cap.boundary().vertices]),
    ),
  );
}

interface DiminishOptions {
  cap: Cap;
}

export const diminish: Operation<DiminishOptions> = {
  apply(polyhedron, { cap }) {
    return removeCap(polyhedron, cap);
  },

  getSearchOptions(polyhedron, config, relations) {
    const options = {};
    const { cap } = config;
    if (!cap) {
      throw new Error('Invalid cap');
    }
    const vertices = cap.innerVertices();
    // If diminishing a pentagonal cupola/rotunda, check which one it is
    if (vertices.length === 5) {
      options.using = 'U5';
    } else if (vertices.length === 10) {
      options.using = 'R5';
    }

    if (hasMultiple(relations, 'gyrate')) {
      options.gyrate = getCupolaGyrate(polyhedron, cap);
    }

    if (options.gyrate !== 'ortho' && hasMultiple(relations, 'align')) {
      options.align = getCapAlignment(polyhedron, cap);
    }
    return options;
  },

  getAllOptions(polyhedron) {
    return Cap.getAll(polyhedron).map(cap => ({ cap }));
  },

  getHitOption(polyhedron, hitPnt) {
    const cap = Cap.find(polyhedron, hitPnt);
    return cap ? { cap } : {};
  },

  getSelectState(polyhedron, { cap }) {
    const allCapFaces = flatMap(Cap.getAll(polyhedron), cap => cap.faces());
    return _.map(polyhedron.faces, face => {
      if (_.isObject(cap) && face.inSet(cap.faces())) return 'selected';
      if (face.inSet(allCapFaces)) return 'selectable';
    });
  },
};
