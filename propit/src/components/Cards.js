import React, { Component } from 'react';
import Board from 'react-trello';
import firebase from 'firebase';
import { Col, Row, Container, Form, Card, Button } from 'react-bootstrap';
import '../assets/css/cards.css';
import Swal from 'sweetalert2';

class Cards extends Component {

    productoRef = React.createRef();

    constructor(props) {
        super(props)
        this.state = {
            habitos: {
                lanes: []
            },
            producto: '',
        }
    }

    handleChange = () => {
        this.setState({
            producto: this.productoRef.current.value,
        })
    }

    addCard = (e) => {
        var producto = this.state.producto;

        e.preventDefault();
        if (producto === '')
            return Swal.fire(
                'No tan rápido',
                'Falta información',
                'warning'
            )

        firebase.database().ref("/compras/").push().set({
            producto: producto,
        });

    }

    componentDidMount = () => {
        firebase.database().ref("/compras").on('value', snap => {
            var productos = [];
            snap.forEach(snapshot => {
                console.log(snapshot.val());
            });
        });
    }

    render() {

        return (
            <div>
                <Container fluid>
                    <Row xs={1} md={1} lg={2}>
                        <Col md={3} lg={3} className="container-card">
                            <Card className="form-card">
                                <Card.Title style={{ paddingTop: "2.5%" }} className="form-card">
                                    Agregar Hábito
                                </Card.Title>
                                <Card.Body className="form-card">
                                    <Form>
                                        <Form.Group>
                                            <Form.Control onChange={this.handleChange} ref={this.nombreRef} type="text" placeholder="Nombre del hábito" />
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>

            </div>
        )
    }
}

export default Cards;