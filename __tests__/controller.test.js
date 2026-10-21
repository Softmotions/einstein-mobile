'use strict';

import {GameFactory} from '../src/app/modules/controller';

describe('GameFactory', () => {
  it('generates a complete solvable puzzle', () => {
    const game = GameFactory.generateGame(4);

    expect(game.size).toBe(4);
    expect(game.finished).toBe(true);
    expect(Object.keys(game.rules).length).toBeGreaterThan(0);

    game.start();
    expect(game.active).toBe(true);

    for (let row = 0; row < game.size; ++row) {
      for (let col = 0; col < game.size; ++col) {
        if (!game.isSet(row, col)) {
          game.set(row, col, game.field.value(row, col));
        }
        expect(game.isSet(row, col)).toBe(true);
      }
    }

    expect(game.hasHidden).toBe(false);
    expect(game.solved).toBe(true);
    expect(game.finished).toBe(true);
  });

  it('restores a saved game', () => {
    const game = GameFactory.generateGame(4);
    game.start();

    const saved = JSON.parse(JSON.stringify(GameFactory.saveGame(game)));
    const restored = GameFactory.loadGame(saved);

    expect(restored.size).toBe(game.size);
    expect(restored.hash).toBe(game.hash);
    expect(restored.rules.length).toBe(game.rules.length);
    expect(restored.mstime).toBeGreaterThanOrEqual(0);
  });
});
