import React, {Component} from 'react'
import moment from 'moment/moment'

class DateTime extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            date: new Date()    ,
        }
    }

    tick() {
        this.setState({ date: new Date() })
    }

    componentDidMount() {
        this.interval = setInterval(this.tick.bind(this), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    render() {
        return (
            <span>
                {moment(this.state.date).format('dddd / LL / A hh:mm:ss')}
            </span>
        )
    }
}

export default DateTime