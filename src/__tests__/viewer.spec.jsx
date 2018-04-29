import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import Polyhedron from 'math/Polyhedron';
import AppPage from 'pages/AppPage';

describe('viewer', () => {
  let appPage;

  function setup(path = '/tetrahedron') {
    appPage = new AppPage(path);
  }

  beforeEach(() => {
    setup('/tetrahedron');
  });

  it('works', () => {
    setup();
  });

  it('does not applyOperation on invalid apply args', () => {
    setup('/augmented-truncated-tetrahedron/related');
    appPage.clickButtonWithText('diminish').clickFaceWithNumSides(6);
  });

  it('unsets the mode and apply args when going to a different polyhedron', () => {
    setup('/triangular-cupola/related');
    appPage
      .clickButtonWithText('augment')
      .clickButtonWithText('elongate')
      .expectNoButtonWithText('ortho');
  });

  it('can augment and diminish a tetrahedron', () => {
    setup('/tetrahedron/related');

    appPage
      .clickButtonWithText('augment')
      .clickFaceIndex(0)
      .expectTransitionTo('triangular-bipyramid')
      .clickButtonWithText('diminish')
      .clickFaceIndex(0)
      .expectTransitionTo('tetrahedron');
  });

  it('can transition through a pyramid series', () => {
    setup('/square-pyramid/related');

    appPage
      .clickButtonWithText('augment')
      .clickFaceWithNumSides(4)
      .expectTransitionTo('octahedron')
      .clickButtonWithText('diminish')
      .clickFaceWithNumSides(3)
      .expectTransitionTo('square-pyramid')
      .clickButtonWithText('elongate')
      .expectTransitionTo('elongated-square-pyramid')
      .clickButtonWithText('augment');
  });

  it('can triaugment a triangular prism', () => {
    setup('/triangular-prism/related');
    appPage
      // test gyrobifastigium
      .clickButtonWithText('augment')
      .clickButtonWithText('fastigium')
      .clickFaceWithNumSides(4)
      .expectTransitionTo('gyrobifastigium')
      .clickButtonWithText('diminish')
      .clickFaceWithNumSides(4)
      .expectTransitionTo('triangular-prism')
      // augmented with pyramids
      .clickButtonWithText('augment')
      .clickButtonWithText('pyramid')
      .clickFaceWithNumSides(4)
      .expectTransitionTo('augmented-triangular-prism')
      .clickFaceWithNumSides(4)
      .expectTransitionTo('biaugmented-triangular-prism')
      .clickFaceWithNumSides(4)
      .expectTransitionTo('triaugmented-triangular-prism');
  });

  it('can go through a simple rhombicosadodecahedron workflow', () => {
    setup('/tridiminished-rhombicosidodecahedron/related');
    appPage
      .clickButtonWithText('augment')
      .clickFaceWithNumSides(10)
      .expectTransitionTo('gyrate-bidiminished-rhombicosidodecahedron')
      .clickFaceWithNumSides(10)
      .expectTransitionTo('bigyrate-diminished-rhombicosidodecahedron')
      .clickFaceWithNumSides(10)
      .expectTransitionTo('trigyrate-rhombicosidodecahedron');
  });

  it('can go through a truncation and rectification workflow', () => {
    setup('/tetrahedron/related');
    appPage
      .clickButtonWithText('truncate')
      .expectTransitionTo('truncated-tetrahedron')
      .clickButtonWithText('cumulate')
      .expectTransitionTo('tetrahedron')
      .clickButtonWithText('rectify')
      .expectTransitionTo('octahedron')
      .clickButtonWithText('rectify')
      .expectTransitionTo('cuboctahedron')
      .clickButtonWithText('cumulate')
      .clickFaceWithNumSides(3)
      .expectTransitionTo('cube')
      .clickButtonWithText('truncate')
      .expectTransitionTo('truncated-cube')
      .clickButtonWithText('augment')
      .clickFaceWithNumSides(8)
      .expectTransitionTo('augmented-truncated-cube');
  });

  it('can go through an expansion workflow', () => {
    setup('/dodecahedron/related');
    // FIXME test contract/snub/twist
    appPage
      .clickButtonWithText('expand')
      .expectTransitionTo('rhombicosidodecahedron')
      .clickButtonWithText('diminish')
      .clickFaceIndex(0)
      .expectTransitionTo('diminished-rhombicosidodecahedron');
  });
});
