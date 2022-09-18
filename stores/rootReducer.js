import {combineReducers} from 'redux';
import tabReducer from './tab/Tabreducer';
import meterReducer from './meter/meterReducer';
import measureReducer from './measure/measureReducer';
import coastReducer from './coast/coastReducer';
export default combineReducers({
  tabReducer,
  meterReducer,
  measureReducer,
  coastReducer,
});
