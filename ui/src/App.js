import React, {useState} from 'react';
import fetch from 'node-fetch'

import './App.css';

const API_ENDPOINT="http://localhost:5000/api"

const createApiQuery = (location) => `${API_ENDPOINT}/${location}`

function App() {
  const [location, setLocation] = useState("");
  const [fetching, setFetching] = useState(false);
  const [parkingLots, setParkingLots] = useState([]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);   
  }

  const handleFormSubmit = () => {
    setFetching(true);
    fetch(createApiQuery(location))
      .then(response => response.json())
      .then(response => setParkingLots(response.businesses))
      .then(() => setFetching(false))
  }

  return (
    <div className="App">
      Search for Location: <input type="text" value={location} onChange={handleLocationChange}/>
      <button disabled={fetching} type="submit" onClick={handleFormSubmit}>Submit</button>
      {fetching ? <div>Fetching Data...</div> : <ParkingLotList lots={parkingLots}></ParkingLotList>}
    </div>
  );
}

function ParkingLotList(props) {
  const lots = props.lots || []
  return <ul>
    {lots
      .sort((a, b) => a.score - b.score)
      .map((lot, i) => 
      <li key={i}>
        <br/>
        <h4 className="ListName">{i + 1}. <a rel="noreferrer" href={lot.url} target="_blank">{lot.name}</a></h4>
        <div>{(lot.location.display_address || []).join(', ')}</div>
        { lot.image_url ? <img alt={lot.name} height="128" width="128" src={lot.image_url}/> : ""}
        <div>Rating: {lot.rating}, Reviews: {lot.review_count}, Score: {lot.score}</div>
      </li>
    )}
  </ul>
}
export default App;
