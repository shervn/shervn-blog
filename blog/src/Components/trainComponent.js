import { useMemo, useState, useEffect } from "react";
import { Container, Grid, Image } from "semantic-ui-react";
import {
  POSTBOX_NULL_FORCE_COUNT,
  POSTBOX_NULL_RANDOM_CHANCE
} from "../utils/constants.js";
import { getS3Path, loadData, shuffleArray, insertEmptySquares, getPlaceholderIndex } from "../utils/general.js";
import CommentPlaceholder from './commentPlaceholder.js';

export default function TrainComponent() {
  const [traindata, setTraindata] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadData((jsonData) => {
      setTraindata(jsonData);
    }, 'traindata');
    loadData((jsonData) => {
      setComments(Array.isArray(jsonData) ? jsonData : []);
    }, 'comments');
  }, []);

  const shuffledComments = useMemo(() => shuffleArray(comments), [comments]);

  // Randomly weave comment placeholders in among the photos, same as the postbox grid
  const items = useMemo(() => {
    if (traindata.length === 0) return [];
    const shuffled = shuffleArray(traindata);
    return insertEmptySquares(shuffled, POSTBOX_NULL_FORCE_COUNT, POSTBOX_NULL_RANDOM_CHANCE);
  }, [traindata]);

  return (
    <Container className="noselect train-container" role="main" aria-label="Photo gallery grid">
      <Grid doubling stackable columns={3} role="grid" aria-label="Photo gallery grid">
        {items.map((item, i) => (
          <Grid.Column key={i}>
            {item ? (
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
            ) : (
              <CommentPlaceholder
                comment={shuffledComments[getPlaceholderIndex(items, i) % shuffledComments.length]}
                seed={getPlaceholderIndex(items, i)}
              />
            )}
          </Grid.Column>
        ))}
      </Grid>
    </Container>
  );
}
