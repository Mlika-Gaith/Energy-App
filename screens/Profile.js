import React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {HeaderBar} from '../components/HeaderBar';
import {COLORS, FONTS, images, SHADOWS, SIZES} from '../constants';
import {Table, TableWrapper, Row, Rows} from 'react-native-table-component';
import {MainLayout} from './';
const RenderImage = ({source}) => {
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        paddingVertical: SIZES.padding,
      }}>
      <Image
        source={source}
        style={{height: 280, width: '100%'}}
        resizeMode="cover"
      />
    </View>
  );
};
const RenderText = ({subtitle, text}) => {
  return (
    <View style={{display: 'flex', marginBottom: SIZES.radius}}>
      {subtitle ? (
        <Text
          style={{
            color: COLORS.lightGreen,
            ...FONTS.h2,
            textTransform: 'capitalize',
            marginBottom: SIZES.base,
          }}>
          {subtitle}
        </Text>
      ) : null}

      <Text
        style={{
          color: COLORS.white,
          textAlign: 'justify',
          ...FONTS.body3,
        }}>
        {text}
      </Text>
    </View>
  );
};
const RenderTable = ({table}) => {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: SIZES.radius,
        paddingBottom: SIZES.padding,
      }}>
      <Table borderStyle={{borderWidth: 2, borderColor: COLORS.lightGray2}}>
        <Row
          data={table.tableHead}
          textStyle={{
            textAlign: 'center',
            color: COLORS.white,
            ...FONTS.h3,
          }}
          style={{height: 50, backgroundColor: COLORS.lightGray}}
          flexArr={[1.5, 1.5, 1]}
          borderStyle={{borderColor: COLORS.black}}
        />
        <TableWrapper>
          <Rows
            data={table.tableData}
            textStyle={{
              textAlign: 'center',
              color: COLORS.white,
              ...FONTS.body5,
            }}
            style={{
              height: 50,
            }}
            flexArr={[1.5, 1.5, 1]}
          />
        </TableWrapper>
      </Table>
    </View>
  );
};
const Profile = () => {
  const Residential = {
    tableHead: ['Consumption', 'Type', 'Price'],
    tableData: [
      ['<= 50 kWh', 'Residental', '62 mill/kWh'],
      ['51 kWh & 100 kWh', 'Residental', '96 mill/kWh'],
      ['101 kWh & 200 kWh', 'Residental', '176 mill/kWh'],
      ['201 kWh & 300 kWh', 'Residental', '218 mill/kWh'],
      ['301 kWh & 500 kWh', 'Residental', '341 mill/kWh'],
      ['>= 500 kWh', 'Residental', '414 mill/kWh'],
    ],
  };
  const NonResidential = {
    tableHead: ['Consumption', 'Type', 'Price'],
    tableData: [
      ['<= 100 kWh', 'Non Residental', '104 mill/kWh'],
      ['101 kWh & 200 kWh', 'Non Residental', '195 mill/kWh'],
      ['201 kWh & 300 kWh', 'Non Residental', '240 mill/Kwh'],
      ['301 kWh & 500 kWh', 'Non Residental', '333 mill/kWh'],
      ['>= 500 kWh', 'Non Residental', '391 mill/kWh'],
    ],
  };
  return (
    <MainLayout>
      <View style={{flex: 1, backgroundColor: COLORS.black}}>
        <ScrollView
          style={{
            paddingHorizontal: SIZES.padding,
            marginVertical: SIZES.radius,
          }}
          showsVerticalScrollIndicator={false}>
          <HeaderBar title="About" />
          <RenderImage source={images.rocket} />
          <RenderText
            subtitle="What is this App ?"
            text="This app is developed by a computer science student this app will help you monitor and manage your electric energy consumption and estimate its coasts."
          />
          <RenderImage source={images.question} />
          <RenderText
            subtitle="How to use this App ?"
            text="On home screen or through the navbar menu you will be able to add new energy monitors based on their ID, type voltage etc... And you will be able to constantly visit your monitor on the panels screen and add new measure values either by the provided values of the scroll picker or by taking a photo of your monitor and letting our app Ai system determine the new energy value. "
          />
          <RenderImage source={images.bulb} />
          <RenderText
            subtitle="How To find my estimated consumed energy ?"
            text="On home screen you will find an overall consumed energy estimation plus every monitor has its own estimated consumed energy on details screen."
          />
          <RenderImage source={images.analyse} />
          <RenderText
            subtitle="In depth Charts :"
            text="Through this app you will find multiple charts either interactive or not that will describe your energy consumption and its coasts. Visit the report screen for more charts."
          />
          <RenderImage source={images.savings} />
          <RenderText
            subtitle="How Is my energy coast calculated ?"
            text="You will find an overall estimated energy cost on the wallet screen plus a specific coast for each monitor on the monitor details screen. Your energy coast (tax free) is estimated based on your monthly energy consumption threshold and your energy subscription type either residential or non residential : "
          />
          <RenderText text="For Residential Subscription Type :" />
          <RenderTable table={Residential} />
          <RenderText text="For Non Residential Subscription Type :" />
          <RenderTable table={NonResidential} />
          <RenderImage source={images.notifications} />
          <RenderText
            subtitle="This App includes notifications :"
            text="This app will remind  you every hour to visit your monitors for a more exact tracking of your energy consumption and will send you a daily reminder of your overall energy consumption."
          />
          <RenderImage source={images.ai} />
          <RenderText
            subtitle="This App includes artificial intelligence :"
            text="Instead of inputting energy measure value take a photo of your monitor and let our image processing engine detect the energy consumption value."
          />
        </ScrollView>
      </View>
    </MainLayout>
  );
};

export default Profile;
