import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Test({ test }) {
    return (
        <Card className="my-3 p-3 rounded">
            <Link to ={`/test/${test._id}`}>
            </Link>

            <Card.Body>
                <Link to ={`/test/${test._id}`}>
                    <Card.Title as="div">
                        <strong>{test.name}</strong>
                    </Card.Title>
                </Link>                
            </Card.Body>
        </Card>
    )
}

export default Test;