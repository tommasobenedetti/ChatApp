import React from 'react';
import { View, Text } from 'react-native';


export default class Chat extends React.Component {
    render() {
        // This will allow the user to enter it's name for the Chat app
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Hello Screen2!</Text>
            </View>
        )
    }
}