import React from "react";
import { View, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"; import "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';


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
        };


        //initializing firebase

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        // reference to the Firestore messages collection

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
            });
        });
        this.setState({
            messages: messages,
        });
    };

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

    // Using component did mount to create the initial chat message and adding a bot image!
    componentDidMount() {
        let { name } = this.props.route.params;
        // This will add the user name at the top of the screen
        this.props.navigation.setOptions({ title: name });

        NetInfo.fetch().then((connection) => {
            if (connection.isConnected) {
                this.setState({ isConnected: true });
                console.log("online");
                // Will check for collection updates
                this.unsubscribe = this.referenceChatMessages
                    .orderBy("createdAt", "desc")
                    .onSnapshot(this.onCollectionUpdate);

                this.authUnsubscribe = firebase
                    .auth()
                    .onAuthStateChanged(async (user) => {
                        if (!user) {
                            await firebase.auth().signInAnonymously();
                        }

                        this.setState({
                            uid: user.uid,
                            messages: [],
                            user: {
                                _id: user.uid,
                                name: name,
                                avatar: "https://placeimg.com/140/140/any",
                            },
                        });
                        this.refMsgsUser = firebase
                            .firestore()
                            .collection("messages")
                            .where("uid", "==", this.state.uid);
                    });
                this.saveMessages();
            } else {
                // When the user is offline!
                this.setState({ isConnected: false });
                console.log("offline");
                this.getMessages();
            }
        });
    }

    componentWillUnmount() {
        //unsubscribe from collection updates
        this.authUnsubscribe();
        this.unsubscribe();
    }

    // Add messages to database
    addMessages() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || "",
            createdAt: message.createdAt,
            user: this.state.user,
            image: message.image || "",
            location: message.location || null,
        });
    }


    //attaches messages to chat
    onSend(messages = []) {
        this.setState(
            (previousState) => ({
                messages: GiftedChat.append(previousState.messages, messages),
            }),
            () => {
                this.addMessages();
                this.saveMessages();
            }
        );
    }

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

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return <InputToolbar {...props} />;
        }
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
                    messages={this.state.messages}
                    user={this.state.user}
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