import { useState, useEffect } from "react";
import { Container, Grid, Image, Button, Icon } from "semantic-ui-react";


export default function TrainComponent({data}) {
    const [start, setStart] = useState(0);
    const [visible, setVisible] = useState(window.innerWidth < 768 ? 1 : 3);
    
    useEffect(() => {
        const handleResize = () => {
            setVisible(window.innerWidth < 768 ? 1 : 3);
            setStart(0);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    const goLeft = () => {
        setStart((s) => (s - 1 + data.length) % data.length);
    };
    
    const goRight = () => {
        setStart((s) => (s + 1) % data.length);
    };
    
    const visibleItems = Array.from({ length: visible }).map((_, i) => {
        const index = (start + i) % data.length;
        return data[index];
    });
    
    return (
        <Container textAlign="center" style={{ marginTop: "4rem" }}>
        <Grid centered columns={visible} stackable>
        {visibleItems.map((item, i) => (
            <Grid.Column
            key={i}
            mobile={16}
            tablet={5}
            computer={5}
            style={{ maxWidth: "320px" }}
            >
            <p style={{ fontWeight: "bold", marginBottom: "12px" }}>
            {item.city}, <span style={{ fontWeight: 400 }}>{item.year}</span>
            </p>
            
            <div
            style={{
                height: "560px",
                overflow: "hidden",
                background: "#eee",
            }}
            >
            <Image
            src={item.src}
            alt={`${item.city} ${item.year}`}
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
            }}
            />
            </div>
            </Grid.Column>
        ))}
        </Grid>
        
        {/* Navigation */}
        <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            marginTop: "2rem",
        }}
        >
        <Button icon onClick={goLeft}>
        <Icon name="angle left" />
        </Button>
        
        <div style={{ display: "flex", gap: "8px" }}>
        {Array.from({ length: data.length - visible + 1 }).map((_, i) => (
            <div
            key={i}
            style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "black",
                opacity: i === start ? 1 : 0.3,
            }}
            />
        ))}
        </div>
        
        <Button icon onClick={goRight}>
        <Icon name="angle right" />
        </Button>
        
        </div>
        </Container>
    );
}