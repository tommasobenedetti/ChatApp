import React from "react";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat'


export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            message: [],
        };
    }

    // Using component did mount to create the initial chat message and adding a bot image!
    componentDidMount() {
        let name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });

        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: '${name} has entered the chat',
                    createdAt: new Date(),
                    system: true,
                },
            ],
        });
    }

    onSend(messages = []) {
        this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    // This will render the bubbles for the chat
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "#9d9d9d",
                    },
                }}
            />
        );
    }

    // The view elements look like CSS but they are from React Native!
    render() {
        let { bgColor } = this.props.route.params;

        return (
            <View style={{
                flex: 1,
                backgroundColor: bgColor,
            }}>
                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />
                {Platform.OS === "android" ? (
                    <KeyboardAvoidingView behavior="height" />
                ) : null}
            </View>
        );
    }
}