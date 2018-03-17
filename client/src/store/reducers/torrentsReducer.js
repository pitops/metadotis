const initialState = {
  torrents: []
};

const torrentsReducer = (state = initialState, action) => {
  console.log(state, action);
  return state;
};

export default torrentsReducer;
