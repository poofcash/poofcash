import styled from "@emotion/styled";
import SvgGithubIcon from "./svgIcons/SvgGithubIcon";

const Wrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
});

const Footer = () => {
  return (
    <Wrapper>
      <div className="row">
        {/*
                <div className="column">
                    <a href="https://tbtc.network/" target="_blank">
                        <SvgTbtcIcon fill="#859096" />
                      </a>
                </div>
                  */}
        <div className="column">
          <a
            href="https://github.com/poofcash"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SvgGithubIcon fill="#859096" />
          </a>
        </div>
        {/*
                <div className="column">
                    <a href="https://tornado.cash/" target="_blank">
                        <SvgTornadoIcon fill="#859096" />
                      </a>
                </div>
                    */}
      </div>
    </Wrapper>
  );
};

export default Footer;
