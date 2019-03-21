import React from "react"
import { Link, graphql } from 'gatsby'
import uniqBy from 'lodash.uniqby'
import moment from 'moment'

import Layout from "../components/layout"
import SEO from "../components/seo"
import GoogleMap from "../components/GoogleMap"
import Marker from "../components/Marker"

const IndexPage = ({ data }) => {
  const venues = data.allVenuesJson.edges;
  const mapVenues = venues.filter(({node: venue}) => venue.events.length)
  const dates = uniqBy(
    data.allEventsJson.edges.map(({node}) => {
      const dateVal = node.date
      const dateStr = moment(node.date).format('DD-MM-YYYY')
      const niceDate = moment(node.date).format('dddd D MMMM')
      return { dateVal, dateStr, niceDate }
  }), 'dateVal')
  const MELB_CENTER = [-37.8124, 144.9623];
  return (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <p>This website shows you what's on this week. Information is from <a href="//www.beat.com.au/gig-guide/">Beat Magazine</a>.</p>
    <h2>This week</h2>
    <ul>
    {dates.map( date => (
      <li><Link to={'/day/' + date.dateStr}>{date.niceDate}</Link></li>
      ))}
    </ul>
    <h2>All venues</h2>
    <div style={{width: '100%', height: '600px', marginBottom: '2em'}}>
    <GoogleMap
      defaultZoom={12}
      defaultCenter={MELB_CENTER}
      yesIWantToUseGoogleMapApiInternals
    >
    {mapVenues.map( ({node: venue}) => (
      <Marker
                key={venue.id}
                text={venue.name}
                lat={venue.coords.lat}
                lng={venue.coords.lng}
                venueId={venue.id}
      />  
      ))}
    </GoogleMap>
    </div>
  </Layout>
)}

export default IndexPage

export const pageQuery = graphql`  
    query IndexQuery {
        allEventsJson
        (sort: {fields: [date], order: ASC} ) {
          edges {
            node {
              slug
              title
              date(formatString: "DD MMMM YY")
              venueName
              genre
              region
              price
          }
      }
  }
        allVenuesJson(sort: {fields: [name], order: ASC}, ) {
          edges {
            node {
              id
              name
              coords {
                lat
                lng
              }
              events {
                title
              }
            }
          }
        }
}
`
