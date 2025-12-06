import React from "react";
import { Grid, Image, Container, Divider } from "semantic-ui-react";

export default function PhotoGrid({ data }) {
  // Function to randomly insert empty squares
  const insertEmptySquares = (photos) => {
    const result = [];
    photos.forEach((photo) => {
      result.push(photo);
      if (Math.random() < 0.05) {
        result.push(null);
      }
    });
    return result;
  };

  // Function to randomly select alignment
  const getRandomAlignment = () => {
    const alignments = ["left", "center", "right"];
    return alignments[Math.floor(Math.random() * alignments.length)];
  };

  // Function to shuffle an array
  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // Shuffle folders
  const shuffledData = shuffleArray(data);

  return (
    <Container className="instaContainer">

        <Container text>
            <p className="farsiPost"></p>
        </Container>

      {shuffledData.map((section) => (
        <div key={section.folderName} style={{ marginBottom: "3rem" }}>
          <p
            className="farsiPost"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: getRandomAlignment(),
            }}
          >
            {section.folderName}
          </p>
          <Grid doubling stackable columns={3}>
            {insertEmptySquares(section.photos).map((src, i) => (
              <Grid.Column key={i}>
                {src ? (
                  <Image
                    src={src}
                    className="notinvert"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ width: "100%", paddingTop: "100%" }} />
                )}
              </Grid.Column>
            ))}
          </Grid>
        </div>
      ))}
    </Container>
  );
}