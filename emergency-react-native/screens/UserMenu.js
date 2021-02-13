import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

export default class UserMenu extends Component {
    render() {
        return (
            <Card style={styles.card}>
                <Card.Title title="Card Title" subtitle="Card Subtitle" left={(props) => <Avatar.Icon {...props} icon="folder" />} />
                <Card.Content>
                    <Title>Card title</Title>
                    <Paragraph>Card content</Paragraph>
                </Card.Content>
                <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                <Card.Actions>
                    <Button>Cancel</Button>
                    <Button>Ok</Button>
                </Card.Actions>
            </Card>

        )
    }
}
const styles = StyleSheet.create({
    card: {

    }
});