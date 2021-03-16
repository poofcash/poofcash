import React from 'react';

interface Props {
    clicked: any;
    show: boolean;
}

const backdrop = (props: Props) => (props.show ? <div className="backdrop" onClick={props.clicked} /> : null);

export default backdrop;
