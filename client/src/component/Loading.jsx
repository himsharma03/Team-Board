import React from 'react'

const Loading = ({show}) => {
    return show && (
       <Container className="text-center p-4">
        <Spinner size = 'lg'></Spinner>
        <p>Loading...</p>
       </Container>
    )
}

export default Loading