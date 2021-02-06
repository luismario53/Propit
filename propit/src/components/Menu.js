import React, { Component } from 'react';
import { Col, Row, Container, Form, Card, Button, Table } from 'react-bootstrap';
import '../assets/css/menu.css';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import { clientId, clientSecret, redirectUrl } from '../utils/spotify';
import SpotifyWebApi from 'spotify-web-api-node';
import moment from 'moment';
import momentDuration from 'moment-duration-format';

class Cards extends Component {

  spotifyApi = new SpotifyWebApi();

  constructor(props) {
    super(props)
    this.state = {
      deviceId: '',
      items: [],
      duracion_ms: 0,
      duracion: '',
      queue: [],
      limit: 0
    }
  }

  componentDidMount = () => {
    momentDuration(moment);
    this.spotifyApi.setAccessToken(localStorage.getItem('token'));
    this.setState({
      deviceId: localStorage.getItem('deviceId')
    });
    this.getTracks();
  }

  handleToken = (token) => {
    localStorage.setItem('token', token);
  }

  getDevices = () => {
    this.spotifyApi.getMyDevices()
      .then(function (data) {
        localStorage.setItem('deviceId', data.body.devices[0].id);
      }, function (error) {
        console.log('Something went wrong!', error);
      });
  }

  getTracks = () => {
    var that = this;
    this.spotifyApi.getMySavedTracks({
      limit: 50,
      offset: this.state.limit
    })
      .then(function (data) {
        that.setState({ items: data.body.items, limit: that.state.limit + 50 });
        console.log(data);
      }, function (error) {
        console.log('Something went wrong!', error);
      });
  }

  toMinutes = (track) => {
    var minutes = moment.duration(track.duration_ms, 'milliseconds').format();
    return minutes;
  }

  addToQueue = (track) => {
    var that = this;
    this.spotifyApi.addToQueue(track.uri, this.state.deviceId)
      .then(function (data) {
        that.setState({
          duracion_ms: that.state.duracion_ms + track.duration_ms
        }, () => {
          var ms = that.state.duracion_ms;
          var minutes = moment.duration(ms, 'milliseconds').format();
          that.setState({
            duracion: minutes
          });
        });
      }, function (error) {
        console.log('Something went wrong!', error);
      });
  }

  render() {

    const items = this.state.items.map(item => {
      return <tr id={item.track.id} key={item.track.id}>
        <td style={{ textAlign: 'left' }}><div style={{ fontSize: 'calc(.9em + .9vw)' }}>{item.track.name}</div> <div style={{ fontSize: 'calc(.6em + .6vw)', marginLeft: '1%' }}>{item.track.artists[0].name}</div></td>
        <td className="sub-text" onClick={() => this.addToQueue(item.track)} style={{ cursor: 'pointer' }}><i className="fa fa-plus-circle fa-w"></i></td>
        <td className="sub-text">{this.toMinutes(item.track)}</td>
      </tr>
    })

    return (
      <div>
        {localStorage.getItem('token') ? (
          <Container className="container-class" fluid>
            <Card className="card-class">
              <Card.Body>
                <Form onSubmit={this.login}>
                  <Form.Group>
                    <h2>Spotify Queue Duration</h2>
                  </Form.Group>
                  <Form.Group>
                    <h6>Duración: {this.state.duracion}</h6>
                  </Form.Group>
                  {/* <Form.Group>
                    <Button onClick={() => { localStorage.removeItem('token'); }}>Remove Token</Button>
                  </Form.Group> */}
                </Form>
                <div className="scrolltable">
                  <Table style={{ borderRadius: '8px' }} size="sm" variant="dark">
                    <tbody>
                      {items &&
                        items
                      }
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Container>
        ) : (
            <SpotifyAuth
              redirectUri={redirectUrl}
              clientID={clientId}
              scopes={[Scopes.userReadPrivate,
              Scopes.userReadEmail,
              Scopes.userReadPlaybackState,
              Scopes.userLibraryRead,
              Scopes.userModifyPlaybackState,
              Scopes.userReadCurrentlyPlaying,
              Scopes.userModifyPlaybackState]}
              onAccessToken={(token) => this.handleToken(token)}
            />
          )}
      </div>
    )
  }
}

export default Cards;