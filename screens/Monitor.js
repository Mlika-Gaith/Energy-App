import React from 'react';
import {
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import {MainLayout} from '.';
import {getMeters} from '../stores/meter/meterActions';
import {getCoasts} from '../stores/coast/coastActions';
import {getMeasures} from '../stores/measure/measureActions';
import {constants, COLORS, FONTS, SIZES, icons} from '../constants';
import {TextButton} from '../components';
import {HeaderBar} from '../components/HeaderBar';
import {LineChart} from 'react-native-chart-kit';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
const monitorTabs = constants.monitorTabs.map(monitorTab => ({
  ...monitorTab,
  ref: React.createRef(),
}));

const TabIndicator = ({measureLayout, scrollX}) => {
  const inputRange = monitorTabs.map((_, i) => i * SIZES.width);
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map(measure => measure.x),
  });
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: 0,
        height: '100%',
        width: (SIZES.width - SIZES.radius * 2) / 2,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.lightGray,
        transform: [
          {
            translateX,
          },
        ],
      }}
    />
  );
};

const Tabs = ({scrollX, onMonitorTabPress}) => {
  const [measureLayout, setMeasureLayout] = React.useState([]);
  const containerRef = React.useRef();
  React.useEffect(() => {
    let ml = [];
    monitorTabs.forEach(monitorTab => {
      monitorTab?.ref?.current?.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
          ml.push({x, y, width, height});
          if (ml.length === monitorTabs.length) {
            setMeasureLayout(ml);
          }
        },
      );
    });
  }, [containerRef.current]);
  return (
    <View style={{flexDirection: 'row'}} ref={containerRef}>
      {/* tabindicator*/}
      {measureLayout.length > 0 && (
        <TabIndicator measureLayout={measureLayout} scrollX={scrollX} />
      )}
      {monitorTabs.map((item, index) => {
        return (
          <TouchableOpacity
            key={`MonitorTab-${index}`}
            style={{flex: 1}}
            onPress={() => onMonitorTabPress(index)}>
            <View
              ref={item.ref}
              style={{
                paddingHorizontal: 15,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
              }}>
              <Text style={{color: COLORS.white, ...FONTS.h3}}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Monitor = ({
  getMeters,
  meters,
  getMeasures,
  getCoasts,
  allMeasures,
  allCoasts,
}) => {
  const navigate = useNavigation();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const monitorTabScrollViewRef = React.useRef();
  const [refreshing, setRefreshing] = React.useState(false);
  const onMonitorTabPress = React.useCallback(monitorTabIndex => {
    monitorTabScrollViewRef?.current?.scrollToOffset({
      offset: monitorTabIndex * SIZES.width,
    });
  });
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getMeters();
    getMeasures();
    getCoasts();
    setRefreshing(false);
  }, []);
  React.useEffect(() => {
    getMeters();
    getMeasures();
    getCoasts();
  }, []);

  function renderTabBar() {
    return (
      <View
        style={{
          marginTop: SIZES.radius,
          marginHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          backgroundColor: COLORS.gray,
        }}>
        <Tabs scrollX={scrollX} onMonitorTabPress={onMonitorTabPress} />
      </View>
    );
  }
  function renderButtons() {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: SIZES.radius,
          marginHorizontal: SIZES.radius,
        }}>
        <TextButton label="Lowest" containerStyle={{marginLeft: SIZES.base}} />
        <TextButton label="Highest" containerStyle={{marginLeft: SIZES.base}} />
      </View>
    );
  }
  function renderList() {
    return (
      <Animated.FlatList
        ref={monitorTabScrollViewRef}
        data={monitorTabs}
        contentContainerStyle={{marginTop: SIZES.padding}}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
        refreshing={refreshing}
        onRefresh={() => onRefresh()}
        renderItem={({item, index}) => {
          return (
            <View style={{flex: 1, width: SIZES.width}}>
              <FlatList
                data={
                  //coins
                  meters
                }
                keyExtractor={item => item._id}
                renderItem={({item, index}) => {
                  let chartData =
                    item.measures.length != 0
                      ? item.measures.map(i => i.real_value)
                      : [0, 0, 0];
                  let diff =
                    item.measures.length != 0
                      ? chartData.slice(-2)[1] - chartData.slice(-2)[0]
                      : 0;
                  let prct =
                    item.measures.length != 0
                      ? ((diff / chartData.slice(-2)[0]) * 100).toFixed(2)
                      : 0;
                  let sum =
                    item.measures.length != 0
                      ? chartData.reduce((partialSum, a) => partialSum + a, 0)
                      : 0;
                  let time =
                    item.measures.length != 0
                      ? moment(item.measures.slice(-1)[0].createdAt).format(
                          'LLLL',
                        )
                      : 0;
                  let times =
                    item.measures.length != 0
                      ? item.measures.map(i => i.createdAt)
                      : [0, 0, 0];
                  let changeColor =
                    prct == 0
                      ? COLORS.lightGray3
                      : prct > 0
                      ? COLORS.lightRed
                      : COLORS.lightGreen;

                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigate.navigate('Details', {
                          item,
                          prct,
                          sum,
                          time,
                          times,
                          chartData,
                          allMeasures,
                          allCoasts,
                        })
                      }
                      style={{
                        flexDirection: 'row',
                        paddingHorizontal: SIZES.padding,
                        marginBottom: SIZES.radius,
                      }}>
                      {/* meters*/}
                      <View
                        style={{
                          flex: 1.5,
                          flexDirection: 'row',
                          alignItem: 'center',
                        }}>
                        <Image
                          source={icons.energy}
                          style={{
                            height: 35,
                            width: 35,
                            tintColor: COLORS.lightGray3,
                            alignSelf: 'center',
                          }}
                        />
                        <Text
                          style={{
                            marginLeft: SIZES.radius,
                            color: COLORS.white,
                            alignSelf: 'center',
                            ...FONTS.h3,
                          }}>
                          {/*item.name*/}
                          {'Monitor ' +
                            item.ID.substring(0, item.ID.length / 2) +
                            '..'}
                        </Text>
                      </View>
                      {/* lineChart*/}
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <LineChart
                          withVerticalLabels={false}
                          withHorizontalLabels={false}
                          withDots={false}
                          withInnerLines={false}
                          withVerticalLines={false}
                          withOuterLines={false}
                          data={{
                            datasets: [
                              {
                                data: chartData,
                              },
                            ],
                          }}
                          width={100}
                          height={60}
                          chartConfig={{
                            color: () => changeColor,
                          }}
                          bezier
                          style={{paddingRight: 0, alignSelf: 'center'}}
                        />
                      </View>
                      {/* FiguresSection*/}
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}>
                        <Text style={{color: COLORS.white, ...FONTS.h4}}>
                          {sum}kWh
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          }}>
                          {prct != 0 && (
                            <Image
                              source={icons.upArrow}
                              style={{
                                height: 10,
                                width: 10,
                                tintColor: changeColor,
                                transform:
                                  prct > 0
                                    ? [{rotate: '45deg'}]
                                    : [{rotate: '125deg'}],
                              }}
                            />
                          )}
                          <Text
                            style={{
                              marginLeft: 5,
                              color: changeColor,
                              ...FONTS.body5,
                            }}>
                            {prct}%
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          );
        }}
      />
    );
  }
  return (
    <MainLayout>
      <View style={{flex: 1, backgroundColor: COLORS.black}}>
        <HeaderBar title="Monitors" />
        {renderTabBar()}
        {renderButtons()}
        {renderList()}
      </View>
    </MainLayout>
  );
};

function mapStateToProps(state) {
  return {
    meters: state.meterReducer.myMeters,
    allMeasures: state.measureReducer.myMeasures,
    allCoasts: state.coastReducer.myCoasts,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMeters: () => {
      return dispatch(getMeters());
    },
    getMeasures: () => {
      return dispatch(getMeasures());
    },
    getCoasts: () => {
      return dispatch(getCoasts());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Monitor);
