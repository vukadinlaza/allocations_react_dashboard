import React from 'react';
import './styles.scss';

function AllocationsLoader({ fullHeight }) {
  return (
    <div className="allocations-loader" style={fullHeight ? { height: '100vh' } : {}}>
      <svg
        className="loader"
        width="142"
        height="91"
        viewBox="0 0 142 91"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 75.8V83.2V90.7H7.5H15V83.2V75.8H7.5H0Z" className="col col1" />
        <path d="M25.3 75.8V83.2V90.7H32.7H40.2V83.2V75.8H32.7H25.3Z" className="col col2" />
        <path d="M25.3 50.5V58V65.5H32.7H40.2V58V50.5H32.7H25.3Z" className="col col2" />
        <path d="M50.5 65.5H58H65.5V58V50.5H58H50.5V58V65.5Z" className="col col3" />
        <path d="M50.5 40.2H58H65.5V32.7V25.2H58H50.5V32.7V40.2Z" className="col col3" />
        <path d="M50.5 75.8V83.2V90.7H58H65.5V83.2V75.8H58H50.5Z" className="col col3" />
        <path d="M75.8 14.9H83.2H90.7V7.5V0H83.2H75.8V7.5V14.9Z" className="col col4" />
        <path d="M75.8 65.5H83.2H90.7V58V50.5H83.2H75.8V58V65.5Z" className="col col4" />
        <path d="M75.8 40.2H83.2H90.7V32.7V25.2H83.2H75.8V32.7V40.2Z" className="col col4" />
        <path d="M75.8 75.8V83.2V90.7H83.2H90.7V83.2V75.8H83.2H75.8Z" className="col col4" />
        <path d="M101 75.8V83.2V90.7H108.5H116V83.2V75.8H108.5H101Z" className="col col5" />
        <path d="M101 50.5V58V65.5H108.5H116V58V50.5H108.5H101Z" className="col col5" />
        <path d="M126.3 65.5H133.7H141.2V58V50.5H133.7H126.3V58V65.5Z" className="col col6" />
        <path d="M126.3 40.2H133.7H141.2V32.7V25.2H133.7H126.3V32.7V40.2Z" className="col col6" />
        <path d="M126.3 75.8V83.2V90.7H133.7H141.2V83.2V75.8H133.7H126.3Z" className="col col6" />
      </svg>
    </div>
  );
}

export default AllocationsLoader;
