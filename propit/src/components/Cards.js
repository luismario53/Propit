import React, { Component } from 'react';
import firebase from 'firebase';
// import 'firebase/database';
import { Col, Row, Container, Form, Button, Navbar,FormControl} from 'react-bootstrap';
import '../assets/css/cards.css';
import check from '../assets/images/check.svg';
import check2 from '../assets/images/check-2.svg';
import close from '../assets/images/close.png';
import Swal from 'sweetalert2';
import random from 'randomstring';

class Cards extends Component {

  timeOut;
  productoRef = React.createRef();

  constructor(props) {
    super(props)
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.handleButtonRelease = this.handleButtonRelease.bind(this);
    this.codigoChange = this.codigoChange.bind(this);
    this.state = {
      codigo: '',
      navExpanded: false,
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
    var grupo = localStorage.getItem('grupo');
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
          firebase.database().ref(grupo + "/" + id).remove();
        }
      })
    }, 500);
  }

  handleButtonRelease() {
    clearTimeout(this.buttonPressTimer);
  }

  componentDidMount = () => {

    // Reiniciar localStorage
    // localStorage.removeItem('grupo');

    //Se crea tu grupo si es la primera vez que entras
    if (localStorage.getItem('grupo') == null) {
      var grupo = random.generate(5);
      localStorage.setItem('grupo', grupo.toUpperCase());
      firebase.database().ref(grupo.toUpperCase()).set({
        exist: true
      });
    }

    // Si el usuario tiene una invitacion
    var grupo = '';
    localStorage.getItem('invitado') == null ? grupo = localStorage.getItem('grupo') : grupo = localStorage.getItem('invitado');

    // Se trae la lista del usuario
    firebase.database().ref(grupo).orderByChild('isComplete').on('value', snap => {
      var productos = [];
      snap.forEach(snapshot => {
        if (snapshot.val() !== true) {
          productos.push({
            producto: snapshot.val(),
            id: snapshot.key
          });
        }
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
    var grupo = '';
    localStorage.getItem('invitado') == null ? grupo = localStorage.getItem('grupo') : grupo = localStorage.getItem('invitado');
    if (this.productoRef.current.value !== '') {
      if (e.key === 'Enter') {
        e.preventDefault();
        var producto = this.firstChar(this.state.producto.toLowerCase());
        firebase.database().ref(grupo).push().set({
          nombre: producto,
          isComplete: false
        }, () => {
          this.productoRef.current.value = '';
        });
      }
    }
  }

  complete = (producto) => {
    var grupo = '';
    localStorage.getItem('invitado') == null ? grupo = localStorage.getItem('grupo') : grupo = localStorage.getItem('invitado');
    firebase.database().ref(grupo + "/" + producto.id).update({
      isComplete: !producto.producto.isComplete
    });
  }

  closeMenu = () => {
    this.setState({
      navExpanded: !this.state.navExpanded
    });
  }

  validarCodigo = () => {
    if (this.state.codigo.length === 5) {
      var codigo = this.state.codigo.toUpperCase();
      firebase.database().ref(codigo + '/exist').orderByChild('isComplete').on('value', snap => {
        if (snap.val()) {
          localStorage.setItem('invitado', codigo);
          this.componentDidMount();
          this.setState({
            navExpanded: false
          });
        } else {
          this.setState({
            codigo: ''
          });
          Swal.fire({
            text: 'Parece que el grupo no existe.',
            icon: 'error',
            confirmButtonColor: '#a83632',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  codigoChange = (event) => {
    this.setState({
      codigo: event.target.value
    })
  }

  compartirCodigo = () => {
    var grupo = localStorage.getItem('grupo');
    Swal.fire({
      title: "Sólo un paso más",
      text: 'Comparte este código con las personas que quieras invitar a tu lista. ' + grupo,
      icon: 'success',
      confirmButtonColor: '#37C339',
      confirmButtonText: 'Aceptar'
    });
  }

  abandonarGrupo = () => {
    Swal.fire({
      text: '¿Esta seguro que desea abandonar la lista?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Nooo',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.value) {
        localStorage.removeItem('invitado');
        this.componentDidMount();
        this.setState({
          navExpanded: false
        });
      }
    })
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
        {this.state.navExpanded &&
          <Container fluid className="menu-movil">
            <img alt="imagen de cerrar" className="cerrar-menu" src={close} onClick={this.closeMenu}></img>
            <Row>
              <Col className="opciones">
                {!localStorage.getItem('invitado') &&
                  <Button onClick={this.compartirCodigo}>Invitar a alguien más</Button>
                }
                {localStorage.getItem('invitado') ? (
                  <Button onClick={this.abandonarGrupo}>Abandonar lista</Button>
                ) : (
                  <div className="codigo text-right">
                    <FormControl maxLength="5" value={this.state.codigo} onChange={this.codigoChange} className="grupo" type="text" placeholder="Código" />
                    <Button onClick={this.validarCodigo}>Ingresar</Button>
                  </div>
                )}

              </Col>
            </Row>
          </Container>
        }
        <Container fluid>
          <Row>
            <Col>
              <Navbar className="color-nav" expand="lg" expanded={this.state.navExpanded}>
                <Navbar.Brand href="#"><h1 className="h1-card">PROPIT</h1></Navbar.Brand>
                <Navbar.Toggle onClick={this.closeMenu} />
              </Navbar>
            </Col>
          </Row>
        </Container>
        {!this.state.loading ? (
          <Container className="container-card">
            <Row>
              <Col className="text-center">

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
                {/* <h1 className="h1-card">PROPIT</h1> */}
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