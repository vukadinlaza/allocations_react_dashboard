import React, { useEffect, useState, useRef } from 'react';
import { CameraAltOutlined } from '@material-ui/icons';
import { CardMedia, Box } from '@material-ui/core';
import DealButton from '../DealButton';
import { useDealPage } from '../../../dashboard/FundManagerDashboard/sections/DealPage/DealPageContext';

export default function CoverPhoto({ classes, deal }) {
  const { dealCoverImageKey, slug } = deal;
  const key = dealCoverImageKey?.includes('https')
    ? dealCoverImageKey
    : `https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`;

  const [img, setImg] = useState(key);
  const inputFile = useRef(null);
  const [upImg, setUpImg] = useState(null);
  const { isEdit } = useDealPage();

  useEffect(() => {
    setImg(key);
  }, [dealCoverImageKey, slug, key]);

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const onSelectFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <Box position="relative">
      <CardMedia
        className={classes.cardMedia}
        component="img"
        alt="SPV Header Image"
        src={img}
        onError={() =>
          setImg('https://allocations-public.s3.us-east-2.amazonaws.com/deals/default.png')
        }
      />
      {isEdit && (
        <Box position="absolute" bottom="16px" right="16px">
          <DealButton secondary icon={<CameraAltOutlined />} onClick={onButtonClick}>
            Add Photo
            <input
              type="file"
              accept="image/*"
              ref={inputFile}
              onChange={onSelectFile}
              style={{ display: 'none' }}
            />
          </DealButton>
        </Box>
      )}
    </Box>
  );
}
