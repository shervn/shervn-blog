import { useMemo, useState, useEffect } from "react";
import { Container, Grid, Image } from "semantic-ui-react";
import { TRAIN_EMPTY_CHANCE } from "../utils/constants.js";
import { getS3Path, loadData, shuffleArray, insertEmptySquares } from "../utils/general.js";

export default function TrainComponent() {
  const [traindata, setTraindata] = useState([]);

  useEffect(() => {
    loadData((jsonData) => {
      setTraindata(jsonData);
    }, 'traindata');
  }, []);

  // Randomly leave some grid slots empty, no forced interval
  const items = useMemo(() => {
    if (traindata.length === 0) return [];
    const shuffled = shuffleArray(traindata);
    return insertEmptySquares(shuffled, Infinity, TRAIN_EMPTY_CHANCE);
  }, [traindata]);

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
