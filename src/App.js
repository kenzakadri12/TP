import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Papa from 'papaparse';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Chart from 'chart.js/auto';
import GenreChart from './GenreChart';
import Menu from './Menu';
import { Navbar, Nav } from 'react-bootstrap';

const marques = [
  { nom: 'ADIDAS', image: 'https://static.vecteezy.com/system/resources/thumbnails/019/766/237/small_2x/adidas-logo-adidas-icon-transparent-free-png.png' },
  { nom: 'NIKE', image: 'https://i.pinimg.com/originals/20/60/2d/20602d43cc993811e5a6bd1886af4f33.png' },
  { nom: 'PUMA', image: 'https://static.vecteezy.com/system/resources/previews/017/339/634/original/puma-transparent-background-free-png.png' },
  { nom: 'VANS', image: 'https://www.pngmart.com/files/22/Vans-Logo-PNG-Photos.png' },
  { nom: 'REEBOK', image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Reebok_logo19.png'},
  { nom: 'CONVERSE', image: 'https://assets.stickpng.com/images/5a314c97cb9a85480a628f80.png' },
  { nom: 'NB', image: 'https://www.logo.wine/a/logo/New_Balance/New_Balance-Logo.wine.svg' },
  { nom: 'JORDAN', image: 'https://assets.stickpng.com/images/584292c4a6515b1e0ad75aca.png' },
  { nom: 'BALENCIAGA', image: 'https://download.logo.wine/logo/Balenciaga/Balenciaga-Logo.wine.png' },
];


function App() {
  //const [data, setData] = useState([]);
  const [personnes, setPersonnes] = useState([]);
  const [genreData, setGenreData] = useState({ Mme: 0, Mr: 0 });
  const [showGenreChart, setShowGenreChart] = useState(false);

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRMR2lIm2aoTC9uqC6L8yMtazMa5vjCxUPR0ETQsXz52B63Hnu6LMGp-0irFcvuj2LGOQlOWiRVCEe/pub?output=csv',
      {
        download: true,
        header: true,
        complete: (result) => {
          console.log('CSV Data:', result.data); 
          // Enregistrez les informations des personnes ici
          const personnesData = result.data.map((personData) => {
            const marquesPreferees = personData["Quelle est votre marque de baskets préférée ?"].split(", ");
            const basketsPreferees = marques.filter((marque) =>
              marquesPreferees.includes(marque.nom)
            );
            return {
              prenom: personData.Prénom,
              nom: personData.Nom,
              basketsPreferees: basketsPreferees,
              genre: personData.Genre,
            };
          });
          setPersonnes(personnesData);
          // Compter les réponses "Mme" et "Mr"
          const genreCount = personnesData.reduce((acc, personne) => {
            acc[personne.genre] = (acc[personne.genre] || 0) + 1;
            return acc;
          }, {});
          setGenreData(genreCount);

          console.log('CSV Data:', result.data); 
        },
      }
    );
  }, []);

  

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
       <Menu setShowGenreChart={setShowGenreChart} /> {/* Ajoutez le menu horizontal */}
      <Container>
        <h1>Marques</h1>
        {/* Affichez les informations des personnes ici */}
        {personnes.map((personne, index) => (
          <Row key={index}>
            <Col>
              <h2 style={{ textAlign: 'center' }}>
                {personne.prenom} {personne.nom}
              </h2>
              {/* Affichez les baskets préférées en un slider */}
              <Slider {...sliderSettings}>
                {personne.basketsPreferees.map((basket, index) => (
                  <div key={index} style={{ textAlign: 'center', margin: '10px' }}>
                    {/* Appliquez des styles personnalisés pour contrôler la taille de l'image */}
                    <img
                      src={basket.image}
                      alt={basket.nom}
                      style={{
                        maxWidth: '100px',
                        maxHeight: '100px',
                        display: 'block',
                        margin: '0 auto',
                        border: '2px solid #ccc', // Ajoutez une bordure de 2px en couleur grise
                        borderRadius: '10px', // Ajoutez un coin arrondi de 10px
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Ajoutez une ombre légère
                      }}
                    />
                  </div>
                ))}
              </Slider>
            </Col>
          </Row>
        ))}
      </Container>
      
      <div id="genre"> {/* Ajoutez cet élément autour de votre composant GenreChart */}
        {showGenreChart && <GenreChart data={genreData} />}
      </div>
    </div>
  );
  
}

export default App;
