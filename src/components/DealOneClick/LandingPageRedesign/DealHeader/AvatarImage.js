import React, { useRef, useState, useEffect } from 'react';
import { Avatar } from '@material-ui/core';
import BadgeWrapper from './BadgeWrapper';
import {
  useDealPageDispatch,
  useDealPage,
} from '../../../dashboard/FundManagerDashboard/sections/DealPage/DealPageContext';

export default function AvatarImage({ deal, classes }) {
  const inputFile = useRef(null);
  const dispatch = useDealPageDispatch();
  const { isEdit } = useDealPage();
  const [img, setImg] = useState('');

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    dispatch({
      type: 'avatar',
      image: file,
    });
    setImg(URL.createObjectURL(file));
  };

  const handleClick = () => {
    inputFile.current.click();
  };

  useEffect(() => {
    setImg(deal.avatarImage ?? '');
  }, [deal.avatarImage, isEdit]);

  return (
    <BadgeWrapper handleClick={handleClick}>
      <Avatar className={classes.avatar} alt="avatar image" src={img} />
      <input
        type="file"
        accept="image/*"
        ref={inputFile}
        style={{ display: 'none' }}
        onChange={handleChangeAvatar}
      />
    </BadgeWrapper>
  );
}
