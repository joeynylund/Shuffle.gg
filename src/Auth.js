import React, {useState,useEffect} from 'react';
import './App.css';
import { Container, Row, Navbar, NavbarBrand } from 'reactstrap';
import ReactGA from 'react-ga';

function App() {

    const [text, setText] = useState('')

    const NavBar2 = () => {
        return (
          <div>
            <Navbar color="dark" dark expand="md">
            <NavbarBrand href="/"><img src="./shuffle-logo.png" alt="Shuffle.gg Logo" width="200px" /></NavbarBrand>
            </Navbar>
          </div>
        );
      }

    async function auth() {

        var token = ''
    

    if (window.location.hash) {

        var auth = await fetch('https://id.twitch.tv/oauth2/token?client_id=jrhhhmgv1e73eq5qnswjqh2p3u1uqr&client_secret=ftkfalr4ztrnj1lpn1cgm61elygbxz&grant_type=client_credentials', {
      method: 'POST'
    }).then((response) => response.json())
    .then((data) => {
      token = 'Bearer ' + data.access_token;
    })

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

          localStorage.setItem('auth', true)
          localStorage.setItem('profile_image', resp.data[0].profile_image_url)
          localStorage.setItem('display_name', resp.data[0].display_name)

          window.close()
          setText("You're logged in! Feel free to close this tab and return to Shuffle!")

        })
        .catch(function(error){
          console.log('error')
        })

    }
}

useEffect(() => {

    ReactGA.initialize('UA-165630956-1');
    ReactGA.pageview(window.location.pathname);

    auth()
  
  }, []);



  return (

    <div className="App">

        <NavBar2 />
        
        <header className="App-header">

          <Container>

            <Row style={{justifyContent:"center"}}>

              <h2 style={{fontFamily:"Poppins", color:"#21FF8A", marginBottom:"2rem"}}>{text}</h2>

            </Row>

          </Container>

        </header>

    </div>

  );

}

export default App;
