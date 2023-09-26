import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Papa from 'papaparse';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import GenreChart from './GenreChart';
import AgeChart from './AgeChart';
import PairsChart from './PairsChart';

const marques = [
  { nom: 'ADIDAS', image: 'https://static.vecteezy.com/system/resources/thumbnails/019/766/237/small_2x/adidas-logo-adidas-icon-transparent-free-png.png' },
  { nom: 'NIKE', image: 'https://i.pinimg.com/originals/20/60/2d/20602d43cc993811e5a6bd1886af4f33.png' },
  { nom: 'PUMA', image: 'https://static.vecteezy.com/system/resources/previews/017/339/634/original/puma-transparent-background-free-png.png' },
  { nom: 'VANS', image: 'https://www.pngmart.com/files/22/Vans-Logo-PNG-Photos.png' },
  { nom: 'REEBOK', image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Reebok_logo19.png'},
  { nom: 'CONVERSE', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmQnhp7rg1XS6VzpLqamujEyDfqDW2eLo6OrcpmcrEFO8XxR0YcwQhLcJyvpslMPS-x_Q&usqp=CAU' },
  { nom: 'NB', image: 'https://www.logo.wine/a/logo/New_Balance/New_Balance-Logo.wine.svg' },
  { nom: 'JORDAN', image: 'https://assets.stickpng.com/images/584292c4a6515b1e0ad75aca.png' },
  { nom: 'BALENCIAGA', image: 'https://download.logo.wine/logo/Balenciaga/Balenciaga-Logo.wine.png' },
];

function App() {
  const [data, setData] = useState([]);
  const [personnes, setPersonnes] = useState([]);
  const [showDetails, setShowDetails] = useState([]);

  const toggleDetails = (index) => {
    setShowDetails((prevState) => {
      const updatedShowDetails = [...prevState];
      updatedShowDetails[index] = !prevState[index];
      return updatedShowDetails;
    });
  };

  useEffect(() => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTRMR2lIm2aoTC9uqC6L8yMtazMa5vjCxUPR0ETQsXz52B63Hnu6LMGp-0irFcvuj2LGOQlOWiRVCEe/pub?output=csv',
      {
        download: true,
        header: true,
        complete: (result) => {
          setData(result.data);
          const personnesData = result.data.map((personData) => {
            const marquesPreferees = personData["Quelle est votre marque de baskets préférée ?"].split(", ");
            const basketsPreferees = marques.filter((marque) =>
              marquesPreferees.includes(marque.nom)
            );
            return {
              prenom: personData.Prénom,
              nom: personData.Nom,
              age: personData['Âge'],
              genre: personData['Genre'],
              marquesPreferees: basketsPreferees,
              nbPairesAchete: personData['Combien de paires de baskets achetez-vous en moyenne par mois ?'],
              influence: personData["Qu'est-ce qui influence le plus votre choix de marque de baskets ?"],
              endroitAchat: personData['Où achetez-vous généralement vos baskets ?'],
              budgetAchat: personData["Quel est généralement votre budget pour l'achat d'une paire de baskets ?"],
              endroitPort: personData["Quel est l'endroit où vous portez le plus souvent vos baskets ?"],
            };
          });
          setPersonnes(personnesData);
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
      <Container>
        <h1>Marques</h1>
        <GenreChart personnes={personnes} />
        <div style={{ width: '300px', height: '300px' }}>
          <h1>Répartition par Age</h1>
          <AgeChart personnes={personnes} />
        </div>
        <div>
          <PairsChart personnes={personnes} />
        </div>
        <div>
          {/* Affichez les informations des personnes ici */}
          <h1>Personnes_Marques_Préférer</h1>
          {personnes.map((personne, index) => (
            <Row key={index}>
              <Col>
                <h2 style={{ textAlign: 'center' }}>
                  {personne.prenom} {personne.nom}
                </h2>
                <button onClick={() => toggleDetails(index)}
                style={{
                  backgroundColor: showDetails[index] ? 'blue' : 'pink', // Couleur de fond
                  color: 'white', // Couleur du texte
                  padding: '10px 20px', // Rembourrage intérieur
                  border: 'none', // Supprime la bordure
                  borderRadius: '5px', // Coins arrondis
                  cursor: 'pointer', // Curseur de souris au survol
               }}
               >
                {showDetails[index] ? 'Masquer les réponses' : 'Afficher les réponses'}
                </button>

                {showDetails[index] && (
                  <div className='additional-details'>
                    <h3>Additional Details</h3>
                    <p>Âge: {personne.age}</p>
                    <p>Genre: {personne.genre}</p>
                    <p>Marque de baskets préférée: {personne.marquesPreferees.map((marque) => marque.nom).join(', ')}</p>
                    <p>Nombre de paires de baskets achetées par mois: {personne.nbPairesAchete}</p>
                    <p>Facteur d'influence pour le choix de la marque de baskets: {personne.influence}</p>
                    <p>Endroit d'achat habituel des baskets: {personne.endroitAchat}</p>
                    <p>Budget moyen pour l'achat d'une paire de baskets: {personne.budgetAchat}</p>
                    <p>Endroit le plus fréquent pour porter des baskets: {personne.endroitPort}</p>
                  </div>
                )}

                {/* Affichez les baskets préférées en un slider */}
                <Slider {...sliderSettings}>
                  {personne.marquesPreferees.map((basket, index) => (
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
        </div>
      </Container>
    </div>
  );
}

export default App;
