import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {SIZES, COLORS, FONTS, icons} from '../constants';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {getCoasts} from '../stores/coast/coastActions';
import {getMeasures} from '../stores/measure/measureActions';
import {getMeters} from '../stores/meter/meterActions';
import moment from 'moment';
import {BarChart} from 'react-native-chart-kit';
import showToast from '../functions/Toast';
import {RenderLineChart} from '../components/LineChart';
import {RenderSubHeader} from '../components/HeaderBar';
const RenderBarChart = ({height, width, labels, data, color, vRotation}) => {
  return (
    <BarChart
      height={height}
      width={width}
      data={{
        labels: labels,
        datasets: [
          {
            data: data,
          },
        ],
      }}
      chartConfig={{
        decimalPlaces: 1, // optional, defaults to 2dp
        color: () => color,
        labelColor: () => COLORS.white,
      }}
      showBarTops={true}
      verticalLabelRotation={vRotation}
      horizontalLabelRotation={0}
      withVerticalLines={false}
      withInnerLines={false}
      showValuesOnTopOfBars={true}
    />
  );
};

const RenderBarChartHeader = ({title}) => {
  return (
    <Text
      style={{
        color: COLORS.white,
        marginVertical: SIZES.radius,
        paddingLeft: SIZES.padding,
        textTransform: 'capitalize',
        ...FONTS.h3,
      }}>
      {title}
    </Text>
  );
};

function renderHeader(energySum, coastSum) {
  return (
    <View
      style={{
        paddingHorizontal: SIZES.padding,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: COLORS.gray,
      }}>
      <Text style={{marginTop: 50, color: COLORS.white, ...FONTS.largeTitle}}>
        Your Report
      </Text>
      <RenderSubHeader
        title="overall consumed  energy "
        icon={icons.energy}
        value={energySum}
        unity="kWh"
        containerStyle={{marginBottom: SIZES.radius}}
      />
      <RenderSubHeader
        title="estimated energy coasts"
        icon={icons.money}
        value={coastSum}
        unity="TD"
        containerStyle={{marginBottom: SIZES.radius}}
      />
    </View>
  );
}

const Report = ({
  getMeasures,
  getCoasts,
  getMeters,
  measures,
  coasts,
  meters,
}) => {
  useFocusEffect(
    React.useCallback(() => {
      getMeasures();
      getCoasts();
      getMeters();
    }, []),
  );
  // GETTING OVERALL VALUES FOR HEADER DISPLAY
  let measureValues =
    typeof measures[0] != 'undefined'
      ? measures.map(i => i.real_value)
      : [0, 0, 0];
  let energySum =
    typeof measures[0] != 'undefined'
      ? measureValues.reduce((partialSum, a) => partialSum + a, 0)
      : 0;
  let coastValues =
    typeof coasts[0] != 'undefined' ? coasts.map(i => i.value) : [0, 0, 0];
  let coastSum =
    typeof coasts[0] != 'undefined'
      ? coastValues.reduce((partialSum, a) => partialSum + a, 0)
      : 0;

  // VARIABLES
  let cont_dates = ['none', 'none', 'none', 'none', 'none'];
  let cont_counts = [0, 0, 0, 0, 0];
  let monthly_coasts = [0, 0, 0, 0, 0];
  let energy_per_months = [0, 0, 0, 0, 0];
  let months = ['none', 'none', 'none', 'none', 'none'];
  var energy_per_days = [0, 0, 0, 0, 0];
  var days = ['none', 'none', 'none', 'none', 'none'];
  var energy_per_days_week = [0, 0, 0, 0, 0];
  var week_days = ['none', 'none', 'none', 'none', 'none'];
  var energy_per_hours_day = [0, 0, 0, 0, 0];
  var day_hours = ['none', 'none', 'none', 'none', 'none'];

  if (typeof measures[0] != 'undefined' && typeof coasts != 'undefined') {
    // GETTING ENERGY VALUES PER MONTHS FOR CHART
    for (let i = 0; i <= 11; i++) {
      let measures_months = measures.map((item, index) => {
        let date = moment(item.createdAt).format('MM');
        if (moment(date).isSame(moment().month(i).format('MM'))) {
          return item.real_value;
        } else {
          return 0;
        }
      });
      energy_per_months[i] = measures_months.reduce(
        (partialSum, a) => partialSum + a,
        0,
      );
      months[i] = moment().month(i).format('MMMM');
    }

    // GETTING ENERGY VALUES PER DAYS OF CURRENT MONTH

    for (let i = 0; i < moment().daysInMonth(); i++) {
      let measures_month = measures.map((item, index) => {
        let date = moment(item.createdAt).format('DD-MM-YY');
        let compare_date = moment()
          .startOf('month')
          .add(i, 'days')
          .format('DD-MM-YY');
        if (moment(date).isSame(compare_date)) {
          return item.real_value;
        } else {
          return 0;
        }
      });

      energy_per_days[i] = measures_month.reduce(
        (partialSum, a) => partialSum + a,
        0,
      );
      days[i] = moment().startOf('month').add(i, 'days').format('DD-MM');
    }

    // GETTING ENERGY VALUES PER WEEK DAYS

    for (let i = 0; i < 7; i++) {
      let measures_week = measures.map((item, index) => {
        let date = moment(item.createdAt).format('DD-MM');
        let compare_date = moment().weekday(i).format('DD-MM');
        if (moment(date).isSame(compare_date)) {
          return item.real_value;
        } else {
          return 0;
        }
      });

      energy_per_days_week[i] = measures_week.reduce(
        (partialSum, a) => partialSum + a,
        0,
      );
      week_days[i] = moment().weekday(i).format('dddd');
    }

    // GETTING ENRGY VALUES PER HOURS OF DAY

    for (let i = 0; i < 24; i++) {
      let measures_day = measures.map((item, index) => {
        let date = moment(item.createdAt).format('YYYY-MM-DD HH');
        let compare_date = moment().hours(i).format('YYYY-MM-DD HH');
        if (moment(date).isSame(compare_date)) {
          return item.real_value;
        } else {
          return 0;
        }
      });

      energy_per_hours_day[i] = measures_day.reduce(
        (partialSum, a) => partialSum + a,
        0,
      );
      day_hours[i] = moment().hours(i).format('h:a');
    }

    // GET METERS MEASURES PER DAY COUNT
    let dates = measures.map((item, index) => {
      return moment(item.createdAt).format('DD-MM-YYYY');
    });
    const counts = {};
    dates.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });
    cont_dates = Object.keys(counts);
    cont_counts = Object.values(counts);

    // Energy Coasts Evolution
    for (let i = 0; i < 12; i++) {
      let coast_per_month = coasts.map((item, index) => {
        let date = moment(item.createdAt).format('MM');
        let comp = moment().month(i).format('MM');
        if (moment(comp).isSame(date)) {
          return item.value;
        } else {
          return 0;
        }
      });
      monthly_coasts[i] = coast_per_month.reduce(
        (partialSum, a) => partialSum + a,
        0,
      );
    }
  } else {
    showToast('unable to connect to server');
  }

  return (
    <View style={{flex: 1, backgroundColor: COLORS.black}}>
      {/** render header section  */}
      {renderHeader(energySum, coastSum.toFixed(2))}
      <ScrollView
        style={{paddingVertical: SIZES.font}}
        showsVerticalScrollIndicator={false}>
        <RenderBarChartHeader
          title={'Energy Consumed per months of ' + moment().format('YYYY')}
        />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: SIZES.padding, paddingHorizontal: SIZES.padding}}>
          <RenderBarChart
            height={250}
            width={1200}
            labels={months}
            data={energy_per_months}
            color={COLORS.lightGreen}
            vRotation={15}
          />
        </ScrollView>
        <RenderBarChartHeader
          title={'energy consumed per days of ' + moment().format('MMMM')}
        />
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{marginTop: SIZES.padding, paddingHorizontal: SIZES.padding}}>
          <RenderBarChart
            height={250}
            width={1800}
            labels={days}
            data={energy_per_days}
            color={COLORS.lightBlue}
            vRotation={15}
          />
        </ScrollView>
        <RenderBarChartHeader title="energy consumed per days of current week" />
        <ScrollView
          horizontal={true}
          style={{marginTop: SIZES.padding, paddingHorizontal: SIZES.padding}}
          showsHorizontalScrollIndicator={false}>
          <RenderBarChart
            height={250}
            width={520}
            labels={week_days}
            data={energy_per_days_week}
            color={COLORS.lightRed}
            vRotation={0}
          />
        </ScrollView>
        <RenderBarChartHeader
          title={
            'energy consumed per hours of ' + moment().format('MMMM, dddd YYYY')
          }
        />
        <ScrollView
          horizontal={true}
          style={{marginTop: SIZES.padding, paddingHorizontal: SIZES.padding}}
          showsHorizontalScrollIndicator={false}>
          <RenderBarChart
            height={250}
            width={2100}
            labels={day_hours}
            data={energy_per_hours_day}
            color={COLORS.lightGreen2}
            vRotation={0}
          />
        </ScrollView>
        <RenderBarChartHeader
          title={
            typeof measures[0] != 'undefined'
              ? 'Number of measures since ' +
                moment(measures[0].createdAt).format('MMMM Do YYYY')
              : 0
          }
        />
        <ScrollView
          horizontal={true}
          style={{marginTop: SIZES.padding, paddingHorizontal: SIZES.padding}}
          showsHorizontalScrollIndicator={false}>
          {
            <RenderLineChart
              data={cont_counts}
              labels={cont_dates}
              color={COLORS.lightBlue}
              width={
                cont_dates.length > 5
                  ? cont_dates.length * 100
                  : SIZES.width + 50
              }
              height={250}
            />
          }
        </ScrollView>
        <RenderBarChartHeader title={'Energy Costs of current Year'} />
        <ScrollView
          horizontal={true}
          style={{marginTop: SIZES.padding, paddingHorizontal: SIZES.padding}}
          showsHorizontalScrollIndicator={false}>
          {
            <RenderLineChart
              data={monthly_coasts}
              labels={months}
              color={COLORS.lightRed}
              width={850}
              height={250}
            />
          }
        </ScrollView>
      </ScrollView>
    </View>
  );
};
function mapStateToProps(state) {
  return {
    measures: state.measureReducer.myMeasures,
    coasts: state.coastReducer.myCoasts,
    meters: state.meterReducer.myMeters,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMeasures: () => {
      return dispatch(getMeasures());
    },
    getCoasts: () => {
      return dispatch(getCoasts());
    },
    getMeters: () => {
      return dispatch(getMeters());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Report);
