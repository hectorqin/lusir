import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    Linking,
    Image,
    FlatList
} from 'react-native';
import PropTypes from 'prop-types';
import color from '../../../Component/Color';
import config from '../../../Component/Config';

const { height, width } = Dimensions.get('window');
export default class VideoListItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            collection: this.props.data.collection,
        }
    }
    static propTypes = {

    };
    static defaultProps = {

    };

    componentWillMount() {


    }

    componentDidMount() {

    }

    switch = (id) => {
        this.setState({
            collection:!this.state.collection
        });
    }

    render() {
        const { data, onPress } = this.props;
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => onPress && onPress(data.id)}>
                <View style={styles.itemList}>
                    <ImageBackground
                        resizeMode={'cover'}//contain
                        //source={{ uri: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2904972646,2757879593&amp;fm=26&amp;gp=0.jpg' }}
                        source={require('../../../images/type/pengyuyan.jpg')}
                        style={{ width: width*0.99 / 3.3, height: width*0.99 / 2.7, justifyContent: 'center', alignItems: 'center' }}
                        //imageStyle={{ borderRadius: width / 5.5 }}
                    />
                    <Text style={{ paddingTop: 3,paddingBottom:3}}>{data.name}</Text>
                </View>


            </TouchableOpacity>
        );
    }

}
const styles = StyleSheet.create({
    itemList: {
        width: width * 0.99 / 3,
        justifyContent: 'center',
        alignItems: 'center',
    },

});