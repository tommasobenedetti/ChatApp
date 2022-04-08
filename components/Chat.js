import React from "react";
import { View, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import * as firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDbGj4FltGaht04E20DuX3dxaZY3XdddX4",
    authDomain: "chatapp-2d39f.firebaseapp.com",
    projectId: "chatapp-2d39f",
    storageBucket: "chatapp-2d39f.appspot.com",
    messagingSenderId: "541513961857",
};


export default class Chat extends React.Component {
    constructor(props) {
        super();
        this.state = {
            messages: [],
            uid: 0,
            user: {
                _id: "",
                name: "",
                avatar: "",
            },
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        this.referenceChatMessages = firebase.firestore().collection("messages");
    }

    // Component did mount to create the initial chat message and adding a bot image!

    componentDidMount() {

        let { name } = this.props.route.params;
        // This will add the name at the top of the screen
        this.props.navigation.setOptions({ title: name });

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                await firebase.auth().signInAnonymously();
            }

            //update user state with currently active user data

            this.setState({
                uid: user.uid,
                messages: [],
                user: {
                    _id: user.uid,
                    name: name,
                    avatar: "https://placeimg.com/140/140/any",
                },
            });

            this.unsubscribe = this.referenceChatMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
        });
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each of the documents
        querySnapshot.forEach((doc) => {
            // get the QueryDocumentSnapshot's data
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
            });
        });
        this.setState({
            messages: messages,
        });
    };

    componentWillUnmount() {
        //unsubscribe from collection updates
        this.authUnsubscribe();
        this.unsubscribe();
    }

    addMessages() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user,
        });
    }

    getMessages = async () => {
        let messages = "";
        try {
            messages = (await AsyncStorage.getItem("messages")) || [];
            this.setState({
                messages: JSON.parse(messages),
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    onSend(messages = []) {
        this.setState(
            (previousState) => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                this.addMessages();
            }
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
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.user._id,
                        name: this.state.name,
                        avatar: this.state.user.avatar,
                    }}
                />
                {Platform.OS === "android" ? (
                    <KeyboardAvoidingView behavior="height" />
                ) : null}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    giftedChat: {
        flex: 1,
        width: "75%",
        paddingBottom: 10,
        justifyContent: "center",
        borderRadius: 5,
    },
});