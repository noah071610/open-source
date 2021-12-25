import Aside from "@components/Aside";
import Section from "@components/Section";
import { useEffect } from "react";
import { useGlobalState, useOneState } from "util/configSwrState";

export default function Home() {
  const { swr } = useGlobalState();
  // const {
  //   data: { currentTitle, a, arr },
  //   mutates,
  // } = useManyState(["currentTitle", "obj.a"]);

  const { mutate } = useOneState("opps.3.deep.0.deepTwo", "abc");
  useEffect(() => {
    mutate(() => 999);
  }, []);
  return (
    <main className="home">
      <Aside />
      <div className="main-content">
        <Section title="What is SWR State?">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Interdum
            posuere lorem ipsum dolor sit amet consectetur adipiscing elit.
            Nulla posuere sollicitudin aliquam ultrices sagittis. In egestas
            erat imperdiet sed euismod nisi porta lorem mollis. Consequat ac
            felis donec et. Non odio euismod lacinia at quis risus sed
            vulputate. Dignissim diam quis enim lobortis scelerisque fermentum
            dui faucibus. Nisi est sit amet facilisis magna etiam tempor. Id
            velit ut tortor pretium viverra.
          </p>
        </Section>
        <Section title="How To Use">
          <h2>Examples</h2>
          <h2>Installation</h2>
        </Section>
        <Section title="Documentation">
          <h2>useGlobalState</h2>
          <h2>useOneState</h2>
          <h2>useManyState</h2>
          <h2>useMapState</h2>
          <h2>APIs</h2>
        </Section>
        <Section title="License">
          <div></div>
        </Section>
        <div className="sakura"></div>
      </div>
    </main>
  );
}
