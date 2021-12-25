import React from "react";

interface IProps {}

function Aside(props: IProps) {
  return (
    <aside>
      <h1>Hello SWR State </h1>
      <nav>
        <a className="header-anchor" href="#">
          <h2>What is SWR state?</h2>
        </a>
        <a className="header-anchor" href="#">
          <h2>How To Use</h2>
        </a>
        <ul>
          <a href="#examples">
            <li>Examples</li>
          </a>
          <a href="#installation">
            <li>Installation</li>
          </a>
        </ul>
        <a className="header-anchor" href="#">
          <h2>Documentation</h2>
        </a>
        <ul>
          <a href="#useGlobalState">
            <li>useGlobalState</li>
          </a>
          <a href="#useOneState">
            <li>useOneState</li>
          </a>
          <a href="#useManyState">
            <li>useManyState</li>
          </a>
          <a href="#useManyState">
            <li>useMapState</li>
          </a>
          <a href="#api">
            <li>APIs</li>
          </a>
        </ul>
        <a className="header-anchor" href="#license">
          <h2>License</h2>
        </a>
      </nav>
    </aside>
  );
}

export default Aside;
