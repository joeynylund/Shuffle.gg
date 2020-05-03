import React, { useState, useEffect } from 'react';
import './App.css';
import { Link, useHistory } from 'react-router-dom';
import NavBar from './NavBar.js';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRandom } from '@fortawesome/free-solid-svg-icons'

function App({location}) {

  const history = useHistory()

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

      sessionStorage.removeItem('streams')
      sessionStorage.removeItem('time')

      if (window.location.hash) {

        var parsedHash = new URLSearchParams(window.location.hash.substr(1));

        var accessToken = parsedHash.get('access_token')

        var profile = await fetch('https://api.twitch.tv/helix/users',
          {
            "headers": {
                "Client-ID": 'jrhhhmgv1e73eq5qnswjqh2p3u1uqr',
                "Authorization": "Bearer " + accessToken
            }
          }
        )
        .then(resp => resp.json())
        .then(resp => {

          sessionStorage.setItem('auth', true)
          sessionStorage.setItem('profile_image', resp.data[0].profile_image_url)
          sessionStorage.setItem('display_name', resp.data[0].display_name)

          history.push('/')

        })

      }      

  }

  useEffect(() => {

    loadGames()
  
  }, []);

  return (

    <div className="App">

      <NavBar />
        
        <header className="App-header">

          <Container>

            
            <div><Row style={{justifyContent:"center"}}>

              <h1 style={{fontWeight:"bold", fontFamily:"Poppins", color:"#21FF8A"}}>Welcome to Shuffle.</h1>

            </Row>

            <Row style={{justifyContent:"center"}}>

              <h6 style={{fontFamily:"Poppins", color:"#21FF8A", marginBottom:"2rem"}}>Select a game you'd like to watch</h6>

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

            </Row></div>

          </Container>

        </header>

    </div>

  );
}

export default App;
