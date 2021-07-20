import React from 'react';

const CrossOrPlusIcon = (props) => {
  const cancel = props.type === 'cross';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={cancel ? '16.673' : '15.579'}
      height={cancel ? '10.673' : '15.579'}
      viewBox={cancel ? '0 0 16.673 16.673' : '0 0 23.579 23.579'}
    >
      <path
        className="a"
        d="M10.9,8.372l5.769,5.769-2.568,2.568L8.336,10.94,2.568,16.709,0,14.141,5.769,8.372,0,2.6,2.568.036,8.336,5.8,14.105.036,16.673,2.6Z"
        transform={cancel ? 'translate(0 -0.036)' : 'translate(12 -0.036) rotate(45)'}
        style={{ fill: cancel ? '#ff0404' : '#39c522' }}
      />
    </svg>
  );
};

export default CrossOrPlusIcon;
