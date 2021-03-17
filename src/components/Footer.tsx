import React from "react";
import SvgGithubIcon from "./svgIcons/SvgGithubIcon";

const Footer = () => {
  return (
    <div className="footer">
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
    </div>
  );
};

export default Footer;
