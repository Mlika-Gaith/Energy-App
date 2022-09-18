import React from 'react';
import {View, Text, FlatList, ScrollView} from 'react-native';
import {MainLayout} from './';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {SIZES, COLORS, FONTS, icons} from '../constants';
import {useNavigation} from '@react-navigation/native';
import {IconTextButton, Chart, BalanceInfo, Stat} from '../components';
import {getMeasures} from '../stores/measure/measureActions';
import moment from 'moment';
import showToast from '../functions/Toast';

const Home = ({getMeasures, measures}) => {
  useFocusEffect(
    React.useCallback(() => {
      getMeasures();
    }, []),
  );
  const navigation = useNavigation();
  let times =
    typeof measures[0] != 'undefined'
      ? measures.map(i => i.createdAt)
      : [0, 0, 0];

  let measureValues =
    typeof measures[0] != 'undefined'
      ? measures.map(i => i.real_value)
      : [0, 0, 0];
  let sum =
    typeof measures[0] != 'undefined'
      ? measureValues.reduce((partialSum, a) => partialSum + a, 0)
      : 0;
  let time =
    typeof measures[0] != 'undefined'
      ? moment(measures.slice(-1)[0].createdAt).format('LLLL')
      : 0;
  let diff =
    typeof measures[0] != 'undefined'
      ? measureValues.slice(-2)[1] - measureValues.slice(-2)[0]
      : 0;
  let prct =
    typeof measures[0] != 'undefined'
      ? ((diff / measureValues.slice(-2)[0]) * 100).toFixed(2)
      : 0;
  //HOUR VALUES MANIP
  let thisHourSum = 0;
  let lastHourSum = 0;
  let hourlyDiffPrct = 0;
  let hourlyPrctColor = COLORS.lightGray;
  let hourIcon = icons.low_measure;
  // DAY VALUES MANIP
  let daySum = 0;
  let yesterdaySum = 0;
  let dailyDiffPrct = 0;
  let dailyPrctColor = COLORS.lightGray;
  let dayIcon = icons.low_measure;
  // WEEK VALUES MANIP
  let thisWeekSum = 0;
  let lastWeekSum = 0;
  let weeklyDiffPrct = 0;
  let weeklyPrctColor = COLORS.lightGray;
  let weekIcon = icons.low_measure;
  // MONTH VALUES MANIP
  let thisMonthSum = 0;
  let lastMonthSum = 0;
  let monthlyDiffPrct = 0;
  let monthlyPrctColor = COLORS.lightGray;
  let monthIcon = icons.low_measure;
  // YEAR VALUES MANIP
  let thisYearSum = 0;
  let lastYearSum = 0;
  let yearlyDiffPrct = 0;
  let yearlyPrctColor = COLORS.lightGray;
  let yearIcon = icons.low_measure;
  if (typeof measures[0] != 'undefined') {
    for (const element of measures) {
      if (
        moment(element.createdAt).isAfter(moment().startOf('hour')) &&
        moment(element.createdAt).isBefore(moment().endOf('hour'))
      ) {
        thisHourSum += element.real_value;
      }
    }
    for (const element of measures) {
      if (
        moment(element.createdAt).isAfter(
          moment().subtract(1, 'hours').startOf('hour'),
        ) &&
        moment(element.createdAt).isBefore(
          moment().subtract(1, 'hours').endOf('hour'),
        )
      ) {
        lastHourSum += element.real_value;
      }
    }
    hourlyDiffPrct = (
      ((thisHourSum - lastHourSum) / lastHourSum) *
      100
    ).toFixed(2);
    hourlyPrctColor =
      hourlyDiffPrct == 0
        ? COLORS.lightGray3
        : hourlyDiffPrct > 0
        ? COLORS.lightRed
        : COLORS.lightGreen;
    hourIcon = hourlyDiffPrct >= 0 ? icons.high_measure : icons.low_measure;

    // DAY VALUES MANIP

    for (const element of measures) {
      let day = moment(element.createdAt).format('MM-DD');
      let today = moment().format('MM-DD');
      if (moment(day).isSame(today)) {
        daySum += element.real_value;
      }
    }

    for (const element of measures) {
      let day = moment(element.createdAt).format('MM-DD');
      let yesterday = moment().subtract(1, 'days').format('MM-DD');
      if (moment(day).isSame(yesterday)) {
        yesterdaySum += element.real_value;
      }
    }
    dailyDiffPrct = (((daySum - yesterdaySum) / yesterdaySum) * 100).toFixed(2);
    dailyPrctColor =
      dailyDiffPrct == 0
        ? COLORS.lightGray3
        : dailyDiffPrct > 0
        ? COLORS.lightRed
        : COLORS.lightGreen;
    dayIcon = dailyDiffPrct >= 0 ? icons.high_measure : icons.low_measure;
    // WEEK VALUES MANIP

    for (const element of measures) {
      if (
        moment(element.createdAt).isAfter(moment().startOf('week')) &&
        moment(element.createdAt).isBefore(moment().endOf('week'))
      ) {
        thisWeekSum += element.real_value;
      }
    }

    for (const element of measures) {
      if (
        moment(element.createdAt).isAfter(
          moment().subtract(1, 'weeks').startOf('week'),
        ) &&
        moment(element.createdAt).isBefore(
          moment().subtract(1, 'weeks').endOf('week'),
        )
      ) {
        lastWeekSum += element.real_value;
      }
    }
    weeklyDiffPrct = (
      ((thisWeekSum - lastWeekSum) / lastWeekSum) *
      100
    ).toFixed(2);

    weeklyPrctColor =
      weeklyDiffPrct == 0
        ? COLORS.lightGray3
        : weeklyDiffPrct > 0
        ? COLORS.lightRed
        : COLORS.lightGreen;
    weekIcon = weeklyDiffPrct >= 0 ? icons.high_measure : icons.low_measure;

    // MONTH VALUES MANIP

    for (const element of measures) {
      if (
        moment(element.createdAt).isAfter(moment().startOf('month')) &&
        moment(element.createdAt).isBefore(moment().endOf('month'))
      ) {
        thisMonthSum += element.real_value;
      }
    }

    for (const element of measures) {
      if (
        moment(element.createdAt).isAfter(
          moment().subtract(1, 'months').startOf('month'),
        ) &&
        moment(element.createdAt).isBefore(
          moment().subtract(1, 'months').endOf('month'),
        )
      ) {
        lastMonthSum += element.real_value;
      }
    }
    monthlyDiffPrct = (
      ((thisMonthSum - lastMonthSum) / lastMonthSum) *
      100
    ).toFixed(2);
    monthlyPrctColor =
      monthlyDiffPrct == 0
        ? COLORS.lightGray3
        : monthlyDiffPrct > 0
        ? COLORS.lightRed
        : COLORS.lightGreen;
    monthIcon = monthlyDiffPrct >= 0 ? icons.high_measure : icons.low_measure;

    // YEAR VALUES MANIP

    for (const element of measures) {
      if (
        moment(element.createdAt).isAfter(moment().startOf('year')) &&
        moment(element.createdAt).isBefore(moment().endOf('year'))
      ) {
        thisYearSum += element.real_value;
      }
    }

    for (const element of measures) {
      if (
        moment(element.createdAt).isAfter(
          moment().subtract(1, 'years').startOf('year'),
        ) &&
        moment(element.createdAt).isBefore(
          moment().subtract(1, 'years').endOf('year'),
        )
      ) {
        lastYearSum += element.real_value;
      }
    }
    yearlyDiffPrct = (
      ((thisYearSum - lastYearSum) / lastYearSum) *
      100
    ).toFixed(2);

    yearlyPrctColor =
      yearlyDiffPrct == 0
        ? COLORS.lightGray3
        : yearlyDiffPrct > 0
        ? COLORS.lightRed
        : COLORS.lightGreen;
    yearIcon = yearlyDiffPrct >= 0 ? icons.high_measure : icons.low_measure;
  } else {
    showToast('unable to connect to server');
  }

  //let perChange = (valueChange / (totalWallet - valueChange)) * 100;
  function renderWalletInfoSection() {
    return (
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: COLORS.gray,
        }}>
        <BalanceInfo
          title="Overall Consumed Energy"
          displayAmount={sum}
          type="power"
          changePct={parseFloat(prct)}
          time={'As of ' + time}
          containerStyle={{marginTop: 50}}
        />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 30,
            marginBottom: -15,
            paddingHorizontal: SIZES.radius,
          }}>
          <IconTextButton
            label="Add Monitor"
            icon={icons.add}
            containerStyle={{flex: 1, height: 40, marginRight: SIZES.radius}}
            onPress={() => navigation.navigate('AddNew')}
          />
          <IconTextButton
            label="Report"
            icon={icons.report}
            containerStyle={{flex: 1, height: 40}}
            onPress={() => navigation.navigate('Report')}
          />
        </View>
      </View>
    );
  }
  return (
    <MainLayout>
      <View style={{flex: 1, backgroundColor: COLORS.black}}>
        {/* HEADER - WALLET INFO*/}
        {renderWalletInfoSection()}
        <Chart
          containerStyle={{marginTop: SIZES.padding * 2}}
          chartPrices={measureValues}
          times={times}
          color={COLORS.lightGreen}
          timeOptions={{month: 'long', year: 'numeric', day: '2-digit'}}
        />
        {/* Top Consumption*/}

        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            marginTop: 15,
            paddingHorizontal: SIZES.padding,
          }}>
          <Text style={{color: COLORS.white, ...FONTS.h3, fontSize: 18}}>
            Energy Consumed
          </Text>
          <Stat
            title="This Hour"
            subTitle="Last Hour"
            thisDate={
              moment().format('hh a') +
              ' : ' +
              moment().add(1, 'hours').format('hh a')
            }
            lastDate={
              moment().subtract(1, 'hours').format('hh a') +
              ' : ' +
              moment().format('hh a')
            }
            energyConsumed={thisHourSum}
            lastEnergyConsumed={lastHourSum}
            diffEnergyConsumed={thisHourSum - lastHourSum}
            prc={hourlyDiffPrct}
            prcColor={hourlyPrctColor}
            unity="kWh"
            icon={hourIcon}
          />
          <Stat
            title="Today"
            subTitle="Yesterday"
            thisDate={moment().format('L')}
            lastDate={moment().subtract(1, 'days').format('L')}
            energyConsumed={daySum}
            lastEnergyConsumed={yesterdaySum}
            diffEnergyConsumed={daySum - yesterdaySum}
            prc={dailyDiffPrct}
            prcColor={dailyPrctColor}
            unity="kWh"
            icon={dayIcon}
          />
          <Stat
            title="This Week"
            subTitle="Last Week"
            thisDate={
              moment().startOf('week').format('DD-MM') +
              ' : ' +
              moment().endOf('week').format('DD-MM')
            }
            lastDate={
              moment().subtract(1, 'weeks').startOf('week').format('DD-MM') +
              ' : ' +
              moment().subtract(1, 'weeks').endOf('week').format('DD-MM')
            }
            energyConsumed={thisWeekSum}
            lastEnergyConsumed={lastWeekSum}
            diffEnergyConsumed={thisWeekSum - lastWeekSum}
            prc={weeklyDiffPrct}
            prcColor={weeklyPrctColor}
            unity="kWh"
            icon={weekIcon}
          />
          <Stat
            title="This Month"
            subTitle="Last Month"
            thisDate={moment().startOf('month').format('MMM-YYYY')}
            lastDate={moment()
              .subtract(1, 'months')
              .startOf('month')
              .format('MMM-YYYY')}
            energyConsumed={thisMonthSum}
            lastEnergyConsumed={lastMonthSum}
            diffEnergyConsumed={thisMonthSum - lastMonthSum}
            prc={monthlyDiffPrct}
            prcColor={monthlyPrctColor}
            unity="kWh"
            icon={monthIcon}
          />
          <Stat
            title="This year"
            subTitle="last Year"
            thisDate={moment().startOf('year').format('YYYY')}
            lastDate={moment()
              .subtract(1, 'years')
              .startOf('year')
              .format('YYYY')}
            energyConsumed={thisYearSum}
            lastEnergyConsumed={lastYearSum}
            diffEnergyConsumed={thisYearSum - lastYearSum}
            prc={yearlyDiffPrct}
            prcColor={yearlyPrctColor}
            unity="kWh"
            icon={yearIcon}
          />
        </ScrollView>
      </View>
    </MainLayout>
  );
};

function mapStateToProps(state) {
  return {
    measures: state.measureReducer.myMeasures,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMeasures: () => {
      return dispatch(getMeasures());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
