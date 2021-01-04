import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import { Col, Row, Container, Form, Button } from 'react-bootstrap';
import '../assets/css/cards.css';
import check from '../assets/images/check.svg';
import check2 from '../assets/images/check-2.svg';
import Swal from 'sweetalert2';

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
                "a word",
                "another word pls",
                "littler than",
                "little",
                "big aserawe",
                "word",
                "another fuck wer wer",
                "yesqweqweqwe",
                "Sample 1",
                "a word more larger qweqwe qe",
                "another word pls",
                "littler than",
                "little qe",
                "big w",
                "word qr rq trq",
                "another fuck",
                "Sample 1",
                "a word",
                "another word pls",
                "littler than",
                "little",
                "big aserawe",
                "word",
                "another fuck wer wer",
                "yesqweqweqwe",
                "Sample 1",
                "a word more larger qweqwe qe",
            ]
        }
    }

    handleButtonPress(e, id) {
        this.buttonPressTimer = setTimeout(() => {
            Swal.fire({
                title: "<span className='no-selected'>Eliminando</span>",
                text: '¿Eliminar producto?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Nooo',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.value) {
                    firebase.database().ref("/compras/" + id).remove();
                }
            })
        }, 500);
    }

    handleButtonRelease() {
        clearTimeout(this.buttonPressTimer);
    }

    componentDidMount = () => {
        firebase.database().ref("compras").orderByChild('isComplete').on('value', snap => {
            var productos = [];
            snap.forEach(snapshot => {
                productos.push({
                    producto: snapshot.val(),
                    id: snapshot.key
                });
            })
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

    complete = (producto) => {
        firebase.database().ref("/compras/" + producto.id).update({
            isComplete: !producto.producto.isComplete
        });
    }

    render() {

        const { productos } = this.state;
        const listaProductos = productos.map((producto, index) => {
            return (
                <Button
                    onTouchStart={(e) => this.handleButtonPress(e, producto.id)}
                    onTouchEnd={this.handleButtonRelease}
                    onMouseDown={(e) => this.handleButtonPress(e, producto.id)}
                    onMouseUp={this.handleButtonRelease}
                    onMouseLeave={this.handleButtonRelease}
                    onClick={() => this.complete(producto)}
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

        const samples = this.state.samples.map((sample, index) => {
            return (
                <Button key={index} className="sample-card">{sample}</Button>
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
                            <Col className="col-card">
                                <Form>
                                    <Form.Group>
                                        <Form.Control maxLength="27" onChange={this.handleChange} ref={this.productoRef} onKeyPress={this.guardarProducto} className="input-card" type="text" placeholder="Escribe aquí..." />
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="col-card">
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
                                <Col className="col-card">
                                    <Form>
                                        <Form.Group>
                                            <Form.Control maxLength="27" onChange={this.handleChange} ref={this.productoRef} onKeyPress={this.guardarProducto} className="input-card" type="text" placeholder="Escribe aquí..." />
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="col-card">
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