import React from "react";

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Pressable,
    ImageBackground,
    TouchableOpacity,
    KeyboardAvoidingView,
} from "react-native";

import BackgroundImage from "../assets/background-image.png";

export default class Start extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            bgColor: this.colors.pink,
        };
    }

    // function to update the state with the new background color for Chat Screen chosen by the user
    changeBgColor = (newColor) => {
        this.setState({ bgColor: newColor });
    };

    colors = {
        red: "#890000",
        green: "#1DA01B",
        gold: "#9D7F15",
        pink: "#931560",
        blue: "#1B70A0",
    };

    render() {
        return (
            //Different components do differents things; View acts as a div from html
            <KeyboardAvoidingView
                style={styles.container}
                behavior="height"
                enabled>
                <ImageBackground
                    source={BackgroundImage}
                    resizeMode="cover"
                    style={styles.backgroundImage}
                >
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>ChatApp</Text>
                    </View>

                    <View style={styles.box1}>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => this.setState({ name: text })}
                                value={this.state.name}
                                placeholder="What is your name?"
                            />
                        </View>

                        <View style={styles.colorBox}>
                            <Text style={styles.chooseColor}>
                                {" "}
                                Pick your background color!{" "}
                            </Text>
                        </View>

                        <View style={styles.colorArray}>
                            <TouchableOpacity
                                accessible={true}
                                accessibilityLabel="red blackground"
                                accessibilityHint="Allows you to add a red background to the chat"
                                accessibilityRole="button"
                                style={styles.color1}
                                onPress={() => this.changeBgColor(this.colors.red)}
                            ></TouchableOpacity>
                            <TouchableOpacity
                                accessible={true}
                                accessibilityLabel="green blackground"
                                accessibilityHint="Allows you to add a green background to the chat"
                                accessibilityRole="button"
                                style={styles.color2}
                                onPress={() => this.changeBgColor(this.colors.green)}
                            ></TouchableOpacity>
                            <TouchableOpacity
                                accessible={true}
                                accessibilityLabel="gold blackground"
                                accessibilityHint="Allows you to add a gold background to the chat"
                                accessibilityRole="button"
                                style={styles.color3}
                                onPress={() => this.changeBgColor(this.colors.gold)}
                            ></TouchableOpacity>
                            <TouchableOpacity
                                accessible={true}
                                accessibilityLabel="pink blackground"
                                accessibilityHint="Allows you to add a pink background to the chat"
                                accessibilityRole="button"
                                style={styles.color4}
                                onPress={() => this.changeBgColor(this.colors.pink)}
                            ></TouchableOpacity>
                            <TouchableOpacity
                                accessible={true}
                                accessibilityLabel="blue blackground"
                                accessibilityHint="Allows you to add a blue background to the chat"
                                accessibilityRole="button"
                                style={styles.color5}
                                onPress={() => this.changeBgColor(this.colors.blue)}
                            ></TouchableOpacity>
                        </View>

                        <Pressable
                            accessible={true}
                            accessibilityLabel="Go to the chat page"
                            accessibilityHint="Allows you to go to the chat page"
                            accessibilityRole="button"
                            style={styles.button}
                            onPress={() =>
                                this.props.navigation.navigate("Chat", {
                                    name: this.state.name,
                                    bgColor: this.state.bgColor,
                                })
                            }
                        >
                            <Text style={styles.buttonText}>Start Chatting</Text>
                        </Pressable>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    backgroundImage: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    titleBox: {
        height: "50%",
        width: "88%",
        alignItems: "center",
        paddingTop: 100,
    },

    title: {
        fontSize: 45,
        fontWeight: "600",
        color: "#FFFFFF",
    },

    box1: {
        backgroundColor: "white",
        height: 250,
        width: "88%",
        justifyContent: "space-around",
        alignItems: "center",
    },

    inputBox: {
        borderWidth: 2,
        borderRadius: 1,
        borderColor: "grey",
        width: "88%",
        height: 60,
        paddingLeft: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    image: {
        width: 20,
        height: 20,
        marginRight: 10,
    },

    input: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 0.5,
    },

    colorBox: {
        marginRight: "auto",
        paddingLeft: 60,
        width: "88%",
    },

    chooseColor: {
        fontSize: 16,
        fontWeight: "300",
        color: "#757083",
        opacity: 1,
    },

    colorArray: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
    },

    color1: {
        backgroundColor: "#890000",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    color2: {
        backgroundColor: "#1DA01B",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    color3: {
        backgroundColor: "#9D7F15",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    color4: {
        backgroundColor: "#931560",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    color5: {
        backgroundColor: "#1B70A0",
        width: 50,
        height: 50,
        borderRadius: 25,
    },

    button: {
        width: "88%",
        height: 70,
        borderRadius: 8,
        backgroundColor: "#1D6085",
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});