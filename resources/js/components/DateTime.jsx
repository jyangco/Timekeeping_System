import React, {Component} from 'react'
import moment from 'moment-timezone'

class DateTime extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            date: moment.tz('Asia/Manila'),
        }
    }

    tick() {
        this.setState({ date: moment.tz('Asia/Manila')})
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