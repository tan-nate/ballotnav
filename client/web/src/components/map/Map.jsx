// for documentation see
// Add points to a map: https://docs.mapbox.com/help/tutorials/add-points-pt-1/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addSearch } from '../../redux/actions/search.js'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import mapboxgl, { styleUrl } from 'services/mapbox'
import queryString from 'query-string'
import api from 'services/api'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import ResultList from '../info/ResultList'
import ResultsLayer from './ResultsLayer'

const closeAlert = () => {
  const alert = document.getElementById('alert')
  alert.style.display = 'none'
}

class Map extends React.Component {
  constructor(props) {
    super(props)

    this.map = null
    this.resultsLayer = null
    this.state = { resultListOpen: true }
  }

  componentDidMount() {
    const { center } = this.props

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: styleUrl,
      center: center,
      zoom: 13,
    })

    this.map.on('load', () => {
      this.initLayers(true)
      this.map.on('click', this.onClick)
    })

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      countries: 'us',
      types: 'address, neighborhood, locality, place, district, postcode',
      flyTo: false,
      clearOnBlur: true,
    })

    document
      .getElementById('map-geocoder')
      .appendChild(geocoder.onAdd(this.map))
    geocoder.setPlaceholder('Enter an address or ZIP')
    geocoder.on('result', ({ result }) => {
      geocoder.clear()
      this.handleGeocodeResult({ result })
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.center !== prevProps.center)
      this.map.setCenter(this.props.center)
  }

  toggleResultList = () => {
    this.setState({ resultListOpen: !this.state.resultListOpen })
  }

  closeResultList = () => {
    this.setState({ resultListOpen: false })
  }

  handleGeocodeResult = async ({ result }) => {
    const { history } = this.props
    const [lon, lat] = result.center
    const jurisdictions = await api.getJurisdictions(lon, lat)

    if (jurisdictions.length === 1) {
      const { id: jid } = jurisdictions[0]
      const query = queryString.stringify({ jid, lon, lat })
      history.push(`/map?${query}`)
      this.toggleResultList()
    } else {
      history.push('/error') // TODO: figure out what route to go to
    }
  }

  initLayers = () => {
    this.resultsLayer.init({
      map: this.map,
    })
  }

  onClick = (e) => {
    const { onSelectLocation } = this.props

    const features = this.map.queryRenderedFeatures(e.point, {
      layers: ['result-circles'],
    })

    if (features[0]) onSelectLocation(features[0].properties.id)
  }

  render() {
    const { locations } = this.props

    return (
      <div className="map">
        <div id="alert">
          <span>
            Remember to verify information through the official website and
            phone number before you leave
          </span>
          <button onClick={() => closeAlert()}>
            <span className="icon is-small">
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </button>
        </div>
        <ResultList
          toggleCountyInfo={this.props.toggleCountyInfo}
          toggleDrawer={this.toggleResultList}
          close={this.closeResultList}
          open={this.state.resultListOpen}
        />
        <div id="map-container" ref={(el) => (this.mapContainer = el)}>
          <ResultsLayer
            results={locations}
            ref={(el) => (this.resultsLayer = el)}
          />
        </div>
        <div id="map-geocoder" />
      </div>
    )
  }
}

function locationsToGeoJson(locations) {
  return {
    type: 'FeatureCollection',
    features: locations.map((loc) => ({
      type: 'Feature',
      properties: loc,
      geometry: {
        type: 'Point',
        coordinates: [loc.geomLongitude, loc.geomLatitude],
      },
    })),
  }
}

const mapStateToProps = (state) => ({
  search: state.searches[state.searches.length - 1],
  locations: locationsToGeoJson(state.data.jurisdictionData.locations),
})

const mapDispatchToProps = (dispatch) => ({
  addSearch: (search) => dispatch(addSearch(search)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Map)

Map.propTypes = {
  search: PropTypes.object,
  addSearch: PropTypes.func.isRequired,
  chicagoParks: PropTypes.object,
}
