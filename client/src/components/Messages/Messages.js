import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

import closeIcon from '../../icons/closeIcon.png'
import onlineIcon from '../../icons/onlineIcon.png'

import Message from '../Message/Message'
import './Messages.css'

const Messages = ({ messages, name }) => (
    <ScrollToBottom>
        {messages.map((message, i) => <div key={i}><Message message={message} name={name} /></div>)}
    </ScrollToBottom>
)

export default Messages