/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {COLORS, FONTS, icons, SIZES} from '../constants';
import {IconTextButton} from '../components';
import {HeaderBar} from '../components/HeaderBar';
import SmoothPicker from 'react-native-smooth-picker';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {ShowModal} from '../functions/Modal';
import FormData from 'form-data';
import MlkitOcr from 'react-native-mlkit-ocr';
import showToast from '../functions/Toast';

const RenderPicker = ({children, selected, horizontal}) => {
  return (
    <View
      style={[
        horizontal ? styles.itemStyleHorizontal : styles.itemStyleVertical,
        selected &&
          (horizontal
            ? styles.itemSelectedStyleHorizontal
            : styles.itemSelectedStyleVertical),
      ]}>
      <Text
        style={{
          fontSize: selected ? SIZES.largeTitle : 20,
          color: selected ? COLORS.white : COLORS.lightGray,
          fontWeight: selected ? 'bold' : 'normal',
        }}>
        {children}
      </Text>
    </View>
  );
};
function renderSmoothPicker(selected, handleChange) {
  return (
    <SmoothPicker
      initialScrollToIndex={selected}
      onScrollToIndexFailed={() => {}}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      offsetSelection={40}
      scrollAnimation
      data={Array.from({length: 10}, (_, i) => 0 + i)}
      onSelected={({item, index}) => handleChange(index)}
      renderItem={({item, index}) => (
        <RenderPicker selected={index === selected}>{item}</RenderPicker>
      )}
    />
  );
}
async function submit(value, item) {
  let measure = {value: value, meterID: item.ID, real_value: value};
  try {
    let response = await axios.post(
      'http://192.168.1.13:8082/measures/measure',
      measure,
    );
    showToast('measure added successfully.');
  } catch (error) {
    console.log(error.message);
    showToast('value must be greater then last measure.');
  }
}

const Measure = ({route, navigation}) => {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [textForModal, setTextForModal] = React.useState('');
  const [pictureValue, setPicureValue] = React.useState(0);
  const {item} = route.params;
  async function takePicture() {
    let measure = null;
    let image = null;
    try {
      image = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
        includeExtra: true,
        maxHeight: 768,
        maxWidth: 1024,
        quality: 1,
      });
    } catch (error) {
      showToast('Picture Canceled');
    }
    if (image != null) {
      const result = await MlkitOcr.detectFromUri(image.assets[0].uri);
      console.log('WIDTH :', image.assets[0].width);
      for (let i = 0; i < result.length; i++) {
        console.log(result[i].text);
        if (result[i].text.toLowerCase() === 'kwh') {
          let onlynumbers = result[i + 1].text.replace(/\D/g, '');
          console.log('ONLY NUMBERS: ', onlynumbers);
          measure = parseInt(onlynumbers);
          if (measure != null) {
            setTextForModal('the detected value is ' + measure + ' kWh.');
            setPicureValue(measure);
            setModalVisible(!isModalVisible);
          } else {
            showToast('No energy measure detected.');
          }
        }
      }
    }
  }
  async function imageFromLibrary() {
    let measure = null;
    let image = null;
    try {
      image = await launchImageLibrary();
    } catch (error) {
      showToast('Image Canceled');
    }
    if (image != null) {
      const result = await MlkitOcr.detectFromUri(image.assets[0].uri);
      console.log('WIDTH :', image.assets[0].width);
      for (let i = 0; i < result.length; i++) {
        console.log(result[i].text);
        if (result[i].text.toLowerCase() === 'kwh') {
          let onlynumbers = result[i + 1].text
            .replace(/\D/g, '')
            .replaceAll(/\s/g, '');
          console.log('ONLY NUMBERS: ', onlynumbers);
          measure = parseInt(onlynumbers);
          if (measure != null) {
            setTextForModal('the detected value is ' + measure + ' kWh.');
            setPicureValue(measure);
            setModalVisible(!isModalVisible);
          } else {
            showToast('No energy measure detected.');
          }
        }
      }
    }
  }

  //console.log(item.ID);
  const [selected, setSelected] = React.useState(0);
  const [selected2, setSelected2] = React.useState(0);
  const [selected3, setSelected3] = React.useState(0);
  const [selected4, setSelected4] = React.useState(0);
  const [selected5, setSelected5] = React.useState(0);
  function handleChange(index) {
    setSelected(index);
  }
  function handleChange2(index) {
    setSelected2(index);
  }
  function handleChange3(index) {
    setSelected3(index);
  }
  function handleChange4(index) {
    setSelected4(index);
  }
  function handleChange5(index) {
    setSelected5(index);
  }

  const handleSubmit = async () => {
    let value =
      selected * 10000 +
      selected2 * 1000 +
      selected3 * 100 +
      selected4 * 10 +
      selected5;
    submit(value, item);
  };
  const handleSubmitPicture = async () => {
    submit(pictureValue, item);
  };
  return (
    <View style={{flex: 1, backgroundColor: COLORS.black}}>
      <HeaderBar title="Measure" />
      <Text
        style={{
          color: COLORS.lightGray,
          ...FONTS.h3,
          textTransform: 'capitalize',
          marginTop: SIZES.base,
          marginLeft: SIZES.padding - 4,
        }}>
        Add a new measure
      </Text>

      <View
        style={{
          height: 150,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: SIZES.padding,
          marginTop: 50,
          maxHeight: 150,
        }}>
        {renderSmoothPicker(selected, handleChange)}
        {renderSmoothPicker(selected2, handleChange2)}
        {renderSmoothPicker(selected3, handleChange3)}
        {renderSmoothPicker(selected4, handleChange4)}
        {renderSmoothPicker(selected5, handleChange5)}

        <Text
          style={{
            color: COLORS.lightRed,
            ...FONTS.largeTitle,
            textTransform: 'capitalize',
            marginLeft: SIZES.padding - 4,
            fontWeight: 'bold',
          }}>
          kWh
        </Text>
      </View>
      <View style={{marginTop: 150, paddingHorizontal: SIZES.padding}}>
        <IconTextButton
          label="Add New Measure"
          onPress={() => handleSubmit()}
          icon={icons.speedometer}
        />
        <IconTextButton
          label="Take A Photo"
          containerStyle={{marginTop: 20}}
          onPress={() => takePicture()}
          icon={icons.camera}
        />
        <IconTextButton
          label="Image From Library"
          containerStyle={{marginTop: 20}}
          onPress={() => imageFromLibrary()}
          icon={icons.gallery}
        />
      </View>
      <ShowModal
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        title="Do you want to consider this value ?"
        text={textForModal}
        onPress={() => handleSubmitPicture()}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  itemStyleVertical: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 80,
    backgroundColor: COLORS.black,
  },
  itemSelectedStyleVertical: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 80,
    backgroundColor: COLORS.black,
  },
});

export default Measure;
