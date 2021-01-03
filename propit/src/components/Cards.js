import React, { Component } from 'react';
import firebase from 'firebase';
import { Col, Row, Container, Form, Card, Button, FormControl } from 'react-bootstrap';
import '../assets/css/cards.css';
import check from '../assets/images/check.svg';
import check2 from '../assets/images/check-2.svg';
import LongPress from './useLongPress';

class Cards extends Component {

    timeOut;
    productoRef = React.createRef();

    constructor(props) {
        super(props)
        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.handleButtonRelease = this.handleButtonRelease.bind(this);
        this.state = {
            loading: false,
            isEnabled: null,
            producto: '',
            productos: [],
            samples: [
                "Sample 1",
                "a word more larger qweqwe",
                "another word pls",
                "littler than",
                "little",
                "big",
                "word",
                "another fuck",
                "yes",
                "Sample 1",
                "a word more larger qweqwe",
                "another word pls",
                "littler than",
                "little",
                "big",
                "word",
                "another fuck",
                "yes",
                "Sample 1",
                "a word more larger qweqwe",
                "another word pls",
                "littler than",
                "little",
                "big",
                "word",
                "another fuck",
                "yes",
            ]
        }
    }

    handleButtonPress(id) {
        this.buttonPressTimer = setTimeout(() => {
            firebase.database().ref("/compras/" + id).remove();
        }, 500);
    }

    handleButtonRelease() {
        clearTimeout(this.buttonPressTimer);
    }

    componentDidMount = () => {
        firebase.database().ref("/compras").on('value', snap => {
            var productos = [];
            snap.forEach(snapshot => {
                productos.push({
                    producto: snapshot.val(),
                    id: snapshot.key
                });
            });
            this.setState({
                productos: productos
            });
            setTimeout(() => {
                this.setState({ loading: true });
            }, 500);
        });
    }

    handleChange = () => {
        this.setState({
            producto: this.productoRef.current.value,
        })
    }

    firstChar = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    guardarProducto = (e) => {
        if (this.productoRef.current.value !== '') {
            if (e.key === 'Enter') {
                e.preventDefault();
                var producto = this.firstChar(this.state.producto.toLowerCase());
                firebase.database().ref("/compras/").push().set({
                    nombre: producto,
                    isComplete: false
                }, () => {
                    this.productoRef.current.value = '';
                });
            }
        }
    }

    complete = (id, isComplete) => {
        firebase.database().ref("/compras/" + id).update({
            isComplete: !isComplete
        });
    }

    render() {

        const { productos } = this.state;
        const listaProductos = productos.map((producto, index) => {
            return (
                <Button
                    id="ejemploBtn"
                    onTouchStart={() => this.handleButtonPress(producto.id)}
                    onTouchEnd={this.handleButtonRelease}
                    onMouseDown={() => this.handleButtonPress(producto.id)}
                    onMouseUp={this.handleButtonRelease}
                    onMouseLeave={this.handleButtonRelease}
                    onClick={() => this.complete(producto.id, producto.producto.isComplete)}
                    className="button-card" key={index}>
                    {producto.producto.nombre}
                    {producto.producto.isComplete === true ? (
                        <img alt="icono" className="check-card" src={check}></img>
                    ) : (
                            <img alt="icono" className="check-card" src={check2}></img>
                        )}
                </Button>
            );
        });

        const samples = this.state.samples.map(sample => {
            return (
                <Button className="sample-card">{sample}</Button>
            );
        });

        return (
            <div>
                {!this.state.loading ? (
                    <Container className="container-card">
                        <Row>
                            <Col className="text-center">
                                <h1 className="h1-card">PROPIT</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form>
                                    <Form.Group>
                                        <Form.Control maxLength="27" onChange={this.handleChange} ref={this.productoRef} onKeyPress={this.guardarProducto} className="input-card" type="text" placeholder="Escribe aquí..." />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {samples}
                            </Col>
                        </Row>
                    </Container>
                ) : (
                        <Container className="container-card">
                            <Row>
                                <Col className="text-center">
                                    <h1 className="h1-card">PROPIT</h1>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form>
                                        <Form.Group>
                                            <Form.Control maxLength="27" onChange={this.handleChange} ref={this.productoRef} onKeyPress={this.guardarProducto} className="input-card" type="text" placeholder="Escribe aquí..." />
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {listaProductos &&
                                        listaProductos
                                    }
                                </Col>
                            </Row>
                        </Container>
                    )}
            </div>
        )
    }
}

export default Cards;