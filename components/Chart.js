import React from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import {SIZES, COLORS, FONTS} from '../constants';
import {LineChart} from 'react-native-wagmi-charts';
import IconTextButton from './IconTextButton';
import moment from 'moment';
const Chart = ({containerStyle, chartPrices, times, color, timeOptions}) => {
  // Points
  let data = chartPrices
    ? chartPrices?.map((item, index) => {
        return {
          timestamp: times[index],
          value: item,
        };
      })
    : [];
  const formatNumber = (value, roundingPoint) => {
    if (value > 1e9) {
      return `${(value / 1e9).toFixed(roundingPoint)}B`;
    } else if (value > 1e6) {
      return `${(value / 1e6).toFixed(roundingPoint)}M`;
    } else if (value > 1e3) {
      return `${(value / 1e3).toFixed(roundingPoint)}K`;
    } else {
      return value.toFixed(roundingPoint);
    }
  };
  const getYaxisLabelValues = () => {
    if (chartPrices != undefined) {
      let minValue = Math.min(...chartPrices);
      let maxValue = Math.max(...chartPrices);
      let midValue = (minValue + maxValue) / 2;
      let higherMidValue = (maxValue + midValue) / 2;
      let lowerMidValue = (minValue + midValue) / 2;
      let roundingPoint = 2;
      return [
        formatNumber(maxValue, roundingPoint),
        formatNumber(higherMidValue, roundingPoint),
        formatNumber(lowerMidValue, roundingPoint),
        formatNumber(minValue, roundingPoint),
      ];
    } else {
      return [];
    }
  };

  return (
    <View
      style={{
        marginTop: SIZES.padding,
        paddingVertical: SIZES.padding,
        ...containerStyle,
      }}>
      {/** Y axis */}
      <View
        style={{
          position: 'absolute',
          left: SIZES.padding,
          top: 0,
          bottom: 0,
          justifyContent: 'space-between',
        }}>
        {/** getYaxis Values */}
        {getYaxisLabelValues().map((item, index) => {
          return (
            <Text
              key={index}
              style={{color: COLORS.lightGray3, ...FONTS.body4}}>
              {item}
            </Text>
          );
        })}
      </View>
      <LineChart.Provider data={data}>
        <LineChart height={200}>
          <LineChart.Path color={color} width={2} />
          <LineChart.CursorCrosshair
            color={COLORS.lightRed}
            size={10}
            outerSize={50}>
            <LineChart.Tooltip />
            <LineChart.Tooltip position="bottom">
              <LineChart.DatetimeText
                style={{
                  color: COLORS.white,
                }}
                options={timeOptions}
              />
              <LineChart.PriceText
                style={{
                  color: COLORS.white,
                }}
              />
            </LineChart.Tooltip>
          </LineChart.CursorCrosshair>
        </LineChart>
      </LineChart.Provider>
    </View>
  );
};
export default Chart;
