import { Carousel as ReactCorousel } from "react-bootstrap";
import "./Carousel.css";

export function Carousel(props) {
  return (
    <ReactCorousel className="carousel-container" indicators="false">
      {props.examples.map((example) => {
        return (
          <ReactCorousel.Item key={example.title}>
            <div className="img-container">
              <img
                className="img-container"
                src={example.src}
                alt={example.title}
              />

              <ReactCorousel.Caption>
                <h5>{example.title}</h5>
              </ReactCorousel.Caption>
            </div>
          </ReactCorousel.Item>
        );
      })}
    </ReactCorousel>
  );
}
