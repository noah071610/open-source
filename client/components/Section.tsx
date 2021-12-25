import React from "react";

interface IProps {
  title: string;
  children: JSX.Element | JSX.Element[];
}

function Section({ title, children }: IProps) {
  return (
    <section className="section">
      <h1>{title}</h1>
      {children}
    </section>
  );
}

export default Section;
