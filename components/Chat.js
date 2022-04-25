import React from "react";
import { View, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import * as firebase from 'firebase';
import "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';



//configuring firebase keys
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
            image: null,
            location: null
        };


        //initializing firebase

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // reference to the Firestore "messages" collection

        this.referenceChatMessages = firebase.firestore().collection("messages");
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
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar,
                },
                image: data.image || null,
                location: data.location || null,
            });
        });
        this.setState({
            messages: messages,
        });
        this.saveMessages();
    };

    // get messages from AsyncStorage

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

    // save messages on the asyncStorage
    async saveMessages() {
        try {
            await AsyncStorage.setItem(
                "messages",
                JSON.stringify(this.state.messages)
            );
        } catch (error) {
            console.log(error.message);
        }
    }

    // delete message from asyncStorage
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem("messages");
            this.setState({
                messages: [],
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    // Using component did mount to create the initial chat message and adding a bot image!
    componentDidMount() {
        // Set the page title once Chat is loaded
        let { name } = this.props.route.params;
        // This will add the user name at the top of the screen
        this.props.navigation.setOptions({ title: name });
        // check if user is online
        NetInfo.fetch().then((connection) => {
            if (connection.isConnected) {
                this.setState({ isConnected: true });
                console.log("online");
                // check for collection updates
                this.unsubscribe = this.referenceChatMessages
                    .orderBy("createdAt", "desc")
                    .onSnapshot(this.onCollectionUpdate);
                // user authentication
                this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
                    if (!user) {
                        return await firebase.auth().signInAnonymously();
                    }
                    //update user state with currently active user data
                    this.setState({
                        uid: user.uid,
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: "https://placeimg.com/140/140/any",
                        },
                    });

                    //referencing messages of current user
                    this.refMsgsUser = firebase
                        .firestore()
                        .collection("messages")
                        .where("uid", "==", this.state.uid);
                });
            } else {
                // when the user is offline!
                this.setState({ isConnected: false });
                console.log("offline");
                this.getMessages();
            }
        });
    }

    // Add messages to database
    addMessages() {
        const message = this.state.messages[0];
        // add a new message to the collection
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || "",
            location: message.location || null
        });
    }

    // Returns a mapview when user adds a location to current message
    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    // action button to access custom features
    renderCustomActions(props) {
        return <CustomActions {...props} />;
    }

    //attaches messages to chat
    onSend(messages = []) {
        this.setState(
            previousState => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                this.saveMessages();
                this.addMessages();
            });
    }


    // handles the background color of the chat bubbles
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: { backgroundColor: "#59c3c3" },
                }}
            />
        );
    }

    //customizes input toolbar if online
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return <InputToolbar {...props} />;
        }
    }

    componentWillUnmount() {
        // close connections when we close the app
        NetInfo.fetch().then((connection) => {
            if (connection.isConnected) {
                this.unsubscribe();
                this.authUnsubscribe();
            }
        });
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
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
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
        justifyContent: 'center',
        paddingTop: 40,
    },
    item: {
        fontSize: 20,
        color: 'blue',
    },
    text: {
        fontSize: 30,
    }
});