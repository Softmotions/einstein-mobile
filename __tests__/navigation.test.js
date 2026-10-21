'use strict';

import navigationReducer from '../src/app/reducers/navigation';
import {
  navBack,
  navGame,
  navHelp,
  navSettings,
  navStats,
  navToIndex,
} from '../src/app/actions/navigation';

const keys = state => state.routes.map(route => route.key);

describe('navigation reducer', () => {
  const initial = navigationReducer(undefined, {type: '@@INIT'});

  it('starts on the welcome screen', () => {
    expect(keys(initial)).toEqual(['welcome']);
    expect(initial.index).toBe(0);
  });

  it('pushes new screens and jumps to existing ones', () => {
    let state = navigationReducer(initial, navGame());
    expect(keys(state)).toEqual(['welcome', 'game']);
    expect(state.index).toBe(1);

    state = navigationReducer(state, navHelp());
    expect(keys(state)).toEqual(['welcome', 'game', 'help']);
    expect(state.index).toBe(2);

    state = navigationReducer(state, navGame());
    expect(keys(state)).toEqual(['welcome', 'game', 'help']);
    expect(state.index).toBe(1);
  });

  it('pops screens and does not pop the root screen', () => {
    let state = navigationReducer(initial, navStats());
    state = navigationReducer(state, navSettings());

    state = navigationReducer(state, navBack());
    expect(keys(state)).toEqual(['welcome', 'statistics']);
    expect(state.index).toBe(1);

    state = navigationReducer(state, navBack());
    expect(keys(state)).toEqual(['welcome']);
    expect(state.index).toBe(0);

    state = navigationReducer(state, navBack());
    expect(keys(state)).toEqual(['welcome']);
    expect(state.index).toBe(0);
  });

  it('resets to the welcome screen', () => {
    let state = navigationReducer(initial, navGame());
    state = navigationReducer(state, navToIndex());

    expect(keys(state)).toEqual(['welcome']);
    expect(state.index).toBe(0);
  });
});
