import React from 'react';
import { Container, Box } from '@material-ui/core';
import { CreateOutlined, VisibilityOutlined } from '@material-ui/icons';
import DealButton from './DealButton';
import {
  useDealPage,
  useDealPageDispatch,
} from '../../dashboard/FundManagerDashboard/sections/DealPage/DealPageContext';

export default function DealPageButtons({ goToDeal }) {
  const { isEdit } = useDealPage();
  const dispatch = useDealPageDispatch();

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="flex-end">
        {!isEdit ? (
          <DealButton
            secondary
            onClick={() => dispatch({ type: 'edit', value: true })}
            icon={<CreateOutlined />}
            style={{ marginRight: '8px' }}
          >
            Edit
          </DealButton>
        ) : (
          <DealButton
            onClick={() => dispatch({ type: 'edit', value: false })}
            secondary
            style={{ marginRight: '8px' }}
          >
            Discard Changes
          </DealButton>
        )}
        <DealButton
          secondary
          onClick={goToDeal}
          icon={<VisibilityOutlined />}
          style={{ marginRight: isEdit ? '8px' : '' }}
        >
          Preview
        </DealButton>
        {isEdit && <DealButton>Save</DealButton>}
      </Box>
    </Container>
  );
}
