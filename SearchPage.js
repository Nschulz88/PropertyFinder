'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator, 
  Image
} from 'react-native';
import SearchResults from './SearchResults';
import ZOMATO_KEY from './environments.js';


function urlForQueryAndPage(key, value) {
  const querystring = key + '=' + value;
  return 'https://developers.zomato.com/api/v2.1/cities?' + querystring;
}


export default class SearchPage extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false,
      message: '',
    };
  }

  _handleResponse = (res) => {
    this.setState({
      isLoading: false,
      message: '',
    });
    if (res.status === 'success') {
      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        passProps: {cities: res.location_suggestions}
      });
    } else {
      this.setState({message: 'Location not found, please try again.'});
    }
    }

  _onSearchTextChange = (event) => {
    console.log('_onSearchTextChange');
    console.log('This is my key:', ZOMATO_KEY)
    this.setState({
      searchString: event.nativeEvent.text });
    console.log('Current: ', this.state.searchString, ', Next: ', event.nativeEvent.text);
  }

  _executeQuery = (query) => {
    console.log(query);
    this.setState({
      isLoading: true
    })
    fetch(query, {
      method: 'GET',
      headers: {
        'user-key': ZOMATO_KEY,
        'crossDomain': true,
      },
    })
    .then(res => res.json())
    .then(json => this._handleResponse(json))
    .catch(error =>
       this.setState({
        isLoading: false,
        message: 'Something bad happened ' + error
     }));
  }

  _onSearchPressed = () => {
    const query = urlForQueryAndPage('q', this.state.searchString);
    this._executeQuery(query);
  }

  render() {
    const spinner = this.state.isLoading ? 
      <ActivityIndicator size='large'/> : null;
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for Restaurants in your hood!
        </Text>
        <Text style={styles.description}>
          Search by city name. 
        </Text>
        <View style={styles.flowRight}>
          <TextInput 
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this._onSearchTextChange}
            placeholder='Search via name'/>
          <Button 
            onPress={this._onSearchPressed}
            color='#48BBEC'
            title='Go'
          />
        </View>
        <Image source={require('./Resources/house.png')} style={styles.images}/>
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  }, 
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  searchInput: {
    height: 34, 
    padding: 4, 
    marginRight: 5,
    flexGrow: 1, 
    fontSize: 18, 
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  image: {
    width: 217,
    height: 138
  }
})