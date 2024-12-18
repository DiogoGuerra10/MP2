import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchOddsData } from '../api/OddsApi'; // Importa a função da api

// Thunk assíncrono para ir buscar as odds da api
export const fetchOdds = createAsyncThunk(
  'odds/fetchOdds',
  async (_, thunkAPI) => {
    try {
      const data = await fetchOddsData();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const oddsSlice = createSlice({
  name: 'odds',
  initialState: {
    data: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOdds.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOdds.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload; // Atualiza os dados com a resposta da api
      })
      .addCase(fetchOdds.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default oddsSlice.reducer;
