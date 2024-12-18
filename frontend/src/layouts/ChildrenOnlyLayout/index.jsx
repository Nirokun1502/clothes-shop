import "./ChildrenOnlyLayout.scss";

// eslint-disable-next-line react/prop-types
function ChildrenOnlyLayout({ children }) {
  return <div className="contentchildren">{children}</div>;
}

export default ChildrenOnlyLayout;
