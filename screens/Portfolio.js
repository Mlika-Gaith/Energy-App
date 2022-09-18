import React from 'react';
import {MainLayout} from './';
import {View, Text, ScrollView} from 'react-native';
import {COLORS, FONTS, SIZES, icons} from '../constants';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {getCoasts} from '../stores/coast/coastActions';
import {BalanceInfo, Chart, Stat} from '../components';
import moment from 'moment';
const Portfolio = ({getCoasts, myCoasts}) => {
  useFocusEffect(
    React.useCallback(() => {
      getCoasts();
    }, []),
  );
  let coastsValuesChart = [];
  let times = [];
  for (let i = 0; i < 12; i++) {
    let date = moment().month(i).format('MM');
    let measures = myCoasts.map((item, index) => {
      let date2 = moment(item.time, 'MM-YY').format('MM');
      if (moment(date).isSame(date2)) {
        return item.value;
      } else {
        return 0;
      }
    });
    coastsValuesChart[i] = measures.reduce(
      (partialSum, a) => partialSum + a,
      0,
    );
    times[i] = moment().month(i).format('YYYY-MM-DD');
  }

  let coastsValues =
    myCoasts.length != 0 ? myCoasts.map(i => i.value) : [0, 0, 0];
  let coastsSum =
    myCoasts.length != 0
      ? coastsValues.reduce((partialSum, a) => partialSum + a, 0)
      : 0;
  let time =
    myCoasts != 0 ? moment(myCoasts.slice(-1)[0].updatedAt).format('LLLL') : 0;
  let diff =
    myCoasts.length > 1
      ? coastsValues.slice(-2)[1] - coastsValues.slice(-2)[0]
      : coastsValues.slice(-2)[0];
  let prct = myCoasts.length > 1 ? (diff / coastsValues.slice(-2)[0]) * 100 : 0;
  // MONTH VALUES MANIP
  let thisMonthSum = 0;
  for (const element of myCoasts) {
    if (
      moment(element.updatedAt).isAfter(moment().startOf('month')) &&
      moment(element.updatedAt).isBefore(moment().endOf('month'))
    ) {
      thisMonthSum += element.value;
    }
  }
  let lastMonthSum = 0;
  for (const element of myCoasts) {
    if (
      moment(element.updatedAt).isAfter(
        moment().subtract(1, 'months').startOf('month'),
      ) &&
      moment(element.updatedAt).isBefore(
        moment().subtract(1, 'months').endOf('month'),
      )
    ) {
      lastMonthSum += element.value;
    }
  }
  let monthlyDiffPrct =
    myCoasts.length != 0
      ? (((thisMonthSum - lastMonthSum) / lastMonthSum) * 100).toFixed(2)
      : 0;
  let monthlyPrctColor =
    monthlyDiffPrct == 0
      ? COLORS.lightGray3
      : monthlyDiffPrct > 0
      ? COLORS.lightRed
      : COLORS.lightGreen;

  // YEAR VALUES MANIP
  let thisYearSum = 0;
  for (const element of myCoasts) {
    if (
      moment(element.updatedAt).isAfter(moment().startOf('year')) &&
      moment(element.updatedAt).isBefore(moment().endOf('year'))
    ) {
      thisYearSum += element.value;
    }
  }
  let lastYearSum = 0;
  for (const element of myCoasts) {
    if (
      moment(element.updatedAt).isAfter(
        moment().subtract(1, 'years').startOf('year'),
      ) &&
      moment(element.updatedAt).isBefore(
        moment().subtract(1, 'years').endOf('year'),
      )
    ) {
      lastYearSum += element.value;
    }
  }
  let yearlyDiffPrct =
    myCoasts.length != 0
      ? (((thisYearSum - lastYearSum) / lastYearSum) * 100).toFixed(2)
      : 0;
  let yearlyPrctColor =
    yearlyDiffPrct == 0
      ? COLORS.lightGray3
      : yearlyDiffPrct > 0
      ? COLORS.lightRed
      : COLORS.lightGreen;

  function renderCurrentBalanceSection() {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: COLORS.gray,
        }}>
        <Text style={{marginTop: 50, color: COLORS.white, ...FONTS.largeTitle}}>
          Your Coasts
        </Text>
        <BalanceInfo
          title="Estimated Energy Coasts"
          displayAmount={coastsSum.toFixed(3)}
          changePct={prct}
          time={'As of ' + time}
          containerStyle={{
            marginTop: SIZES.radius,
            marginBottom: SIZES.padding,
          }}
        />
      </View>
    );
  }
  return (
    <MainLayout>
      <View style={{flex: 1, backgroundColor: COLORS.black}}>
        {/**Header Section */}
        {renderCurrentBalanceSection()}
        {/**Chart*/}
        <Chart
          containerStyle={{marginTop: SIZES.padding}}
          chartPrices={coastsValuesChart}
          times={times}
          color={COLORS.lightGreen}
          timeOptions={{month: 'long', year: 'numeric'}}
        />
        {/**Your money */}
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            marginTop: 15,
            paddingHorizontal: SIZES.padding,
          }}>
          <Text style={{color: COLORS.white, ...FONTS.h3, fontSize: 18}}>
            Coasts of your Consumption
          </Text>
          <Stat
            title="This Month"
            subTitle="Last Month"
            thisDate={moment().startOf('month').format('MMM-YYYY')}
            lastDate={moment()
              .subtract(1, 'months')
              .startOf('month')
              .format('MMM-YYYY')}
            energyConsumed={thisMonthSum.toFixed(3)}
            lastEnergyConsumed={lastMonthSum.toFixed(3)}
            diffEnergyConsumed={(thisMonthSum - lastMonthSum).toFixed(3)}
            prc={monthlyDiffPrct}
            prcColor={monthlyPrctColor}
            type="coast"
            unity="TD"
            icon={icons.money}
          />
          <Stat
            title="This Year"
            subTitle="Last Year"
            thisDate={moment().startOf('year').format('YYYY')}
            lastDate={moment()
              .subtract(1, 'years')
              .startOf('year')
              .format('YYYY')}
            energyConsumed={thisYearSum.toFixed(3)}
            lastEnergyConsumed={lastYearSum.toFixed(3)}
            diffEnergyConsumed={(thisYearSum - lastYearSum).toFixed(3)}
            prc={yearlyDiffPrct}
            prcColor={yearlyPrctColor}
            type="coast"
            unity="TD"
            icon={icons.money}
          />
        </ScrollView>
      </View>
    </MainLayout>
  );
};

function mapStateToProps(state) {
  return {
    myCoasts: state.coastReducer.myCoasts,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getCoasts: () => {
      return dispatch(getCoasts());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
