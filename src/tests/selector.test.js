import createSelector from '../selectors';

describe('createSelector', () => {

    const state = {
        todos: [
            {
                name: 'tood 01'
            },
            {
                name: 'todo 02'
            },
            {
                name: 'todo 42',
                isSpecial: true
            }
        ]
    };

    it('should generate a single selector that apply all the filter functions', () => {

      const getSpecialTodosSelector = createSelector(
        state => state.todos,
        todos => todos.find(t => t.isSpecial)
      );

      const result = getSpecialTodosSelector(state);

      expect(result).toEqual({
          name: 'todo 42',
          isSpecial: true
      });

    });

    it('should memorize the state selection', () => {

      const getSpecialTodosSelector = createSelector(
        state => state.todos,
        todos => todos.find(t => t.isSpecial)
      );

      const result1 = getSpecialTodosSelector(state);
      const result2 = getSpecialTodosSelector(state);

      expect(result1).toEqual({
          name: 'todo 42',
          isSpecial: true
      });
      expect(result1).toBe(result2);
    });
});