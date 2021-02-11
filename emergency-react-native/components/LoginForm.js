import React, { Component } from 'react'
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
export default class LoginForm extends Component {
    render() {
        return (
            <View>
                <TextInput
                    style={styles.input}
                    placeholder='seu@email.com'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                    placeholderTextColor='#D1D1D1'
                    value={this.props.email}
                    onChangeText={(email) => this.props.handleChange('email', email)}
                />
                <TextInput
                    style={styles.input}
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry
                    placeholder='senha'
                    placeholderTextColor='#D7D7D7'
                    value={this.props.password}
                    onChangeText={(password) => this.props.handleChange('password', password)}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.props.handleSignIn}
                >
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.create}
                    onPress={this.props.handleSignUp}
                >
                    <Text style={styles.create}>Criar conta</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        padding: 5,
        marginBottom: 10,
        marginRight: 30,
        marginLeft: 30,
        backgroundColor: 'rgba(0,0,0,0.2)',
        color: '#fff',
        textAlign: 'center',
        fontSize: 17,
        borderRadius: 20
    },
    button: {
        borderRadius: 20,
        backgroundColor: '#EE4936',
        paddingVertical: 10,
        marginVertical: 10,
        marginRight: 30,
        marginLeft: 30,

    },
    buttonText: {
        textAlign: 'center',
        fontSize: 25,
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
        fontWeight: '200',
    },
    create: {
        color: '#111',
        textAlign: 'center',
        fontSize: 25,
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
        fontWeight: '200',
    }
})
