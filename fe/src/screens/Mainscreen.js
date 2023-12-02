import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { listTests } from '../actions/testActions';
import Test from '../components/Test';
import { useFetcher, useNavigate, useLocation } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'

export default function MainScreen() {
  const dispatch = useDispatch()
  const testList = useSelector(stage => stage.testList)
  const {error, loading, tests } = testList 

  useEffect(() => {
    dispatch(listTests())
   }, [])
    return(
      <div>
        <h1>HÃY CHỌN MỘT ĐỀ THI</h1>
        {loading ? <Loader />
          : error ? <Message variant='danger'>{error}</Message>
          :
          <div>
              <Row>
                  {tests.map(test => (
                      <Col key={test._id} sm={12} md={6} lg={4} xl={3}>
                          <Test test={test} />
                      </Col>
                  ))}
              </Row>
              
          </div>
        }
      </div>
    );
}