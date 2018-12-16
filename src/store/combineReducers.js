export default function combineReducers(reducers) {
    return (state = {}, action) => {
        return Object.keys(reducers).reduce((cum, curr) => {
            return {
                ...cum,
                [curr]: reducers[curr](state[curr], action) || undefined
            };
          }, {});
    }
}