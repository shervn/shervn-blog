import { useEffect, useMemo, useState } from "react";
import { Container, Header, Loader } from "semantic-ui-react";
import { getS3Path, loadData, pastelColorForIndex, shuffleArray } from "../utils/general.js";

// Prefers exact `lat`/`lng` (pinned from a resolved Google Maps link) over a
// text search, which can land on the wrong branch/result for a common name.
// Falls back to a plain search query (venue + city + country) when neither
// coordinates nor an explicit `mapsQuery` are set on the place.
function getPlaceQuery(place) {
  if (place.lat != null && place.lng != null) return `${place.lat},${place.lng}`;
  return place.mapsQuery || `${place.name} ${place.city.en} ${place.country.en}`;
}

// Keyless embed - no Google Maps API key/billing needed, unlike the Static
// Maps API. Trade-off is a live interactive iframe instead of a flat image.
function getGoogleMapsEmbedUrl(place) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(getPlaceQuery(place))}&output=embed`;
}

// CSS columns otherwise pin every column's first item flush to the same top
// edge - this offset, cycled by index, breaks that up so the very top row
// doesn't read as a straight line across columns.
const TOP_OFFSET_SEQUENCE = [0, 48, 20, 64, 8, 36, 56, 16, 28];

function PlaceCard({ place, index }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="place-card">
      <div className="place-card-photo-wrap">
        {!imageFailed ? (
          <img
            src={getS3Path(place.image)}
            alt={`${place.name}, ${place.city.en}`}
            className="place-card-photo"
            draggable={false}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="place-card-photo-fallback"
            style={{
              background: `linear-gradient(135deg, ${pastelColorForIndex(index)}, ${pastelColorForIndex(index + 3)})`,
            }}
          >
            <span className="place-card-fallback-initial" aria-hidden="true">{place.name.charAt(0)}</span>
          </div>
        )}
        <div className="place-card-caption">
          <div className="place-card-caption-name">{place.name}</div>
          <div className="place-card-caption-location">{place.city.en}, {place.country.en}</div>
          <div className="place-card-caption-location farsi">{place.city.fa}</div>
          <div className="place-card-caption-year">{place.year}</div>
        </div>
      </div>
      <div className="place-card-details">
        {place.note && <p className="place-card-note">{place.note}</p>}
        <iframe
          className="place-card-map"
          src={getGoogleMapsEmbedUrl(place)}
          title={`Map of ${place.name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export default function PlacesComponent() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData((data) => {
      setPlaces(Array.isArray(data) ? data : []);
      setLoading(false);
    }, "placesdata");
  }, []);

  const visiblePlaces = useMemo(() => shuffleArray(places), [places]);

  if (loading) {
    return (
      <Container className="places-loading" role="status" aria-live="polite">
        <Loader active indeterminate inline="centered" size="small" />
        <p>Loading places...</p>
      </Container>
    );
  }

  if (!places.length) {
    return (
      <Container className="places-container">
        <div className="places-no-data">No places yet.</div>
      </Container>
    );
  }

  return (
    <Container className="places-container" role="main" aria-label="Places I've loved">
      <div className="places-intro">
        <Header as="h2" content="Places I've loved" />
        <p className="places-subtitle">Some places, some people.</p>
      </div>

      <div className="places-masonry" role="grid" aria-label="Places visited">
        {visiblePlaces.map((place, i) => (
          <div
            className="places-masonry-item"
            key={place.uuid}
            style={{ marginTop: `${TOP_OFFSET_SEQUENCE[i % TOP_OFFSET_SEQUENCE.length]}px` }}
          >
            <PlaceCard place={place} index={i} />
          </div>
        ))}
      </div>
    </Container>
  );
}
