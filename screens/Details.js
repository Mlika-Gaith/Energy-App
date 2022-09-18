/* eslint-disable react-native/no-inline-styles */
import {View, Text, SafeAreaView, ScrollView, Image} from 'react-native';
import React from 'react';
import {COLORS, SIZES, FONTS, icons} from '../constants';
import {BalanceInfo, Chart} from '../components';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import axios from 'axios';
import {ShowModal} from '../functions/Modal';
import {showToast} from '../functions/Toast';
import {RenderPieChart, RenderTwoLineCharts} from '../components/LineChart';
import {CircleButton} from '../components/CircleButton';
import {RenderSubHeader} from '../components/HeaderBar';
const DetailsHeader = ({
  item,
  prct,
  sum,
  time,
  overallCoasts,
  lastCoastTime,
  coastPrct,
}) => {
  const navigate = useNavigation();
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [textForModal, setTextForModal] = React.useState('');
  const handlePress = () => {
    setTextForModal('delete Monitor ' + item.ID + ' ?');
    setModalVisible(!isModalVisible);
  };
  const deleteMeter = async () => {
    try {
      let result = await axios.post(
        'http://192.168.1.13:8082/meters/delete/' + item.ID,
      );
      showToast('monitor deleted');
    } catch (error) {
      showToast('unable to delete monitor');
    }
  };
  return (
    <View
      style={{
        paddingHorizontal: SIZES.padding,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: COLORS.gray,
      }}>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 50,
        }}>
        <Text
          style={{
            flex: 2,
            color: COLORS.white,
            ...FONTS.largeTitle,
          }}>
          Details
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginLeft: SIZES.radius,
            flex: 1,
          }}>
          <CircleButton
            icon={icons.speedometer}
            onPress={() => navigate.navigate('Measure', {item})}
          />
          <CircleButton
            icon={icons.remove}
            onPress={() => handlePress()}
            containerStyle={{marginLeft: 20}}
          />
        </View>
      </View>

      <BalanceInfo
        title={'Monitor  ' + item.ID}
        displayAmount={sum}
        changePct={parseFloat(prct)}
        time={time}
        type="power"
        containerStyle={{
          marginTop: SIZES.radius,
          marginBottom: SIZES.padding,
        }}
      />
      <RenderSubHeader
        title="Initial Monitor Value"
        icon={icons.energy}
        value={item.initial_value}
        unity="kWh"
        containerStyle={{marginBottom: SIZES.radius, marginTop: -SIZES.font}}
      />
      <BalanceInfo
        displayAmount={overallCoasts}
        changePct={parseFloat(coastPrct)}
        time={lastCoastTime}
        type="money"
        containerStyle={{
          marginBottom: SIZES.padding,
          marginTop: -SIZES.padding,
        }}
      />
      <ShowModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        title="Do you want to delete this Monitor ?"
        text={textForModal}
        onPress={() => deleteMeter() && navigate.navigate('Market')}
      />
    </View>
  );
};
const DescriptionItem = ({title, item}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 15,
      }}>
      <View style={{flex: 2, flexDirection: 'row', alignItem: 'center'}}>
        <Text
          style={{
            color: COLORS.lightGray,
            ...FONTS.h3,
            paddingRight: SIZES.padding * 2,
          }}>
          {title}
        </Text>
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <Text
          style={{
            color: COLORS.white,
            ...FONTS.h3,
            alignSelf: 'flex-start',
          }}>
          {item}
        </Text>
      </View>
    </View>
  );
};
function verifyCoast(total, type) {
  if (type == 'residential') {
    if (total <= 50) {
      return 62;
    } else if (51 <= total && total <= 100) {
      return 96;
    } else if (101 <= total && total <= 200) {
      return 176;
    } else if (201 <= total && total <= 300) {
      return 218;
    } else if (301 <= total && total <= 500) {
      return 341;
    } else {
      return 501;
    }
  } else {
    if (total <= 100) {
      return 104;
    } else if (101 <= total && total <= 200) {
      return 195;
    } else if (201 <= total && total <= 300) {
      return 240;
    } else if (301 <= total && total <= 500) {
      return 333;
    } else {
      return 391;
    }
  }
}
const Details = ({route, navigation}) => {
  const {item} = route.params;
  const {prct} = route.params;
  const {sum} = route.params;
  const {time} = route.params;
  const {times} = route.params;
  const {chartData} = route.params;
  const {allCoasts} = route.params;
  const {allMeasures} = route.params;

  // find values of energy of current month
  let this_month_energy = item.measures.map((item, index) => {
    let month_year = moment(item.createdAt).format('MM');
    let this_month_year = moment().format('MM');
    if (moment(month_year).isSame(this_month_year)) {
      return item.real_value;
    } else {
      return 0;
    }
  });
  // find sum of current values
  let this_month_energy_sum =
    this_month_energy.length != 0
      ? this_month_energy.reduce((partialSum, a) => partialSum + a, 0)
      : 0;

  let this_month_energy_coast =
    (this_month_energy_sum *
      verifyCoast(this_month_energy_sum, item.residential)) /
    1000;
  let coast = {
    coast: this_month_energy_coast,
    time: moment().format('MM-YY'),
    meterID: item.ID,
  };
  const [coastsData, setCoastsData] = React.useState([]);

  let submitCoast = async () => {
    try {
      let response = await axios.post(
        'http://192.168.1.13:8082/coasts/coast',
        coast,
      );
    } catch (error) {
      console.log(error);
    }
  };
  let fetchCoasts = async () => {
    try {
      let response = await axios.get(
        'http://192.168.1.13:8082/coasts/coast/' + item.ID,
      );
      setCoastsData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    submitCoast();
    fetchCoasts();
  }, []);
  // get coasts data from api here
  let coasts = coastsData.map((item, index) => {
    return item.value;
  });
  let months = coastsData.map((item, index) => {
    return item.updatedAt;
  });
  let coastsValuesChart = [];
  let timesChart = [];
  for (let i = 0; i < 12; i++) {
    let date = moment().month(i).format('MM');
    let measures = coastsData.map((item, index) => {
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
    timesChart[i] = moment().month(i).format('YYYY-MM');
  }
  // Overall coasts
  let overallCoasts = coasts.reduce((partialSum, a) => partialSum + a, 0);
  // last coast measure
  let lastCoastTime = moment(months.slice(-1)[0]).format('LLLL');
  // COAST PRCT
  let diff = coasts.slice(-2)[1] - coasts.slice(-2)[0];
  let coastPrct = ((diff / coasts.slice(-2)[0]) * 100).toFixed(2);

  // Two Line Charts
  // Current meter energy sum per day and other meters anergy sum per day
  // Other meters anergy sum per day
  let newTimes = [];
  newTimes[0] = moment(allMeasures[0].createdAt).format('MM-DD-YYYY');
  let k = 0;
  for (let i = 1; i < allMeasures.length; i++) {
    let date = moment(allMeasures[i].createdAt).format('MM-DD-YYYY');
    let verify = false;
    for (let y = 0; y < newTimes.length; y++) {
      if (moment(date).isSame(newTimes[y])) {
        verify = true;
      }
    }
    if (verify == false) {
      k++;
      newTimes[k] = date;
    }
  }
  let Sums = [];
  let thisDaySum = 0;
  for (let i = 0; i < newTimes.length; i++) {
    thisDaySum = allMeasures.map(it => {
      let date = moment(it.createdAt).format('MM-DD-YYYY');
      if (moment(date).isSame(newTimes[i]) && item.ID != it.meterID) {
        return it.real_value;
      } else {
        return 0;
      }
    });
    Sums[i] = thisDaySum.reduce((partialSum, a) => partialSum + a, 0);
  }
  // Current meter energy sum per day
  let CurrentSums = [];
  let thisDayCurrentSum = 0;
  for (let i = 0; i < newTimes.length; i++) {
    thisDayCurrentSum = allMeasures.map(it => {
      let date = moment(it.createdAt).format('MM-DD-YYYY');
      if (moment(date).isSame(newTimes[i]) && item.ID == it.meterID) {
        return it.real_value;
      } else {
        return 0;
      }
    });
    CurrentSums[i] = thisDayCurrentSum.reduce(
      (partialSum, a) => partialSum + a,
      0,
    );
  }

  //Other METERS COSTS FOR PIE CHART
  let allMeterCoasts = allCoasts.map(i => {
    return i.value;
  });
  let otherMeterCoast = allMeterCoasts.reduce(
    (partialSum, a) => partialSum + a,
    0,
  );
  // All METERS Measures
  let allMetersMeasures = allMeasures.map(i => {
    return i.real_value;
  });
  let overallMeasure = allMetersMeasures.reduce(
    (partialSum, a) => partialSum + a,
    0,
  );
  // Two Line Charts
  // Coasts 2 line charts
  let othercoastsValues = [];
  for (let i = 0; i < 12; i++) {
    let date = moment().month(i).format('MM');
    let measures = allCoasts.map((it, index) => {
      let date2 = moment(it.time, 'MM-YY').format('MM');
      if (moment(date).isSame(date2) && it.meterID != item.ID) {
        return it.value;
      } else {
        return 0;
      }
    });
    othercoastsValues[i] = measures.reduce(
      (partialSum, a) => partialSum + a,
      0,
    );
  }
  // PIE CHART FOR ENERGY DATA
  const measuresPieData = [
    {
      name: 'This Panel',
      energy: sum,
      color: COLORS.lightGreen3,
      legendFontColor: COLORS.white,
      legendFontSize: 18,
    },
    {
      name: 'Other Panels',
      energy: overallMeasure,
      color: COLORS.lightGray2,
      legendFontColor: COLORS.white,
      legendFontSize: 18,
    },
  ];
  const coastsPieData = [
    {
      name: 'This Panel',
      coast: overallCoasts,
      color: COLORS.lightGreen3,
      legendFontColor: COLORS.white,
      legendFontSize: 18,
    },
    {
      name: 'Other Panels',
      coast: otherMeterCoast,
      color: COLORS.lightGray2,
      legendFontColor: COLORS.white,
      legendFontSize: 18,
    },
  ];
  return (
    <View style={{flex: 1, backgroundColor: COLORS.black}}>
      <DetailsHeader
        item={item}
        prct={prct}
        sum={sum}
        time={time}
        overallCoasts={overallCoasts}
        lastCoastTime={lastCoastTime}
        coastPrct={coastPrct}
      />

      <ScrollView
        style={{
          flex: 1,
          marginTop: 15,
          paddingHorizontal: SIZES.padding,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Text style={{color: COLORS.white, ...FONTS.h3}}>Description</Text>
        <View
          style={{
            marginTop: 20,
            paddingLeft: SIZES.radius,
          }}>
          {<DescriptionItem title="ID : " item={item.ID} />}
          {<DescriptionItem title="Type : " item={item.type} />}
          {<DescriptionItem title="Sector : " item={item.residential} />}
          {<DescriptionItem title="Voltage : " item={item.voltage} />}
          {<DescriptionItem title="Amperage : " item={item.amperage} />}
          {<DescriptionItem title="Frequence : " item={item.frequency} />}
          {
            <DescriptionItem
              title="Added : "
              item={moment(item.createdAt).fromNow()}
            />
          }
        </View>
        <Text style={{color: COLORS.white, ...FONTS.h3, marginTop: 30}}>
          Consumed Energy
        </Text>

        <Chart
          containerStyle={{marginTop: SIZES.padding}}
          chartPrices={chartData}
          times={times}
          color={COLORS.lightGreen}
          timeOptions={{month: 'long', year: 'numeric', day: '2-digit'}}
        />
        <Text style={{color: COLORS.white, ...FONTS.h3, marginTop: 30}}>
          Consumed Energy Evolution Compared to Other Monitors
        </Text>
        <ScrollView
          horizontal={true}
          style={{marginTop: SIZES.padding}}
          showsHorizontalScrollIndicator={false}>
          <RenderTwoLineCharts
            data1={CurrentSums}
            data2={Sums}
            labels={newTimes}
            color1={COLORS.lightGreen3}
            color2={COLORS.lightGray3}
            width={newTimes.length * 100}
            height={250}
          />
        </ScrollView>
        <Text style={{color: COLORS.white, ...FONTS.h3, marginTop: 30}}>
          Monitor Consumption of Total Energy
        </Text>
        <ScrollView
          horizontal={true}
          style={{marginTop: SIZES.padding}}
          showsHorizontalScrollIndicator={false}>
          <RenderPieChart
            data={measuresPieData}
            width={SIZES.width + 50}
            accessor="energy"
          />
        </ScrollView>
        <Text
          style={{
            color: COLORS.white,
            ...FONTS.h3,
            marginTop: 35,
            paddingBottom: SIZES.padding,
          }}>
          Costs Per Month
        </Text>
        <Chart
          containerStyle={{marginTop: SIZES.padding}}
          chartPrices={coastsValuesChart}
          times={timesChart}
          color={COLORS.lightGreen}
          timeOptions={{month: 'long', year: 'numeric'}}
        />
        <Text
          style={{
            color: COLORS.white,
            ...FONTS.h3,
            marginTop: 35,
            paddingBottom: SIZES.padding,
          }}>
          Costs Per Month Compared to Other Monitors Coasts
        </Text>
        <ScrollView
          horizontal={true}
          style={{marginTop: SIZES.padding}}
          showsHorizontalScrollIndicator={false}>
          <RenderTwoLineCharts
            data1={coastsValuesChart}
            data2={othercoastsValues}
            labels={timesChart}
            color1={COLORS.lightGreen3}
            color2={COLORS.lightRed}
            width={
              timesChart.length > 5 ? timesChart.length * 100 : SIZES.width
            }
            height={250}
          />
        </ScrollView>
        <Text
          style={{
            color: COLORS.white,
            ...FONTS.h3,
            marginTop: 35,
            paddingBottom: SIZES.padding,
          }}>
          Monitor Energy Coast of Total Coast
        </Text>
        <ScrollView
          horizontal={true}
          style={{marginTop: SIZES.padding}}
          showsHorizontalScrollIndicator={false}>
          <RenderPieChart
            data={coastsPieData}
            width={SIZES.width + 50}
            accessor="coast"
          />
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default Details;
