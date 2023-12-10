import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { listMyResults } from '../actions/resultActions'

export default function ResultScreen() {
    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { error, loading, user } = userDetails 
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin 

    const resultListMy = useSelector(state => state. resultListMy)
    const { loading: loadingResults, error: errorResults, results } =  resultListMy

    const history = useNavigate()
    useEffect(() => {
        if (!userInfo) {
            history('/login')
        } else {
                dispatch(listMyResults())
        }
    }, [dispatch, history, userInfo])
    
    return (
        <Row>
            <Col md={15} className='col-margin-top'>
                <h2>Kết quả của bạn</h2>
                {loadingResults ? (
                    <Loader />
                ) : errorResults ? (
                    <Message variant='danger'>{errorResults}</Message>
                ) : (
                            <Table striped responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>Ngày thực hiện</th>
                                        <th>Đề thi</th>
                                        <th>Câu 1</th>
                                        <th>Nội dung bạn nói</th>
                                        <th>Đoạn ghi âm</th>
                                   
                                        <th>Câu 2</th>
                                        <th>Nội dung bạn nói</th>
                                        <th>Đoạn ghi âm</th>
                                        
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {results.map(result => (
                                        <tr key={result._id}>
                                            <td>{result.createdAt.substring(0, 10)}</td>
                                            <td>{result.testName}</td>
                                            <td>{result.question1}</td>
                                            <td>{result.answer1}</td>
                                            <td><audio controls src={result.audioURL1} /></td>
                                            <td>{result.question2}</td>
                                            <td>{result.answer2}</td>
                                            <td><audio controls src={result.audioURL2} /></td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
            </Col>
        </Row>
    )
}