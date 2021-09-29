import React, {useEffect, useState} from 'react';
import {View, Text, Alert, ActivityIndicator} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';

const App = () => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
    currentAddress: '',
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const {longitude, latitude} = position.coords;
        console.log(longitude, latitude);
        setCurrentLocation({
          ...currentLocation,
          longitude,
          latitude,
        });
        setLoading(false);
        getAddress(latitude, longitude);
      },
      err => console.log(err.message),
      {timeout: 20000, maximumAge: 1000},
      setLoading(false),
    );
  }, []);

  const getAddress = async (lat, lng) => {
    try {
      await Geocoder.fallbackToGoogle(
        'AIzaSyCMZeh2mXRBO6XJWngSp23WWqCpycC4Cd8',
      );
      let res = await Geocoder.geocodePosition({lat, lng});
      console.log(res);
      setCurrentLocation({
        ...currentLocation,
        currentAddress: res[0].formattedAddress,
      });
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (!loading) {
    currentLocation.latitude !== null && (
      <View style={{flex: 1}}>
        <MapView
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: currentLocation.latitudeDelta,
            longitudeDelta: currentLocation.longitudeDelta,
          }}
          style={{flex: 1}}
          showsUserLocation={true}
        />
        <View
          style={{
            height: 300,
            backgroundColor: 'salmon',
            borderRadius: 30,
            padding: 20,
          }}>
          <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>
            {currentLocation.currentAddress}
          </Text>
        </View>
      </View>
    );
  }
  return <ActivityIndicator size="large" color="#ffff00" />;
};

export default App;
