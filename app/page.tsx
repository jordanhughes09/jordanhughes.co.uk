import { ConnectsMap } from "./connects-map";
import { ThemeToggle } from "./theme-toggle";

const linkedIn = "https://www.linkedin.com/in/jordan-c-hughes/";

export default function Home() {
  return (
    <>
      <main>
        <header>
          <h1>Jordan Hughes</h1>
          <p className="lede">Senior Product Manager for AI at Sky.</p>
          <p className="intro">
            I turn business problems into working AI products. I build a lot of them myself, with
            code and AI tools, bring in engineering for the bigger builds, and stay with them until
            people actually use them.
          </p>
          <ul className="links">
            <li>London</li>
            <li>
              <a href={linkedIn}>LinkedIn</a>
            </li>
          </ul>
        </header>

        <ConnectsMap />

        <section aria-labelledby="career">
          <h2 id="career">Career</h2>
          <div className="org" data-place="sky">
            <h3 className="org-head">
              <span>
                <span className="mk" aria-hidden="true" />
                Sky
              </span>
              <span className="yrs">2020 to now</span>
            </h3>
            <ol className="roles">
              <li>
                <strong>Senior Product Manager, Group AI</strong>
                <span className="when">2026 to now</span>
                <p>
                  Partnering with teams across Sky Group on AI products, and owning delivery,
                  adoption and iteration.
                </p>
              </li>
              <li>
                <strong>AI Product Manager</strong>
                <span className="when">2024 to 2026</span>
                <p>
                  Led AI platforms for operational efficiency and reliability across Sky and
                  NBCUniversal, and set the roadmap towards a central AI Hub of secure GenAI tools.
                </p>
              </li>
              <li>
                <strong>Product Manager</strong>
                <span className="when">2022 to 2024</span>
              </li>
              <li>
                <strong>Technology Graduate</strong>
                <span className="when">2020 to 2022</span>
              </li>
            </ol>
          </div>
          <div className="org" data-place="toyota">
            <h3 className="org-head">
              <span>
                <span className="mk" aria-hidden="true" />
                Toyota (GB)
              </span>
              <span className="yrs">2018 to 2019</span>
            </h3>
            <p>
              Systems Analyst on IT for Toyota’s UK dealer network: technical analysis, stakeholders
              and cost.
            </p>
          </div>
          <div className="org" data-place="lboro">
            <h3 className="org-head">
              <span>
                <span className="mk" aria-hidden="true" />
                Loughborough University
              </span>
              <span className="yrs">2016 to 2020</span>
            </h3>
            <p>Bachelor’s in Computer Science, First Class.</p>
          </div>
        </section>

        <section aria-labelledby="side">
          <h2 id="side">On the side</h2>
          <div className="org" data-place="fms">
            <h3 className="org-head">
              <span>
                <span className="mk side" aria-hidden="true" />
                <a href="https://www.fitmyswing.com/">FitMySwing</a>
              </span>
              <span className="yrs">2025 to now</span>
            </h3>
            <p>My own project: using AI to make golf club fitting accessible to everyone.</p>
          </div>
          <div className="org" data-place="sis">
            <h3 className="org-head">
              <span>
                <span className="mk side" aria-hidden="true" />
                SIS
              </span>
              <span className="yrs">2021 to now</span>
            </h3>
            <p>
              Part-time Senior Esports Studio Supervisor, running live streams and the referees and
              operators behind them.
            </p>
          </div>
        </section>

        <section aria-labelledby="said">
          <h2 id="said">What people say</h2>
          <p className="note">From LinkedIn recommendations.</p>
          <figure className="quote">
            <blockquote>
              <p>“A genuinely dependable and respected leader on our team.”</p>
            </blockquote>
            <figcaption>William Winter, Solutions Engineer, Sky and NBCUniversal</figcaption>
          </figure>
          <figure className="quote">
            <blockquote>
              <p>“Approachable, communicative, and always calm under pressure.”</p>
            </blockquote>
            <figcaption>Alex Bristow, Senior Front End Developer</figcaption>
          </figure>
        </section>
      </main>
      <footer>
        <div className="foot">
          <p>
            Jordan Hughes, London. Say hello on <a href={linkedIn}>LinkedIn</a>.
          </p>
          <ThemeToggle />
        </div>
      </footer>
    </>
  );
}
