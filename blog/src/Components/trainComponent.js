import { useMemo, useState, useEffect } from "react";
import { Container, Grid, Image } from "semantic-ui-react";
import { TRAIN_EMPTY_CHANCE } from "../utils/constants.js";
import { getS3Path, loadData, shuffleArray, insertEmptySquares } from "../utils/general.js";

const MOBILE_BREAKPOINT = 768;

export default function TrainComponent() {
  const [traindata, setTraindata] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  useEffect(() => {
    loadData((jsonData) => {
      setTraindata(jsonData);
    }, 'traindata');
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Randomly leave some grid slots empty, no forced interval - but on mobile
  // (single column) an empty slot is a full-width gap, not a small one among
  // several columns, so skip them there.
  const items = useMemo(() => {
    if (traindata.length === 0) return [];
    const shuffled = shuffleArray(traindata);
    return isMobile ? shuffled : insertEmptySquares(shuffled, Infinity, TRAIN_EMPTY_CHANCE);
  }, [traindata, isMobile]);

  return (
    <Container className="noselect train-container" role="main" aria-label="Photo gallery grid">
      <Grid doubling stackable columns={3} role="grid" aria-label="Photo gallery grid">
        {items.map((item, i) => (
          <Grid.Column key={i}>
            {item && (
              <div className="train-image-wrapper">
                <Image
                  src={getS3Path(item.path)}
                  alt={`${item.city.en}`}
                  onDragStart={(e) => e.preventDefault()}
                  className="train-image"
                />
                <div className="overlayCityName">
                  <div>{item.city.en}</div>
                  <div>{item.city.fa}</div>
                </div>
              </div>
            )}
            {!item && <div className="train-empty-slot" />}
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  );
}
