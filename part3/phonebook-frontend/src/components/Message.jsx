const Message = ({ text, isError }) => {
    const messageStyle = {
        color: isError ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: '20px',        
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
        visibility: (text===null) ? 'hidden' : 'visible'
    }

    return (
        <div style={messageStyle}>
            {text}
        </div>
    )
}

export default Message