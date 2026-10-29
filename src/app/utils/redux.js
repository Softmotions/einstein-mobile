'use strict';

/**
 * Minimal replacement for redux-actions `handleActions`.
 *
 * @param {Object<string, Function>} handlers map of action type to reducer
 * @param {*} initialState state used when the reducer is called without a state
 * @return {Function} redux reducer
 */
const handleActions = (handlers, initialState) => (state = initialState, action) => {
  const handler = action && handlers[action.type];
  return handler ? handler(state, action) : state;
};

export {
  handleActions,
};
