import React from 'react';
import SwipeableFlatList from 'react-native-swipeable-list';
import {View, Text, AsyncStorage, StyleSheet,
        TouchableNativeFeedback, TouchableHighlight, ToastAndroid,
        Alert, Modal, ActivityIndicator,Button,ScrollView} from 'react-native';

   

export default class ManageAccounts extends React.Component {
    static navigationOptions = {
        title: 'Manage Accounts',
      };
      async componentDidMount() {
        record = await AsyncStorage.getItem('ACCOUNTS');
        rec = JSON.parse(record);
        this.setState({record: rec});
        this.setState({recordLoaded: true });
        this.setState({ActiveAccount: (JSON.parse(await AsyncStorage.getItem('ActiveAccount')))})
    }
    state = {
        recordLoaded: false,
    }

    renderSeparator = () => {
        return (
          <View
            style={styles.seperator}
          />
        );
    };

    render(){
        return(
            <ScrollView styles={styles.container}>
             <Text style={styles.info}>Accounts stored on your phone are listed below. Swipe
              on the account to be modified or removed.</Text>
              <Button
            title="Clear All Accounts"
            color="tomato"
            onPress={() => {
                Alert.alert('Remove All Accounts ?', 'Clicking yes will remove all accounts below. No further warnings will be prompted!',
                [
                    {text: 'No'},
                    {text: 'Yes', onPress: () => {
                        AsyncStorage.removeItem('ACCOUNTS')
                        ToastAndroid.show('All accounts removed.',ToastAndroid.SHORT)
                        this.props.navigation.navigate('AccountsHome');
                    }}
                ])
            }}
            />
            <View styles={styles.container}>
            {
                this.state.recordLoaded ? (
                   <SwipeableFlatList
                        ItemSeparatorComponent={this.renderSeparator}
                        bounceFirstRowOnMount={true}
                        maxSwipeDistance={160}
                        data={this.state.record}
                        renderItem={({item}) => 
                        <TouchableNativeFeedback 
                        style={styles.optionContent}
                        background={TouchableNativeFeedback.SelectableBackground()}
                        onPress={() => ToastAndroid.show('Only swiping is supported.',ToastAndroid.SHORT)
                    }
                        >
                        
                            <View style={styles.option}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.register}>{item.reg_no}</Text>
                            </View>
                        </TouchableNativeFeedback>  
                        }
                        renderQuickActions={({item}) => 
                        <View style={styles.actionsContainer}>
                        <TouchableHighlight
                          style={styles.actionButton}
                          onPress={() => {
                            this.props.navigation.navigate('ModifyAccount', {name:item.name,
                            key:item.key,password:item.password})
                          }}>
                          <Text style={styles.actionButtonText}>Edit</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                          style={[styles.actionButton, styles.actionButtonDestructive]}
                          onPress={() => {
                            Alert.alert('Remove Selected Account ?', 'Clicking yes will remove all records assosiated with the selected account.',
                            [
                                {text: 'No'},
                                {text: 'Yes', onPress: () => {
                                    index = this.state.record.findIndex(x => x.reg_no===item.reg_no);
                                    var all_rec = this.state.record
                                    all_rec.splice(index,1);
                                 new_value = JSON.stringify(all_rec);
                                 AsyncStorage.setItem('ACCOUNTS', new_value);
                                ToastAndroid.show(`Sucessfully Removed ${item.name}!`, ToastAndroid.SHORT);
                                 this.forceUpdate();
                                 try{
                                 if(this.state.ActiveAccount.key == item.key){
                                   AsyncStorage.removeItem('ActiveAccount')
                                 }} catch(err){
                                     console.log('No active accounts.')
                                 }
                                }},
                              ]
                        )
                        }}>
                        <Text style={styles.actionButtonText}>Remove</Text>
                      </TouchableHighlight>
                </View>
                        }
                   />
                ) : <View style={[styles.loading, styles.horizontal]}>
                        <ActivityIndicator size="large" color="tomato" />
                    </View>
               }
               </View>
            </ScrollView>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex:1,
       flexDirection: 'column'
    },
    info: {
        padding: 12,
        color: 'gray',
    },
    name: {
        fontSize: 18,
        justifyContent:'center',
      },
    register: {
        color: 'gray',
        justifyContent:'center',
    },
    seperator:{
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
    option: {
        padding:12,
        justifyContent:'center',
        backgroundColor:'white',
    },
    optionContent: {

    },
    actionButton: {
        padding: 10,
        width: 80,
        backgroundColor: 'limegreen',
      },
      actionButtonDestructive: {
        backgroundColor: 'tomato',
        
      },
      actionButtonText: {
        textAlign: 'center',
        color: 'white',
    },
    actionsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    loading: {
        flex: 1,
        justifyContent: 'center'
      },
      horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
      }
});
