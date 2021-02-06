import React, { Component } from 'react';
import { Container, Form, Card, Table, Row, Button } from 'react-bootstrap';
import '../assets/css/menu.css';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import { clientId, redirectUrl } from '../utils/spotify';
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
      limit: 0,
      searchedItems: [],
      search: false
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
        var items = that.state.items;
        Array.prototype.push.apply(items, data.body.items);
        that.setState({ searchedItems: items, items: items, limit: that.state.limit + 50 });
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

  handleScroll = (e) => {
    if ((e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) && !this.state.search)
      this.getTracks();
  }

  searchSongs = (e) => {
    var { searchedItems } = this.state;
    if (e.target.value.length >= 3) {
      var result = searchedItems.filter(item => item.track.name.toLowerCase().startsWith(e.target.value.toLowerCase()) || item.track.name.toLowerCase().includes(e.target.value.toLowerCase()));
      this.setState({ searchedItems: result, search: true });
    } else if (e.target.value.length === 0) {
      this.setState({ searchedItems: this.state.items, search: false });
    }
  }

  render() {

    const items = this.state.searchedItems.map(item => {
      return <tr id={item.track.id} key={item.track.id}>
        <td style={{ textAlign: 'left' }}><div style={{ fontSize: 'calc(.9em + .9vw)' }}>{item.track.name}</div> <div style={{ fontSize: 'calc(.6em + .6vw)', marginLeft: '1%' }}>{item.track.artists[0].name}</div></td>
        <td className="sub-text" onClick={() => this.addToQueue(item.track)} style={{ cursor: 'pointer' }}><i className="fa fa-plus-circle fa-w"></i></td>
        <td className="sub-text">{this.toMinutes(item.track)}</td>
      </tr>
    })

    return (
      <div>
        {localStorage.getItem('token') ? (
          <Container className="container-class" fluid onScroll={this.handleScroll}>
            <Row xs={1} sm={1}>
              <Form onSubmit={this.login}>
                <Form.Group>
                  <h2 className="text-title">Spotify Queue Duration</h2>
                </Form.Group>
                <Form.Group>
                  <h6 className="text-subtitle">Duración: {this.state.duracion}</h6>
                </Form.Group>
                {/* <Form.Group>
                    <Button onClick={() => { localStorage.removeItem('token'); }}>Remove Token</Button>
                  </Form.Group> */}
                <Form.Group>
                  <Form.Control type="text" onKeyUp={this.searchSongs.bind(this)} />
                </Form.Group>
              </Form>
            </Row>
            <Row xs={1} sm={1}>
              <Card className="card-class">
                <Card.Body>
                  <div className="scrolltable">
                    <Table style={{ borderRadius: '8px' }} size="sm" variant="dark">
                      <tbody>
                        {items &&
                          items
                        }
                      </tbody>
                    </Table>
                  </div>
                  {!this.state.search &&
                    <div>
                      <h4>Loading...</h4>
                    </div>
                  }
                </Card.Body>
              </Card>
            </Row>
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