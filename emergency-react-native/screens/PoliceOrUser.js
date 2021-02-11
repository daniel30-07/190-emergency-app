import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Image, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

export default class PoliceOrUser extends Component {
    render() {
        const onPressUser = () => this.props.handleChange('isUser', true)
        const onPressPolice = () => this.props.handleChange('isPolice', true)
        return (
            <LinearGradient
                colors={['#1840A4', '#FED840', '#EE4936']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <TouchableOpacity
                    style={styles.choiceContainer}
                    onPress={onPressUser}
                >
                    <Text style={styles.choiceText}>Eu preciso de ajuda</Text>
                    <Image
                        source={require('../images/target.png')}
                        style={styles.selectionImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.choiceContainer}
                    onPress={onPressPolice}
                >
                    <Text style={styles.choiceText}>Sou Policial</Text>
                    <Image
                        source={require('../images/policeman.png')}
                        style={styles.selectionImage}
                    />
                </TouchableOpacity>

            </ LinearGradient >

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    choiceContainer: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
    },
    choiceText: {
        marginBottom: 16,
        fontSize: 32,
        fontWeight: '200',
        textAlign: 'center',
        fontFamily: Platform.os === 'android' ? 'sans-serif-light' : undefined
    },
    selectionImage: {
        alignSelf: 'center',
        width: 180,
        height: 180,
    }
})
