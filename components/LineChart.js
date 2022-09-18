import React from 'react';
import {LineChart, PieChart} from 'react-native-chart-kit';
import {View} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants';
export const RenderLineChart = ({data, labels, color, width, height}) => {
  return (
    <LineChart
      data={{
        labels: labels,
        datasets: [
          {
            data: data,
          },
        ],
      }}
      withDots={true}
      withInnerLines={false}
      withVerticalLines={false}
      withOuterLines={false}
      width={width}
      height={height}
      chartConfig={{
        color: () => color,
        labelColor: () => COLORS.white,
        decimalPlaces: 1,
      }}
      bezier
    />
  );
};

export const RenderPieChart = ({data, width, accessor}) => {
  return (
    <View style={{paddingBottom: SIZES.padding}}>
      <PieChart
        data={data}
        width={width}
        height={220}
        accessor={accessor}
        bgColor={'transparent'}
        chartConfig={{
          color: () => COLORS.black,
          labelColor: () => COLORS.white,
          propsForLabels: {...FONTS.h4},
        }}
        style={{...FONTS.h4}}
        paddingLeft={5}
        center={[10, 10]}
      />
    </View>
  );
};
export const RenderTwoLineCharts = ({
  data1,
  data2,
  labels,
  color1,
  color2,
  width,
  height,
}) => {
  return (
    <LineChart
      data={{
        labels: labels,
        datasets: [
          {
            data: data1,
            color: () => color1,
          },
          {
            data: data2,
            color: () => color2,
          },
        ],
      }}
      withDots={false}
      withInnerLines={false}
      withVerticalLines={false}
      withOuterLines={false}
      fromNumber={100}
      fromZero={false}
      width={width}
      height={height}
      chartConfig={{
        color: () => color1,
        labelColor: () => COLORS.white,
        decimalPlaces: 0,
        strokeWidth: 2,
      }}
      withShadow={false}
    />
  );
};
