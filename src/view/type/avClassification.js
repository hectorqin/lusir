/*
*  @flow
        新订单
*/
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity,
    DeviceEventEmitter,
    RefreshControl,
    ActivityIndicator,
    ScrollView
} from 'react-native';

import PropTypes from 'prop-types';
import color from '../../Component/Color';
import AvListItem from './component/avListItem';


const { height, width } = Dimensions.get('window');

export default class AvClassification extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [{ id: 0, name: '彭于晏', collection: 0 }, { id: 1, name: '彭于晏', collection: 1 }, { id: 2, name: '彭于晏' }, { id: 3, name: '彭于晏' }, { id: 4, name: '彭于晏' }, { id: 5, name: '彭于晏', collection: 0 }, { id: 6, name: '彭于晏', collection: 1 }, { id: 7, name: '彭于晏' }, { id: 8, name: '彭于晏' }, { id: 9, name: '彭于晏' }, { id: 10, name: '彭于晏', collection: 0 }, { id: 11, name: '彭于晏', collection: 1 }, { id: 12, name: '彭于晏' }, { id: 13, name: '彭于晏' }, { id: 14, name: '彭于晏' }],
        }
        this.noData = false;

    };

    static propTypes = {

    };
    static defaultProps = {

    };

    componentWillMount() {

        //定义全局变量this.page
        this.page = 1;//新订单页码
        this.jiazaiSign = 1;//加载标记
        this.subs = [this.props.addListener('didFocus', () => {


        })];


        this.registerEvent();
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
        this.listener.remove();
    }


    registerEvent() {

        /**
         * 广播事件
         */
        this.listener = DeviceEventEmitter.addListener(
            'Fresh',
            (data) => {
            }
        );
    }


    refresh = () => {
        this.noData = false;

        this.jiazaiSign = 0;
        this.page = 1;//页码变为1
        //this.getNewOrder();

    }

    getMore = () => {
        if (this.noData) {
            return;
        }



        this.jiazaiSign = 1;
        //有待查一下总数
        if (this.state.data.length < this.page * 10) {
            //实际总数少于页码*数量总数，页数不加1，还是查当前那一页码
            //前提是第一页从1开始，0另算
        } else {
            this.page = this.page + 1;//（如果上次查询结果报错，由于上一步走了this.page = this.page + 1则this.state.data.length < this.page * 10，不会再走这一步）
        }
        //this.getNewOrder();

    }


    onPress = (id) => {
        alert(id);
    }
    renderItem = ({ item }) => {

        return (
            <AvListItem
                data={item}
                onPress={this.onPress}
            />
        );
    }


    genIndicator = () => { //底部加载(一个圆圈)

        return (
            this.noData ? (
                <View style={styles.dixian}>
                    <Text style={{ color: 'gray' }}>{'我也有底线的，撸不动了...'}</Text>
                </View>
            ) :
                (<View style={styles.indicatorContainer}>
                    <ActivityIndicator
                        style={styles.indicator}
                        size={'large'}
                        color={color.saffron_yellow}
                        animating={true}
                    />
                    <Text>正在加载更多</Text>
                </View>)


            // (<View style={styles.indicatorContainer}>
            //     <ActivityIndicator
            //         style={styles.indicator}
            //         size={'large'}
            //         color={color.saffron_yellow}
            //         animating={true}
            //     />
            //     <Text>正在加载更多</Text>
            // </View>)
        )
    };

    separator = () => {
        return (
            <View style={{ width: width, height: 10 }}>

            </View>
        );
    }


    EmptyComponent = () => {
        return (
            <View style={styles.emptyComponent}>
                {/* <Image
                    resizeMode={'contain'}
                    source={require('../../images/home/order.png')}
                    style={{ width: 60, height: 60 }}
                /> */}
                <Text style={styles.text}>暂无资源</Text>
            </View>
        );
    }


    render() {
        return (

            <View style={styles.container}>

                <FlatList
                    keyExtractor={item => item.id}
                    ref={(flatList) => this._flatList = flatList}
                    data={this.state.data}
                    ListFooterComponent={this.genIndicator}
                    //ItemSeparatorComponent={this.separator}
                    ListEmptyComponent={this.EmptyComponent}
                    numColumns={3}
                    renderItem={this.renderItem}
                    //onRefresh={this.refresh}//onRefresh refreshing 同在
                    //refreshing={false}//refreshing  onRefresh 同在
                    //onEndReachedThreshold={0}
                    // onEndReached={
                    //     this._onload
                    // }
                    //2:自定义的下拉刷新
                    refreshControl={        //为控制listView下拉刷新的属性  用于自定义下拉图标设置
                        <RefreshControl         //这一组件可以用在ScrollView或ListView内部，为其添加下拉刷新的功能。
                            colors={[color.saffron_yellow]}//android的刷新图标颜色
                            refreshing={false}//判断是否正在刷新
                            onRefresh={() => {                  //触动刷新的方法
                                this.refresh()//加载数据(带参数)
                            }}
                        />
                    }
                    onEndReached={() => {//当所有的数据都已经渲染过，并且列表被滚动到距离最底部时调用
                        if (!this.state.isLoading) {
                            this.getMore()//加载数据（不带参数）
                        }
                    }}
                    horizontal={false}


                >
                </FlatList>

                {/* <Loading isLoading={this.state.isLoading} /> */}
            </View >
        )
    }
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: color.background,
        backgroundColor: '#FFFFFF',
        padding: width * 0.01
    },
    text: {
        color: 'gray',
        fontSize: 14,
        marginTop: 10
    },
    scutcheon: {
        padding: 5,
        borderWidth: 1,
        borderColor: color.saffron_yellow,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollViewStyle: {
        marginLeft: 10,
    },
    letterView: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },





    emptyComponent: {
        width: width,
        height: height - 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        margin: 10
    },
    dixian: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 40
    }


})
