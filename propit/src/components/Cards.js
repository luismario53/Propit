import React, { Component } from 'react';
import Board from 'react-trello';
import firebase from 'firebase';
import { Col, Row, Container, Form, Card, Button } from 'react-bootstrap';
import '../assets/css/cards.css';
import Swal from 'sweetalert2';

class Cards extends Component {

    nombreRef = React.createRef();
    descripcionRef = React.createRef();
    dificultadRef = React.createRef();

    constructor(props) {
        super(props)
        this.state = {
            habitos: {
                lanes: []
            },
            nombre: '',
            descripcion: '',
            dificultad: ''
        }
    }

    handleChange = () => {
        this.setState({
            nombre: this.nombreRef.current.value,
            descripcion: this.descripcionRef.current.value,
            dificultad: this.dificultadRef.current.value
        })
    }

    deleteCard = (cardId) => {
        firebase.database().ref("/habitos/lanes/-MPsaSAuYGrwiUo5ibQ-/cards/").once('value', snap => {
            snap.forEach(snapChild => {
                if (cardId === snapChild.val().id)
                    firebase.database().ref("/habitos/lanes/-MPsaSAuYGrwiUo5ibQ-/cards/" + snapChild.key).remove();
                Swal.fire({
                    title: 'Lo lograrás la próxima',
                    text: 'Has abandonado un hábito',
                    icon: 'error',
                    confirmButtonText: 'F'
                });
            });
        });
    }

    addCard = (e) => {
        var nombre = this.state.nombre;
        var descripcion = this.state.descripcion;
        var dificultad = this.state.dificultad;
        var id;

        e.preventDefault();
        if (nombre === '' || descripcion === '')
            return Swal.fire(
                'No tan rápido',
                'Falta información',
                'warning'
            )

        firebase.database().ref("/habitos/lanes/-MPsaSAuYGrwiUo5ibQ-/cards/").limitToLast(1).once('value', snap => {
            snap.forEach(snapChild => {
                id = parseInt(snapChild.val().id) + 1;
            });
        });

        if (id === undefined) id = 1;
        //CARDS
        firebase.database().ref("/habitos/lanes/-MPsaSAuYGrwiUo5ibQ-/cards").push().set({
            id: String(id),
            title: nombre,
            description: descripcion,
            label: 'Dificultad: ' + dificultad
        });

        //LANES
        // firebase.database().ref("/habitos/lanes/").push().set({
        //     id: "lane3",
        //     title: nombre,
        // });

        Swal.fire({
            title: 'Felicidades :)',
            text: 'Acaba de agregar un hábito',
            icon: 'success',
            confirmButtonText: 'Gracias'
        });
    }

    componentDidMount = () => {
        firebase.database().ref("/habitos/lanes/").on('value', snap => {
            var lanes = [];
            snap.forEach(snapshot => {
                var habito = snapshot.val();
                var habitos = [];
                snapshot.forEach(snap2 => {
                    snap2.forEach(snap3 => {
                        var aux = snap3.val();
                        habitos.push(aux);
                    })
                });
                lanes.push({
                    id: habito.id,
                    title: habito.title,
                    cards: habitos
                });
            });
            this.setState({
                habitos: {
                    lanes: lanes
                }
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
                                        <Form.Group>
                                            <Form.Control onChange={this.handleChange} ref={this.descripcionRef} style={{ resize: "none" }} as="textarea" placeholder="Descripción" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Control onChange={this.handleChange} ref={this.dificultadRef} type="text" placeholder="Dificultad" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Button onClick={this.addCard} variant="info">Guardar</Button>
                                        </Form.Group>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={9} lg={9} className="container-card">
                            <Board onCardDelete={this.deleteCard} data={this.state.habitos} />
                        </Col>
                    </Row>
                </Container>

            </div>
        )
    }
}

export default Cards;