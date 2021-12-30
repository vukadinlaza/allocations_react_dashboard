import React, { useEffect, useState, useRef, useCallback } from 'react';
import { CameraAltOutlined } from '@material-ui/icons';
import { CardMedia, Box } from '@material-ui/core';
import ReactCrop from 'react-image-crop';
import DealButton from '../DealButton';
import {
  useDealPage,
  useDealPageDispatch,
} from '../../../dashboard/FundManagerDashboard/sections/DealPage/DealPageContext';

export default function CoverImage({ classes, deal }) {
  const { dealCoverImageKey } = deal;

  const [imgSrc, setImgSrc] = useState(
    `https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`,
  );
  const [upImg, setUpImg] = useState(null);
  const inputFile = useRef(null);
  const previewCanvasRef = useRef(null);
  const { isEdit } = useDealPage();
  const dispatch = useDealPageDispatch();
  const [cropperOpen, setCropperOpen] = useState(false);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 3 / 2 });
  const [completedCrop, setCompletedCrop] = useState(null);

  useEffect(() => {
    setImgSrc(`https://allocations-public.s3.us-east-2.amazonaws.com/${dealCoverImageKey}`);
  }, [dealCoverImageKey, isEdit]);

  const onButtonClick = () => {
    inputFile.current.click();
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
      setCropperOpen(true);
    }
  };

  const onImageLoaded = useCallback((img) => {
    inputFile.current = img;
  }, []);

  const submitCrop = (canvas, crop) => {
    if (!crop || !canvas) return;
    canvas.toBlob(
      (blob) => {
        if (blob) {
          dispatch({
            type: 'coverImage',
            image: blob,
          });
          setImgSrc(URL.createObjectURL(blob));
        }
      },
      'image/png',
      1,
    );
  };

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !inputFile.current) {
      return;
    }

    const image = inputFile.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
  }, [completedCrop]);

  return (
    <Box position="relative">
      {!cropperOpen && (
        <CardMedia
          className={classes.cardMedia}
          component="img"
          alt="SPV Header Image"
          src={imgSrc}
          style={{ objectFit: 'contain' }}
          onError={() =>
            dispatch({
              type: 'coverImage',
              image: 'https://allocations-public.s3.us-east-2.amazonaws.com/deals/default.png',
            })
          }
        />
      )}
      {isEdit && !cropperOpen && (
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
      {cropperOpen && (
        <div className={classes.cardMedia}>
          <ReactCrop
            src={upImg}
            onImageLoaded={onImageLoaded}
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            style={{ width: '100%' }}
            imageStyle={{ maxHeight: '241px' }}
          />

          <canvas
            hidden
            ref={previewCanvasRef}
            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0),
            }}
          />
          <Box position="absolute" bottom="16px" right="16px">
            <DealButton
              secondary
              onClick={() => {
                submitCrop(previewCanvasRef.current, completedCrop);
                setCropperOpen(false);
              }}
            >
              Crop Image
            </DealButton>
          </Box>
        </div>
      )}
    </Box>
  );
}
