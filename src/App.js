import React, { useState, useEffect } from 'react';
import './App.css';
import {Link} from 'react-router-dom';
import NavBar from './NavBar.js';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'

function App() {

  const [height, setHeight] = useState('433px');

  const [games, setGames] = useState([]);

  async function loadGames() {
  
    var token = ''

    var auth = await fetch('https://id.twitch.tv/oauth2/token?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&client_secret=ftkfalr4ztrnj1lpn1cgm61elygbxz&grant_type=client_credentials', {
      method: 'POST'
    }).then((response) => response.json())
    .then((data) => {
      token = 'Bearer ' + data.access_token;
    })
  
      var load = await fetch('https://api.twitch.tv/helix/games/top?first=12', {
      headers: {
        'Client-ID': 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
        'Authorization': token,
      }
      }).then((response) => response.json())
      .then((data) => {
        let i = 0
        data.data.forEach(game => {
          let newImagePath = game.box_art_url.replace('{width}', '271').replace('{height}', '328');
          let animation = 'fadeIns 0.5s' + ' ' + i + 's'

          let live = {
            id: game.id,
            name: game.name,
            image: newImagePath,
            css: animation
          }
          i = i + 0.125
          setGames(oldArray => [...oldArray, live])
        })
      })

      sessionStorage.clear()

  }

  useEffect(() => {

    loadGames()
  
  }, [height]);

  return (

    <div className="App">

      <NavBar />
        
        <header className="App-header">

          <Container>
             
            <Row style={{justifyContent:"center"}}>

              <h1 style={{fontWeight:"bold", fontFamily:"Poppins", color:"#22FF8A"}}>Welcome to Shuffle.</h1>

            </Row>

            <Row style={{justifyContent:"center"}}>

              <h6 style={{fontFamily:"Poppins", color:"#22FF8A", marginBottom:"2rem"}}>Select a game you'd like to watch</h6>

            </Row>

            <Row>

              {games.map(game => (
                
                  <Col xs={{ size: 8, offset: 2 }} sm={{ size: 4, offset: 0 }} md={{ size: 3, offset: 0 }} lg={{ size: 3, offset: 0 }} xl={{ size: 2, offset: 0 }} style={{marginBottom:"30px"}} className="hover">
                    <Link to={{
                  pathname: "/" + game.name,
                }}>
                    <img src={game.image} style={{borderRadius: "15px", width:"100%", height:"calc(100% - 30px)", animation: game.css}} className="animate hover2" />
                    <h6 style={{textAlign:"left", fontFamily:"Poppins", marginTop:"5px", marginBottom:"20px", animation: game.css}} className="animate">{game.name}</h6>
                    </Link>
                  </Col>

              ))}

            </Row>

          </Container>

        </header>

    </div>

  );
}

export default App;
