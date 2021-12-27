import React, { useEffect, useState } from 'react';
import { CameraAltOutlined } from '@material-ui/icons';
import { CardMedia } from '@material-ui/core';
import DealButton from '../DealButton';

export default function CoverPhoto({ isEdit, classes, dealCoverImageKey, slug }) {
  const key = dealCoverImageKey?.includes('https')
    ? dealCoverImageKey
    : `https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`;

  const [img, setImg] = useState(key);

  useEffect(() => {
    setImg(key);
  }, [dealCoverImageKey, slug, key]);

  return (
    <>
      <CardMedia
        className={classes.cardMedia}
        component="img"
        alt="SPV Header Image"
        src={img}
        onError={() =>
          setImg('https://allocations-public.s3.us-east-2.amazonaws.com/deals/default.png')
        }
      />
      {isEdit && <DealButton secondary text="Add Photo" icon={<CameraAltOutlined />} />}
    </>
  );
}
