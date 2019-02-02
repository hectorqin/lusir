/*
 * @Author: {Wang Kai} 
 * @Date: 2019-01-23 15:36:45 
 * @Last Modified by: Wang Kai
 * @Last Modified time: 2019-01-31 14:06:28
 * @Describe 密码锁 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Alert,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Image,
    TouchableOpacity,
    Modal,
    Dimensions,
    DeviceEventEmitter
} from 'react-native';
import color from '../../Component/Color';
import Dimension from '../../Component/Dimension';
import { ToastShort } from '../../Component/Toast';
import Icon from 'react-native-vector-icons/FontAwesome';

var whitchone = 1;

var { height, width } = Dimensions.get('window');

export default class CodeLock extends React.PureComponent {
    //构造方法
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            inputPwd: "",
            imputPwd2: '',
            msg: "请输入密码",
            msgs: '',
            code: false,
            lock: ''
        };
    }

    static navigationOptions = ({ navigation }) => {

        goback = () => {
            navigation.pop();
            DeviceEventEmitter.emit('lock', { lock: !navigation.state.params.falseSwitchIsOn });
        }

        return {
            headerTitle: navigation.state.params.falseSwitchIsOn == true ? '设置密码锁' : '取消密码锁',
            //导航栏的title的style
            headerTitleStyle: {
                color: color.white,
                //居中显示
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 16,
            },
            headerLeft: <TouchableOpacity onPress={this.goback} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                    name={'backward'}
                    size={20}
                    color={'gray'}
                />
            </TouchableOpacity>,
            //是否允许右滑返回，在iOS上默认为true，在Android上默认为false
            gesturesEnabled: true,
            headerStyle: { backgroundColor: color.saffron_yellow, height: 40 },
        };
    }

    UNSAFE_componentWillMount() {
        let code = this.props.navigation.state.params.falseSwitchIsOn;
        console.log(code)
        if (code == false) {
            storage.load({
                key: 'lock',
            }).then(ret => {
                if (ret == null) {
                    this.setState({
                        lock: ''
                    });
                }
                this.setState({
                    lock: ret
                });
            }).catch(err => {
                console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        // TODO;
                        break;
                    case 'ExpiredError':
                        // TODO
                        break;
                }
            })
        }
    }

    //刷新密码状态
    renderPwd() {
        var vi = [];
        var inputPwd = this.state.inputPwd;
        for (var i = 0; i < 6; i++) {
            if (i <= inputPwd.length - 1) {
                vi.push(<View key={i} style={styles.blackPoint}></View>);
            } else {
                vi.push(<View key={i} style={styles.whitePoint}></View>);
            }
        }
        return vi;
    }

    // renderView() {
    //     if (this.state.locked) {
    //         return (
    //             <TouchableOpacity onPress={() => this.showPwdView()}>
    //                 <Text style={{ fontSize: 20 }}>点击解锁</Text>
    //             </TouchableOpacity>
    //         );
    //     } else {
    //         return (
    //             <Text style={{ fontSize: 20 }}>已解锁</Text>
    //         );
    //     }
    // }

    pressNum(num) {
        let code = this.props.navigation.state.params.falseSwitchIsOn;
        if (code == true) {

            var pwd = this.state.inputPwd;
            this.setState({
                inputPwd: pwd + "" + num,
            });
            this.renderPwd();
            setTimeout(() => {
                var inputPwd = this.state.inputPwd;
                var inputPwd2 = this.state.inputPwd2;
                if (pwd.length == 5) {
                    if (inputPwd2 == inputPwd) {
                        this.setState({
                            msg: '密码正确'
                        })

                        storage.save({
                            key: 'lock', // Note: Do not use underscore("_") in key!
                            data: inputPwd2
                        });

                        this.props.navigation.pop();
                    } else {
                        if (this.state.code == false) {
                            this.setState({
                                inputPwd2: inputPwd,
                                inputPwd: "",
                                msg: '请再次输入密码',
                                code: true,
                            });
                        } else {
                            this.setState({
                                msg: '两次输入的密码不一致',
                                inputPwd: "",
                            })

                            setTimeout(() => {
                                this.setState({
                                    inputPwd2: inputPwd,
                                    inputPwd: "",
                                    msg: '请再次输入密码',
                                });
                            }, 1000);
                        }


                    }
                }
            }, 10);
        } else {
            var pwd = this.state.inputPwd;
            this.setState({
                inputPwd: pwd + "" + num,
            });
            this.renderPwd();
            setTimeout(() => {
                var inputPwd = this.state.inputPwd;
                var lock = this.state.lock;
                if (pwd.length == 5) {
                    if (lock == inputPwd) {
                        storage.remove({
                            key: 'lock'
                        });
                        this.props.navigation.pop();
                    } else {

                        this.setState({
                            msg: '密码不正确',
                            inputPwd: "",
                        })

                        setTimeout(() => {
                            this.setState({
                                inputPwd: "",
                                msg: '请再次输入密码',
                            });
                        }, 1000);
                    }
                }
            }, 10);
        }
    }

    deleteNum() {
        var pwd = this.state.inputPwd;
        pwd = pwd.substring(0, pwd.length - 1);
        this.setState({
            inputPwd: pwd,
        });
        this.renderPwd();
    }

    cancel() {
        this.props.navigation.pop();
        DeviceEventEmitter.emit('lock', { lock: !this.props.navigation.state.params.falseSwitchIsOn });
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2A3740', paddingLeft: 30, paddingRight: 30 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 16, color: '#fff' }}>{this.state.msg}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60 }}>
                        {this.renderPwd()}
                    </View>
                    <View style={{ width: width - 60, }}>
                        <View style={styles.row}>
                            <NumComp num="1" pressNum={() => this.pressNum(1)} />
                            <NumComp num="2" pressNum={() => this.pressNum(2)} />
                            <NumComp num="3" pressNum={() => this.pressNum(3)} />
                        </View>
                        <View style={styles.row}>
                            <NumComp num="4" pressNum={() => this.pressNum(4)} />
                            <NumComp num="5" pressNum={() => this.pressNum(5)} />
                            <NumComp num="6" pressNum={() => this.pressNum(6)} />
                        </View>
                        <View style={styles.row}>
                            <NumComp num="7" pressNum={() => this.pressNum(7)} />
                            <NumComp num="8" pressNum={() => this.pressNum(8)} />
                            <NumComp num="9" pressNum={() => this.pressNum(9)} />
                        </View>
                        <View style={styles.row}>
                            <NumComp num="取消" textStyle={{ fontSize: 16 }} style={{ borderWidth: 0 }} pressNum={() => this.cancel()} />
                            <NumComp num="0" pressNum={() => this.pressNum(0)} />
                            <NumComp num="删除" textStyle={{ fontSize: 16 }} style={{ borderWidth: 0 }} pressNum={() => this.deleteNum()} />
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

class NumComp extends React.Component {
    render() {
        return (
            <View style={[styles.gridView,]}>
                <TouchableOpacity activeOpacity={0.1} onPress={this.props.pressNum}>
                    <View style={[styles.cycle, this.props.style]}>
                        <Text style={[styles.numText, this.props.textStyle]}>{this.props.num}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        height: 60,
        marginTop: 10,
        marginBottom: 10,
    },
    whitePoint: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 1,
        margin: 5,
    },
    blackPoint: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 1,
        margin: 5,
        backgroundColor: 'white',
    },
    gridView: {
        flex: 1,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cycle: {
        height: 60,
        width: 60,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 30,
        borderColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: '#2A3740',
        justifyContent: 'center',
        alignItems: 'center',
    },
    numText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    indicator: {
        margin: 10
    },
    indicatorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },

});