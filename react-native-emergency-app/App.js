import React, { Component } from 'react'
import { StyleSheet, Button, View, TouchableOpacity, Text } from 'react-native'
import Police from './screens/Police'
import User from './screens/User'
import Login from './screens/Login'
import GenericContainer from './components/GenericContainer'
import PoliceOrUser from './screens/PoliceOrUser'
import SignUp from './screens/SignUp'
import UserMenu from './screens/UserMenu'

const PoliceWithGenericContainer = GenericContainer(Police)
const UserWithGenericContainer = GenericContainer(User)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPolice: false,
      isUser: false,
      token: '',
      createAccount: false
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(name, value) {
    this.setState({ [name]: value })
  }

  render() {

    if (this.state.createAccount) {
      return <SignUp handleChange={this.handleChange} />
    }

    if (this.state.token === '') {
      return <Login handleChange={this.handleChange} />
    }

    if (this.state.isPolice) {
      return <PoliceWithGenericContainer token={this.state.token} />
    }
    if (this.state.isUser) {
      return <UserMenu />
      //return <UserWithGenericContainer token={this.state.token} />
    }
    return <PoliceOrUser handleChange={this.handleChange} />
  }
}
