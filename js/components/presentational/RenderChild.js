//What is this for?
//https://reactrocket.com/post/turn-your-hocs-into-render-prop-components/

const RenderChild = ({ children, ...props }) => children(props);

export default RenderChild;
