import React, { Component } from 'react'
import { View, Text,Image } from 'react-native'
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'

class History extends Component {
    componentDidMount() {
        const {dispatch}=this.props
        fetchCalendarResults().then((entries) => dispatch(receiveEntries(entries)))
        .then(({entries}) => {
            if(!entries[timeToString()]){
                dispatch(addEntry({
                    [timeToString]:getDailyReminderValue()
                }))
            }
        })
        .then(() => this.setState({ready:true}))
    }   
    render(){
        return(
            <Text>{JSON.stringify(this.props)}</Text>
        )
    }
}

function mapStateToProps(entries){
    return{
        entries
    }
}

export default connect(mapStateToProps)(History)